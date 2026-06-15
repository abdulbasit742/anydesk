import type { DepartmentRecord, DepartmentRecordRepository } from "./departmentsTypes.js";

export class DepartmentRecordService {
  constructor(private readonly repository: DepartmentRecordRepository) {}

  create(record: DepartmentRecord): Promise<DepartmentRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<DepartmentRecord>): Promise<DepartmentRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("departments-not-found");
    return updated;
  }

  list(filter: Partial<DepartmentRecord> = {}, limit = 50): Promise<DepartmentRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
