export interface WorkflowApprovalRecord {
  id: string; runId: string; state: 'pending' | 'approved' | 'rejected' | 'expired'; requestedByUserId: string; approverUserId?: string; createdAt: string;
}

export interface WorkflowApprovalRecordRepository {
  create(record: WorkflowApprovalRecord): Promise<WorkflowApprovalRecord>;
  update(id: string, patch: Partial<WorkflowApprovalRecord>): Promise<WorkflowApprovalRecord | null>;
  list(filter: Partial<WorkflowApprovalRecord>, limit: number): Promise<WorkflowApprovalRecord[]>;
}
