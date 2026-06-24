import type { Response } from "express";
import type { NextFunction } from "express";
import type { RequestWithId } from "./requestId.js";
import { JSON_BODY_METHODS, hasRequestBody, isApiPath, isJsonContentType } from "./requireJsonContentType.js";

export const SUPPORTED_JSON_CHARSETS = new Set(["utf-8", "utf8"]);

export function normalizeJsonCharset(contentType: string | undefined): string | null {
  const match = contentType?.match(/(?:^|;)\s*charset\s*=\s*([^;]+)/i);
  const charset = match?.[1]?.trim().replace(/^"|"$/g, "").toLowerCase();
  return charset || null;
}

export function rejectUnsupportedJsonCharset(req: RequestWithId, res: Response, next: NextFunction) {
  if (!JSON_BODY_METHODS.has(req.method) || !isApiPath(req.path) || !hasRequestBody(req)) {
    return next();
  }

  const contentType = req.get("content-type");
  if (!isJsonContentType(contentType)) {
    return next();
  }

  const charset = normalizeJsonCharset(contentType);
  if (!charset || SUPPORTED_JSON_CHARSETS.has(charset)) {
    return next();
  }

  return res.status(415).json({
    success: false,
    error: {
      code: "unsupported_charset",
      message: "Request body charset is not supported",
      requestId: req.requestId
    }
  });
}
