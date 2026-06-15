import type { RoleAssignmentRecord, RoleAssignmentRecordRepository } from "./roleAssignmentsTypes.js";

export class RoleAssignmentRecordService {
  constructor(private readonly repository: RoleAssignmentRecordRepository) {}

  create(record: RoleAssignmentRecord): Promise<RoleAssignmentRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<RoleAssignmentRecord>): Promise<RoleAssignmentRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("roleAssignments-not-found");
    return updated;
  }

  list(filter: Partial<RoleAssignmentRecord> = {}, limit = 50): Promise<RoleAssignmentRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
