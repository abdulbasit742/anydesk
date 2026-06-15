export interface ScimDirectoryEventRecord {
  id: string; organizationId: string; externalId: string; action: 'created' | 'updated' | 'deactivated'; processedAt: string;
}

export interface ScimDirectoryEventRecordRepository {
  create(record: ScimDirectoryEventRecord): Promise<ScimDirectoryEventRecord>;
  update(id: string, patch: Partial<ScimDirectoryEventRecord>): Promise<ScimDirectoryEventRecord | null>;
  list(filter: Partial<ScimDirectoryEventRecord>, limit: number): Promise<ScimDirectoryEventRecord[]>;
}
