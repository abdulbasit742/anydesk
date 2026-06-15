export interface InvoiceLine {
  description: string;
  quantity: number;
  unitCents: number;
}

export function invoiceSubtotalCents(lines: readonly InvoiceLine[]): number {
  return lines.reduce((sum, line) => sum + Math.max(0, line.quantity) * Math.max(0, line.unitCents), 0);
}

export function invoiceTotalCents(lines: readonly InvoiceLine[], taxCents: number, discountCents: number): number {
  return Math.max(0, invoiceSubtotalCents(lines) + Math.max(0, taxCents) - Math.max(0, discountCents));
}
