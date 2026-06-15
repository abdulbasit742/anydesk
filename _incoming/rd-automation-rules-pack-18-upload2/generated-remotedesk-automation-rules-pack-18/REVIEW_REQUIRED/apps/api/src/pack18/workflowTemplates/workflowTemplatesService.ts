import type { WorkflowTemplateRecord, WorkflowTemplateRecordRepository } from "./workflowTemplatesTypes.js";

export class WorkflowTemplateRecordService {
  constructor(private readonly repository: WorkflowTemplateRecordRepository) {}

  create(record: WorkflowTemplateRecord): Promise<WorkflowTemplateRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<WorkflowTemplateRecord>): Promise<WorkflowTemplateRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("workflowTemplates-not-found");
    return updated;
  }

  list(filter: Partial<WorkflowTemplateRecord> = {}, limit = 50): Promise<WorkflowTemplateRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
