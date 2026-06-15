export interface OrganizationRecord {
  id: string; name: string; slug: string; plan: string; createdAt: string;
}

export interface OrganizationRecordRepository {
  create(record: OrganizationRecord): Promise<OrganizationRecord>;
  update(id: string, patch: Partial<OrganizationRecord>): Promise<OrganizationRecord | null>;
  list(filter: Partial<OrganizationRecord>, limit: number): Promise<OrganizationRecord[]>;
}
