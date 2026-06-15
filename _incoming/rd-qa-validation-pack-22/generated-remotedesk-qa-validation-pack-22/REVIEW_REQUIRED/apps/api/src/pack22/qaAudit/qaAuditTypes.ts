export interface QaAuditRecord {
  id: string; actorUserId: string; action: string; occurredAt: string; metadata?: Record<string, unknown>;
}

export interface QaAuditRecordRepository {
  create(record: QaAuditRecord): Promise<QaAuditRecord>;
  update(id: string, patch: Partial<QaAuditRecord>): Promise<QaAuditRecord | null>;
  list(filter: Partial<QaAuditRecord>, limit: number): Promise<QaAuditRecord[]>;
}
