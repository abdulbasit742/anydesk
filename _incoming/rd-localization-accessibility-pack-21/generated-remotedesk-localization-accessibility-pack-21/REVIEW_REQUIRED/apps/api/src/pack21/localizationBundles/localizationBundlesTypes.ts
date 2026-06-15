export interface LocalizationBundleRecord {
  id: string; locale: string; namespace: string; version: number; published: boolean; updatedAt: string;
}

export interface LocalizationBundleRecordRepository {
  create(record: LocalizationBundleRecord): Promise<LocalizationBundleRecord>;
  update(id: string, patch: Partial<LocalizationBundleRecord>): Promise<LocalizationBundleRecord | null>;
  list(filter: Partial<LocalizationBundleRecord>, limit: number): Promise<LocalizationBundleRecord[]>;
}
