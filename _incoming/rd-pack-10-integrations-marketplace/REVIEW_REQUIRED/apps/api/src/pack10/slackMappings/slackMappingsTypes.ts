export interface SlackMappingRecord {
  id: string; teamId: string; channelId: string; eventType: string; enabled: boolean;
}

export interface SlackMappingRecordRepository {
  create(record: SlackMappingRecord): Promise<SlackMappingRecord>;
  update(id: string, patch: Partial<SlackMappingRecord>): Promise<SlackMappingRecord | null>;
  list(filter: Partial<SlackMappingRecord>, limit: number): Promise<SlackMappingRecord[]>;
}
