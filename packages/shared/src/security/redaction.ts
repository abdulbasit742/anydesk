const DEFAULT_MAX_DEPTH = 8;
const DEFAULT_MAX_TEXT_LENGTH = 200_000;

export const REDACTION_PLACEHOLDER = "[REDACTED]";

export const SECRET_FIELD_NAME_PATTERNS = [
  /password/i,
  /passwd/i,
  /pwd/i,
  /secret/i,
  /token/i,
  /access[_-]?token/i,
  /refresh[_-]?token/i,
  /id[_-]?token/i,
  /api[_-]?key/i,
  /apikey/i,
  /private[_-]?key/i,
  /client[_-]?secret/i,
  /jwt/i,
  /authorization/i,
  /^cookie$/i,
  /^set-cookie$/i,
  /session[_-]?token/i,
  /device[_-]?token/i,
  /webhook[_-]?secret/i,
  /webhook[_-]?signature/i,
  /signing[_-]?secret/i,
  /supabase.*service.*role/i,
  /turn[_-]?credential/i,
  /database[_-]?url/i,
  /connection[_-]?string/i
] as const;

export const SECRET_VALUE_PATTERNS = [
  /-----BEGIN (?:OPENSSH |RSA |EC |DSA |)?PRIVATE KEY-----[\s\S]*?-----END (?:OPENSSH |RSA |EC |DSA |)?PRIVATE KEY-----/gi,
  /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g,
  /\bBearer\s+[A-Za-z0-9._~+\/-]{16,}\b/gi,
  /\b(?:ghp|github_pat)_[A-Za-z0-9_]{20,}\b/g,
  /\bsk-[A-Za-z0-9]{20,}\b/g,
  /\bAKIA[0-9A-Z]{16}\b/g,
  /\bAIza[0-9A-Za-z_-]{20,}\b/g,
  /\b(?:postgres|postgresql|mysql|mongodb|redis):\/\/[^\s@:/]+:[^\s@]+@[^\s]+/gi,
  /\b(?:token|access_token|refresh_token|api_key|signature|secret|code)=([^\s&]+)/gi,
  /\bX-RemoteDesk-(?:Webhook-)?Signature\s*[:=]\s*[^\s]+/gi,
  /\bWEBRTC_TURN_CREDENTIAL\s*[:=]\s*[^\s]+/gi,
  /\bSUPABASE_SERVICE_ROLE_KEY\s*[:=]\s*[^\s]+/gi
] as const;

export const FORBIDDEN_DIAGNOSTIC_FILENAMES = [
  ".env",
  ".env.local",
  ".env.production",
  ".npmrc",
  ".yarnrc",
  ".pypirc",
  ".netrc",
  "id_rsa",
  "id_ed25519"
] as const;

export const FORBIDDEN_DIAGNOSTIC_CATEGORIES = [
  "screen_capture",
  "clipboard_content",
  "keystrokes",
  "browser_history",
  "passwords",
  "private_keys",
  "raw_auth_headers",
  "api_keys",
  "env_files",
  "full_filesystem"
] as const;

export interface RedactionSummary {
  totalRedactions: number;
  categories: Record<string, number>;
  truncated: boolean;
}

export interface RedactionResult<T> {
  value: T;
  summary: RedactionSummary;
}

const emptySummary = (): RedactionSummary => ({
  totalRedactions: 0,
  categories: {},
  truncated: false
});

const increment = (summary: RedactionSummary, category: string, amount = 1) => {
  summary.totalRedactions += amount;
  summary.categories[category] = (summary.categories[category] ?? 0) + amount;
};

export function redactSensitiveText(input: string, summary = emptySummary()): RedactionResult<string> {
  let value = input;
  if (value.length > DEFAULT_MAX_TEXT_LENGTH) {
    value = value.slice(0, DEFAULT_MAX_TEXT_LENGTH);
    summary.truncated = true;
  }

  for (const pattern of SECRET_VALUE_PATTERNS) {
    value = value.replace(pattern, () => {
      increment(summary, "secret_value");
      return REDACTION_PLACEHOLDER;
    });
  }

  return { value, summary };
}

