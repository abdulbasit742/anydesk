import type { SamlGroupMappingRecord, SamlGroupMappingRecordRepository } from "./samlGroupMappingsTypes.js";

export class SamlGroupMappingRecordService {
  constructor(private readonly repository: SamlGroupMappingRecordRepository) {}

  create(record: SamlGroupMappingRecord): Promise<SamlGroupMappingRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<SamlGroupMappingRecord>): Promise<SamlGroupMappingRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("samlGroupMappings-not-found");
    return updated;
  }

  list(filter: Partial<SamlGroupMappingRecord> = {}, limit = 50): Promise<SamlGroupMappingRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
