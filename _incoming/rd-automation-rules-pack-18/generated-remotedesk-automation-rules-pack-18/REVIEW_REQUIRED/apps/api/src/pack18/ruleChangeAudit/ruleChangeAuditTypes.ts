export interface RuleChangeAuditRecord {
  id: string; teamId: string; ruleId: string; actorUserId: string; action: string; occurredAt: string;
}

export interface RuleChangeAuditRecordRepository {
  create(record: RuleChangeAuditRecord): Promise<RuleChangeAuditRecord>;
  update(id: string, patch: Partial<RuleChangeAuditRecord>): Promise<RuleChangeAuditRecord | null>;
  list(filter: Partial<RuleChangeAuditRecord>, limit: number): Promise<RuleChangeAuditRecord[]>;
}
