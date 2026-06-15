import type { ManualQaChecklistRecord, ManualQaChecklistRecordRepository } from "./manualQaChecklistsTypes.js";

export class ManualQaChecklistRecordService {
  constructor(private readonly repository: ManualQaChecklistRecordRepository) {}

  create(record: ManualQaChecklistRecord): Promise<ManualQaChecklistRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<ManualQaChecklistRecord>): Promise<ManualQaChecklistRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("manualQaChecklists-not-found");
    return updated;
  }

  list(filter: Partial<ManualQaChecklistRecord> = {}, limit = 50): Promise<ManualQaChecklistRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
