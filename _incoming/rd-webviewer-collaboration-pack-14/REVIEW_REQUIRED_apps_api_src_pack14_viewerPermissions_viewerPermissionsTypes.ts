export interface ViewerPermissionRecord {
  id: string; sessionId: string; userId: string; permissions: string[]; updatedByUserId: string; updatedAt: string;
}

export interface ViewerPermissionRecordRepository {
  create(record: ViewerPermissionRecord): Promise<ViewerPermissionRecord>;
  update(id: string, patch: Partial<ViewerPermissionRecord>): Promise<ViewerPermissionRecord | null>;
  list(filter: Partial<ViewerPermissionRecord>, limit: number): Promise<ViewerPermissionRecord[]>;
}
