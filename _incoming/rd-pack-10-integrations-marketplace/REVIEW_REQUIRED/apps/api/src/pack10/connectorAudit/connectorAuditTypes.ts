export interface ConnectorAuditRecord {
  id: string; teamId: string; connectorKey: string; action: string; actorUserId: string; occurredAt: string;
}

export interface ConnectorAuditRecordRepository {
  create(record: ConnectorAuditRecord): Promise<ConnectorAuditRecord>;
  update(id: string, patch: Partial<ConnectorAuditRecord>): Promise<ConnectorAuditRecord | null>;
  list(filter: Partial<ConnectorAuditRecord>, limit: number): Promise<ConnectorAuditRecord[]>;
}
