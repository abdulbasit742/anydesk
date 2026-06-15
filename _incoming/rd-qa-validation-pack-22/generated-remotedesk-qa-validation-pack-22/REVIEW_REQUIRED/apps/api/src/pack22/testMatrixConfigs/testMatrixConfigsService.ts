import type { TestMatrixConfigRecord, TestMatrixConfigRecordRepository } from "./testMatrixConfigsTypes.js";

export class TestMatrixConfigRecordService {
  constructor(private readonly repository: TestMatrixConfigRecordRepository) {}

  create(record: TestMatrixConfigRecord): Promise<TestMatrixConfigRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<TestMatrixConfigRecord>): Promise<TestMatrixConfigRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("testMatrixConfigs-not-found");
    return updated;
  }

  list(filter: Partial<TestMatrixConfigRecord> = {}, limit = 50): Promise<TestMatrixConfigRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
