export interface PaginationParams {
  cursor?: string;
  limit: number;
  direction?: 'forward' | 'backward';
}

export interface CursorPage<T> {
  items: T[];
  nextCursor?: string;
  limit: number;
}

export interface PaginatedResult<T> {
  items: T[];
  nextCursor?: string;
  prevCursor?: string;
  hasMore: boolean;
  total?: number;
}

export function encodeCursor(data: Record<string, unknown>): string {
  return btoa(JSON.stringify(data));
}

export function decodeCursor(cursor: string | undefined): Record<string, unknown> | undefined {
  if (!cursor) return undefined;
  try {
    return JSON.parse(atob(cursor)) as Record<string, unknown>;
  } catch {
    return undefined;
  }
}

export function buildPaginatedResponse<T>(
  items: T[],
  limit: number,
  cursorField: keyof T
): PaginatedResult<T> {
  const hasMore = items.length > limit;
  const sliced = hasMore ? items.slice(0, limit) : items;
  const lastItem = sliced[sliced.length - 1];
  const nextCursor = hasMore && lastItem
    ? encodeCursor({ id: lastItem[cursorField] })
    : undefined;

  return { items: sliced, nextCursor, hasMore };
}

export function clampLimit(value: unknown, fallback = 50, max = 200): number {
  const n = Number(value);
  return Number.isFinite(n) ? Math.max(1, Math.min(max, Math.floor(n))) : fallback;
}
