import type { FlakyTestQuarantineRecord, FlakyTestQuarantineRecordRepository } from "./flakyTestQuarantineTypes.js";

export class FlakyTestQuarantineRecordService {
  constructor(private readonly repository: FlakyTestQuarantineRecordRepository) {}

  create(record: FlakyTestQuarantineRecord): Promise<FlakyTestQuarantineRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<FlakyTestQuarantineRecord>): Promise<FlakyTestQuarantineRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("flakyTestQuarantine-not-found");
    return updated;
  }

  list(filter: Partial<FlakyTestQuarantineRecord> = {}, limit = 50): Promise<FlakyTestQuarantineRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
