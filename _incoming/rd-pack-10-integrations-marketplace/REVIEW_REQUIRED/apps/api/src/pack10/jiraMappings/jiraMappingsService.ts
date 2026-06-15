import type { JiraMappingRecord, JiraMappingRecordRepository } from "./jiraMappingsTypes.js";

export class JiraMappingRecordService {
  constructor(private readonly repository: JiraMappingRecordRepository) {}

  create(record: JiraMappingRecord): Promise<JiraMappingRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<JiraMappingRecord>): Promise<JiraMappingRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("jiraMappings-not-found");
    return updated;
  }

  list(filter: Partial<JiraMappingRecord> = {}, limit = 50): Promise<JiraMappingRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
