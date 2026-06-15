export interface SupportHandoffRecord {
  id: string; sessionId: string; fromUserId: string; toSupportUserId: string; state: 'requested' | 'accepted' | 'rejected' | 'completed'; createdAt: string;
}

export interface SupportHandoffRecordRepository {
  create(record: SupportHandoffRecord): Promise<SupportHandoffRecord>;
  update(id: string, patch: Partial<SupportHandoffRecord>): Promise<SupportHandoffRecord | null>;
  list(filter: Partial<SupportHandoffRecord>, limit: number): Promise<SupportHandoffRecord[]>;
}
