import type { WebhookEndpointRecord, WebhookEndpointRecordRepository } from "./webhookEndpointsTypes.js";

export class WebhookEndpointRecordService {
  constructor(private readonly repository: WebhookEndpointRecordRepository) {}

  create(record: WebhookEndpointRecord): Promise<WebhookEndpointRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<WebhookEndpointRecord>): Promise<WebhookEndpointRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("webhookEndpoints-not-found");
    return updated;
  }

  list(filter: Partial<WebhookEndpointRecord> = {}, limit = 50): Promise<WebhookEndpointRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
