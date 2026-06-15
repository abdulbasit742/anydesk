import type { ViewerRosterRecord, ViewerRosterRecordRepository } from "./viewerRosterTypes.js";

export class ViewerRosterRecordService {
  constructor(private readonly repository: ViewerRosterRecordRepository) {}

  create(record: ViewerRosterRecord): Promise<ViewerRosterRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<ViewerRosterRecord>): Promise<ViewerRosterRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("viewerRoster-not-found");
    return updated;
  }

  list(filter: Partial<ViewerRosterRecord> = {}, limit = 50): Promise<ViewerRosterRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
