export interface LocalePreferenceRecord {
  id: string; userId: string; locale: string; timeZone: string; updatedAt: string;
}

export interface LocalePreferenceRecordRepository {
  create(record: LocalePreferenceRecord): Promise<LocalePreferenceRecord>;
  update(id: string, patch: Partial<LocalePreferenceRecord>): Promise<LocalePreferenceRecord | null>;
  list(filter: Partial<LocalePreferenceRecord>, limit: number): Promise<LocalePreferenceRecord[]>;
}
