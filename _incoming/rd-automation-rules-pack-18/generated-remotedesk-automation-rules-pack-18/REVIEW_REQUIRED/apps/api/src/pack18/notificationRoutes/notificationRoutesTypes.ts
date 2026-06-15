export interface NotificationRouteRecord {
  id: string; teamId: string; eventType: string; targetRole: string; enabled: boolean;
}

export interface NotificationRouteRecordRepository {
  create(record: NotificationRouteRecord): Promise<NotificationRouteRecord>;
  update(id: string, patch: Partial<NotificationRouteRecord>): Promise<NotificationRouteRecord | null>;
  list(filter: Partial<NotificationRouteRecord>, limit: number): Promise<NotificationRouteRecord[]>;
}
