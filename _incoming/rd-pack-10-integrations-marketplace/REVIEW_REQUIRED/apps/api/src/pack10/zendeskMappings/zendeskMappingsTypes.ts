export interface ZendeskMappingRecord {
  id: string; teamId: string; groupId?: string; priority: string; eventType: string;
}

export interface ZendeskMappingRecordRepository {
  create(record: ZendeskMappingRecord): Promise<ZendeskMappingRecord>;
  update(id: string, patch: Partial<ZendeskMappingRecord>): Promise<ZendeskMappingRecord | null>;
  list(filter: Partial<ZendeskMappingRecord>, limit: number): Promise<ZendeskMappingRecord[]>;
}
