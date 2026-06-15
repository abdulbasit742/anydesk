export interface ConnectorCatalogRecord {
  id: string; key: string; name: string; category: string; enabled: boolean; docsUrl?: string;
}

export interface ConnectorCatalogRecordRepository {
  create(record: ConnectorCatalogRecord): Promise<ConnectorCatalogRecord>;
  update(id: string, patch: Partial<ConnectorCatalogRecord>): Promise<ConnectorCatalogRecord | null>;
  list(filter: Partial<ConnectorCatalogRecord>, limit: number): Promise<ConnectorCatalogRecord[]>;
}
