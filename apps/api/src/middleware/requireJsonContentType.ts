import type { RequestHandler } from "express";
import type { RequestWithId } from "./requestId.js";

export const JSON_BODY_TYPES = ["application/json", "application/*+json"] as const;
export const JSON_BODY_METHODS = new Set(["POST", "PUT", "PATCH"]);

export function isApiPath(path: string): boolean {
  return path === "/api" || path.startsWith("/api/");
}

export function hasRequestBody(req: RequestWithId): boolean {
  const contentLength = req.get("content-length");
  if (contentLength && Number(contentLength) > 0) return true;
  return Boolean(req.get("transfer-encoding"));
}

function getMediaType(contentType: string | undefined): string | null {
  return contentType?.split(";")[0]?.trim().toLowerCase() || null;
}

export function isJsonContentType(contentType: string | undefined): boolean {
  const mediaType = getMediaType(contentType);
  if (!mediaType) return false;

  return JSON_BODY_TYPES.some((type) => {
    if (type === "application/*+json") return mediaType.startsWith("application/") && mediaType.endsWith("+json");
    return mediaType === type;
  });
}

export const requireJsonContentType: RequestHandler = (req: RequestWithId, res, next) => {
  if (!JSON_BODY_METHODS.has(req.method) || !isApiPath(req.path) || !hasRequestBody(req)) {
    return next();
  }

  if (isJsonContentType(req.get("content-type"))) {
    return next();
  }

  return res.status(415).json({
    success: false,
    error: {
      code: "unsupported_media_type",
      message: "Content-Type must be application/json when a request body is sent",
      requestId: req.requestId
    }
  });
};
