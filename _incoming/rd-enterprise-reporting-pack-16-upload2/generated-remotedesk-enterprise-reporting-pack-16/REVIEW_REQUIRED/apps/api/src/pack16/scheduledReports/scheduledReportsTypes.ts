export interface ScheduledReportRecord {
  id: string; organizationId: string; reportKey: string; cadence: 'daily' | 'weekly' | 'monthly'; nextRunAt: string; enabled: boolean;
}

export interface ScheduledReportRecordRepository {
  create(record: ScheduledReportRecord): Promise<ScheduledReportRecord>;
  update(id: string, patch: Partial<ScheduledReportRecord>): Promise<ScheduledReportRecord | null>;
  list(filter: Partial<ScheduledReportRecord>, limit: number): Promise<ScheduledReportRecord[]>;
}
