export interface RetentionPolicyRecord {
  id: string; tenantId: string; resourceType: string; keepDays: number; legalHoldAware: boolean; updatedAt: string;
}

export interface RetentionPolicyRecordRepository {
  create(record: RetentionPolicyRecord): Promise<RetentionPolicyRecord>;
  update(id: string, patch: Partial<RetentionPolicyRecord>): Promise<RetentionPolicyRecord | null>;
  list(filter: Partial<RetentionPolicyRecord>, limit: number): Promise<RetentionPolicyRecord[]>;
}
