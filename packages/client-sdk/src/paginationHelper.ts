import { PaginatedResponse, PaginationParams } from '@remotedesk/shared';

export function createPaginationParams(page = 1, limit = 20, cursor?: string): PaginationParams {
  return { page, limit, cursor };
}

export function mergePaginated<T>(a: PaginatedResponse<T>, b: PaginatedResponse<T>): PaginatedResponse<T> {
  return {
    data: [...a.data, ...b.data],
    page: b.page,
    limit: b.limit,
    total: b.total,
    nextCursor: b.nextCursor,
    hasMore: b.hasMore,
  };
}


