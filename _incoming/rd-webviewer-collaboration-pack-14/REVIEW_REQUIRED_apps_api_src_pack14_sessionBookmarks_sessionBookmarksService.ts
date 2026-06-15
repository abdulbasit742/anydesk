import type { SessionBookmarkRecord, SessionBookmarkRecordRepository } from "./sessionBookmarksTypes.js";

export class SessionBookmarkRecordService {
  constructor(private readonly repository: SessionBookmarkRecordRepository) {}

  create(record: SessionBookmarkRecord): Promise<SessionBookmarkRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<SessionBookmarkRecord>): Promise<SessionBookmarkRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("sessionBookmarks-not-found");
    return updated;
  }

  list(filter: Partial<SessionBookmarkRecord> = {}, limit = 50): Promise<SessionBookmarkRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
