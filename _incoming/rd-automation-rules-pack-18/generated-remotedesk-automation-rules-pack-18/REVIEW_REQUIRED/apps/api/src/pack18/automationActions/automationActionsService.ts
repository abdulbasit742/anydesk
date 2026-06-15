import type { AutomationActionRecord, AutomationActionRecordRepository } from "./automationActionsTypes.js";

export class AutomationActionRecordService {
  constructor(private readonly repository: AutomationActionRecordRepository) {}

  create(record: AutomationActionRecord): Promise<AutomationActionRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<AutomationActionRecord>): Promise<AutomationActionRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("automationActions-not-found");
    return updated;
  }

  list(filter: Partial<AutomationActionRecord> = {}, limit = 50): Promise<AutomationActionRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
