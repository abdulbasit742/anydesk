import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { generateRemoteDeskId } from "../lib/remoteDeskId.js";
import { hashPassword, verifyPassword } from "../lib/password.js";
import { signAccessToken, signRefreshToken } from "../lib/tokens.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";

const router = Router();

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

router.post("/signup", async (req, res) => {
  const input = signupSchema.safeParse(req.body);
  if (!input.success) return res.status(400).json({ success: false, errors: input.error.flatten() });

  const existing = await prisma.user.findUnique({ where: { email: input.data.email } });
  if (existing) return res.status(409).json({ success: false, message: "Email already registered" });

  const user = await prisma.user.create({
    data: {
      email: input.data.email,
      fullName: input.data.fullName,
      passwordHash: await hashPassword(input.data.password),
      remoteDeskId: await generateRemoteDeskId(),
      subscriptions: { create: { plan: "FREE", status: "ACTIVE" } }
    },
    select: { id: true, email: true, fullName: true, remoteDeskId: true, plan: true }
  });

  const accessToken = signAccessToken({ userId: user.id, email: user.email });
  const refreshToken = signRefreshToken({ userId: user.id, email: user.email });

  res.status(201).json({
    success: true,
    data: {
      user,
      tokens: { accessToken, refreshToken },
      accessToken,
      token: accessToken,
      refreshToken
    },
    user,
    accessToken,
    token: accessToken,
    refreshToken
  });
});

router.post("/register", async (req, res, next) => {
  req.url = "/signup";
  return router.handle(req, res, next);
});

router.post("/login", async (req, res) => {
  const input = loginSchema.safeParse(req.body);
  if (!input.success) return res.status(400).json({ success: false, errors: input.error.flatten() });

  const user = await prisma.user.findUnique({ where: { email: input.data.email } });
  if (!user || !(await verifyPassword(input.data.password, user.passwordHash))) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }

  const safeUser = {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    remoteDeskId: user.remoteDeskId,
    plan: user.plan
  };
  const accessToken = signAccessToken({ userId: user.id, email: user.email });
  const refreshToken = signRefreshToken({ userId: user.id, email: user.email });

  res.json({
    success: true,
    data: {
      user: safeUser,
      tokens: { accessToken, refreshToken },
      accessToken,
      token: accessToken,
      refreshToken
    },
    user: safeUser,
    accessToken,
    token: accessToken,
    refreshToken
  });
});

router.get("/me", requireAuth, async (req: AuthedRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { id: true, email: true, fullName: true, remoteDeskId: true, plan: true, isOnline: true }
  });
  res.json({ success: true, data: user, user });
});

router.post("/logout", requireAuth, async (_req: AuthedRequest, res) => {
  res.json({ success: true, ok: true });
});

export default router;
