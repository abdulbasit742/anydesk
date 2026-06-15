import type { NextFunction, Request, RequestHandler, Response } from "express";

export interface RateLimitOptions {
  windowMs: number;
  max: number;
  keyOf?: (req: Request) => string;
}

export function createRateLimit(options: RateLimitOptions): RequestHandler {
  const hits = new Map<string, number[]>();
  const keyOf = options.keyOf ?? ((req: Request) => req.ip ?? req.socket.remoteAddress ?? "unknown");

  return function rateLimit(req: Request, res: Response, next: NextFunction) {
    const now = Date.now();
    const key = keyOf(req);
    const recent = (hits.get(key) ?? []).filter((timestamp) => now - timestamp < options.windowMs);
    recent.push(now);
    hits.set(key, recent);

    const remaining = Math.max(0, options.max - recent.length);
    res.setHeader("RateLimit-Limit", String(options.max));
    res.setHeader("RateLimit-Remaining", String(remaining));
    res.setHeader("RateLimit-Reset", String(Math.ceil((now + options.windowMs) / 1000)));

    if (recent.length > options.max) {
      res.setHeader("Retry-After", String(Math.ceil(options.windowMs / 1000)));
      res.status(429).json({
        success: false,
        message: "Too many requests",
        code: "RATE_LIMITED"
      });
      return;
    }

    next();
  };
}
