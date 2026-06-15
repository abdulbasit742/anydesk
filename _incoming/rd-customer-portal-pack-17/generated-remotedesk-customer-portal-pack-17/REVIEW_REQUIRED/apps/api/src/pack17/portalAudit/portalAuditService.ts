import type { PortalAuditRecord, PortalAuditRecordRepository } from "./portalAuditTypes.js";

export class PortalAuditRecordService {
  constructor(private readonly repository: PortalAuditRecordRepository) {}

  create(record: PortalAuditRecord): Promise<PortalAuditRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<PortalAuditRecord>): Promise<PortalAuditRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("portalAudit-not-found");
    return updated;
  }

  list(filter: Partial<PortalAuditRecord> = {}, limit = 50): Promise<PortalAuditRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
