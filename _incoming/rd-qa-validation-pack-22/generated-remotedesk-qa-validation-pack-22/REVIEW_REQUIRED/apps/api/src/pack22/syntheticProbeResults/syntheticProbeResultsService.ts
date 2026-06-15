import type { SyntheticProbeResultRecord, SyntheticProbeResultRecordRepository } from "./syntheticProbeResultsTypes.js";

export class SyntheticProbeResultRecordService {
  constructor(private readonly repository: SyntheticProbeResultRecordRepository) {}

  create(record: SyntheticProbeResultRecord): Promise<SyntheticProbeResultRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<SyntheticProbeResultRecord>): Promise<SyntheticProbeResultRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("syntheticProbeResults-not-found");
    return updated;
  }

  list(filter: Partial<SyntheticProbeResultRecord> = {}, limit = 50): Promise<SyntheticProbeResultRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
