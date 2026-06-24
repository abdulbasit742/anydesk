import { randomUUID } from "node:crypto";
import type { NextFunction, Request, Response } from "express";

export interface RequestWithId extends Request {
  requestId?: string;
}

export const REQUEST_ID_HEADER = "x-request-id";
export const REQUEST_ID_MIN_LENGTH = 8;
export const REQUEST_ID_MAX_LENGTH = 96;
export const REQUEST_ID_PATTERN = /^[a-zA-Z0-9._:-]+$/;

export function normalizeRequestId(value: string | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  if (trimmed.length < REQUEST_ID_MIN_LENGTH) return null;
  if (trimmed.length > REQUEST_ID_MAX_LENGTH) return null;
  if (!REQUEST_ID_PATTERN.test(trimmed)) return null;
  return trimmed;
}

export function requestId(req: RequestWithId, res: Response, next: NextFunction) {
  const incoming = normalizeRequestId(req.header(REQUEST_ID_HEADER));
  const id = incoming ?? randomUUID();

  req.requestId = id;
  res.setHeader(REQUEST_ID_HEADER, id);
  next();
}
