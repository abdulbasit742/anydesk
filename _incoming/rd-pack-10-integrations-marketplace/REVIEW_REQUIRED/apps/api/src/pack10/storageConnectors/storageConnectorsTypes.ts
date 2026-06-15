export interface StorageConnectorRecord {
  id: string; teamId: string; provider: 's3' | 'gcs' | 'azure_blob'; bucket: string; prefix?: string; enabled: boolean;
}

export interface StorageConnectorRecordRepository {
  create(record: StorageConnectorRecord): Promise<StorageConnectorRecord>;
  update(id: string, patch: Partial<StorageConnectorRecord>): Promise<StorageConnectorRecord | null>;
  list(filter: Partial<StorageConnectorRecord>, limit: number): Promise<StorageConnectorRecord[]>;
}
