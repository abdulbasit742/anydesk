export interface ReportDefinitionRecord {
  id: string; organizationId: string; key: string; title: string; fields: string[]; createdAt: string;
}

export interface ReportDefinitionRecordRepository {
  create(record: ReportDefinitionRecord): Promise<ReportDefinitionRecord>;
  update(id: string, patch: Partial<ReportDefinitionRecord>): Promise<ReportDefinitionRecord | null>;
  list(filter: Partial<ReportDefinitionRecord>, limit: number): Promise<ReportDefinitionRecord[]>;
}
