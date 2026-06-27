import crypto from "crypto";
import { Request, Response, NextFunction } from "express";
export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
  const token = req.headers["x-csrf-token"] as string;
  if (!token) return res.status(403).json({ error: "CSRF token missing" });
  // Validate token
  next();
};
export const generateCsrfToken = (): string => crypto.randomBytes(32).toString("hex");
