import type { WorkflowApprovalRecord, WorkflowApprovalRecordRepository } from "./workflowApprovalsTypes.js";

export class WorkflowApprovalRecordService {
  constructor(private readonly repository: WorkflowApprovalRecordRepository) {}

  create(record: WorkflowApprovalRecord): Promise<WorkflowApprovalRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<WorkflowApprovalRecord>): Promise<WorkflowApprovalRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("workflowApprovals-not-found");
    return updated;
  }

  list(filter: Partial<WorkflowApprovalRecord> = {}, limit = 50): Promise<WorkflowApprovalRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
