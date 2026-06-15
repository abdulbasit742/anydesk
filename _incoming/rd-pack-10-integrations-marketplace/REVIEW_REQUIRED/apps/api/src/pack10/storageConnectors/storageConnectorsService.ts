import type { StorageConnectorRecord, StorageConnectorRecordRepository } from "./storageConnectorsTypes.js";

export class StorageConnectorRecordService {
  constructor(private readonly repository: StorageConnectorRecordRepository) {}

  create(record: StorageConnectorRecord): Promise<StorageConnectorRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<StorageConnectorRecord>): Promise<StorageConnectorRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("storageConnectors-not-found");
    return updated;
  }

  list(filter: Partial<StorageConnectorRecord> = {}, limit = 50): Promise<StorageConnectorRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
