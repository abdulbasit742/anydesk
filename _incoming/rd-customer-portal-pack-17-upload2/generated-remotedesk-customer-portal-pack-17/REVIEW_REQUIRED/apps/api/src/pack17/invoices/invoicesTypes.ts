export interface InvoiceRecord {
  id: string; teamId: string; number: string; status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible'; totalCents: number; createdAt: string;
}

export interface InvoiceRecordRepository {
  create(record: InvoiceRecord): Promise<InvoiceRecord>;
  update(id: string, patch: Partial<InvoiceRecord>): Promise<InvoiceRecord | null>;
  list(filter: Partial<InvoiceRecord>, limit: number): Promise<InvoiceRecord[]>;
}
