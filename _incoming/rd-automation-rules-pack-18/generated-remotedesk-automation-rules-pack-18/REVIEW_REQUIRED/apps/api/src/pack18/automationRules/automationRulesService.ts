import type { AutomationRuleRecord, AutomationRuleRecordRepository } from "./automationRulesTypes.js";

export class AutomationRuleRecordService {
  constructor(private readonly repository: AutomationRuleRecordRepository) {}

  create(record: AutomationRuleRecord): Promise<AutomationRuleRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<AutomationRuleRecord>): Promise<AutomationRuleRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("automationRules-not-found");
    return updated;
  }

  list(filter: Partial<AutomationRuleRecord> = {}, limit = 50): Promise<AutomationRuleRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
