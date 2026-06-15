export interface InvoiceLineItemRecord {
  id: string; invoiceId: string; description: string; quantity: number; unitCents: number;
}

export interface InvoiceLineItemRecordRepository {
  create(record: InvoiceLineItemRecord): Promise<InvoiceLineItemRecord>;
  update(id: string, patch: Partial<InvoiceLineItemRecord>): Promise<InvoiceLineItemRecord | null>;
  list(filter: Partial<InvoiceLineItemRecord>, limit: number): Promise<InvoiceLineItemRecord[]>;
}
