export interface CursorPage<T> { items: T[]; nextCursor?: string; limit: number; }
export function encodeCursor(value: Record<string, unknown>): string { return btoa(JSON.stringify(value)); }
export function decodeCursor(cursor: string | undefined): Record<string, unknown> | undefined {
  if (!cursor) return undefined;
  try { return JSON.parse(atob(cursor)) as Record<string, unknown>; } catch { return undefined; }
}
export function clampLimit(value: unknown, fallback = 50, max = 200): number {
  const n = Number(value);
  return Number.isFinite(n) ? Math.max(1, Math.min(max, Math.floor(n))) : fallback;
}
