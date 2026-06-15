export interface TranslationReviewRecord {
  id: string; locale: string; keyId: string; state: 'draft' | 'reviewed' | 'approved' | 'rejected'; reviewerUserId?: string; updatedAt: string;
}

export interface TranslationReviewRecordRepository {
  create(record: TranslationReviewRecord): Promise<TranslationReviewRecord>;
  update(id: string, patch: Partial<TranslationReviewRecord>): Promise<TranslationReviewRecord | null>;
  list(filter: Partial<TranslationReviewRecord>, limit: number): Promise<TranslationReviewRecord[]>;
}
