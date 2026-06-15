import type { DataInventoryItemRecord, DataInventoryItemRecordRepository } from "./dataInventoryItemsTypes.js";

export class DataInventoryItemRecordService {
  constructor(private readonly repository: DataInventoryItemRecordRepository) {}

  create(record: DataInventoryItemRecord): Promise<DataInventoryItemRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<DataInventoryItemRecord>): Promise<DataInventoryItemRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("dataInventoryItems-not-found");
    return updated;
  }

  list(filter: Partial<DataInventoryItemRecord> = {}, limit = 50): Promise<DataInventoryItemRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
