import type { SessionAnnotationRecord, SessionAnnotationRecordRepository } from "./sessionAnnotationsTypes.js";

export class SessionAnnotationRecordService {
  constructor(private readonly repository: SessionAnnotationRecordRepository) {}

  create(record: SessionAnnotationRecord): Promise<SessionAnnotationRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<SessionAnnotationRecord>): Promise<SessionAnnotationRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("sessionAnnotations-not-found");
    return updated;
  }

  list(filter: Partial<SessionAnnotationRecord> = {}, limit = 50): Promise<SessionAnnotationRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
