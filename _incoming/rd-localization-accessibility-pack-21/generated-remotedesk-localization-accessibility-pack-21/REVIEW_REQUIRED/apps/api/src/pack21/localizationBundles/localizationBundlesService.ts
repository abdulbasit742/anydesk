import type { LocalizationBundleRecord, LocalizationBundleRecordRepository } from "./localizationBundlesTypes.js";

export class LocalizationBundleRecordService {
  constructor(private readonly repository: LocalizationBundleRecordRepository) {}

  create(record: LocalizationBundleRecord): Promise<LocalizationBundleRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<LocalizationBundleRecord>): Promise<LocalizationBundleRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("localizationBundles-not-found");
    return updated;
  }

  list(filter: Partial<LocalizationBundleRecord> = {}, limit = 50): Promise<LocalizationBundleRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
