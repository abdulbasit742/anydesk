export function normalizeInvoiceNumber(value: string): string {
  return value.trim().toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 40);
}

export function buildInvoiceNumber(prefix: string, sequence: number): string {
  return `${normalizeInvoiceNumber(prefix)}-${String(sequence).padStart(6, "0")}`;
}
