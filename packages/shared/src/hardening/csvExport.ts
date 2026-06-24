export function escapeCsvCell(value: unknown): string {
  const text = value == null ? '' : String(value);
  return /[",\r\n]/.test(text) ? '"' + text.replace(/"/g, '""') + '"' : text;
}
export function toCsvRow(cells: unknown[]): string {
  return cells.map(escapeCsvCell).join(',') + '\r\n';
}
export function toCsvString(headers: string[], rows: unknown[][]): string {
  return toCsvRow(headers) + rows.map(r => toCsvRow(r)).join('');
}
