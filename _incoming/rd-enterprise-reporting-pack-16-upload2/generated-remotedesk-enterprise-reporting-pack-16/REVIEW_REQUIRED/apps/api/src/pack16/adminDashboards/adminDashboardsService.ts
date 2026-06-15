import type { AdminDashboardRecord, AdminDashboardRecordRepository } from "./adminDashboardsTypes.js";

export class AdminDashboardRecordService {
  constructor(private readonly repository: AdminDashboardRecordRepository) {}

  create(record: AdminDashboardRecord): Promise<AdminDashboardRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<AdminDashboardRecord>): Promise<AdminDashboardRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("adminDashboards-not-found");
    return updated;
  }

  list(filter: Partial<AdminDashboardRecord> = {}, limit = 50): Promise<AdminDashboardRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
