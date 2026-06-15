export interface TenantScopedRecord {
  tenantId: string;
}

export function enforceTenantBoundary<T extends TenantScopedRecord>(records: readonly T[], tenantId: string): T[] {
  return records.filter((record) => record.tenantId === tenantId);
}

export function assertTenantMatch(recordTenantId: string, requestTenantId: string): void {
  if (recordTenantId !== requestTenantId) throw new Error("tenant-boundary-violation");
}
