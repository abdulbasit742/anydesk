export interface ConnectorRateLimit {
  perMinute: number;
  usedThisMinute: number;
  resetAt: number;
}

export function canSendConnectorRequest(limit: ConnectorRateLimit, now = Date.now()): boolean {
  if (now >= limit.resetAt) return true;
  return limit.usedThisMinute < limit.perMinute;
}
