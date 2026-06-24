import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

const createSessionInput = z.object({
  deviceId: z.string().uuid(),
  permissions: z.array(z.string()).optional().default(["view-only"]),
  reason: z.string().max(500).optional(),
  mode: z.literal("view-only").optional().default("view-only")
});

const denyInput = z.object({
  reason: z.string().max(500).optional()
});

const endInput = z.object({
  reason: z.string().max(500).optional()
});

type SessionWithUsers = Awaited<ReturnType<typeof prisma.session.findFirst<{ include: typeof sessionInclude }>>>;

const sessionInclude = {
  host: { select: { id: true, email: true, fullName: true, remoteDeskId: true } },
  client: { select: { id: true, email: true, fullName: true, remoteDeskId: true } }
} as const;

function statusToApi(status: string) {
  switch (status) {
    case "PENDING": return "pending";
    case "ACTIVE": return "connected";
    case "REJECTED": return "denied";
    case "ENDED": return "ended";
    case "FAILED": return "failed";
    default: return status.toLowerCase();
  }
}

function serializeSession(session: NonNullable<SessionWithUsers>, deviceId?: string | null, deviceName?: string | null) {
  return {
    id: session.id,
    hostId: session.hostId,
    host_id: session.hostId,
    clientId: session.clientId,
    client_id: session.clientId,
    deviceId: deviceId ?? null,
    device_id: deviceId ?? null,
    targetDeviceId: deviceId ?? null,
    target_device_id: deviceId ?? null,
    targetName: deviceName ?? session.host.fullName,
    target_name: deviceName ?? session.host.fullName,
    initiator: session.client.fullName,
    status: statusToApi(session.status),
    rawStatus: session.status,
    permissions: ["view-only"],
    mode: "view-only",
    startedAt: session.startedAt,
    started_at: session.startedAt,
    acceptedAt: session.startedAt,
    accepted_at: session.startedAt,
    endedAt: session.endedAt,
    ended_at: session.endedAt,
    durationSeconds: session.duration,
    duration_seconds: session.duration,
    reason: null,
    quality: null,
    createdAt: session.createdAt,
    created_at: session.createdAt,
    host: session.host,
    client: session.client
  };
}

async function findVisibleSession(sessionId: string, userId: string) {
  return prisma.session.findFirst({
    where: {
      id: sessionId,
      OR: [{ hostId: userId }, { clientId: userId }]
    },
    include: sessionInclude
  });
}

async function writeDeviceAudit(deviceId: string, actorUserId: string, type: string, message: string, metadata: Record<string, unknown> = {}) {
  await prisma.deviceAuditEvent.create({
    data: { deviceId, actorUserId, type, message, metadata }
  }).catch(() => null);
}

router.get("/", async (req: AuthedRequest, res) => {
  const sessions = await prisma.session.findMany({
    where: { OR: [{ hostId: req.user!.id }, { clientId: req.user!.id }] },
    include: sessionInclude,
    orderBy: { createdAt: "desc" },
    take: 100
  });
  res.json({ success: true, data: sessions.map((s) => serializeSession(s)), sessions: sessions.map((s) => serializeSession(s)) });
});

router.get("/history", async (req: AuthedRequest, res) => {
  const sessions = await prisma.session.findMany({
    where: { OR: [{ hostId: req.user!.id }, { clientId: req.user!.id }] },
    include: sessionInclude,
    orderBy: { createdAt: "desc" },
    take: 50
  });
  res.json({ success: true, data: sessions.map((s) => serializeSession(s)), sessions: sessions.map((s) => serializeSession(s)) });
});

router.post("/", async (req: AuthedRequest, res) => {
  const input = createSessionInput.safeParse(req.body);
  if (!input.success) return res.status(400).json({ success: false, errors: input.error.flatten() });

  const device = await prisma.device.findUnique({ where: { id: input.data.deviceId } });
  if (!device) return res.status(404).json({ success: false, message: "Device not found" });
  if (device.userId === req.user!.id) {
    return res.status(400).json({ success: false, message: "Open the desktop host app to accept local host sessions. A viewer cannot request itself as a host." });
  }

  const session = await prisma.session.create({
    data: {
      hostId: device.userId,
      clientId: req.user!.id,
      status: "PENDING"
    },
    include: sessionInclude
  });

  await writeDeviceAudit(device.id, req.user!.id, "session.requested", "View-only session requested", {
    sessionId: session.id,
    permissions: input.data.permissions,
    mode: input.data.mode,
    reason: input.data.reason ?? null
  });

  const body = serializeSession(session, device.id, device.name);
  res.status(201).json({ success: true, data: body, session: body });
});

router.get("/:sessionId", async (req: AuthedRequest, res) => {
  const session = await findVisibleSession(req.params.sessionId, req.user!.id);
  if (!session) return res.status(404).json({ success: false, message: "Session not found" });
  const body = serializeSession(session);
  res.json({ success: true, data: body, session: body });
});

router.post("/:sessionId/accept", async (req: AuthedRequest, res) => {
  const session = await findVisibleSession(req.params.sessionId, req.user!.id);
  if (!session) return res.status(404).json({ success: false, message: "Session not found" });
  if (session.hostId !== req.user!.id) return res.status(403).json({ success: false, message: "Only the host can accept this session" });
  if (session.status !== "PENDING") return res.status(409).json({ success: false, message: "Session is not pending" });

  const updated = await prisma.session.update({
    where: { id: session.id },
    data: { status: "ACTIVE", startedAt: new Date() },
    include: sessionInclude
  });
  const body = serializeSession(updated);
  res.json({ success: true, data: body, session: body });
});

router.post("/:sessionId/deny", async (req: AuthedRequest, res) => {
  const input = denyInput.safeParse(req.body);
  if (!input.success) return res.status(400).json({ success: false, errors: input.error.flatten() });
  const session = await findVisibleSession(req.params.sessionId, req.user!.id);
  if (!session) return res.status(404).json({ success: false, message: "Session not found" });
  if (session.hostId !== req.user!.id) return res.status(403).json({ success: false, message: "Only the host can deny this session" });

  const updated = await prisma.session.update({
    where: { id: session.id },
    data: { status: "REJECTED", endedAt: new Date() },
    include: sessionInclude
  });
  const body = serializeSession(updated);
  res.json({ success: true, data: { ...body, reason: input.data.reason ?? null }, session: { ...body, reason: input.data.reason ?? null } });
});

async function endSession(req: AuthedRequest, res: import("express").Response, emergency = false) {
  const input = endInput.safeParse(req.body ?? {});
  if (!input.success) return res.status(400).json({ success: false, errors: input.error.flatten() });
  const session = await findVisibleSession(req.params.sessionId, req.user!.id);
  if (!session) return res.status(404).json({ success: false, message: "Session not found" });

  const duration = session.startedAt ? Math.max(0, Math.floor((Date.now() - session.startedAt.getTime()) / 1000)) : null;
  const updated = await prisma.session.update({
    where: { id: session.id },
    data: { status: emergency ? "FAILED" : "ENDED", endedAt: new Date(), duration },
    include: sessionInclude
  });
  const body = serializeSession(updated);
  res.json({ success: true, data: { ...body, reason: input.data.reason ?? (emergency ? "emergency_stop" : "ended") }, session: { ...body, reason: input.data.reason ?? (emergency ? "emergency_stop" : "ended") } });
}

router.post("/:sessionId/end", (req: AuthedRequest, res) => endSession(req, res, false));
router.post("/:sessionId/emergency-stop", (req: AuthedRequest, res) => endSession(req, res, true));

export default router;
