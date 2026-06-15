export type RetentionResource = "audit_logs" | "session_events" | "support_tickets" | "security_events" | "diagnostics_bundles";

export interface RetentionPolicy {
  resource: RetentionResource;
  retentionDays: number;
  legalHold: boolean;
}

export function getRetentionCutoff(now: Date, policy: RetentionPolicy): Date | null {
  if (policy.legalHold) return null;
  const safeDays = Math.max(1, Math.min(3650, policy.retentionDays));
  return new Date(now.getTime() - safeDays * 24 * 60 * 60 * 1000);
}

export function shouldRetain(createdAt: Date, now: Date, policy: RetentionPolicy): boolean {
  const cutoff = getRetentionCutoff(now, policy);
  return cutoff === null || createdAt >= cutoff;
}
