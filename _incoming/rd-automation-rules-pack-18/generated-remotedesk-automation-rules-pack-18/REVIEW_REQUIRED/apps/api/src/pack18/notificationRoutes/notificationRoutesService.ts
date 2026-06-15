import type { NotificationRouteRecord, NotificationRouteRecordRepository } from "./notificationRoutesTypes.js";

export class NotificationRouteRecordService {
  constructor(private readonly repository: NotificationRouteRecordRepository) {}

  create(record: NotificationRouteRecord): Promise<NotificationRouteRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<NotificationRouteRecord>): Promise<NotificationRouteRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("notificationRoutes-not-found");
    return updated;
  }

  list(filter: Partial<NotificationRouteRecord> = {}, limit = 50): Promise<NotificationRouteRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
