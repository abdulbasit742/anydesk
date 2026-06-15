export interface HelpArticleRecord {
  id: string; slug: string; title: string; body: string; published: boolean; updatedAt: string;
}

export interface HelpArticleRecordRepository {
  create(record: HelpArticleRecord): Promise<HelpArticleRecord>;
  update(id: string, patch: Partial<HelpArticleRecord>): Promise<HelpArticleRecord | null>;
  list(filter: Partial<HelpArticleRecord>, limit: number): Promise<HelpArticleRecord[]>;
}
