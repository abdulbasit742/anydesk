import type { OrganizationRecord, OrganizationRecordRepository } from "./organizationsTypes.js";

export class OrganizationRecordService {
  constructor(private readonly repository: OrganizationRecordRepository) {}

  create(record: OrganizationRecord): Promise<OrganizationRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<OrganizationRecord>): Promise<OrganizationRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("organizations-not-found");
    return updated;
  }

  list(filter: Partial<OrganizationRecord> = {}, limit = 50): Promise<OrganizationRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
