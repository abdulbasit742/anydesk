import type { ScheduledReportRecord, ScheduledReportRecordRepository } from "./scheduledReportsTypes.js";

export class ScheduledReportRecordService {
  constructor(private readonly repository: ScheduledReportRecordRepository) {}

  create(record: ScheduledReportRecord): Promise<ScheduledReportRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<ScheduledReportRecord>): Promise<ScheduledReportRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("scheduledReports-not-found");
    return updated;
  }

  list(filter: Partial<ScheduledReportRecord> = {}, limit = 50): Promise<ScheduledReportRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
