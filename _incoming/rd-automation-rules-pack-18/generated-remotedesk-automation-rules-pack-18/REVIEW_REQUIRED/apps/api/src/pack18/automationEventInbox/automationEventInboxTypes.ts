export interface AutomationEventInboxRecord {
  id: string; teamId: string; eventType: string; eventId: string; receivedAt: string; processedAt?: string;
}

export interface AutomationEventInboxRecordRepository {
  create(record: AutomationEventInboxRecord): Promise<AutomationEventInboxRecord>;
  update(id: string, patch: Partial<AutomationEventInboxRecord>): Promise<AutomationEventInboxRecord | null>;
  list(filter: Partial<AutomationEventInboxRecord>, limit: number): Promise<AutomationEventInboxRecord[]>;
}
