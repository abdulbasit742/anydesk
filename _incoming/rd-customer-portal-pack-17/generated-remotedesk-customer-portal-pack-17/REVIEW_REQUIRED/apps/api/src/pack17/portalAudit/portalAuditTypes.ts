export interface PortalAuditRecord {
  id: string; teamId: string; actorUserId: string; action: string; occurredAt: string; metadata?: Record<string, unknown>;
}

export interface PortalAuditRecordRepository {
  create(record: PortalAuditRecord): Promise<PortalAuditRecord>;
  update(id: string, patch: Partial<PortalAuditRecord>): Promise<PortalAuditRecord | null>;
  list(filter: Partial<PortalAuditRecord>, limit: number): Promise<PortalAuditRecord[]>;
}
