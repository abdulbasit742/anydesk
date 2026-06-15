import type { PublicStatusIncidentRecord, PublicStatusIncidentRecordRepository } from "./publicStatusIncidentsTypes.js";

export class PublicStatusIncidentRecordService {
  constructor(private readonly repository: PublicStatusIncidentRecordRepository) {}

  create(record: PublicStatusIncidentRecord): Promise<PublicStatusIncidentRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<PublicStatusIncidentRecord>): Promise<PublicStatusIncidentRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("publicStatusIncidents-not-found");
    return updated;
  }

  list(filter: Partial<PublicStatusIncidentRecord> = {}, limit = 50): Promise<PublicStatusIncidentRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
