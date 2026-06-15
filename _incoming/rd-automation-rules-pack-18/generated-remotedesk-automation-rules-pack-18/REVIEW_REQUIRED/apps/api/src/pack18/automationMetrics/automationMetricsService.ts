import type { AutomationMetricRecord, AutomationMetricRecordRepository } from "./automationMetricsTypes.js";

export class AutomationMetricRecordService {
  constructor(private readonly repository: AutomationMetricRecordRepository) {}

  create(record: AutomationMetricRecord): Promise<AutomationMetricRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<AutomationMetricRecord>): Promise<AutomationMetricRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("automationMetrics-not-found");
    return updated;
  }

  list(filter: Partial<AutomationMetricRecord> = {}, limit = 50): Promise<AutomationMetricRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
