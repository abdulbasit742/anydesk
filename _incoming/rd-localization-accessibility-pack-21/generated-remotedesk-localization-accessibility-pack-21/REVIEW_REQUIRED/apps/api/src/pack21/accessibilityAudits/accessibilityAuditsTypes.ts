export interface AccessibilityAuditRecord {
  id: string; target: string; status: 'queued' | 'running' | 'passed' | 'failed'; issueCount: number; createdAt: string;
}

export interface AccessibilityAuditRecordRepository {
  create(record: AccessibilityAuditRecord): Promise<AccessibilityAuditRecord>;
  update(id: string, patch: Partial<AccessibilityAuditRecord>): Promise<AccessibilityAuditRecord | null>;
  list(filter: Partial<AccessibilityAuditRecord>, limit: number): Promise<AccessibilityAuditRecord[]>;
}
