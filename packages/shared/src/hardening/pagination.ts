export interface PaginationParams {
  cursor?: string;
  limit: number;
  direction?: 'forward' | 'backward';
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

export function decodeCursor(cursor: string): Record<string, unknown> {
  try {
    return JSON.parse(atob(cursor));
  } catch {
    return {};
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
