import type { Response } from "express";
import type { NextFunction } from "express";
import type { RequestWithId } from "./requestId.js";
import { JSON_BODY_TYPES } from "./requireJsonContentType.js";

const JSON_BODY_METHODS = new Set(["POST", "PUT", "PATCH"]);
const SUPPORTED_JSON_CHARSETS = new Set(["utf-8", "utf8"]);

function isApiPath(path: string): boolean {
  return path === "/api" || path.startsWith("/api/");
}

function hasRequestBody(req: RequestWithId): boolean {
  const contentLength = req.get("content-length");
  if (contentLength && Number(contentLength) > 0) return true;
  return Boolean(req.get("transfer-encoding"));
}

function getMediaType(contentType: string | undefined): string | null {
  return contentType?.split(";")[0]?.trim().toLowerCase() || null;
}

function isJsonContentType(contentType: string | undefined): boolean {
  const mediaType = getMediaType(contentType);
  if (!mediaType) return false;

  return JSON_BODY_TYPES.some((type) => {
    if (type === "application/*+json") return mediaType.startsWith("application/") && mediaType.endsWith("+json");
    return mediaType === type;
  });
}

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
