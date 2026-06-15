import type { InvoiceLineItemRecord, InvoiceLineItemRecordRepository } from "./invoiceLineItemsTypes.js";

export class InvoiceLineItemRecordService {
  constructor(private readonly repository: InvoiceLineItemRecordRepository) {}

  create(record: InvoiceLineItemRecord): Promise<InvoiceLineItemRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<InvoiceLineItemRecord>): Promise<InvoiceLineItemRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("invoiceLineItems-not-found");
    return updated;
  }

  list(filter: Partial<InvoiceLineItemRecord> = {}, limit = 50): Promise<InvoiceLineItemRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
