export interface ApiSuccess<T> {
  ok: true;
  data: T;
  requestId?: string;
}

export interface ApiFailure {
  ok: false;
  error: {
    code: string;
    message: string;
    requestId?: string;
    details?: unknown;
  };
}

export type ApiEnvelope<T> = ApiSuccess<T> | ApiFailure;

export function successEnvelope<T>(data: T, requestId?: string): ApiSuccess<T> {
  return { ok: true, data, requestId };
}

export function failureEnvelope(code: string, message: string, requestId?: string, details?: unknown): ApiFailure {
  return { ok: false, error: { code, message, requestId, details } };
}
