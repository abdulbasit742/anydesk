export interface TranslationKeyRecord {
  id: string; namespace: string; key: string; defaultText: string; description?: string; updatedAt: string;
}

export interface TranslationKeyRecordRepository {
  create(record: TranslationKeyRecord): Promise<TranslationKeyRecord>;
  update(id: string, patch: Partial<TranslationKeyRecord>): Promise<TranslationKeyRecord | null>;
  list(filter: Partial<TranslationKeyRecord>, limit: number): Promise<TranslationKeyRecord[]>;
}
