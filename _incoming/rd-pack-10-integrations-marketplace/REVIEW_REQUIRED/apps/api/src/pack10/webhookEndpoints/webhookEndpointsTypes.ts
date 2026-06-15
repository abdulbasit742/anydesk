export interface WebhookEndpointRecord {
  id: string; teamId: string; url: string; eventTypes: string[]; enabled: boolean; createdAt: string;
}

export interface WebhookEndpointRecordRepository {
  create(record: WebhookEndpointRecord): Promise<WebhookEndpointRecord>;
  update(id: string, patch: Partial<WebhookEndpointRecord>): Promise<WebhookEndpointRecord | null>;
  list(filter: Partial<WebhookEndpointRecord>, limit: number): Promise<WebhookEndpointRecord[]>;
}
