import type { QaAuditRecord, QaAuditRecordRepository } from "./qaAuditTypes.js";

export class QaAuditRecordService {
  constructor(private readonly repository: QaAuditRecordRepository) {}

  create(record: QaAuditRecord): Promise<QaAuditRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<QaAuditRecord>): Promise<QaAuditRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("qaAudit-not-found");
    return updated;
  }

  list(filter: Partial<QaAuditRecord> = {}, limit = 50): Promise<QaAuditRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
