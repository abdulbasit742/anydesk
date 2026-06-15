import type { CollaborationAuditRecord, CollaborationAuditRecordRepository } from "./collaborationAuditTypes.js";

export class CollaborationAuditRecordService {
  constructor(private readonly repository: CollaborationAuditRecordRepository) {}

  create(record: CollaborationAuditRecord): Promise<CollaborationAuditRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<CollaborationAuditRecord>): Promise<CollaborationAuditRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("collaborationAudit-not-found");
    return updated;
  }

  list(filter: Partial<CollaborationAuditRecord> = {}, limit = 50): Promise<CollaborationAuditRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
