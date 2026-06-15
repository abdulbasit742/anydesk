export interface SessionBookmarkRecord {
  id: string; sessionId: string; label: string; timestampMs: number; createdByUserId: string; createdAt: string;
}

export interface SessionBookmarkRecordRepository {
  create(record: SessionBookmarkRecord): Promise<SessionBookmarkRecord>;
  update(id: string, patch: Partial<SessionBookmarkRecord>): Promise<SessionBookmarkRecord | null>;
  list(filter: Partial<SessionBookmarkRecord>, limit: number): Promise<SessionBookmarkRecord[]>;
}
