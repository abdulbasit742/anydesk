import type { PaymentReceiptRecord, PaymentReceiptRecordRepository } from "./paymentReceiptsTypes.js";

export class PaymentReceiptRecordService {
  constructor(private readonly repository: PaymentReceiptRecordRepository) {}

  create(record: PaymentReceiptRecord): Promise<PaymentReceiptRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<PaymentReceiptRecord>): Promise<PaymentReceiptRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("paymentReceipts-not-found");
    return updated;
  }

  list(filter: Partial<PaymentReceiptRecord> = {}, limit = 50): Promise<PaymentReceiptRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
