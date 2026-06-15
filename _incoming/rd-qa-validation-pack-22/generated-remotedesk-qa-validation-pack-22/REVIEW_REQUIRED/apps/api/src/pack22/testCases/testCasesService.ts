import type { TestCaseRecord, TestCaseRecordRepository } from "./testCasesTypes.js";

export class TestCaseRecordService {
  constructor(private readonly repository: TestCaseRecordRepository) {}

  create(record: TestCaseRecord): Promise<TestCaseRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<TestCaseRecord>): Promise<TestCaseRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("testCases-not-found");
    return updated;
  }

  list(filter: Partial<TestCaseRecord> = {}, limit = 50): Promise<TestCaseRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
