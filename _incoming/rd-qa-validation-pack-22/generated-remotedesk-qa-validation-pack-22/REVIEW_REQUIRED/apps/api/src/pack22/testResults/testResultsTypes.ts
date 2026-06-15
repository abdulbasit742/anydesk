export interface TestResultRecord {
  id: string; runId: string; caseId: string; status: 'passed' | 'failed' | 'blocked' | 'flaky'; durationMs: number; failureMessage?: string;
}

export interface TestResultRecordRepository {
  create(record: TestResultRecord): Promise<TestResultRecord>;
  update(id: string, patch: Partial<TestResultRecord>): Promise<TestResultRecord | null>;
  list(filter: Partial<TestResultRecord>, limit: number): Promise<TestResultRecord[]>;
}
