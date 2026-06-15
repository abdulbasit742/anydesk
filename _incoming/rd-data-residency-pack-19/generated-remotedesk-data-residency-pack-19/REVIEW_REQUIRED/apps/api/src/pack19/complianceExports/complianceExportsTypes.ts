export interface ComplianceExportRecord {
  id: string; tenantId: string; scope: string; status: 'queued' | 'running' | 'completed' | 'failed'; objectKey?: string; createdAt: string;
}

export interface ComplianceExportRecordRepository {
  create(record: ComplianceExportRecord): Promise<ComplianceExportRecord>;
  update(id: string, patch: Partial<ComplianceExportRecord>): Promise<ComplianceExportRecord | null>;
  list(filter: Partial<ComplianceExportRecord>, limit: number): Promise<ComplianceExportRecord[]>;
}
