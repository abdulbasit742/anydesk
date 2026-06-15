export interface PaymentReceiptRecord {
  id: string; teamId: string; invoiceId: string; amountCents: number; providerReceiptId: string; createdAt: string;
}

export interface PaymentReceiptRecordRepository {
  create(record: PaymentReceiptRecord): Promise<PaymentReceiptRecord>;
  update(id: string, patch: Partial<PaymentReceiptRecord>): Promise<PaymentReceiptRecord | null>;
  list(filter: Partial<PaymentReceiptRecord>, limit: number): Promise<PaymentReceiptRecord[]>;
}
