export interface AutomationRuleRecord {
  id: string; teamId: string; name: string; trigger: string; enabled: boolean; createdByUserId: string; updatedAt: string;
}

export interface AutomationRuleRecordRepository {
  create(record: AutomationRuleRecord): Promise<AutomationRuleRecord>;
  update(id: string, patch: Partial<AutomationRuleRecord>): Promise<AutomationRuleRecord | null>;
  list(filter: Partial<AutomationRuleRecord>, limit: number): Promise<AutomationRuleRecord[]>;
}
