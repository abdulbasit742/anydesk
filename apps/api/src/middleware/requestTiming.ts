import type { NextFunction, Response } from "express";
import type { RequestWithId } from "./requestId.js";

export interface RequestTimingEntry {
  method: string;
  routePattern: string;
  statusCode: number;
  durationMs: number;
  requestId: string;
  teamId?: string;
  userId?: string;
  errorCode?: string;
  timestamp: string;
}

const MAX_ENTRIES = 2000;
const timingBuffer: RequestTimingEntry[] = [];

export function getTimingBuffer(): readonly RequestTimingEntry[] {
  return timingBuffer;
}

export function clearTimingBuffer(): void {
  timingBuffer.length = 0;
}

export function requestTiming(req: RequestWithId, res: Response, next: NextFunction): void {
  const start = Date.now();

  res.on("finish", () => {
    const durationMs = Date.now() - start;
    const entry: RequestTimingEntry = {
      method: req.method,
      routePattern: req.route?.path ?? req.path,
      statusCode: res.statusCode,
      durationMs,
      requestId: req.requestId ?? "unknown",
      teamId: (req as any).teamId ?? undefined,
      userId: (req as any).userId ?? undefined,
      errorCode: res.statusCode >= 400 ? String(res.statusCode) : undefined,
      timestamp: new Date().toISOString(),
    };

    if (timingBuffer.length >= MAX_ENTRIES) {
      timingBuffer.shift();
    }
    timingBuffer.push(entry);
  });

  next();
}
