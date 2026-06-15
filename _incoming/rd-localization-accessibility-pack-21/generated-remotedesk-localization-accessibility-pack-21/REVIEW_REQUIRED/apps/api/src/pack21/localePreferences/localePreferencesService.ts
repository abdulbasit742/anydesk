import type { LocalePreferenceRecord, LocalePreferenceRecordRepository } from "./localePreferencesTypes.js";

export class LocalePreferenceRecordService {
  constructor(private readonly repository: LocalePreferenceRecordRepository) {}

  create(record: LocalePreferenceRecord): Promise<LocalePreferenceRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<LocalePreferenceRecord>): Promise<LocalePreferenceRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("localePreferences-not-found");
    return updated;
  }

  list(filter: Partial<LocalePreferenceRecord> = {}, limit = 50): Promise<LocalePreferenceRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
