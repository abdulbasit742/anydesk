import type { AutomationDeadLetterRecord, AutomationDeadLetterRecordRepository } from "./automationDeadLettersTypes.js";

export class AutomationDeadLetterRecordService {
  constructor(private readonly repository: AutomationDeadLetterRecordRepository) {}

  create(record: AutomationDeadLetterRecord): Promise<AutomationDeadLetterRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<AutomationDeadLetterRecord>): Promise<AutomationDeadLetterRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("automationDeadLetters-not-found");
    return updated;
  }

  list(filter: Partial<AutomationDeadLetterRecord> = {}, limit = 50): Promise<AutomationDeadLetterRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
