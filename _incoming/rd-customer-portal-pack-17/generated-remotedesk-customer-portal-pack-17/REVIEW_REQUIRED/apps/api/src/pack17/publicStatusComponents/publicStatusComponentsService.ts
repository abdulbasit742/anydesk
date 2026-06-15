import type { PublicStatusComponentRecord, PublicStatusComponentRecordRepository } from "./publicStatusComponentsTypes.js";

export class PublicStatusComponentRecordService {
  constructor(private readonly repository: PublicStatusComponentRecordRepository) {}

  create(record: PublicStatusComponentRecord): Promise<PublicStatusComponentRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<PublicStatusComponentRecord>): Promise<PublicStatusComponentRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("publicStatusComponents-not-found");
    return updated;
  }

  list(filter: Partial<PublicStatusComponentRecord> = {}, limit = 50): Promise<PublicStatusComponentRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
