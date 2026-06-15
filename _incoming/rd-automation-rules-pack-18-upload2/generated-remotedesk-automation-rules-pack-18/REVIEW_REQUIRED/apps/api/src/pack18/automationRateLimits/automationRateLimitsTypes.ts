export interface AutomationRateLimitRecord {
  id: string; teamId: string; ruleId: string; perMinute: number; enabled: boolean; updatedAt: string;
}

export interface AutomationRateLimitRecordRepository {
  create(record: AutomationRateLimitRecord): Promise<AutomationRateLimitRecord>;
  update(id: string, patch: Partial<AutomationRateLimitRecord>): Promise<AutomationRateLimitRecord | null>;
  list(filter: Partial<AutomationRateLimitRecord>, limit: number): Promise<AutomationRateLimitRecord[]>;
}
