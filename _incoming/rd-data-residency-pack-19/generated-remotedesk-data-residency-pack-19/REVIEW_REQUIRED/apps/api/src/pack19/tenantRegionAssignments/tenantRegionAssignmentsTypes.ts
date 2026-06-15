export interface TenantRegionAssignmentRecord {
  id: string; tenantId: string; region: string; purpose: 'primary' | 'backup' | 'archive'; assignedAt: string;
}

export interface TenantRegionAssignmentRecordRepository {
  create(record: TenantRegionAssignmentRecord): Promise<TenantRegionAssignmentRecord>;
  update(id: string, patch: Partial<TenantRegionAssignmentRecord>): Promise<TenantRegionAssignmentRecord | null>;
  list(filter: Partial<TenantRegionAssignmentRecord>, limit: number): Promise<TenantRegionAssignmentRecord[]>;
}
