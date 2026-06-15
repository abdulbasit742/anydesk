import type { AutomationConditionRecord, AutomationConditionRecordRepository } from "./automationConditionsTypes.js";

export class AutomationConditionRecordService {
  constructor(private readonly repository: AutomationConditionRecordRepository) {}

  create(record: AutomationConditionRecord): Promise<AutomationConditionRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<AutomationConditionRecord>): Promise<AutomationConditionRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("automationConditions-not-found");
    return updated;
  }

  list(filter: Partial<AutomationConditionRecord> = {}, limit = 50): Promise<AutomationConditionRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
