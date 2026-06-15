import type { SessionNoteRecord, SessionNoteRecordRepository } from "./sessionNotesTypes.js";

export class SessionNoteRecordService {
  constructor(private readonly repository: SessionNoteRecordRepository) {}

  create(record: SessionNoteRecord): Promise<SessionNoteRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<SessionNoteRecord>): Promise<SessionNoteRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("sessionNotes-not-found");
    return updated;
  }

  list(filter: Partial<SessionNoteRecord> = {}, limit = 50): Promise<SessionNoteRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
