export type RetentionSubject = 'audit_logs' | 'session_logs' | 'support_bundles' | 'security_events';
export interface RetentionRule { subject: RetentionSubject; days: number; legalHold?: boolean; }
export function shouldRetain(createdAt: Date, now: Date, rule: RetentionRule): boolean {
  if (rule.legalHold) return true;
  const ageMs = now.getTime() - createdAt.getTime();
  return ageMs <= rule.days * 24 * 60 * 60 * 1000;
}
