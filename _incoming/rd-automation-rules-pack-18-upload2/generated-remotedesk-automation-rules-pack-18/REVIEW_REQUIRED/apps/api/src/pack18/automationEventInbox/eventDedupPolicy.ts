export function automationEventDedupKey(teamId: string, eventType: string, eventId: string): string {
  return `${teamId}:${eventType}:${eventId}`.slice(0, 220);
}
