export interface CrossRegionTransferRequestRecord {
  id: string; tenantId: string; sourceRegion: string; targetRegion: string; purpose: string; approved: boolean; createdAt: string;
}

export interface CrossRegionTransferRequestRecordRepository {
  create(record: CrossRegionTransferRequestRecord): Promise<CrossRegionTransferRequestRecord>;
  update(id: string, patch: Partial<CrossRegionTransferRequestRecord>): Promise<CrossRegionTransferRequestRecord | null>;
  list(filter: Partial<CrossRegionTransferRequestRecord>, limit: number): Promise<CrossRegionTransferRequestRecord[]>;
}
