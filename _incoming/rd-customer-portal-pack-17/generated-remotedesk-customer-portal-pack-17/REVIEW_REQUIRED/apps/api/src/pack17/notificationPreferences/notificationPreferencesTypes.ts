export interface NotificationPreferenceRecord {
  id: string; userId: string; channel: 'email' | 'in_app' | 'push' | 'webhook'; enabled: boolean; digestOnly?: boolean; updatedAt: string;
}

export interface NotificationPreferenceRecordRepository {
  create(record: NotificationPreferenceRecord): Promise<NotificationPreferenceRecord>;
  update(id: string, patch: Partial<NotificationPreferenceRecord>): Promise<NotificationPreferenceRecord | null>;
  list(filter: Partial<NotificationPreferenceRecord>, limit: number): Promise<NotificationPreferenceRecord[]>;
}
