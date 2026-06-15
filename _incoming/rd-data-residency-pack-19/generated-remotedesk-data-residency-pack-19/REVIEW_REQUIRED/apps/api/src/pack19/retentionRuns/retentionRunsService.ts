import type { RetentionRunRecord, RetentionRunRecordRepository } from "./retentionRunsTypes.js";

export class RetentionRunRecordService {
  constructor(private readonly repository: RetentionRunRecordRepository) {}

  create(record: RetentionRunRecord): Promise<RetentionRunRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<RetentionRunRecord>): Promise<RetentionRunRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("retentionRuns-not-found");
    return updated;
  }

  list(filter: Partial<RetentionRunRecord> = {}, limit = 50): Promise<RetentionRunRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
