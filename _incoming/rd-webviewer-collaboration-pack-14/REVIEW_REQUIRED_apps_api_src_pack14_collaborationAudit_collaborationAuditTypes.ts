export interface CollaborationAuditRecord {
  id: string; sessionId: string; actorUserId: string; action: string; occurredAt: string; metadata?: Record<string, unknown>;
}

export interface CollaborationAuditRecordRepository {
  create(record: CollaborationAuditRecord): Promise<CollaborationAuditRecord>;
  update(id: string, patch: Partial<CollaborationAuditRecord>): Promise<CollaborationAuditRecord | null>;
  list(filter: Partial<CollaborationAuditRecord>, limit: number): Promise<CollaborationAuditRecord[]>;
}
