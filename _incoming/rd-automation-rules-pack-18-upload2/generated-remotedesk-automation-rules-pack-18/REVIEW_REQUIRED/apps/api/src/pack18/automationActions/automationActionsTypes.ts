export interface AutomationActionRecord {
  id: string; ruleId: string; action: string; config: Record<string, unknown>;
}

export interface AutomationActionRecordRepository {
  create(record: AutomationActionRecord): Promise<AutomationActionRecord>;
  update(id: string, patch: Partial<AutomationActionRecord>): Promise<AutomationActionRecord | null>;
  list(filter: Partial<AutomationActionRecord>, limit: number): Promise<AutomationActionRecord[]>;
}
