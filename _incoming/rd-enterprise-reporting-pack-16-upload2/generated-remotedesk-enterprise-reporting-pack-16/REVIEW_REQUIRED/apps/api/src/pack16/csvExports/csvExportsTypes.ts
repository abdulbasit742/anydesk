export interface CsvExportRecord {
  id: string; organizationId: string; reportRunId: string; objectKey: string; sha256: string; rows: number; createdAt: string;
}

export interface CsvExportRecordRepository {
  create(record: CsvExportRecord): Promise<CsvExportRecord>;
  update(id: string, patch: Partial<CsvExportRecord>): Promise<CsvExportRecord | null>;
  list(filter: Partial<CsvExportRecord>, limit: number): Promise<CsvExportRecord[]>;
}
