import type { TranslationReviewRecord, TranslationReviewRecordRepository } from "./translationReviewsTypes.js";

export class TranslationReviewRecordService {
  constructor(private readonly repository: TranslationReviewRecordRepository) {}

  create(record: TranslationReviewRecord): Promise<TranslationReviewRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<TranslationReviewRecord>): Promise<TranslationReviewRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("translationReviews-not-found");
    return updated;
  }

  list(filter: Partial<TranslationReviewRecord> = {}, limit = 50): Promise<TranslationReviewRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
