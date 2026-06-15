import type { OrgMemberRecord, OrgMemberRecordRepository } from "./orgMembersTypes.js";

export class OrgMemberRecordService {
  constructor(private readonly repository: OrgMemberRecordRepository) {}

  create(record: OrgMemberRecord): Promise<OrgMemberRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<OrgMemberRecord>): Promise<OrgMemberRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("orgMembers-not-found");
    return updated;
  }

  list(filter: Partial<OrgMemberRecord> = {}, limit = 50): Promise<OrgMemberRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
