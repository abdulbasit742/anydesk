import type { UxExperimentRecord, UxExperimentRecordRepository } from "./uxExperimentsTypes.js";

export class UxExperimentRecordService {
  constructor(private readonly repository: UxExperimentRecordRepository) {}

  create(record: UxExperimentRecord): Promise<UxExperimentRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<UxExperimentRecord>): Promise<UxExperimentRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("uxExperiments-not-found");
    return updated;
  }

  list(filter: Partial<UxExperimentRecord> = {}, limit = 50): Promise<UxExperimentRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
