import type { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { verifyAccessToken } from "../lib/tokens.js";

export interface AuthedRequest extends Request {
  user?: {
    id: string;
    email: string;
    remoteDeskId: string;
  };
}

export async function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Missing token" });
  }

  try {
    const payload = verifyAccessToken(header.slice("Bearer ".length));
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, remoteDeskId: true }
    });
    if (!user) return res.status(401).json({ success: false, message: "User not found" });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
}
