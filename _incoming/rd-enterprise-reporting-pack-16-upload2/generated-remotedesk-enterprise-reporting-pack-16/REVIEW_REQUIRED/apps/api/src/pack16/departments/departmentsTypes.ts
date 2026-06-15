export interface DepartmentRecord {
  id: string; organizationId: string; path: string; name: string; parentId?: string; createdAt: string;
}

export interface DepartmentRecordRepository {
  create(record: DepartmentRecord): Promise<DepartmentRecord>;
  update(id: string, patch: Partial<DepartmentRecord>): Promise<DepartmentRecord | null>;
  list(filter: Partial<DepartmentRecord>, limit: number): Promise<DepartmentRecord[]>;
}
