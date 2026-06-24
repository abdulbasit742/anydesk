import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { env } from "../config/env.js";
import { logger } from "../observability/safeLogger.js";
import type { RequestWithId } from "./requestId.js";

interface HttpError extends Error {
  status?: number;
  statusCode?: number;
  code?: string;
  body?: unknown;
  type?: string;
}

function statusFromError(error: HttpError): number {
  const status = error.statusCode ?? error.status ?? 500;
  if (!Number.isInteger(status) || status < 400 || status > 599) return 500;
  return status;
}

function codeFromStatus(status: number): string {
  if (status === 400) return "bad_request";
  if (status === 401) return "unauthorized";
  if (status === 403) return "forbidden";
  if (status === 404) return "not_found";
  if (status === 413) return "payload_too_large";
  if (status === 415) return "unsupported_media_type";
  if (status === 429) return "rate_limited";
  return status >= 500 ? "internal_error" : "request_error";
}

function isJsonSyntaxError(error: HttpError): boolean {
  return error instanceof SyntaxError && error.status === 400 && "body" in error;
}

function isPayloadTooLargeError(error: HttpError): boolean {
  return error.status === 413 || error.type === "entity.too.large";
}

function isUnsupportedContentEncodingError(error: HttpError): boolean {
  return error.status === 415 && error.type === "encoding.unsupported";
}

function isUnsupportedCharsetError(error: HttpError): boolean {
  return error.status === 415 && error.type === "charset.unsupported";
}

export function notFound(req: RequestWithId, res: Response) {
  res.status(404).json({
    success: false,
    error: {
      code: "not_found",
      message: "Route not found",
      requestId: req.requestId,
      path: req.path
    }
  });
}

export function errorHandler(error: HttpError, req: RequestWithId, res: Response, next: NextFunction) {
  if (res.headersSent) return next(error);

  if (isJsonSyntaxError(error)) {
    return res.status(400).json({
      success: false,
      error: {
        code: "invalid_json",
        message: "Request body contains invalid JSON",
        requestId: req.requestId
      }
    });
  }

  if (isUnsupportedContentEncodingError(error)) {
    return res.status(415).json({
      success: false,
      error: {
        code: "unsupported_content_encoding",
        message: "Compressed request bodies are not supported",
        requestId: req.requestId
      }
    });
  }

  if (isUnsupportedCharsetError(error)) {
    return res.status(415).json({
      success: false,
      error: {
        code: "unsupported_charset",
        message: "Request body charset is not supported",
        requestId: req.requestId
      }
    });
  }

  if (isPayloadTooLargeError(error)) {
    return res.status(413).json({
      success: false,
      error: {
        code: "payload_too_large",
        message: "Request body exceeds the maximum allowed size",
        requestId: req.requestId
      }
    });
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: {
        code: "validation_error",
        message: "Invalid request payload",
        requestId: req.requestId,
        issues: error.flatten()
      }
    });
  }

  const status = statusFromError(error);
  const code = error.code ?? codeFromStatus(status);
  const message = status >= 500 ? "An unexpected error occurred" : error.message || "Request failed";

  logger.error("API request failed", {
    event: "api.error",
    status: String(status),
    code,
    requestId: req.requestId,
    method: req.method,
    path: req.path,
    errorName: error.name,
    errorMessage: error.message
  });

  return res.status(status).json({
    success: false,
    error: {
      code,
      message,
      requestId: req.requestId,
      ...(env.isProduction ? {} : { stack: error.stack })
    }
  });
}
