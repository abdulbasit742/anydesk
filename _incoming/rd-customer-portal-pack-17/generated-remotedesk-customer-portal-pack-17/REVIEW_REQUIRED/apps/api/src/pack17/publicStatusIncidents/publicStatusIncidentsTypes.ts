export interface PublicStatusIncidentRecord {
  id: string; title: string; status: 'investigating' | 'identified' | 'monitoring' | 'resolved'; public: boolean; createdAt: string;
}

export interface PublicStatusIncidentRecordRepository {
  create(record: PublicStatusIncidentRecord): Promise<PublicStatusIncidentRecord>;
  update(id: string, patch: Partial<PublicStatusIncidentRecord>): Promise<PublicStatusIncidentRecord | null>;
  list(filter: Partial<PublicStatusIncidentRecord>, limit: number): Promise<PublicStatusIncidentRecord[]>;
}
