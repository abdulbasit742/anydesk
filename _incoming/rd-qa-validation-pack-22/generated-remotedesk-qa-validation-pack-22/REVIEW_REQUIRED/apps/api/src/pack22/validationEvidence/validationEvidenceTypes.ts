export interface ValidationEvidenceRecord {
  id: string; runId?: string; releaseId?: string; kind: string; objectKey: string; sha256: string; createdAt: string;
}

export interface ValidationEvidenceRecordRepository {
  create(record: ValidationEvidenceRecord): Promise<ValidationEvidenceRecord>;
  update(id: string, patch: Partial<ValidationEvidenceRecord>): Promise<ValidationEvidenceRecord | null>;
  list(filter: Partial<ValidationEvidenceRecord>, limit: number): Promise<ValidationEvidenceRecord[]>;
}
