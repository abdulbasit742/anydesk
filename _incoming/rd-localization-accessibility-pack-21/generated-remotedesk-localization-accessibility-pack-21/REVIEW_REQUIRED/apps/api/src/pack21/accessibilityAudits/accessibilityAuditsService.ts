import type { AccessibilityAuditRecord, AccessibilityAuditRecordRepository } from "./accessibilityAuditsTypes.js";

export class AccessibilityAuditRecordService {
  constructor(private readonly repository: AccessibilityAuditRecordRepository) {}

  create(record: AccessibilityAuditRecord): Promise<AccessibilityAuditRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<AccessibilityAuditRecord>): Promise<AccessibilityAuditRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("accessibilityAudits-not-found");
    return updated;
  }

  list(filter: Partial<AccessibilityAuditRecord> = {}, limit = 50): Promise<AccessibilityAuditRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
