export interface TestRunRecord {
  id: string; suiteId: string; releaseId?: string; status: 'queued' | 'running' | 'completed' | 'failed'; startedAt?: string; finishedAt?: string;
}

export interface TestRunRecordRepository {
  create(record: TestRunRecord): Promise<TestRunRecord>;
  update(id: string, patch: Partial<TestRunRecord>): Promise<TestRunRecord | null>;
  list(filter: Partial<TestRunRecord>, limit: number): Promise<TestRunRecord[]>;
}
