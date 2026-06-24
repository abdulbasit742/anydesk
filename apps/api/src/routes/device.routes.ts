import { Router } from "express";
import {
  type SafeDeviceCommandType
} from "@remotedesk/shared/pack7";
import type { Prisma } from "@prisma/client";
import { z } from "zod";
import {
  buildSafeDeviceCommandPreviews,
  expireOverdueDeviceCommands,
  SAFE_DEVICE_COMMANDS,
  serializeDeviceCommand,
  writeDeviceAuditEvent,
  type DeviceCommandStatus
} from "../lib/deviceCommands.js";
import {
  ensureDeviceSecurityState,
  getDeviceSecuritySettings,
  updateDeviceAccessPolicy,
  updateDeviceTrust
} from "../lib/deviceSecurity.js";
import { listDeviceAdminAudit, serializeDeviceAuditEvent } from "../lib/deviceAdminAudit.js";
import { prisma } from "../lib/prisma.js";
import { formatRemoteDeskId } from "../lib/remoteDeskId.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

const commandInput = z.object({
  type: z.enum(["refresh_policy", "collect_diagnostics", "check_update", "sign_out"]),
  ttlSeconds: z.number().int().min(30).max(3600).optional(),
  payload: z.record(z.unknown()).optional()
});

const commandAckInput = z.object({
  status: z.enum(["delivered", "completed", "failed", "canceled"]),
  result: z.record(z.unknown()).optional(),
  failureReason: z.string().max(500).optional()
});

const registerDeviceInput = z.object({
  name: z.string().min(2).max(120),
  platform: z.string().min(2).max(80),
  remoteDeskId: z.string().regex(/^\d{9}$/).optional()
});

const trustInput = z.object({
  status: z.enum(["trusted", "untrusted", "blocked"]),
  reason: z.string().max(500).optional()
});

const accessPolicyInput = z.object({
  unattendedAccessEnabled: z.boolean().optional(),
  remoteInputEnabled: z.boolean().optional(),
  clipboardSyncEnabled: z.boolean().optional(),
  fileTransferEnabled: z.boolean().optional(),
  requiresSessionApproval: z.boolean().optional(),
  maxSessionMinutes: z.number().int().min(5).max(720).optional()
});

async function getOwnedDevice(deviceId: string, userId: string) {
  return prisma.device.findFirst({
    where: {
      id: deviceId,
      userId
    }
  });
}

router.get("/", async (req: AuthedRequest, res) => {
  const devices = await prisma.device.findMany({
    where: { userId: req.user!.id },
    orderBy: [{ isOnline: "desc" }, { lastSeenAt: "desc" }, { createdAt: "desc" }]
  });

  res.json({
    success: true,
    data: devices.map((device) => ({
      ...device,
      remoteDeskIdFormatted: formatRemoteDeskId(device.remoteDeskId)
    }))
  });
});

router.post("/register", async (req: AuthedRequest, res) => {
  const input = registerDeviceInput.safeParse(req.body);
  if (!input.success) return res.status(400).json({ success: false, errors: input.error.flatten() });

  const remoteDeskId = input.data.remoteDeskId ?? req.user!.remoteDeskId;
  const existing = await prisma.device.findUnique({ where: { remoteDeskId } });

  if (existing && existing.userId !== req.user!.id) {
    return res.status(409).json({ success: false, message: "RemoteDesk ID is already registered to another device" });
  }

  const device = existing
    ? await prisma.device.update({
        where: { id: existing.id },
        data: {
          name: input.data.name,
          platform: input.data.platform,
          isOnline: true,
          lastSeenAt: new Date()
        }
      })
    : await prisma.device.create({
        data: {
          userId: req.user!.id,
          name: input.data.name,
          platform: input.data.platform,
          remoteDeskId,
          isOnline: true,
          lastSeenAt: new Date()
        }
      });

  await writeDeviceAuditEvent({
    deviceId: device.id,
    actorUserId: req.user!.id,
    type: existing ? "device.registered.refresh" : "device.registered",
    message: `${device.name} registered from desktop client`,
    metadata: { platform: device.platform, remoteDeskId: device.remoteDeskId }
  });
  await ensureDeviceSecurityState(device.id, req.user!.id);

  res.status(existing ? 200 : 201).json({
    success: true,
    data: {
      ...device,
      remoteDeskIdFormatted: formatRemoteDeskId(device.remoteDeskId)
    }
  });
});

