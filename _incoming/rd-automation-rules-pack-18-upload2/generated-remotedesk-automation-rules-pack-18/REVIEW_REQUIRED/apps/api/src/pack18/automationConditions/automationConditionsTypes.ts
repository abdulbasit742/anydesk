export interface AutomationConditionRecord {
  id: string; ruleId: string; field: string; operator: string; value: string;
}

export interface AutomationConditionRecordRepository {
  create(record: AutomationConditionRecord): Promise<AutomationConditionRecord>;
  update(id: string, patch: Partial<AutomationConditionRecord>): Promise<AutomationConditionRecord | null>;
  list(filter: Partial<AutomationConditionRecord>, limit: number): Promise<AutomationConditionRecord[]>;
}
