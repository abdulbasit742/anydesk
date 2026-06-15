import type { ResidencyAuditRecord, ResidencyAuditRecordRepository } from "./residencyAuditTypes.js";

export class ResidencyAuditRecordService {
  constructor(private readonly repository: ResidencyAuditRecordRepository) {}

  create(record: ResidencyAuditRecord): Promise<ResidencyAuditRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<ResidencyAuditRecord>): Promise<ResidencyAuditRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("residencyAudit-not-found");
    return updated;
  }

  list(filter: Partial<ResidencyAuditRecord> = {}, limit = 50): Promise<ResidencyAuditRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
