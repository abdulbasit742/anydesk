export interface ExperienceAuditRecord {
  id: string; actorUserId: string; action: string; occurredAt: string; metadata?: Record<string, unknown>;
}

export interface ExperienceAuditRecordRepository {
  create(record: ExperienceAuditRecord): Promise<ExperienceAuditRecord>;
  update(id: string, patch: Partial<ExperienceAuditRecord>): Promise<ExperienceAuditRecord | null>;
  list(filter: Partial<ExperienceAuditRecord>, limit: number): Promise<ExperienceAuditRecord[]>;
}
