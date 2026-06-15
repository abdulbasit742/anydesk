import type { WebhookAttemptRecord, WebhookAttemptRecordRepository } from "./webhookAttemptsTypes.js";

export class WebhookAttemptRecordService {
  constructor(private readonly repository: WebhookAttemptRecordRepository) {}

  create(record: WebhookAttemptRecord): Promise<WebhookAttemptRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<WebhookAttemptRecord>): Promise<WebhookAttemptRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("webhookAttempts-not-found");
    return updated;
  }

  list(filter: Partial<WebhookAttemptRecord> = {}, limit = 50): Promise<WebhookAttemptRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
