import type { Response } from "express";
import type { NextFunction } from "express";
import type { RequestWithId } from "./requestId.js";

export const ALLOWED_HTTP_METHODS = ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"] as const;
const ALLOWED_HTTP_METHOD_SET = new Set<string>(ALLOWED_HTTP_METHODS);
const ALLOW_HEADER_VALUE = ALLOWED_HTTP_METHODS.join(", ");

export function isAllowedHttpMethod(method: string): boolean {
  return ALLOWED_HTTP_METHOD_SET.has(method.toUpperCase());
}

export function rejectUnsupportedHttpMethod(req: RequestWithId, res: Response, next: NextFunction) {
  if (isAllowedHttpMethod(req.method)) {
    return next();
  }

  res.setHeader("Allow", ALLOW_HEADER_VALUE);

  return res.status(405).json({
    success: false,
    error: {
      code: "method_not_allowed",
      message: "HTTP method is not allowed",
      requestId: req.requestId
    }
  });
}
