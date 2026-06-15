import type { CoverageReportRecord, CoverageReportRecordRepository } from "./coverageReportsTypes.js";

export class CoverageReportRecordService {
  constructor(private readonly repository: CoverageReportRecordRepository) {}

  create(record: CoverageReportRecord): Promise<CoverageReportRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<CoverageReportRecord>): Promise<CoverageReportRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("coverageReports-not-found");
    return updated;
  }

  list(filter: Partial<CoverageReportRecord> = {}, limit = 50): Promise<CoverageReportRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
