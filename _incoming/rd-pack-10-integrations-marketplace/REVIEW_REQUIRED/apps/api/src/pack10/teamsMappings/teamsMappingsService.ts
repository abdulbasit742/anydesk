import type { TeamsMappingRecord, TeamsMappingRecordRepository } from "./teamsMappingsTypes.js";

export class TeamsMappingRecordService {
  constructor(private readonly repository: TeamsMappingRecordRepository) {}

  create(record: TeamsMappingRecord): Promise<TeamsMappingRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<TeamsMappingRecord>): Promise<TeamsMappingRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("teamsMappings-not-found");
    return updated;
  }

  list(filter: Partial<TeamsMappingRecord> = {}, limit = 50): Promise<TeamsMappingRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
