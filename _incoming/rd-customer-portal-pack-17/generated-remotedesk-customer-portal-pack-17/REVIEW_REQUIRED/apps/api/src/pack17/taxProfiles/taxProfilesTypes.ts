export interface TaxProfileRecord {
  id: string; teamId: string; countryCode: string; stateOrProvince?: string; taxIdMasked?: string; updatedAt: string;
}

export interface TaxProfileRecordRepository {
  create(record: TaxProfileRecord): Promise<TaxProfileRecord>;
  update(id: string, patch: Partial<TaxProfileRecord>): Promise<TaxProfileRecord | null>;
  list(filter: Partial<TaxProfileRecord>, limit: number): Promise<TaxProfileRecord[]>;
}
