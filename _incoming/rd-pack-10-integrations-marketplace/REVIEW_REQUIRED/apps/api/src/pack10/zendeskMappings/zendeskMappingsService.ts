import type { ZendeskMappingRecord, ZendeskMappingRecordRepository } from "./zendeskMappingsTypes.js";

export class ZendeskMappingRecordService {
  constructor(private readonly repository: ZendeskMappingRecordRepository) {}

  create(record: ZendeskMappingRecord): Promise<ZendeskMappingRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<ZendeskMappingRecord>): Promise<ZendeskMappingRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("zendeskMappings-not-found");
    return updated;
  }

  list(filter: Partial<ZendeskMappingRecord> = {}, limit = 50): Promise<ZendeskMappingRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
