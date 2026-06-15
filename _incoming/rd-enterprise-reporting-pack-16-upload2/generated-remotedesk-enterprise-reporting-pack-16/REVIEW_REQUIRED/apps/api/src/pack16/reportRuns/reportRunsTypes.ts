export interface ReportRunRecord {
  id: string; organizationId: string; reportKey: string; status: 'queued' | 'running' | 'completed' | 'failed'; objectKey?: string; createdAt: string;
}

export interface ReportRunRecordRepository {
  create(record: ReportRunRecord): Promise<ReportRunRecord>;
  update(id: string, patch: Partial<ReportRunRecord>): Promise<ReportRunRecord | null>;
  list(filter: Partial<ReportRunRecord>, limit: number): Promise<ReportRunRecord[]>;
}
