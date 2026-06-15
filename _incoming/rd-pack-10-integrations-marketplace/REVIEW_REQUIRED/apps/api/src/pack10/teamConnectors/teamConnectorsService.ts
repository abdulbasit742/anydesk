import type { TeamConnectorRecord, TeamConnectorRecordRepository } from "./teamConnectorsTypes.js";

export class TeamConnectorRecordService {
  constructor(private readonly repository: TeamConnectorRecordRepository) {}

  create(record: TeamConnectorRecord): Promise<TeamConnectorRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<TeamConnectorRecord>): Promise<TeamConnectorRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("teamConnectors-not-found");
    return updated;
  }

  list(filter: Partial<TeamConnectorRecord> = {}, limit = 50): Promise<TeamConnectorRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
