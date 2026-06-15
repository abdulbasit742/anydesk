import type { TestRunRecord, TestRunRecordRepository } from "./testRunsTypes.js";

export class TestRunRecordService {
  constructor(private readonly repository: TestRunRecordRepository) {}

  create(record: TestRunRecord): Promise<TestRunRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<TestRunRecord>): Promise<TestRunRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("testRuns-not-found");
    return updated;
  }

  list(filter: Partial<TestRunRecord> = {}, limit = 50): Promise<TestRunRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
