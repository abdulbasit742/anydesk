import type { SupportHandoffRecord, SupportHandoffRecordRepository } from "./supportHandoffsTypes.js";

export class SupportHandoffRecordService {
  constructor(private readonly repository: SupportHandoffRecordRepository) {}

  create(record: SupportHandoffRecord): Promise<SupportHandoffRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<SupportHandoffRecord>): Promise<SupportHandoffRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("supportHandoffs-not-found");
    return updated;
  }

  list(filter: Partial<SupportHandoffRecord> = {}, limit = 50): Promise<SupportHandoffRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
