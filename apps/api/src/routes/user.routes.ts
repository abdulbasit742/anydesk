import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { hashPassword } from "../lib/password.js";
import { formatRemoteDeskId } from "../lib/remoteDeskId.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();
router.use(requireAuth);

router.get("/profile", asyncHandler<AuthedRequest>(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { id: true, email: true, fullName: true, remoteDeskId: true, plan: true, isOnline: true, lastSeenAt: true }
  });
  res.json({
    success: true,
    data: user ? { ...user, remoteDeskIdFormatted: formatRemoteDeskId(user.remoteDeskId) } : null
  });
}));

router.patch("/profile", asyncHandler<AuthedRequest>(async (req, res) => {
  const input = z.object({ fullName: z.string().min(2) }).safeParse(req.body);
  if (!input.success) return res.status(400).json({ success: false, errors: input.error.flatten() });
  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data: input.data,
    select: { id: true, email: true, fullName: true, remoteDeskId: true, plan: true }
  });
  res.json({ success: true, data: user });
}));

router.patch("/device-password", asyncHandler<AuthedRequest>(async (req, res) => {
  const input = z.object({ password: z.string().min(4).max(128) }).safeParse(req.body);
  if (!input.success) return res.status(400).json({ success: false, errors: input.error.flatten() });
  await prisma.user.update({
    where: { id: req.user!.id },
    data: { devicePassword: await hashPassword(input.data.password) }
  });
  res.json({ success: true, message: "Device password updated" });
}));

router.get("/lookup/:remoteDeskId", asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { remoteDeskId: req.params.remoteDeskId.replace(/\s/g, "") },
    select: { id: true, fullName: true, remoteDeskId: true, isOnline: true }
  });
  if (!user) return res.status(404).json({ success: false, message: "RemoteDesk ID not found" });
  res.json({ success: true, data: user });
}));

export default router;
