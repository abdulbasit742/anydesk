export interface AutomationDeadLetterRecord {
  id: string; teamId: string; ruleId?: string; eventId: string; reason: string; createdAt: string;
}

export interface AutomationDeadLetterRecordRepository {
  create(record: AutomationDeadLetterRecord): Promise<AutomationDeadLetterRecord>;
  update(id: string, patch: Partial<AutomationDeadLetterRecord>): Promise<AutomationDeadLetterRecord | null>;
  list(filter: Partial<AutomationDeadLetterRecord>, limit: number): Promise<AutomationDeadLetterRecord[]>;
}
