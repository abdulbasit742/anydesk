const CSV_INJECTION = /^[=+\-@]/;

export function escapeCsvCell(value: unknown): string {
  const raw = String(value ?? "");
  const safe = CSV_INJECTION.test(raw) ? `'${raw}` : raw;
  return `"${safe.replace(/"/g, '""')}"`;
}

export function buildCsvRow(values: readonly unknown[]): string {
  return values.map(escapeCsvCell).join(",");
}
