import type { SyntheticProbeRecord, SyntheticProbeRecordRepository } from "./syntheticProbesTypes.js";

export class SyntheticProbeRecordService {
  constructor(private readonly repository: SyntheticProbeRecordRepository) {}

  create(record: SyntheticProbeRecord): Promise<SyntheticProbeRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<SyntheticProbeRecord>): Promise<SyntheticProbeRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("syntheticProbes-not-found");
    return updated;
  }

  list(filter: Partial<SyntheticProbeRecord> = {}, limit = 50): Promise<SyntheticProbeRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
