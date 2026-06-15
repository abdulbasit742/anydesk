import type { TestResultRecord, TestResultRecordRepository } from "./testResultsTypes.js";

export class TestResultRecordService {
  constructor(private readonly repository: TestResultRecordRepository) {}

  create(record: TestResultRecord): Promise<TestResultRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<TestResultRecord>): Promise<TestResultRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("testResults-not-found");
    return updated;
  }

  list(filter: Partial<TestResultRecord> = {}, limit = 50): Promise<TestResultRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
