import type { Response } from "express";
import type { NextFunction } from "express";
import type { RequestWithId } from "./requestId.js";

export const MAX_QUERY_STRING_LENGTH = 2048;

export function getQueryStringLength(originalUrl: string | undefined): number {
  const queryStart = originalUrl?.indexOf("?") ?? -1;
  if (queryStart < 0 || !originalUrl) return 0;
  return originalUrl.length - queryStart - 1;
}

export function rejectOversizedQueryString(req: RequestWithId, res: Response, next: NextFunction) {
  const queryLength = getQueryStringLength(req.originalUrl || req.url);

  if (queryLength <= MAX_QUERY_STRING_LENGTH) {
    return next();
  }

  return res.status(414).json({
    success: false,
    error: {
      code: "query_string_too_long",
      message: "Query string exceeds the maximum allowed length",
      requestId: req.requestId
    }
  });
}
