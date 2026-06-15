export interface TeamsMappingRecord {
  id: string; teamId: string; webhookUrl: string; eventType: string; enabled: boolean;
}

export interface TeamsMappingRecordRepository {
  create(record: TeamsMappingRecord): Promise<TeamsMappingRecord>;
  update(id: string, patch: Partial<TeamsMappingRecord>): Promise<TeamsMappingRecord | null>;
  list(filter: Partial<TeamsMappingRecord>, limit: number): Promise<TeamsMappingRecord[]>;
}
