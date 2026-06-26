export function sanitizeCsvCell(cell: string): string {
  const dangerous = /^[=+\-@\t\r]/;
  if (dangerous.test(cell)) {
    return "'" + cell;
  }
  if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
    return '"' + cell.replace(/"/g, '""') + '"';
  }
  return cell;
}

export function buildCsvRow(cells: string[]): string {
  return cells.map(sanitizeCsvCell).join(',');
}

export function buildCsvDocument(headers: string[], rows: string[][]): string {
  const headerLine = buildCsvRow(headers);
  const dataLines = rows.map(buildCsvRow);
  return [headerLine, ...dataLines].join('\n') + '\n';
}

export function escapeCsvCell(value: unknown): string {
  const text = value == null ? '' : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function toCsv(rows: readonly Record<string, unknown>[], columns: readonly string[]): string {
  return [columns.map(escapeCsvCell).join(','), ...rows.map(row => columns.map(col => escapeCsvCell(row[col])).join(','))].join('\n');
}
