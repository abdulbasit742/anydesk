import type { AutomationRateLimitRecord, AutomationRateLimitRecordRepository } from "./automationRateLimitsTypes.js";

export class AutomationRateLimitRecordService {
  constructor(private readonly repository: AutomationRateLimitRecordRepository) {}

  create(record: AutomationRateLimitRecord): Promise<AutomationRateLimitRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<AutomationRateLimitRecord>): Promise<AutomationRateLimitRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("automationRateLimits-not-found");
    return updated;
  }

  list(filter: Partial<AutomationRateLimitRecord> = {}, limit = 50): Promise<AutomationRateLimitRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
