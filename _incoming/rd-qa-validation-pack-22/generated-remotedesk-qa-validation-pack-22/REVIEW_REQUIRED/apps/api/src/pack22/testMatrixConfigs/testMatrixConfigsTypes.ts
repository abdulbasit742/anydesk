export interface TestMatrixConfigRecord {
  id: string; key: string; axes: Array<{ name: string; values: string[] }>; maxCases: number; updatedAt: string;
}

export interface TestMatrixConfigRecordRepository {
  create(record: TestMatrixConfigRecord): Promise<TestMatrixConfigRecord>;
  update(id: string, patch: Partial<TestMatrixConfigRecord>): Promise<TestMatrixConfigRecord | null>;
  list(filter: Partial<TestMatrixConfigRecord>, limit: number): Promise<TestMatrixConfigRecord[]>;
}
