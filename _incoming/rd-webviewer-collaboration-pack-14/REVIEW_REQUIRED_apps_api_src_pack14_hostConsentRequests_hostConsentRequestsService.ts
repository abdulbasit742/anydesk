import type { HostConsentRequestRecord, HostConsentRequestRecordRepository } from "./hostConsentRequestsTypes.js";

export class HostConsentRequestRecordService {
  constructor(private readonly repository: HostConsentRequestRecordRepository) {}

  create(record: HostConsentRequestRecord): Promise<HostConsentRequestRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<HostConsentRequestRecord>): Promise<HostConsentRequestRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("hostConsentRequests-not-found");
    return updated;
  }

  list(filter: Partial<HostConsentRequestRecord> = {}, limit = 50): Promise<HostConsentRequestRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
