export interface OrgMemberRecord {
  id: string; organizationId: string; userId: string; role: string; departmentId?: string; createdAt: string;
}

export interface OrgMemberRecordRepository {
  create(record: OrgMemberRecord): Promise<OrgMemberRecord>;
  update(id: string, patch: Partial<OrgMemberRecord>): Promise<OrgMemberRecord | null>;
  list(filter: Partial<OrgMemberRecord>, limit: number): Promise<OrgMemberRecord[]>;
}
