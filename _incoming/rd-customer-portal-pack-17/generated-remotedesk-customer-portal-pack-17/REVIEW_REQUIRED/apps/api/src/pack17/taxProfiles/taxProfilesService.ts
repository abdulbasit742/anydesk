import type { TaxProfileRecord, TaxProfileRecordRepository } from "./taxProfilesTypes.js";

export class TaxProfileRecordService {
  constructor(private readonly repository: TaxProfileRecordRepository) {}

  create(record: TaxProfileRecord): Promise<TaxProfileRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<TaxProfileRecord>): Promise<TaxProfileRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("taxProfiles-not-found");
    return updated;
  }

  list(filter: Partial<TaxProfileRecord> = {}, limit = 50): Promise<TaxProfileRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
