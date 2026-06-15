export interface WorkflowRunRecord {
  id: string; ruleId: string; eventId: string; status: 'queued' | 'running' | 'completed' | 'failed' | 'skipped'; startedAt?: string; finishedAt?: string;
}

export interface WorkflowRunRecordRepository {
  create(record: WorkflowRunRecord): Promise<WorkflowRunRecord>;
  update(id: string, patch: Partial<WorkflowRunRecord>): Promise<WorkflowRunRecord | null>;
  list(filter: Partial<WorkflowRunRecord>, limit: number): Promise<WorkflowRunRecord[]>;
}
