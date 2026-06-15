import type { FieldClassificationRuleRecord, FieldClassificationRuleRecordRepository } from "./fieldClassificationRulesTypes.js";

export class FieldClassificationRuleRecordService {
  constructor(private readonly repository: FieldClassificationRuleRecordRepository) {}

  create(record: FieldClassificationRuleRecord): Promise<FieldClassificationRuleRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<FieldClassificationRuleRecord>): Promise<FieldClassificationRuleRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("fieldClassificationRules-not-found");
    return updated;
  }

  list(filter: Partial<FieldClassificationRuleRecord> = {}, limit = 50): Promise<FieldClassificationRuleRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
