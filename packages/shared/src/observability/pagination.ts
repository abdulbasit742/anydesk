/**
 * Pagination, filtering, and sorting contracts for API endpoints.
 */

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface SortParams {
  sortBy: string;
  sortDirection: "asc" | "desc";
}

export interface DateRangeFilter {
  startDate?: string;
  endDate?: string;
}

export interface CommonFilters extends Partial<PaginationParams>, Partial<SortParams>, Partial<DateRangeFilter> {
  status?: string;
  severity?: string;
  category?: string;
  deviceId?: string;
  sessionId?: string;
  userId?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const DEFAULT_PAGE_SIZE = 25;
export const MAX_PAGE_SIZE = 100;

export function normalizePagination(params: Partial<PaginationParams>): PaginationParams {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, params.pageSize ?? DEFAULT_PAGE_SIZE));
  return { page, pageSize };
}
