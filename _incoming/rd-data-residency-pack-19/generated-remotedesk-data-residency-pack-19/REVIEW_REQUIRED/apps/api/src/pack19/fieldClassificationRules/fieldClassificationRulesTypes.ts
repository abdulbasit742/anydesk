export interface FieldClassificationRuleRecord {
  id: string; tenantId: string; resourceType: string; fieldName: string; classification: string; encrypted: boolean; updatedAt: string;
}

export interface FieldClassificationRuleRecordRepository {
  create(record: FieldClassificationRuleRecord): Promise<FieldClassificationRuleRecord>;
  update(id: string, patch: Partial<FieldClassificationRuleRecord>): Promise<FieldClassificationRuleRecord | null>;
  list(filter: Partial<FieldClassificationRuleRecord>, limit: number): Promise<FieldClassificationRuleRecord[]>;
}
