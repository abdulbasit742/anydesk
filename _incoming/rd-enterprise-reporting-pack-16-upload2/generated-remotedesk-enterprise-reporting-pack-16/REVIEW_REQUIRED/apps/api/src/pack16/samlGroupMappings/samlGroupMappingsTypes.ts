export interface SamlGroupMappingRecord {
  id: string; organizationId: string; groupName: string; orgRole: string; departmentPath?: string; updatedAt: string;
}

export interface SamlGroupMappingRecordRepository {
  create(record: SamlGroupMappingRecord): Promise<SamlGroupMappingRecord>;
  update(id: string, patch: Partial<SamlGroupMappingRecord>): Promise<SamlGroupMappingRecord | null>;
  list(filter: Partial<SamlGroupMappingRecord>, limit: number): Promise<SamlGroupMappingRecord[]>;
}
