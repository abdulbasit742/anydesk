import type { BillingPortalSessionRecord, BillingPortalSessionRecordRepository } from "./billingPortalSessionsTypes.js";

export class BillingPortalSessionRecordService {
  constructor(private readonly repository: BillingPortalSessionRecordRepository) {}

  create(record: BillingPortalSessionRecord): Promise<BillingPortalSessionRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<BillingPortalSessionRecord>): Promise<BillingPortalSessionRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("billingPortalSessions-not-found");
    return updated;
  }

  list(filter: Partial<BillingPortalSessionRecord> = {}, limit = 50): Promise<BillingPortalSessionRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
