import type { ViewerPermissionRecord, ViewerPermissionRecordRepository } from "./viewerPermissionsTypes.js";

export class ViewerPermissionRecordService {
  constructor(private readonly repository: ViewerPermissionRecordRepository) {}

  create(record: ViewerPermissionRecord): Promise<ViewerPermissionRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<ViewerPermissionRecord>): Promise<ViewerPermissionRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("viewerPermissions-not-found");
    return updated;
  }

  list(filter: Partial<ViewerPermissionRecord> = {}, limit = 50): Promise<ViewerPermissionRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
