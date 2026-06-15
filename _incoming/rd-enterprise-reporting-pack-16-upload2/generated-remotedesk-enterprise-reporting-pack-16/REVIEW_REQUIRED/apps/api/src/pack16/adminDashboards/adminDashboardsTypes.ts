export interface AdminDashboardRecord {
  id: string; organizationId: string; name: string; layout: Record<string, unknown>; updatedAt: string;
}

export interface AdminDashboardRecordRepository {
  create(record: AdminDashboardRecord): Promise<AdminDashboardRecord>;
  update(id: string, patch: Partial<AdminDashboardRecord>): Promise<AdminDashboardRecord | null>;
  list(filter: Partial<AdminDashboardRecord>, limit: number): Promise<AdminDashboardRecord[]>;
}
