export interface SessionAnnotationRecord {
  id: string; sessionId: string; tool: string; x: number; y: number; text?: string; createdByUserId: string; createdAt: string;
}

export interface SessionAnnotationRecordRepository {
  create(record: SessionAnnotationRecord): Promise<SessionAnnotationRecord>;
  update(id: string, patch: Partial<SessionAnnotationRecord>): Promise<SessionAnnotationRecord | null>;
  list(filter: Partial<SessionAnnotationRecord>, limit: number): Promise<SessionAnnotationRecord[]>;
}
