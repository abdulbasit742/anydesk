export interface WebhookAttemptRecord {
  id: string; endpointId: string; status: 'pending' | 'delivered' | 'failed'; attempts: number; nextAttemptAt?: string;
}

export interface WebhookAttemptRecordRepository {
  create(record: WebhookAttemptRecord): Promise<WebhookAttemptRecord>;
  update(id: string, patch: Partial<WebhookAttemptRecord>): Promise<WebhookAttemptRecord | null>;
  list(filter: Partial<WebhookAttemptRecord>, limit: number): Promise<WebhookAttemptRecord[]>;
}
