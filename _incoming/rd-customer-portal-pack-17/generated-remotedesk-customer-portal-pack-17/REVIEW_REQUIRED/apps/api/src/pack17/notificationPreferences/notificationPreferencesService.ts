import type { NotificationPreferenceRecord, NotificationPreferenceRecordRepository } from "./notificationPreferencesTypes.js";

export class NotificationPreferenceRecordService {
  constructor(private readonly repository: NotificationPreferenceRecordRepository) {}

  create(record: NotificationPreferenceRecord): Promise<NotificationPreferenceRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<NotificationPreferenceRecord>): Promise<NotificationPreferenceRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("notificationPreferences-not-found");
    return updated;
  }

  list(filter: Partial<NotificationPreferenceRecord> = {}, limit = 50): Promise<NotificationPreferenceRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
