import type { KeyRotationJobRecord, KeyRotationJobRecordRepository } from "./keyRotationJobsTypes.js";

export class KeyRotationJobRecordService {
  constructor(private readonly repository: KeyRotationJobRecordRepository) {}

  create(record: KeyRotationJobRecord): Promise<KeyRotationJobRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<KeyRotationJobRecord>): Promise<KeyRotationJobRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("keyRotationJobs-not-found");
    return updated;
  }

  list(filter: Partial<KeyRotationJobRecord> = {}, limit = 50): Promise<KeyRotationJobRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
