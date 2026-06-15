import type { WorkflowRunRecord, WorkflowRunRecordRepository } from "./workflowRunsTypes.js";

export class WorkflowRunRecordService {
  constructor(private readonly repository: WorkflowRunRecordRepository) {}

  create(record: WorkflowRunRecord): Promise<WorkflowRunRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<WorkflowRunRecord>): Promise<WorkflowRunRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("workflowRuns-not-found");
    return updated;
  }

  list(filter: Partial<WorkflowRunRecord> = {}, limit = 50): Promise<WorkflowRunRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