router.get("/:deviceId", async (req: AuthedRequest, res) => {
  const device = await getOwnedDevice(req.params.deviceId, req.user!.id);

  if (!device) {
    return res.status(404).json({ success: false, message: "Device not found" });
  }

  await expireOverdueDeviceCommands(device.id);

  const sessions = await prisma.session.findMany({
    where: {
      OR: [{ hostId: req.user!.id }, { clientId: req.user!.id }]
    },
    include: {
      host: { select: { id: true, fullName: true, remoteDeskId: true } },
      client: { select: { id: true, fullName: true, remoteDeskId: true } }
    },
    orderBy: { createdAt: "desc" },
    take: 20
  });

  const commands = await prisma.deviceCommand.findMany({
    where: { deviceId: device.id },
    orderBy: { createdAt: "desc" },
    take: 20
  });

  const auditEvents = await prisma.deviceAuditEvent.findMany({
    where: { deviceId: device.id },
    include: {
      actor: { select: { id: true, email: true, fullName: true } }
    },
    orderBy: { createdAt: "desc" },
    take: 30
  });
  const securitySettings = await getDeviceSecuritySettings(device.id, req.user!.id);

  const timeline = [
    {
      id: `${device.id}:created`,
      type: "device.created",
      message: `${device.name} was registered`,
      at: device.createdAt
    },
    ...(device.lastSeenAt
      ? [
          {
            id: `${device.id}:last-seen`,
            type: "device.last_seen",
            message: `${device.name} checked in`,
            at: device.lastSeenAt
          }
        ]
      : []),
    ...auditEvents.map((event) => {
      const serialized = serializeDeviceAuditEvent(event);
      return {
        id: event.id,
        type: event.type,
        actionLabel: serialized.actionLabel,
        message: event.message,
        actor: serialized.actor,
        metadata: event.metadata,
        at: event.createdAt
      };
    }),
    ...sessions.slice(0, 8).map((session) => ({
      id: session.id,
      type: `session.${session.status.toLowerCase()}`,
      message: `Session ${session.status.toLowerCase()} with ${
        session.hostId === req.user!.id ? session.client.fullName : session.host.fullName
      }`,
      at: session.startedAt ?? session.createdAt
    }))
  ].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());

  res.json({
    success: true,
    data: {
      device: {
        ...device,
        remoteDeskIdFormatted: formatRemoteDeskId(device.remoteDeskId)
      },
      sessions,
      commands: commands.map(serializeDeviceCommand),
      timeline,
      settings: {
        ...securitySettings,
        deviceCommands: {
          allowed: buildSafeDeviceCommandPreviews(device.id),
          blocked: ["remote_shell", "run_command", "execute_native_input", "unattended_access"],
          reason: "Only safe maintenance command envelopes are exposed; every command is persisted, expires, and is audit logged"
        }
      }
    }
  });
});

router.get("/:deviceId/audit", async (req: AuthedRequest, res) => {
  const device = await getOwnedDevice(req.params.deviceId, req.user!.id);
  if (!device) return res.status(404).json({ success: false, message: "Device not found" });

  const rawLimit = Number(req.query.limit ?? 50);
  const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit, 1), 100) : 50;
  const events = await listDeviceAdminAudit({ deviceId: device.id, limit });

  res.json({
    success: true,
    data: events.map(serializeDeviceAuditEvent)
  });
});

router.patch("/:deviceId/heartbeat", async (req: AuthedRequest, res) => {
  const device = await getOwnedDevice(req.params.deviceId, req.user!.id);
  if (!device) return res.status(404).json({ success: false, message: "Device not found" });

  const updated = await prisma.device.update({
    where: { id: device.id },
    data: {
      isOnline: true,
      lastSeenAt: new Date()
    }
  });

  res.json({
    success: true,
    data: {
      ...updated,
      remoteDeskIdFormatted: formatRemoteDeskId(updated.remoteDeskId)
    }
  });
});

router.patch("/:deviceId/trust", async (req: AuthedRequest, res) => {
  const device = await getOwnedDevice(req.params.deviceId, req.user!.id);
  if (!device) return res.status(404).json({ success: false, message: "Device not found" });

  const input = trustInput.safeParse(req.body);
  if (!input.success) return res.status(400).json({ success: false, errors: input.error.flatten() });

  await updateDeviceTrust({
    deviceId: device.id,
    actorUserId: req.user!.id,
    status: input.data.status,
    reason: input.data.reason
  });

  const settings = await getDeviceSecuritySettings(device.id, req.user!.id);
  res.json({ success: true, data: settings });
});

