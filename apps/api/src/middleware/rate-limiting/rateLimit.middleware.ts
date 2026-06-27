import { Request, Response, NextFunction } from "express";
const requests = new Map<string, { count: number; resetAt: number }>();
export const rateLimit = (maxRequests: number = 100, windowMs: number = 60000) => (req: Request, res: Response, next: NextFunction) => {
  const key = req.ip || "unknown";
  const now = Date.now();
  const record = requests.get(key);
  if (!record || record.resetAt < now) { requests.set(key, { count: 1, resetAt: now + windowMs }); return next(); }
  if (record.count >= maxRequests) { res.set("Retry-After", String(Math.ceil((record.resetAt - now) / 1000))); return res.status(429).json({ error: "Too many requests" }); }
  record.count++;
  next();
};
