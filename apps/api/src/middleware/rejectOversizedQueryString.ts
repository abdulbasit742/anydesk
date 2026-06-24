import type { Response } from "express";
import type { NextFunction } from "express";
import type { RequestWithId } from "./requestId.js";

export const MAX_REQUEST_TARGET_LENGTH = 4096;
export const MAX_PATH_LENGTH = 2048;
export const MAX_PATH_SEGMENTS = 64;
export const MAX_QUERY_STRING_LENGTH = 2048;
export const MAX_QUERY_PARAMETER_COUNT = 64;
export const MAX_QUERY_PARAMETER_KEY_LENGTH = 128;
export const MAX_QUERY_PARAMETER_VALUE_LENGTH = 1024;

const PERCENT_ENCODING_PATTERN = /%(?![0-9a-fA-F]{2})/;
const ENCODED_CONTROL_CHARACTER_PATTERN = /%(?:0[0-9a-fA-F]|1[0-9a-fA-F]|7f)/i;
const ENCODED_BACKSLASH_PATTERN = /%5c/i;
const ENCODED_PARENT_SEGMENT_PATTERN = /(?:^|\/)%2e%2e(?:\/|$)/i;

interface QueryParameterStats {
  count: number;
  maxKeyLength: number;
  maxValueLength: number;
}

function getRequestTarget(req: RequestWithId): string {
  return req.originalUrl || req.url || "";
}

export function hasMalformedPercentEncoding(value: string): boolean {
  return PERCENT_ENCODING_PATTERN.test(value);
}

export function hasEncodedControlCharacter(value: string): boolean {
  return ENCODED_CONTROL_CHARACTER_PATTERN.test(value);
}

export function hasEncodedBackslash(value: string): boolean {
  return ENCODED_BACKSLASH_PATTERN.test(value);
}

export function getPathFromRequestTarget(requestTarget: string | undefined): string {
  const target = requestTarget || "";
  const queryStart = target.indexOf("?");
  return queryStart < 0 ? target : target.slice(0, queryStart);
}

export function getPathSegmentCount(path: string | undefined): number {
  return (path || "").split("/").filter(Boolean).length;
}

export function hasParentDirectorySegment(path: string | undefined): boolean {
  const target = path || "";
  return target.split("/").some((segment) => segment === "..") || ENCODED_PARENT_SEGMENT_PATTERN.test(target);
}

export function getQueryString(requestTarget: string | undefined): string {
  const queryStart = requestTarget?.indexOf("?") ?? -1;
  if (queryStart < 0 || !requestTarget) return "";
  return requestTarget.slice(queryStart + 1);
}

export function getQueryStringLength(originalUrl: string | undefined): number {
  return getQueryString(originalUrl).length;
}

export function getQueryParameterStats(queryString: string): QueryParameterStats {
  if (!queryString) return { count: 0, maxKeyLength: 0, maxValueLength: 0 };

  return queryString.split("&").filter(Boolean).reduce<QueryParameterStats>((stats, pair) => {
    const separatorIndex = pair.indexOf("=");
    const key = separatorIndex < 0 ? pair : pair.slice(0, separatorIndex);
    const value = separatorIndex < 0 ? "" : pair.slice(separatorIndex + 1);

    return {
      count: stats.count + 1,
      maxKeyLength: Math.max(stats.maxKeyLength, key.length),
      maxValueLength: Math.max(stats.maxValueLength, value.length)
    };
  }, { count: 0, maxKeyLength: 0, maxValueLength: 0 });
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

  if (hasEncodedBackslash(requestTarget)) {
    return res.status(400).json({
      success: false,
      error: {
        code: "invalid_path_separator",
        message: "Request target contains an encoded path separator",
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

  if (hasParentDirectorySegment(path)) {
    return res.status(400).json({
      success: false,
      error: {
        code: "parent_path_segment_not_allowed",
        message: "Request path contains a parent directory segment",
        requestId: req.requestId
      }
    });
  }

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

  const queryString = getQueryString(requestTarget);

  if (queryString.length > MAX_QUERY_STRING_LENGTH) {
    return res.status(414).json({
      success: false,
      error: {
        code: "query_string_too_long",
        message: "Query string exceeds the maximum allowed length",
        requestId: req.requestId
      }
    });
  }

  const queryStats = getQueryParameterStats(queryString);

  if (queryStats.count > MAX_QUERY_PARAMETER_COUNT) {
    return res.status(414).json({
      success: false,
      error: {
        code: "too_many_query_parameters",
        message: "Query string contains too many parameters",
        requestId: req.requestId
      }
    });
  }

  if (queryStats.maxKeyLength > MAX_QUERY_PARAMETER_KEY_LENGTH) {
    return res.status(414).json({
      success: false,
      error: {
        code: "query_parameter_key_too_long",
        message: "Query parameter key exceeds the maximum allowed length",
        requestId: req.requestId
      }
    });
  }

  if (queryStats.maxValueLength > MAX_QUERY_PARAMETER_VALUE_LENGTH) {
    return res.status(414).json({
      success: false,
      error: {
        code: "query_parameter_value_too_long",
        message: "Query parameter value exceeds the maximum allowed length",
        requestId: req.requestId
      }
    });
  }

  return next();
}
