import type { NextFunction, Request, RequestHandler, Response } from "express";

export interface RateLimitOptions {
  windowMs: number;
  max: number;
  keyOf?: (req: Request) => string;
  name?: string;
  cleanupIntervalMs?: number;
}

interface RateLimitBucket {
  hits: number[];
  lastSeenAt: number;
}

function defaultKeyOf(req: Request): string {
  return req.ip ?? req.socket.remoteAddress ?? "unknown";
}

function clampPositiveInteger(value: number, fallback: number): number {
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : fallback;
}

export function createRateLimit(options: RateLimitOptions): RequestHandler {
  const windowMs = clampPositiveInteger(options.windowMs, 60_000);
  const max = clampPositiveInteger(options.max, 60);
  const cleanupIntervalMs = clampPositiveInteger(options.cleanupIntervalMs ?? windowMs, windowMs);
  const hits = new Map<string, RateLimitBucket>();
  const keyOf = options.keyOf ?? defaultKeyOf;
  const limiterName = options.name ?? "default";
  let nextCleanupAt = Date.now() + cleanupIntervalMs;

  function cleanup(now: number) {
    if (now < nextCleanupAt) return;
    for (const [key, bucket] of hits.entries()) {
      const recent = bucket.hits.filter((timestamp) => now - timestamp < windowMs);
      if (recent.length === 0 && now - bucket.lastSeenAt >= windowMs) {
        hits.delete(key);
      } else {
        bucket.hits = recent;
        bucket.lastSeenAt = now;
      }
    }
    nextCleanupAt = now + cleanupIntervalMs;
  }

  return function rateLimit(req: Request, res: Response, next: NextFunction) {
    const now = Date.now();
    cleanup(now);

    const key = keyOf(req);
    const bucket = hits.get(key) ?? { hits: [], lastSeenAt: now };
    const recent = bucket.hits.filter((timestamp) => now - timestamp < windowMs);
    const oldest = recent[0] ?? now;
    const resetAt = oldest + windowMs;
    const resetSeconds = Math.ceil(resetAt / 1000);
    const retryAfterSeconds = Math.max(1, Math.ceil((resetAt - now) / 1000));

    if (recent.length >= max) {
      bucket.hits = recent;
      bucket.lastSeenAt = now;
      hits.set(key, bucket);

      res.setHeader("RateLimit-Limit", String(max));
      res.setHeader("RateLimit-Remaining", "0");
      res.setHeader("RateLimit-Reset", String(resetSeconds));
      res.setHeader("Retry-After", String(retryAfterSeconds));
      res.setHeader("X-RateLimit-Policy", `${limiterName};w=${Math.ceil(windowMs / 1000)};q=${max}`);
      res.status(429).json({
        success: false,
        message: "Too many requests",
        code: "RATE_LIMITED",
        retryAfterSeconds
      });
      return;
    }

    recent.push(now);
    bucket.hits = recent;
    bucket.lastSeenAt = now;
    hits.set(key, bucket);

    const remaining = Math.max(0, max - recent.length);
    res.setHeader("RateLimit-Limit", String(max));
    res.setHeader("RateLimit-Remaining", String(remaining));
    res.setHeader("RateLimit-Reset", String(resetSeconds));
    res.setHeader("X-RateLimit-Policy", `${limiterName};w=${Math.ceil(windowMs / 1000)};q=${max}`);

    next();
  };
}
