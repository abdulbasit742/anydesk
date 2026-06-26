import { Router } from "express";
import type { Request } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { generateRemoteDeskId } from "../lib/remoteDeskId.js";
import { hashPassword, verifyPassword } from "../lib/password.js";
import { issueTokenPair, verifyRefreshToken } from "../lib/tokens.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { createRateLimit } from "../middleware/rateLimit.js";

const router = Router();

const authRateLimit = createRateLimit({
  windowMs: 10 * 60_000,
  max: 25,
  keyOf: (req: Request) => {
    const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "no-email";
    const ip = req.ip ?? req.socket.remoteAddress ?? "unknown";
    return `${req.path}:${ip}:${email}`;
  }
});

const emailSchema = z.string().trim().email().transform((email) => email.toLowerCase());

const signupSchema = z.object({
  email: emailSchema,
  password: z.string().min(8),
  fullName: z.string().trim().min(2)
});

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1)
});

const refreshSchema = z.object({
  refreshToken: z.string().trim().min(20)
});

function publicUser(user: { id: string; email: string; fullName: string; remoteDeskId: string; plan: string }) {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    remoteDeskId: user.remoteDeskId,
    plan: user.plan
  };
}

router.post("/signup", authRateLimit, asyncHandler(async (req, res) => {
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
      subscription: { create: { plan: "FREE", status: "ACTIVE" } }
    },
    select: { id: true, email: true, fullName: true, remoteDeskId: true, plan: true }
  });

  res.status(201).json({
    success: true,
    data: {
      user: publicUser(user),
      tokens: issueTokenPair({ userId: user.id, email: user.email })
    }
  });
}));

router.post("/login", authRateLimit, asyncHandler(async (req, res) => {
  const input = loginSchema.safeParse(req.body);
  if (!input.success) return res.status(400).json({ success: false, errors: input.error.flatten() });

  const user = await prisma.user.findUnique({ where: { email: input.data.email } });
  if (!user || !(await verifyPassword(input.data.password, user.passwordHash))) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }

  res.json({
    success: true,
    data: {
      user: publicUser(user),
      tokens: issueTokenPair({ userId: user.id, email: user.email })
    }
  });
}));

router.post("/refresh", authRateLimit, asyncHandler(async (req, res) => {
  const input = refreshSchema.safeParse(req.body);
  if (!input.success) return res.status(400).json({ success: false, errors: input.error.flatten() });

  try {
    const payload = verifyRefreshToken(input.data.refreshToken);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, fullName: true, remoteDeskId: true, plan: true }
    });

    if (!user || user.email !== payload.email) {
      return res.status(401).json({ success: false, message: "Invalid refresh token" });
    }

    return res.json({
      success: true,
      data: {
        user: publicUser(user),
        tokens: issueTokenPair({ userId: user.id, email: user.email })
      }
    });
  } catch {
    return res.status(401).json({ success: false, message: "Invalid refresh token" });
  }
}));

router.get("/me", requireAuth, asyncHandler<AuthedRequest>(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { id: true, email: true, fullName: true, remoteDeskId: true, plan: true, isOnline: true }
  });
  res.json({ success: true, data: user });
}));

export default router;
