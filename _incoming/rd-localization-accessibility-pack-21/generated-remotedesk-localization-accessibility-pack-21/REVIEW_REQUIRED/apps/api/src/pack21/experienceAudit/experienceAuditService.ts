import type { ExperienceAuditRecord, ExperienceAuditRecordRepository } from "./experienceAuditTypes.js";

export class ExperienceAuditRecordService {
  constructor(private readonly repository: ExperienceAuditRecordRepository) {}

  create(record: ExperienceAuditRecord): Promise<ExperienceAuditRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<ExperienceAuditRecord>): Promise<ExperienceAuditRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("experienceAudit-not-found");
    return updated;
  }

  list(filter: Partial<ExperienceAuditRecord> = {}, limit = 50): Promise<ExperienceAuditRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
