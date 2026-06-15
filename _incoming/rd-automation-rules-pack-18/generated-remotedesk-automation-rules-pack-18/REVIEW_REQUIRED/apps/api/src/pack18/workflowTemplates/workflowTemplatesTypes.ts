export interface WorkflowTemplateRecord {
  id: string; key: string; title: string; trigger: string; actions: string[]; enabled: boolean;
}

export interface WorkflowTemplateRecordRepository {
  create(record: WorkflowTemplateRecord): Promise<WorkflowTemplateRecord>;
  update(id: string, patch: Partial<WorkflowTemplateRecord>): Promise<WorkflowTemplateRecord | null>;
  list(filter: Partial<WorkflowTemplateRecord>, limit: number): Promise<WorkflowTemplateRecord[]>;
}
