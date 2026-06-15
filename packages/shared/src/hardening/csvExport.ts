export function escapeCsvCell(value: unknown): string {
  const text = value == null ? '' : String(value);
  return /[",
]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}
export function toCsv(rows: readonly Record<string, unknown>[], columns: readonly string[]): string {
  return [columns.map(escapeCsvCell).join(','), ...rows.map(row => columns.map(col => escapeCsvCell(row[col])).join(','))].join('
');
}
