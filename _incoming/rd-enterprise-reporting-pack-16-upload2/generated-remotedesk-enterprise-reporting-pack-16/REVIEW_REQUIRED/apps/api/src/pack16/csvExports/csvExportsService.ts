import type { CsvExportRecord, CsvExportRecordRepository } from "./csvExportsTypes.js";

export class CsvExportRecordService {
  constructor(private readonly repository: CsvExportRecordRepository) {}

  create(record: CsvExportRecord): Promise<CsvExportRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<CsvExportRecord>): Promise<CsvExportRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("csvExports-not-found");
    return updated;
  }

  list(filter: Partial<CsvExportRecord> = {}, limit = 50): Promise<CsvExportRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
