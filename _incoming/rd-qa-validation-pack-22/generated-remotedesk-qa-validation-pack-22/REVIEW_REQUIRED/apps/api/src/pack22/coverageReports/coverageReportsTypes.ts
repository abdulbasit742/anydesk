export interface CoverageReportRecord {
  id: string; runId: string; statements: number; branches: number; functions: number; lines: number; objectKey?: string;
}

export interface CoverageReportRecordRepository {
  create(record: CoverageReportRecord): Promise<CoverageReportRecord>;
  update(id: string, patch: Partial<CoverageReportRecord>): Promise<CoverageReportRecord | null>;
  list(filter: Partial<CoverageReportRecord>, limit: number): Promise<CoverageReportRecord[]>;
}
