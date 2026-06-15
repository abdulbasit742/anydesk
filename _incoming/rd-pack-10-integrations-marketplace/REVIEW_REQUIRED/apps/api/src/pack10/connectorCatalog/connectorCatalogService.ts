import type { ConnectorCatalogRecord, ConnectorCatalogRecordRepository } from "./connectorCatalogTypes.js";

export class ConnectorCatalogRecordService {
  constructor(private readonly repository: ConnectorCatalogRecordRepository) {}

  create(record: ConnectorCatalogRecord): Promise<ConnectorCatalogRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<ConnectorCatalogRecord>): Promise<ConnectorCatalogRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("connectorCatalog-not-found");
    return updated;
  }

  list(filter: Partial<ConnectorCatalogRecord> = {}, limit = 50): Promise<ConnectorCatalogRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
