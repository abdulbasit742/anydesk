export interface RoleAssignmentRecord {
  id: string; organizationId: string; subjectUserId: string; role: string; assignedByUserId: string; assignedAt: string;
}

export interface RoleAssignmentRecordRepository {
  create(record: RoleAssignmentRecord): Promise<RoleAssignmentRecord>;
  update(id: string, patch: Partial<RoleAssignmentRecord>): Promise<RoleAssignmentRecord | null>;
  list(filter: Partial<RoleAssignmentRecord>, limit: number): Promise<RoleAssignmentRecord[]>;
}
