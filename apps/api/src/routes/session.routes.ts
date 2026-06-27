import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { z } from "zod";

const router = Router();
router.use(requireAuth);

// Create a new session request
const createSessionSchema = z.object({
  targetDeviceId: z.string().uuid(),
  type: z.enum(["view", "control"]).default("view"),
});

router.post("/create", asyncHandler<AuthedRequest>(async (req, res) => {
  const input = createSessionSchema.safeParse(req.body);
  if (!input.success) return res.status(400).json({ success: false, errors: input.error.flatten() });

  const device = await prisma.device.findUnique({ where: { id: input.data.targetDeviceId } });
  if (!device) return res.status(404).json({ success: false, message: "Target device not found" });

  const session = await prisma.session.create({
    data: {
      hostId: device.userId,
      clientId: req.user!.id,
      status: "PENDING",
    },
  });

  res.status(201).json({ success: true, data: session });
}));

// Session history (MUST be before /:id to avoid being caught by param route)
router.get("/history", asyncHandler<AuthedRequest>(async (req, res) => {
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
}));

// Get active sessions (MUST be before /:id)
router.get("/active", asyncHandler<AuthedRequest>(async (req, res) => {
  const sessions = await prisma.session.findMany({
    where: {
      OR: [{ hostId: req.user!.id }, { clientId: req.user!.id }],
      status: "ACTIVE",
    },
    include: {
      host: { select: { id: true, fullName: true, remoteDeskId: true } },
      client: { select: { id: true, fullName: true, remoteDeskId: true } },
    },
  });
  res.json({ success: true, data: sessions });
}));

// Get session by ID
router.get("/:id", asyncHandler<AuthedRequest>(async (req, res) => {
  const session = await prisma.session.findUnique({
    where: { id: req.params.id },
    include: {
      host: { select: { id: true, fullName: true, remoteDeskId: true } },
      client: { select: { id: true, fullName: true, remoteDeskId: true } },
    },
  });
  if (!session) return res.status(404).json({ success: false, message: "Session not found" });
  if (session.hostId !== req.user!.id && session.clientId !== req.user!.id) {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }
  res.json({ success: true, data: session });
}));

// Respond to a session (accept/deny)
const respondSchema = z.object({
  action: z.enum(["accept", "deny"]),
});

router.patch("/:id/respond", asyncHandler<AuthedRequest>(async (req, res) => {
  const input = respondSchema.safeParse(req.body);
  if (!input.success) return res.status(400).json({ success: false, errors: input.error.flatten() });

  const session = await prisma.session.findUnique({ where: { id: req.params.id } });
  if (!session) return res.status(404).json({ success: false, message: "Session not found" });
  if (session.hostId !== req.user!.id) return res.status(403).json({ success: false, message: "Only host can respond" });
  if (session.status !== "PENDING") return res.status(400).json({ success: false, message: "Session is not pending" });

  const newStatus = input.data.action === "accept" ? "ACTIVE" : "REJECTED";
  const updated = await prisma.session.update({
    where: { id: session.id },
    data: {
      status: newStatus,
      ...(newStatus === "ACTIVE" ? { startedAt: new Date() } : {}),
    },
  });

  res.json({ success: true, data: updated });
}));

// End a session (emergency stop)
router.patch("/:id/end", asyncHandler<AuthedRequest>(async (req, res) => {
  const session = await prisma.session.findUnique({ where: { id: req.params.id } });
  if (!session) return res.status(404).json({ success: false, message: "Session not found" });
  if (session.hostId !== req.user!.id && session.clientId !== req.user!.id) {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }
  if (session.status === "ENDED") return res.status(400).json({ success: false, message: "Session already ended" });

  const updated = await prisma.session.update({
    where: { id: session.id },
    data: { status: "ENDED", endedAt: new Date() },
  });

  res.json({ success: true, data: updated });
}));

export default router;
