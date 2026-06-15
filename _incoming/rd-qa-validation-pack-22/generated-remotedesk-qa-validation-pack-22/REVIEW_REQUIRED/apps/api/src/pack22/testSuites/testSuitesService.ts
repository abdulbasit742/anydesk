import type { TestSuiteRecord, TestSuiteRecordRepository } from "./testSuitesTypes.js";

export class TestSuiteRecordService {
  constructor(private readonly repository: TestSuiteRecordRepository) {}

  create(record: TestSuiteRecord): Promise<TestSuiteRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<TestSuiteRecord>): Promise<TestSuiteRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("testSuites-not-found");
    return updated;
  }

  list(filter: Partial<TestSuiteRecord> = {}, limit = 50): Promise<TestSuiteRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
