import type { ReportDefinitionRecord, ReportDefinitionRecordRepository } from "./reportDefinitionsTypes.js";

export class ReportDefinitionRecordService {
  constructor(private readonly repository: ReportDefinitionRecordRepository) {}

  create(record: ReportDefinitionRecord): Promise<ReportDefinitionRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<ReportDefinitionRecord>): Promise<ReportDefinitionRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("reportDefinitions-not-found");
    return updated;
  }

  list(filter: Partial<ReportDefinitionRecord> = {}, limit = 50): Promise<ReportDefinitionRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
