import type { RequestHandler } from "express";
import type { RequestWithId } from "./requestId.js";

const JSON_BODY_METHODS = new Set(["POST", "PUT", "PATCH"]);

function isApiPath(path: string): boolean {
  return path === "/api" || path.startsWith("/api/");
}

function acceptsJson(req: RequestWithId): boolean {
  return Boolean(req.is("application/json") || req.is("application/*+json"));
}

export const requireJsonContentType: RequestHandler = (req: RequestWithId, res, next) => {
  if (!JSON_BODY_METHODS.has(req.method) || !isApiPath(req.path)) {
    return next();
  }

  if (acceptsJson(req)) {
    return next();
  }

  return res.status(415).json({
    success: false,
    error: {
      code: "unsupported_media_type",
      message: "Content-Type must be application/json",
      requestId: req.requestId
    }
  });
};
