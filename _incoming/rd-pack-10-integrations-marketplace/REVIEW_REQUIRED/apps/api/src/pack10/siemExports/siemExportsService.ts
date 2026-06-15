import type { SiemExportRecord, SiemExportRecordRepository } from "./siemExportsTypes.js";

export class SiemExportRecordService {
  constructor(private readonly repository: SiemExportRecordRepository) {}

  create(record: SiemExportRecord): Promise<SiemExportRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<SiemExportRecord>): Promise<SiemExportRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("siemExports-not-found");
    return updated;
  }

  list(filter: Partial<SiemExportRecord> = {}, limit = 50): Promise<SiemExportRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
