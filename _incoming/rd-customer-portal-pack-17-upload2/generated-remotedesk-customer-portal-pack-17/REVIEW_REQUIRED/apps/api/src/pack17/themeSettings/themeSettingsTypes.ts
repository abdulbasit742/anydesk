export interface ThemeSettingsRecord {
  id: string; teamId: string; brandName: string; logoObjectKey?: string; accentColor: string; updatedAt: string;
}

export interface ThemeSettingsRecordRepository {
  create(record: ThemeSettingsRecord): Promise<ThemeSettingsRecord>;
  update(id: string, patch: Partial<ThemeSettingsRecord>): Promise<ThemeSettingsRecord | null>;
  list(filter: Partial<ThemeSettingsRecord>, limit: number): Promise<ThemeSettingsRecord[]>;
}
