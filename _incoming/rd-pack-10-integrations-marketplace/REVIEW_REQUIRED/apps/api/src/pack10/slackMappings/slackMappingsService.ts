import type { SlackMappingRecord, SlackMappingRecordRepository } from "./slackMappingsTypes.js";

export class SlackMappingRecordService {
  constructor(private readonly repository: SlackMappingRecordRepository) {}

  create(record: SlackMappingRecord): Promise<SlackMappingRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<SlackMappingRecord>): Promise<SlackMappingRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("slackMappings-not-found");
    return updated;
  }

  list(filter: Partial<SlackMappingRecord> = {}, limit = 50): Promise<SlackMappingRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