router.patch("/:deviceId/access-policy", async (req: AuthedRequest, res) => {
  const device = await getOwnedDevice(req.params.deviceId, req.user!.id);
  if (!device) return res.status(404).json({ success: false, message: "Device not found" });

  const input = accessPolicyInput.safeParse(req.body);
  if (!input.success) return res.status(400).json({ success: false, errors: input.error.flatten() });

  try {
    await updateDeviceAccessPolicy({
      deviceId: device.id,
      actorUserId: req.user!.id,
      patch: input.data
    });
    const settings = await getDeviceSecuritySettings(device.id, req.user!.id);
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Unable to update access policy"
    });
  }
});

router.get("/:deviceId/commands", async (req: AuthedRequest, res) => {
  const device = await getOwnedDevice(req.params.deviceId, req.user!.id);
  if (!device) return res.status(404).json({ success: false, message: "Device not found" });

  await expireOverdueDeviceCommands(device.id);

  const commands = await prisma.deviceCommand.findMany({
    where: { deviceId: device.id },
    orderBy: { createdAt: "desc" },
    take: 50
  });

  res.json({ success: true, data: commands.map(serializeDeviceCommand) });
});

router.get("/:deviceId/commands/pending", async (req: AuthedRequest, res) => {
  const device = await getOwnedDevice(req.params.deviceId, req.user!.id);
  if (!device) return res.status(404).json({ success: false, message: "Device not found" });

  await expireOverdueDeviceCommands(device.id);

  const commands = await prisma.deviceCommand.findMany({
    where: {
      deviceId: device.id,
      status: "pending",
      expiresAt: { gt: new Date() }
    },
    orderBy: { createdAt: "asc" },
    take: 25
  });

  res.json({ success: true, data: commands.map(serializeDeviceCommand) });
});

router.post("/:deviceId/commands", async (req: AuthedRequest, res) => {
  const device = await getOwnedDevice(req.params.deviceId, req.user!.id);
  if (!device) return res.status(404).json({ success: false, message: "Device not found" });

  const input = commandInput.safeParse(req.body);
  if (!input.success) return res.status(400).json({ success: false, errors: input.error.flatten() });

  const type = input.data.type as SafeDeviceCommandType;
  if (!SAFE_DEVICE_COMMANDS.includes(type)) {
    return res.status(400).json({ success: false, message: "Unsupported or unsafe command type" });
  }

  const ttlSeconds = input.data.ttlSeconds ?? 300;
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000);

  const command = await prisma.deviceCommand.create({
    data: {
      deviceId: device.id,
      issuedByUserId: req.user!.id,
      type,
      payload: input.data.payload as Prisma.InputJsonObject | undefined,
      expiresAt
    }
  });

  await writeDeviceAuditEvent({
    deviceId: device.id,
    actorUserId: req.user!.id,
    type: "device.command.issued",
    message: `${type.replace(/_/g, " ")} command queued`,
    metadata: { commandId: command.id, commandType: type, expiresAt: expiresAt.toISOString() }
  });

  res.status(201).json({ success: true, data: serializeDeviceCommand(command) });
});

router.patch("/:deviceId/commands/:commandId", async (req: AuthedRequest, res) => {
  const device = await getOwnedDevice(req.params.deviceId, req.user!.id);
  if (!device) return res.status(404).json({ success: false, message: "Device not found" });

  const input = commandAckInput.safeParse(req.body);
  if (!input.success) return res.status(400).json({ success: false, errors: input.error.flatten() });

  const command = await prisma.deviceCommand.findFirst({
    where: {
      id: req.params.commandId,
      deviceId: device.id
    }
  });
  if (!command) return res.status(404).json({ success: false, message: "Command not found" });

  const now = new Date();
  const status = input.data.status as DeviceCommandStatus;
  const updated = await prisma.deviceCommand.update({
    where: { id: command.id },
    data: {
      status,
      result: input.data.result as Prisma.InputJsonObject | undefined,
      deliveredAt: status === "delivered" ? now : command.deliveredAt,
      completedAt: status === "completed" ? now : command.completedAt,
      failedAt: status === "failed" || status === "canceled" ? now : command.failedAt,
      failureReason: input.data.failureReason
    }
  });

  await writeDeviceAuditEvent({
    deviceId: device.id,
    actorUserId: req.user!.id,
    type: `device.command.${status}`,
    message: `${command.type.replace(/_/g, " ")} command marked ${status}`,
    metadata: { commandId: command.id, commandType: command.type, status }
  });

  res.json({ success: true, data: serializeDeviceCommand(updated) });
});

export default router;
