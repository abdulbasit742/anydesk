export interface ResidencyAuditRecord {
  id: string; tenantId: string; actorUserId: string; action: string; occurredAt: string; metadata?: Record<string, unknown>;
}

export interface ResidencyAuditRecordRepository {
  create(record: ResidencyAuditRecord): Promise<ResidencyAuditRecord>;
  update(id: string, patch: Partial<ResidencyAuditRecord>): Promise<ResidencyAuditRecord | null>;
  list(filter: Partial<ResidencyAuditRecord>, limit: number): Promise<ResidencyAuditRecord[]>;
}
