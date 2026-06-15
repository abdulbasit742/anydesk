import type { TranslationKeyRecord, TranslationKeyRecordRepository } from "./translationKeysTypes.js";

export class TranslationKeyRecordService {
  constructor(private readonly repository: TranslationKeyRecordRepository) {}

  create(record: TranslationKeyRecord): Promise<TranslationKeyRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<TranslationKeyRecord>): Promise<TranslationKeyRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("translationKeys-not-found");
    return updated;
  }

  list(filter: Partial<TranslationKeyRecord> = {}, limit = 50): Promise<TranslationKeyRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