export function containsPotentialSecret(input: string): boolean {
  return SECRET_VALUE_PATTERNS.some((pattern) => {
    pattern.lastIndex = 0;
    return pattern.test(input);
  });
}

export function isSensitiveFieldName(fieldName: string): boolean {
  return SECRET_FIELD_NAME_PATTERNS.some((pattern) => pattern.test(fieldName));
}

export function redactSensitiveHeaders(headers: Record<string, unknown>): RedactionResult<Record<string, unknown>> {
  const summary = emptySummary();
  const value: Record<string, unknown> = {};

  for (const [key, raw] of Object.entries(headers)) {
    if (isSensitiveFieldName(key)) {
      value[key] = REDACTION_PLACEHOLDER;
      increment(summary, "sensitive_header");
      continue;
    }
    if (typeof raw === "string") value[key] = redactSensitiveText(raw, summary).value;
    else value[key] = raw;
  }

  return { value, summary };
}

export function redactSensitiveUrl(rawUrl: string): RedactionResult<string> {
  const summary = emptySummary();
  try {
    const url = new URL(rawUrl);
    if (url.username || url.password) {
      url.username = REDACTION_PLACEHOLDER;
      url.password = REDACTION_PLACEHOLDER;
      increment(summary, "url_credentials");
    }
    for (const key of [...url.searchParams.keys()]) {
      if (isSensitiveFieldName(key) || /token|secret|signature|code|key/i.test(key)) {
        url.searchParams.set(key, REDACTION_PLACEHOLDER);
        increment(summary, "url_secret_param");
      }
    }
    return { value: url.toString(), summary };
  } catch {
    return redactSensitiveText(rawUrl, summary);
  }
}

export function redactSensitiveObject<T>(input: T, maxDepth = DEFAULT_MAX_DEPTH): RedactionResult<T> {
  const summary = emptySummary();
  const seen = new WeakSet<object>();

  const walk = (value: unknown, key = "", depth = 0): unknown => {
    if (depth > maxDepth) {
      increment(summary, "max_depth");
      return "[REDACTED_DEPTH_LIMIT]";
    }
    if (isSensitiveFieldName(key)) {
      increment(summary, "sensitive_field");
      return REDACTION_PLACEHOLDER;
    }
    if (typeof value === "string") return redactSensitiveText(value, summary).value;
    if (value === null || typeof value !== "object") return value;
    if (seen.has(value)) {
      increment(summary, "circular_reference");
      return "[REDACTED_CIRCULAR]";
    }
    seen.add(value);
    if (Array.isArray(value)) return value.map((item) => walk(item, key, depth + 1));

    const output: Record<string, unknown> = {};
    for (const [childKey, childValue] of Object.entries(value as Record<string, unknown>)) {
      output[childKey] = walk(childValue, childKey, depth + 1);
    }
    return output;
  };

  return { value: walk(input) as T, summary };
}

export function redactSensitiveJson(input: string): RedactionResult<string> {
  try {
    const parsed = JSON.parse(input) as unknown;
    const redacted = redactSensitiveObject(parsed);
    return { value: JSON.stringify(redacted.value, null, 2), summary: redacted.summary };
  } catch {
    return redactSensitiveText(input);
  }
}

export function redactSensitiveError(error: unknown): RedactionResult<Record<string, unknown>> {
  if (error instanceof Error) {
    return redactSensitiveObject({ name: error.name, message: error.message, stack: error.stack });
  }
  return redactSensitiveObject({ error });
}

export function hashSensitiveValue(value: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return `fnv1a32:${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function buildRedactionSummary(...summaries: RedactionSummary[]): RedactionSummary {
  const combined = emptySummary();
  for (const summary of summaries) {
    combined.totalRedactions += summary.totalRedactions;
    combined.truncated = combined.truncated || summary.truncated;
    for (const [category, count] of Object.entries(summary.categories)) {
      combined.categories[category] = (combined.categories[category] ?? 0) + count;
    }
  }
  return combined;
}

export function assertRedactionSafe(text: string): void {
  if (containsPotentialSecret(text)) {
    throw new Error("Potential secret remained after redaction");
  }
}
