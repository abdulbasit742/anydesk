import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

// Create a new session request (viewer initiates connection to host)
const createSessionSchema = z.object({
  targetRemoteDeskId: z.string().min(1),
});

router.post("/create", async (req: AuthedRequest, res) => {
  const input = createSessionSchema.safeParse(req.body);
  if (!input.success) return res.status(400).json({ success: false, errors: input.error.flatten() });

  const targetId = input.data.targetRemoteDeskId.replace(/\s/g, "");
  const target = await prisma.user.findUnique({ where: { remoteDeskId: targetId } });
  if (!target) return res.status(404).json({ success: false, message: "Target user not found" });
  if (target.id === req.user!.id) return res.status(400).json({ success: false, message: "Cannot connect to yourself" });

  const session = await prisma.session.create({
    data: {
      hostId: target.id,
      clientId: req.user!.id,
      status: "PENDING",
    },
    include: {
      host: { select: { id: true, fullName: true, remoteDeskId: true, isOnline: true } },
      client: { select: { id: true, fullName: true, remoteDeskId: true } },
    },
  });

  res.status(201).json({ success: true, data: session });
});

// Accept or deny a session request (host responds)
const respondSessionSchema = z.object({
  accepted: z.boolean(),
});

router.patch("/:sessionId/respond", async (req: AuthedRequest, res) => {
  const input = respondSessionSchema.safeParse(req.body);
  if (!input.success) return res.status(400).json({ success: false, errors: input.error.flatten() });

  const session = await prisma.session.findUnique({ where: { id: req.params.sessionId } });
  if (!session) return res.status(404).json({ success: false, message: "Session not found" });
  if (session.hostId !== req.user!.id) return res.status(403).json({ success: false, message: "Only the host can respond" });
  if (session.status !== "PENDING") return res.status(400).json({ success: false, message: "Session is no longer pending" });

  const updated = await prisma.session.update({
    where: { id: session.id },
    data: {
      status: input.data.accepted ? "ACTIVE" : "REJECTED",
      startedAt: input.data.accepted ? new Date() : undefined,
    },
    include: {
      host: { select: { id: true, fullName: true, remoteDeskId: true } },
      client: { select: { id: true, fullName: true, remoteDeskId: true } },
    },
  });

  res.json({ success: true, data: updated });
});

// End an active session (either party can end)
router.patch("/:sessionId/end", async (req: AuthedRequest, res) => {
  const session = await prisma.session.findUnique({ where: { id: req.params.sessionId } });
  if (!session) return res.status(404).json({ success: false, message: "Session not found" });
  if (session.hostId !== req.user!.id && session.clientId !== req.user!.id) {
    return res.status(403).json({ success: false, message: "Not a participant of this session" });
  }
  if (session.status === "ENDED") return res.status(400).json({ success: false, message: "Session already ended" });

  const now = new Date();
  const duration = session.startedAt ? Math.floor((now.getTime() - session.startedAt.getTime()) / 1000) : null;

  const updated = await prisma.session.update({
    where: { id: session.id },
    data: { status: "ENDED", endedAt: now, duration },
    include: {
      host: { select: { id: true, fullName: true, remoteDeskId: true } },
      client: { select: { id: true, fullName: true, remoteDeskId: true } },
    },
  });

  res.json({ success: true, data: updated });
});

// Get active sessions for current user
router.get("/active", async (req: AuthedRequest, res) => {
  const sessions = await prisma.session.findMany({
    where: {
      OR: [{ hostId: req.user!.id }, { clientId: req.user!.id }],
      status: { in: ["PENDING", "ACTIVE"] },
    },
    include: {
      host: { select: { id: true, fullName: true, remoteDeskId: true, isOnline: true } },
      client: { select: { id: true, fullName: true, remoteDeskId: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  res.json({ success: true, data: sessions });
});

// Get session history
router.get("/history", async (req: AuthedRequest, res) => {
  const sessions = await prisma.session.findMany({
    where: {
      OR: [{ hostId: req.user!.id }, { clientId: req.user!.id }],
    },
    include: {
      host: { select: { id: true, fullName: true, remoteDeskId: true } },
      client: { select: { id: true, fullName: true, remoteDeskId: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  res.json({ success: true, data: sessions });
});

// Get single session by ID
router.get("/:sessionId", async (req: AuthedRequest, res) => {
  const session = await prisma.session.findUnique({
    where: { id: req.params.sessionId },
    include: {
      host: { select: { id: true, fullName: true, remoteDeskId: true, isOnline: true } },
      client: { select: { id: true, fullName: true, remoteDeskId: true } },
    },
  });
  if (!session) return res.status(404).json({ success: false, message: "Session not found" });
  if (session.hostId !== req.user!.id && session.clientId !== req.user!.id) {
    return res.status(403).json({ success: false, message: "Not a participant of this session" });
  }
  res.json({ success: true, data: session });
});

export default router;
