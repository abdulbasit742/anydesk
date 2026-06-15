export interface JiraMappingRecord {
  id: string; teamId: string; projectKey: string; issueType: string; eventType: string;
}

export interface JiraMappingRecordRepository {
  create(record: JiraMappingRecord): Promise<JiraMappingRecord>;
  update(id: string, patch: Partial<JiraMappingRecord>): Promise<JiraMappingRecord | null>;
  list(filter: Partial<JiraMappingRecord>, limit: number): Promise<JiraMappingRecord[]>;
}
