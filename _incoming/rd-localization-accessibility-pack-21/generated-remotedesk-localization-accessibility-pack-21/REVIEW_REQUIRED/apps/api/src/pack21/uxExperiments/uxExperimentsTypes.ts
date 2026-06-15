export interface UxExperimentRecord {
  id: string; key: string; variant: string; enabled: boolean; rolloutPercent: number; updatedAt: string;
}

export interface UxExperimentRecordRepository {
  create(record: UxExperimentRecord): Promise<UxExperimentRecord>;
  update(id: string, patch: Partial<UxExperimentRecord>): Promise<UxExperimentRecord | null>;
  list(filter: Partial<UxExperimentRecord>, limit: number): Promise<UxExperimentRecord[]>;
}
