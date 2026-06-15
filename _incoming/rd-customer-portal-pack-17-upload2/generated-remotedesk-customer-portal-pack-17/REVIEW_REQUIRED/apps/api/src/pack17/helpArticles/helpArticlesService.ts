import type { HelpArticleRecord, HelpArticleRecordRepository } from "./helpArticlesTypes.js";

export class HelpArticleRecordService {
  constructor(private readonly repository: HelpArticleRecordRepository) {}

  create(record: HelpArticleRecord): Promise<HelpArticleRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<HelpArticleRecord>): Promise<HelpArticleRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("helpArticles-not-found");
    return updated;
  }

  list(filter: Partial<HelpArticleRecord> = {}, limit = 50): Promise<HelpArticleRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
