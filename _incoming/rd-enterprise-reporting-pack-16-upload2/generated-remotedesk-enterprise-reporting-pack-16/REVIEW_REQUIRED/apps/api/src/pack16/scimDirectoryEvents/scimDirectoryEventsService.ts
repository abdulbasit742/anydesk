import type { ScimDirectoryEventRecord, ScimDirectoryEventRecordRepository } from "./scimDirectoryEventsTypes.js";

export class ScimDirectoryEventRecordService {
  constructor(private readonly repository: ScimDirectoryEventRecordRepository) {}

  create(record: ScimDirectoryEventRecord): Promise<ScimDirectoryEventRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<ScimDirectoryEventRecord>): Promise<ScimDirectoryEventRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("scimDirectoryEvents-not-found");
    return updated;
  }

  list(filter: Partial<ScimDirectoryEventRecord> = {}, limit = 50): Promise<ScimDirectoryEventRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
