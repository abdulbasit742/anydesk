import { randomUUID } from "node:crypto";
import type { NextFunction, Request, Response } from "express";

export interface RequestWithId extends Request {
  requestId?: string;
}

export function requestId(req: RequestWithId, res: Response, next: NextFunction) {
  const incoming = req.header("x-request-id");
  const id = incoming && incoming.trim().length > 0 ? incoming : randomUUID();

  req.requestId = id;
  res.setHeader("x-request-id", id);
  next();
}
