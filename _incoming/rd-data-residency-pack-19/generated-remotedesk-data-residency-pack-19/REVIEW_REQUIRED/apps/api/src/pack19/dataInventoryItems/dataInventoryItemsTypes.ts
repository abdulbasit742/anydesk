export interface DataInventoryItemRecord {
  id: string; tenantId: string; resourceType: string; region: string; classification: string; updatedAt: string;
}

export interface DataInventoryItemRecordRepository {
  create(record: DataInventoryItemRecord): Promise<DataInventoryItemRecord>;
  update(id: string, patch: Partial<DataInventoryItemRecord>): Promise<DataInventoryItemRecord | null>;
  list(filter: Partial<DataInventoryItemRecord>, limit: number): Promise<DataInventoryItemRecord[]>;
}
