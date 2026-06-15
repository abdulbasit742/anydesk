export interface TestSuiteRecord {
  id: string; key: string; name: string; area: 'api' | 'web' | 'desktop' | 'infra' | 'security'; enabled: boolean; updatedAt: string;
}

export interface TestSuiteRecordRepository {
  create(record: TestSuiteRecord): Promise<TestSuiteRecord>;
  update(id: string, patch: Partial<TestSuiteRecord>): Promise<TestSuiteRecord | null>;
  list(filter: Partial<TestSuiteRecord>, limit: number): Promise<TestSuiteRecord[]>;
}
