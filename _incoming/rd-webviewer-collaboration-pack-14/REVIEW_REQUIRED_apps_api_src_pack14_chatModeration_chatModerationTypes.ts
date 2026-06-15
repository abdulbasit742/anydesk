export interface ChatModerationRecord {
  id: string; sessionId: string; messageId: string; allowed: boolean; reasons: string[]; checkedAt: string;
}

export interface ChatModerationRecordRepository {
  create(record: ChatModerationRecord): Promise<ChatModerationRecord>;
  update(id: string, patch: Partial<ChatModerationRecord>): Promise<ChatModerationRecord | null>;
  list(filter: Partial<ChatModerationRecord>, limit: number): Promise<ChatModerationRecord[]>;
}
