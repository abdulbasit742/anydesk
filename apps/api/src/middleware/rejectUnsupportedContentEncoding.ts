import type { Response } from "express";
import type { NextFunction } from "express";
import type { RequestWithId } from "./requestId.js";
import { JSON_BODY_METHODS, hasRequestBody, isApiPath } from "./requireJsonContentType.js";

const SUPPORTED_CONTENT_ENCODINGS = new Set(["identity"]);

export function normalizeContentEncoding(value: string | undefined): string | null {
  const normalized = value?.trim().toLowerCase();
  return normalized || null;
}

export function rejectUnsupportedContentEncoding(req: RequestWithId, res: Response, next: NextFunction) {
  if (!JSON_BODY_METHODS.has(req.method) || !isApiPath(req.path) || !hasRequestBody(req)) {
    return next();
  }

  const encoding = normalizeContentEncoding(req.get("content-encoding"));

  if (!encoding || SUPPORTED_CONTENT_ENCODINGS.has(encoding)) {
    return next();
  }

  return res.status(415).json({
    success: false,
    error: {
      code: "unsupported_content_encoding",
      message: "Compressed request bodies are not supported",
      requestId: req.requestId
    }
  });
}
