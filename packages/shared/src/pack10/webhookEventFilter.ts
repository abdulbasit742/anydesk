export interface WebhookEventFilter {
  eventTypes: readonly string[];
  teamIds?: readonly string[];
}

export function webhookEventAllowed(filter: WebhookEventFilter, event: { type: string; teamId?: string }): boolean {
  if (!filter.eventTypes.includes(event.type)) return false;
  if (filter.teamIds && event.teamId && !filter.teamIds.includes(event.teamId)) return false;
  return true;
}
