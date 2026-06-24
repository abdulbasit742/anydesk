import type { Response } from "express";
import type { NextFunction } from "express";
import type { RequestWithId } from "./requestId.js";

const SUPPORTED_CONTENT_ENCODINGS = new Set(["identity"]);

export function normalizeContentEncoding(value: string | undefined): string | null {
  const normalized = value?.trim().toLowerCase();
  return normalized || null;
}

export function rejectUnsupportedContentEncoding(req: RequestWithId, res: Response, next: NextFunction) {
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
