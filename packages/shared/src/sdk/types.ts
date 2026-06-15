export interface PaginationParams {
  page: number;
  limit: number;
  cursor?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  nextCursor?: string;
  hasMore: boolean;
}

export interface APIErrorDetail {
  code: string;
  message: string;
  field?: string;
  suggestion?: string;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: APIErrorDetail;
  meta?: { requestId: string; timestamp: number };
}


