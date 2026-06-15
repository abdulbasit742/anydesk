export interface IdempotencyKeyParts {
  actorId: string;
  action: string;
  resourceId?: string;
  requestId?: string;
}

export function buildIdempotencyKey(parts: IdempotencyKeyParts): string {
  const stable = [parts.actorId, parts.action, parts.resourceId ?? "none", parts.requestId ?? "none"]
    .map((part) => encodeURIComponent(part.trim().toLowerCase()))
    .join(":");
  if (stable.length > 240) return stable.slice(0, 240);
  return stable;
}

export function isValidIdempotencyKey(value: string): boolean {
  return /^[a-z0-9%_.:-]{8,240}$/i.test(value);
}
