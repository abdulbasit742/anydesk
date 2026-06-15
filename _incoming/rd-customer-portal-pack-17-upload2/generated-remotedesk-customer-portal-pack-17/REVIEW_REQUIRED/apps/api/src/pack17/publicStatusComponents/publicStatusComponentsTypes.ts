export interface PublicStatusComponentRecord {
  id: string; key: string; name: string; status: 'operational' | 'degraded' | 'partial_outage' | 'major_outage' | 'maintenance'; updatedAt: string;
}

export interface PublicStatusComponentRecordRepository {
  create(record: PublicStatusComponentRecord): Promise<PublicStatusComponentRecord>;
  update(id: string, patch: Partial<PublicStatusComponentRecord>): Promise<PublicStatusComponentRecord | null>;
  list(filter: Partial<PublicStatusComponentRecord>, limit: number): Promise<PublicStatusComponentRecord[]>;
}
