import type { TenantIsolationCheckRecord, TenantIsolationCheckRecordRepository } from "./tenantIsolationChecksTypes.js";

export class TenantIsolationCheckRecordService {
  constructor(private readonly repository: TenantIsolationCheckRecordRepository) {}

  create(record: TenantIsolationCheckRecord): Promise<TenantIsolationCheckRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<TenantIsolationCheckRecord>): Promise<TenantIsolationCheckRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("tenantIsolationChecks-not-found");
    return updated;
  }

  list(filter: Partial<TenantIsolationCheckRecord> = {}, limit = 50): Promise<TenantIsolationCheckRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
