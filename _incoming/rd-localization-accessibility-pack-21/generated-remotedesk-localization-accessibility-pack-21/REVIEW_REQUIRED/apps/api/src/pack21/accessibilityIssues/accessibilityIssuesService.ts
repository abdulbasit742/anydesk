import type { AccessibilityIssueRecord, AccessibilityIssueRecordRepository } from "./accessibilityIssuesTypes.js";

export class AccessibilityIssueRecordService {
  constructor(private readonly repository: AccessibilityIssueRecordRepository) {}

  create(record: AccessibilityIssueRecord): Promise<AccessibilityIssueRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<AccessibilityIssueRecord>): Promise<AccessibilityIssueRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("accessibilityIssues-not-found");
    return updated;
  }

  list(filter: Partial<AccessibilityIssueRecord> = {}, limit = 50): Promise<AccessibilityIssueRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
