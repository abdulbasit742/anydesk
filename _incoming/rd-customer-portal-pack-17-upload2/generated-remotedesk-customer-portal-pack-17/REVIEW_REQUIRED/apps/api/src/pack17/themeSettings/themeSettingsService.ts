import type { ThemeSettingsRecord, ThemeSettingsRecordRepository } from "./themeSettingsTypes.js";

export class ThemeSettingsRecordService {
  constructor(private readonly repository: ThemeSettingsRecordRepository) {}

  create(record: ThemeSettingsRecord): Promise<ThemeSettingsRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<ThemeSettingsRecord>): Promise<ThemeSettingsRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("themeSettings-not-found");
    return updated;
  }

  list(filter: Partial<ThemeSettingsRecord> = {}, limit = 50): Promise<ThemeSettingsRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
