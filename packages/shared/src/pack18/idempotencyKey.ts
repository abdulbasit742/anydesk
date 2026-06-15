export function buildAutomationIdempotencyKey(ruleId: string, eventId: string): string {
  return `${ruleId}:${eventId}`.slice(0, 180);
}
