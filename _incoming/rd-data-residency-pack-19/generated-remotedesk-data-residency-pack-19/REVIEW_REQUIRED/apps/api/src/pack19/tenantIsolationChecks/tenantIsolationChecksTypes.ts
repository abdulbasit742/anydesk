export interface TenantIsolationCheckRecord {
  id: string; tenantId: string; check: string; status: 'passed' | 'failed' | 'warning'; checkedAt: string;
}

export interface TenantIsolationCheckRecordRepository {
  create(record: TenantIsolationCheckRecord): Promise<TenantIsolationCheckRecord>;
  update(id: string, patch: Partial<TenantIsolationCheckRecord>): Promise<TenantIsolationCheckRecord | null>;
  list(filter: Partial<TenantIsolationCheckRecord>, limit: number): Promise<TenantIsolationCheckRecord[]>;
}
