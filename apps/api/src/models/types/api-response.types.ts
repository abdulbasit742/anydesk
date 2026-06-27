export type ApiResponse<T> = { success: true; data: T; meta?: { page?: number; limit?: number; total?: number } } | { success: false; error: string; code?: string; details?: any };
export type PaginatedResponse<T> = { items: T[]; page: number; limit: number; total: number; totalPages: number; hasNext: boolean; hasPrev: boolean };
export type SortOrder = "asc" | "desc";
export type FilterOperator = "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "contains" | "startsWith";
