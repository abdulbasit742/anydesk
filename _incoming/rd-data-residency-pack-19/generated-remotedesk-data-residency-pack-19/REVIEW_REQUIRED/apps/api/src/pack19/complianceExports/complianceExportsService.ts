import type { ComplianceExportRecord, ComplianceExportRecordRepository } from "./complianceExportsTypes.js";

export class ComplianceExportRecordService {
  constructor(private readonly repository: ComplianceExportRecordRepository) {}

  create(record: ComplianceExportRecord): Promise<ComplianceExportRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<ComplianceExportRecord>): Promise<ComplianceExportRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("complianceExports-not-found");
    return updated;
  }

  list(filter: Partial<ComplianceExportRecord> = {}, limit = 50): Promise<ComplianceExportRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
