export interface CursorPage<T> { items: T[]; nextCursor?: string; limit: number; }
export function encodeCursor(value: Record<string, unknown>): string { return Buffer.from(JSON.stringify(value), 'utf8').toString('base64url'); }
export function decodeCursor(cursor: string | undefined): Record<string, unknown> | undefined {
  if (!cursor) return undefined;
  try { return JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8')) as Record<string, unknown>; } catch { return undefined; }
}
export function clampLimit(value: unknown, fallback = 50, max = 200): number {
  const n = Number(value);
  return Number.isFinite(n) ? Math.max(1, Math.min(max, Math.floor(n))) : fallback;
}
