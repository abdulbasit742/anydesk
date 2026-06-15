export interface ManualQaChecklistRecord {
  id: string; releaseId?: string; name: string; required: boolean; completed: boolean; updatedAt: string;
}

export interface ManualQaChecklistRecordRepository {
  create(record: ManualQaChecklistRecord): Promise<ManualQaChecklistRecord>;
  update(id: string, patch: Partial<ManualQaChecklistRecord>): Promise<ManualQaChecklistRecord | null>;
  list(filter: Partial<ManualQaChecklistRecord>, limit: number): Promise<ManualQaChecklistRecord[]>;
}
