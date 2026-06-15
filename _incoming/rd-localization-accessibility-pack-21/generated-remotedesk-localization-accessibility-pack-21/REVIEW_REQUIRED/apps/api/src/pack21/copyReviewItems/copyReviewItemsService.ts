import type { CopyReviewItemRecord, CopyReviewItemRecordRepository } from "./copyReviewItemsTypes.js";

export class CopyReviewItemRecordService {
  constructor(private readonly repository: CopyReviewItemRecordRepository) {}

  create(record: CopyReviewItemRecord): Promise<CopyReviewItemRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<CopyReviewItemRecord>): Promise<CopyReviewItemRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("copyReviewItems-not-found");
    return updated;
  }

  list(filter: Partial<CopyReviewItemRecord> = {}, limit = 50): Promise<CopyReviewItemRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
