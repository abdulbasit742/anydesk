export interface AutomationMetricRecord {
  id: string; teamId: string; ruleId?: string; runs: number; failures: number; windowStart: string; windowEnd: string;
}

export interface AutomationMetricRecordRepository {
  create(record: AutomationMetricRecord): Promise<AutomationMetricRecord>;
  update(id: string, patch: Partial<AutomationMetricRecord>): Promise<AutomationMetricRecord | null>;
  list(filter: Partial<AutomationMetricRecord>, limit: number): Promise<AutomationMetricRecord[]>;
}
