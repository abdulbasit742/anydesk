import type { RuleChangeAuditRecord, RuleChangeAuditRecordRepository } from "./ruleChangeAuditTypes.js";

export class RuleChangeAuditRecordService {
  constructor(private readonly repository: RuleChangeAuditRecordRepository) {}

  create(record: RuleChangeAuditRecord): Promise<RuleChangeAuditRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<RuleChangeAuditRecord>): Promise<RuleChangeAuditRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("ruleChangeAudit-not-found");
    return updated;
  }

  list(filter: Partial<RuleChangeAuditRecord> = {}, limit = 50): Promise<RuleChangeAuditRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
