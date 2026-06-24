import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { generateRemoteDeskId, formatRemoteDeskId } from "../lib/remoteDeskId.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

const enrollInput = z.object({
  name: z.string().min(2).max(120),
  os: z.string().max(80).optional(),
  osVersion: z.string().max(80).optional(),
  platform: z.string().max(80).optional(),
  hostname: z.string().max(120).optional(),
  appVersion: z.string().max(80).optional(),
  pairingCode: z.string().max(120).optional(),
  remoteDeskId: z.string().regex(/^\d{9}$/).optional()
});

const heartbeatInput = z.object({
  status: z.enum(["online", "offline"]).optional(),
  appVersion: z.string().max(80).optional(),
  platform: z.string().max(80).optional(),
  hostname: z.string().max(120).optional(),
  metrics: z.record(z.unknown()).optional()
});

function serializeDevice(device: {
  id: string;
  userId: string;
  name: string;
  platform: string;
  remoteDeskId: string;
  isOnline: boolean;
  lastSeenAt: Date | null;
  createdAt: Date;
}) {
  return {
    id: device.id,
    userId: device.userId,
    user_id: device.userId,
    name: device.name,
    os: device.platform,
    platform: device.platform,
    status: device.isOnline ? "online" : "offline",
    remoteDeskId: device.remoteDeskId,
    remote_desk_id: device.remoteDeskId,
    remoteDeskIdFormatted: formatRemoteDeskId(device.remoteDeskId),
    lastSeenAt: device.lastSeenAt,
    last_seen_at: device.lastSeenAt,
    last_seen: device.lastSeenAt,
    createdAt: device.createdAt,
    created_at: device.createdAt
  };
}

async function auditDevice(deviceId: string, actorUserId: string, type: string, message: string, metadata: Record<string, unknown> = {}) {
  await prisma.deviceAuditEvent.create({
    data: { deviceId, actorUserId, type, message, metadata }
  }).catch(() => null);
}

router.post("/enroll", async (req: AuthedRequest, res) => {
  const input = enrollInput.safeParse(req.body);
  if (!input.success) return res.status(400).json({ success: false, errors: input.error.flatten() });

  const platform = input.data.platform ?? input.data.os ?? process.platform;
  const remoteDeskId = input.data.remoteDeskId ?? await generateRemoteDeskId();
  const existing = await prisma.device.findFirst({
    where: {
      OR: [
        { remoteDeskId },
        { userId: req.user!.id, name: input.data.name }
      ]
    }
  });

  if (existing && existing.userId !== req.user!.id) {
    return res.status(409).json({ success: false, message: "Device ID is already registered to another account" });
  }

  const device = existing
    ? await prisma.device.update({
        where: { id: existing.id },
        data: { name: input.data.name, platform, isOnline: true, lastSeenAt: new Date() }
      })
    : await prisma.device.create({
        data: { userId: req.user!.id, name: input.data.name, platform, remoteDeskId, isOnline: true, lastSeenAt: new Date() }
      });

  await auditDevice(device.id, req.user!.id, existing ? "device.enrolled.refresh" : "device.enrolled", "Desktop device enrolled", {
    platform,
    osVersion: input.data.osVersion ?? null,
    appVersion: input.data.appVersion ?? null,
    hostname: input.data.hostname ?? null
  });

  const body = serializeDevice(device);
  res.status(existing ? 200 : 201).json({ success: true, data: body, device: body });
});

router.post("/:deviceId/heartbeat", async (req: AuthedRequest, res) => {
  const input = heartbeatInput.safeParse(req.body ?? {});
  if (!input.success) return res.status(400).json({ success: false, errors: input.error.flatten() });

  const device = await prisma.device.findFirst({ where: { id: req.params.deviceId, userId: req.user!.id } });
  if (!device) return res.status(404).json({ success: false, message: "Device not found" });

  const updated = await prisma.device.update({
    where: { id: device.id },
    data: { isOnline: input.data.status !== "offline", lastSeenAt: new Date(), platform: input.data.platform ?? device.platform }
  });

  const body = serializeDevice(updated);
  res.json({ success: true, data: body, device: body });
});

router.post("/:deviceId/revoke", async (req: AuthedRequest, res) => {
  const device = await prisma.device.findFirst({ where: { id: req.params.deviceId, userId: req.user!.id } });
  if (!device) return res.status(404).json({ success: false, message: "Device not found" });

  const updated = await prisma.device.update({
    where: { id: device.id },
    data: { isOnline: false, lastSeenAt: new Date() }
  });
  await auditDevice(device.id, req.user!.id, "device.revoked", "Device revoked from dashboard");

  const body = serializeDevice(updated);
  res.json({ success: true, ok: true, data: body, device: body });
});

export default router;
