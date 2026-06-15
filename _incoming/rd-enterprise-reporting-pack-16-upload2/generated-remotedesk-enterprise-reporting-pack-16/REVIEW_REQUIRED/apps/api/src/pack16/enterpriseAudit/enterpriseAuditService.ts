import type { EnterpriseAuditRecord, EnterpriseAuditRecordRepository } from "./enterpriseAuditTypes.js";

export class EnterpriseAuditRecordService {
  constructor(private readonly repository: EnterpriseAuditRecordRepository) {}

  create(record: EnterpriseAuditRecord): Promise<EnterpriseAuditRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<EnterpriseAuditRecord>): Promise<EnterpriseAuditRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("enterpriseAudit-not-found");
    return updated;
  }

  list(filter: Partial<EnterpriseAuditRecord> = {}, limit = 50): Promise<EnterpriseAuditRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
