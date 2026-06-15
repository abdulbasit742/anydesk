export interface SiemExportRecord {
  id: string; teamId: string; destination: 'splunk' | 'datadog' | 'elastic' | 'custom'; enabled: boolean;
}

export interface SiemExportRecordRepository {
  create(record: SiemExportRecord): Promise<SiemExportRecord>;
  update(id: string, patch: Partial<SiemExportRecord>): Promise<SiemExportRecord | null>;
  list(filter: Partial<SiemExportRecord>, limit: number): Promise<SiemExportRecord[]>;
}
