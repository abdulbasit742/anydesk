import type { Response } from "express";
import type { NextFunction } from "express";
import type { RequestWithId } from "./requestId.js";

export const MAX_REQUEST_TARGET_LENGTH = 4096;
export const MAX_PATH_LENGTH = 2048;
export const MAX_PATH_SEGMENTS = 64;
export const MAX_QUERY_STRING_LENGTH = 2048;

const PERCENT_ENCODING_PATTERN = /%(?![0-9a-fA-F]{2})/;
const ENCODED_CONTROL_CHARACTER_PATTERN = /%(?:0[0-9a-fA-F]|1[0-9a-fA-F]|7f)/i;

function getRequestTarget(req: RequestWithId): string {
  return req.originalUrl || req.url || "";
}

export function hasMalformedPercentEncoding(value: string): boolean {
  return PERCENT_ENCODING_PATTERN.test(value);
}

export function hasEncodedControlCharacter(value: string): boolean {
  return ENCODED_CONTROL_CHARACTER_PATTERN.test(value);
}

export function getPathFromRequestTarget(requestTarget: string | undefined): string {
  const target = requestTarget || "";
  const queryStart = target.indexOf("?");
  return queryStart < 0 ? target : target.slice(0, queryStart);
}

export function getPathSegmentCount(path: string | undefined): number {
  return (path || "").split("/").filter(Boolean).length;
}

export function getQueryStringLength(originalUrl: string | undefined): number {
  const queryStart = originalUrl?.indexOf("?") ?? -1;
  if (queryStart < 0 || !originalUrl) return 0;
  return originalUrl.length - queryStart - 1;
}

export function rejectOversizedQueryString(req: RequestWithId, res: Response, next: NextFunction) {
  const requestTarget = getRequestTarget(req);

  if (hasMalformedPercentEncoding(requestTarget)) {
    return res.status(400).json({
      success: false,
      error: {
        code: "malformed_request_target_encoding",
        message: "Request target contains malformed percent-encoding",
        requestId: req.requestId
      }
    });
  }

  if (hasEncodedControlCharacter(requestTarget)) {
    return res.status(400).json({
      success: false,
      error: {
        code: "invalid_request_target_character",
        message: "Request target contains an encoded control character",
        requestId: req.requestId
      }
    });
  }

  if (requestTarget.length > MAX_REQUEST_TARGET_LENGTH) {
    return res.status(414).json({
      success: false,
      error: {
        code: "request_target_too_long",
        message: "Request target exceeds the maximum allowed length",
        requestId: req.requestId
      }
    });
  }

  const path = getPathFromRequestTarget(requestTarget);

  if (path.length > MAX_PATH_LENGTH) {
    return res.status(414).json({
      success: false,
      error: {
        code: "path_too_long",
        message: "Request path exceeds the maximum allowed length",
        requestId: req.requestId
      }
    });
  }

  if (getPathSegmentCount(path) > MAX_PATH_SEGMENTS) {
    return res.status(414).json({
      success: false,
      error: {
        code: "too_many_path_segments",
        message: "Request path contains too many segments",
        requestId: req.requestId
      }
    });
  }

  const queryLength = getQueryStringLength(requestTarget);

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
