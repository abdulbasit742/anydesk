export interface EnterpriseAuditRecord {
  id: string; organizationId: string; actorUserId: string; action: string; occurredAt: string; metadata?: Record<string, unknown>;
}

export interface EnterpriseAuditRecordRepository {
  create(record: EnterpriseAuditRecord): Promise<EnterpriseAuditRecord>;
  update(id: string, patch: Partial<EnterpriseAuditRecord>): Promise<EnterpriseAuditRecord | null>;
  list(filter: Partial<EnterpriseAuditRecord>, limit: number): Promise<EnterpriseAuditRecord[]>;
}
