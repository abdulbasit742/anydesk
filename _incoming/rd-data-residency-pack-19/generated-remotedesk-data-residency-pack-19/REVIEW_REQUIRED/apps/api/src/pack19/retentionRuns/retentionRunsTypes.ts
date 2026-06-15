export interface RetentionRunRecord {
  id: string; tenantId: string; policyId: string; status: 'queued' | 'running' | 'completed' | 'failed'; deletedCount: number; createdAt: string;
}

export interface RetentionRunRecordRepository {
  create(record: RetentionRunRecord): Promise<RetentionRunRecord>;
  update(id: string, patch: Partial<RetentionRunRecord>): Promise<RetentionRunRecord | null>;
  list(filter: Partial<RetentionRunRecord>, limit: number): Promise<RetentionRunRecord[]>;
}
