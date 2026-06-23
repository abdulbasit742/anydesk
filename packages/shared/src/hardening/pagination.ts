export interface CursorPage<T> { items: T[]; nextCursor?: string; limit: number; }

export function encodeCursor(value: Record<string, unknown>): string {
  const json = JSON.stringify(value);
  return btoa(unescape(encodeURIComponent(json)));
}

export function decodeCursor(cursor: string | undefined): Record<string, unknown> | undefined {
  if (!cursor) return undefined;
  try {
    const json = decodeURIComponent(escape(atob(cursor)));
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return undefined;
  }
}

export function clampLimit(value: unknown, fallback = 50, max = 200): number {
  const n = Number(value);
  return Number.isFinite(n) ? Math.max(1, Math.min(max, Math.floor(n))) : fallback;
}
