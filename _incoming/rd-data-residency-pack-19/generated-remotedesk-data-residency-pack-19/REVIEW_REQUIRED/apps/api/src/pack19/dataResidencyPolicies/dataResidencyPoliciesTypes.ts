export interface DataResidencyPolicyRecord {
  id: string; tenantId: string; primaryRegion: string; backupRegions: string[]; crossRegionSupportAccess: boolean; updatedAt: string;
}

export interface DataResidencyPolicyRecordRepository {
  create(record: DataResidencyPolicyRecord): Promise<DataResidencyPolicyRecord>;
  update(id: string, patch: Partial<DataResidencyPolicyRecord>): Promise<DataResidencyPolicyRecord | null>;
  list(filter: Partial<DataResidencyPolicyRecord>, limit: number): Promise<DataResidencyPolicyRecord[]>;
}
