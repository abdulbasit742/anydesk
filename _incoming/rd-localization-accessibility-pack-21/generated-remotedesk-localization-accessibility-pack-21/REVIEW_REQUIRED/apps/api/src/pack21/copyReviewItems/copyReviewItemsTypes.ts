export interface CopyReviewItemRecord {
  id: string; surface: string; copy: string; state: 'draft' | 'reviewed' | 'approved' | 'rejected'; updatedAt: string;
}

export interface CopyReviewItemRecordRepository {
  create(record: CopyReviewItemRecord): Promise<CopyReviewItemRecord>;
  update(id: string, patch: Partial<CopyReviewItemRecord>): Promise<CopyReviewItemRecord | null>;
  list(filter: Partial<CopyReviewItemRecord>, limit: number): Promise<CopyReviewItemRecord[]>;
}
