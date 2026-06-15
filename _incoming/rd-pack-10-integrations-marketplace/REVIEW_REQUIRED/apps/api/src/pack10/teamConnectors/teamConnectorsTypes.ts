export interface TeamConnectorRecord {
  id: string; teamId: string; connectorKey: string; authState: string; connectedAt?: string; revokedAt?: string;
}

export interface TeamConnectorRecordRepository {
  create(record: TeamConnectorRecord): Promise<TeamConnectorRecord>;
  update(id: string, patch: Partial<TeamConnectorRecord>): Promise<TeamConnectorRecord | null>;
  list(filter: Partial<TeamConnectorRecord>, limit: number): Promise<TeamConnectorRecord[]>;
}
