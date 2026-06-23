export function escapeCsvCell(value: unknown): string {
  const text = value == null ? "" : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function toCsv(
  rows: readonly Record<string, unknown>[],
  columns: readonly string[]
): string {
  const header = columns.map(escapeCsvCell).join(",");
  const body = rows.map((row) =>
    columns.map((col) => escapeCsvCell(row[col])).join(",")
  );
  return [header, ...body].join("\n");
}
