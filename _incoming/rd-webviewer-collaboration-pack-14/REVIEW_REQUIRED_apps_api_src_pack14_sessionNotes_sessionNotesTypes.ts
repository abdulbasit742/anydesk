export interface SessionNoteRecord {
  id: string; sessionId: string; body: string; privateToSupport: boolean; createdByUserId: string; createdAt: string;
}

export interface SessionNoteRecordRepository {
  create(record: SessionNoteRecord): Promise<SessionNoteRecord>;
  update(id: string, patch: Partial<SessionNoteRecord>): Promise<SessionNoteRecord | null>;
  list(filter: Partial<SessionNoteRecord>, limit: number): Promise<SessionNoteRecord[]>;
}
