import type { InvoiceRecord, InvoiceRecordRepository } from "./invoicesTypes.js";

export class InvoiceRecordService {
  constructor(private readonly repository: InvoiceRecordRepository) {}

  create(record: InvoiceRecord): Promise<InvoiceRecord> {
    return this.repository.create(record);
  }

  async update(id: string, patch: Partial<InvoiceRecord>): Promise<InvoiceRecord> {
    const updated = await this.repository.update(id, patch);
    if (!updated) throw new Error("invoices-not-found");
    return updated;
  }

  list(filter: Partial<InvoiceRecord> = {}, limit = 50): Promise<InvoiceRecord[]> {
    return this.repository.list(filter, Math.max(1, Math.min(200, limit)));
  }
}
