import type { ReportRunRecord, ReportRunRecordRepository } from "./reportRunsTypes.js";

export class ReportRunRecordService {
  constructor(private readonly repository: ReportRunRecordRepository) {}

  create(record: ReportRunRecord): Promise<ReportRunRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<ReportRunRecord>): Promise<ReportRunRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("reportRuns-not-found");
    return updated;
  }

  list(filter: Partial<ReportRunRecord> = {}, limit = 50): Promise<ReportRunRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
