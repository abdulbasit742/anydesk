import type { TenantRegionAssignmentRecord, TenantRegionAssignmentRecordRepository } from "./tenantRegionAssignmentsTypes.js";

export class TenantRegionAssignmentRecordService {
  constructor(private readonly repository: TenantRegionAssignmentRecordRepository) {}

  create(record: TenantRegionAssignmentRecord): Promise<TenantRegionAssignmentRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<TenantRegionAssignmentRecord>): Promise<TenantRegionAssignmentRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("tenantRegionAssignments-not-found");
    return updated;
  }

  list(filter: Partial<TenantRegionAssignmentRecord> = {}, limit = 50): Promise<TenantRegionAssignmentRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
