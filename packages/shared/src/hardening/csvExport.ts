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
