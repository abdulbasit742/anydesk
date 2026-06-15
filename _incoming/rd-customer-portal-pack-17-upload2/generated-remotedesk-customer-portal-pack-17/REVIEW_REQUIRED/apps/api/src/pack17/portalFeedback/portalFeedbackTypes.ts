export interface PortalFeedbackRecord {
  id: string; teamId: string; userId: string; rating: number; message: string; createdAt: string;
}

export interface PortalFeedbackRecordRepository {
  create(record: PortalFeedbackRecord): Promise<PortalFeedbackRecord>;
  update(id: string, patch: Partial<PortalFeedbackRecord>): Promise<PortalFeedbackRecord | null>;
  list(filter: Partial<PortalFeedbackRecord>, limit: number): Promise<PortalFeedbackRecord[]>;
}
