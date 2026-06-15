export interface TestCaseRecord {
  id: string; suiteId: string; key: string; title: string; priority: 'p0' | 'p1' | 'p2' | 'p3'; automated: boolean; updatedAt: string;
}

export interface TestCaseRecordRepository {
  create(record: TestCaseRecord): Promise<TestCaseRecord>;
  update(id: string, patch: Partial<TestCaseRecord>): Promise<TestCaseRecord | null>;
  list(filter: Partial<TestCaseRecord>, limit: number): Promise<TestCaseRecord[]>;
}
