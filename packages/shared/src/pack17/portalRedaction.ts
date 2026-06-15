const SECRET_PATTERN = /\b(password|token|secret|api[_-]?key|clipboard)\b/i;

export function redactPortalText(value: string): string {
  if (SECRET_PATTERN.test(value)) return "[redacted]";
  return value.slice(0, 500);
}
