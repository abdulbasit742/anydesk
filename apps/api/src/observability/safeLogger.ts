/**
 * Safe structured logger with automatic redaction.
 * Never logs secrets, tokens, SDP/ICE, clipboard, file, screen, or input content.
 */

type LogLevel = "debug" | "info" | "warn" | "error";

const SECRET_PATTERNS = [
  /token/i,
  /secret/i,
  /password/i,
  /authorization/i,
  /cookie/i,
  /credential/i,
  /apikey/i,
  /api_key/i,
  /private_key/i,
  /service_role/i,
  /jwt/i,
  /session_token/i,
  /refresh_token/i,
  /access_token/i,
];

const CONTENT_PATTERNS = [
  /clipboard/i,
  /file_content/i,
  /screen_capture/i,
  /input_data/i,
  /sdp/i,
  /ice_candidate/i,
  /turn_credential/i,
  /stun_credential/i,
];

function shouldRedactKey(key: string): boolean {
  return (
    SECRET_PATTERNS.some((p) => p.test(key)) ||
    CONTENT_PATTERNS.some((p) => p.test(key))
  );
}

function redactValue(value: unknown): unknown {
  if (typeof value === "string" && value.length > 100) {
    return "[REDACTED:long_string]";
  }
  return "[REDACTED]";
}

function sanitizeMetadata(
  meta: Record<string, unknown> | undefined
): Record<string, unknown> | undefined {
  if (!meta) return undefined;
  const safe: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(meta)) {
    if (shouldRedactKey(key)) {
      safe[key] = redactValue(value);
    } else if (typeof value === "object" && value !== null) {
      safe[key] = "[object]";
    } else {
      safe[key] = value;
    }
  }
  return safe;
}

function formatLog(
  level: LogLevel,
  message: string,
  metadata?: Record<string, unknown>
): string {
  const entry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(metadata ? { metadata: sanitizeMetadata(metadata) } : {}),
  };
  return JSON.stringify(entry);
}

export const safeLogger = {
  debug(message: string, metadata?: Record<string, unknown>): void {
    if (process.env.LOG_LEVEL === "debug") {
      console.debug(formatLog("debug", message, metadata));
    }
  },

  info(message: string, metadata?: Record<string, unknown>): void {
    console.info(formatLog("info", message, metadata));
  },

  warn(message: string, metadata?: Record<string, unknown>): void {
    console.warn(formatLog("warn", message, metadata));
  },

  error(message: string, metadata?: Record<string, unknown>): void {
    console.error(formatLog("error", message, metadata));
  },
};
