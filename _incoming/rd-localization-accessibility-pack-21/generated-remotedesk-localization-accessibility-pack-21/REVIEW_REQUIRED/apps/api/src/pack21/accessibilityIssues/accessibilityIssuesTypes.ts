export interface AccessibilityIssueRecord {
  id: string; auditId: string; severity: 'low' | 'medium' | 'high' | 'critical'; rule: string; message: string; status: 'open' | 'resolved';
}

export interface AccessibilityIssueRecordRepository {
  create(record: AccessibilityIssueRecord): Promise<AccessibilityIssueRecord>;
  update(id: string, patch: Partial<AccessibilityIssueRecord>): Promise<AccessibilityIssueRecord | null>;
  list(filter: Partial<AccessibilityIssueRecord>, limit: number): Promise<AccessibilityIssueRecord[]>;
}
