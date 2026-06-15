import type { AutomationEventInboxRecord, AutomationEventInboxRecordRepository } from "./automationEventInboxTypes.js";

export class AutomationEventInboxRecordService {
  constructor(private readonly repository: AutomationEventInboxRecordRepository) {}

  create(record: AutomationEventInboxRecord): Promise<AutomationEventInboxRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<AutomationEventInboxRecord>): Promise<AutomationEventInboxRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("automationEventInbox-not-found");
    return updated;
  }

  list(filter: Partial<AutomationEventInboxRecord> = {}, limit = 50): Promise<AutomationEventInboxRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
