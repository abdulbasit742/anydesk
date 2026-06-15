import { SDKConfig } from './types.js';
import { mapFetchError } from './errorMapper.js';
import { withRetry } from './retryHelper.js';
import { RemoteDeskSDKError, PaginatedResponse, APIResponse } from '@remotedesk/shared';

export class HTTPClient {
  constructor(private cfg: SDKConfig) {}

  private async request<T>(method: string, path: string, body?: unknown, headers?: Record<string, string>): Promise<T> {
    const url = `${this.cfg.baseURL}/api/${this.cfg.apiVersion}${path}`;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), this.cfg.timeoutMs);
    try {
      const res = await withRetry(
        () =>
          fetch(url, {
            method,
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              ...headers,
            },
            body: body ? JSON.stringify(body) : undefined,
            signal: ctrl.signal,
          }),
        this.cfg.retry
      );
      clearTimeout(timer);
      const requestId = res.headers.get('x-request-id') ?? undefined;
      if (!res.ok) {
        const text = await res.text();
        throw mapHTTPStatusToError(res.status, text, requestId);
      }
      const json = (await res.json()) as APIResponse<T>;
      if (!json.success) throw new RemoteDeskSDKError(json.error?.code as any ?? 'unknown', json.error?.message ?? 'API error', res.status, requestId);
      return json.data as T;
    } catch (e) {
      clearTimeout(timer);
      throw mapFetchError(e);
    }
  }

  get<T>(path: string, headers?: Record<string, string>) { return this.request<T>('GET', path, undefined, headers); }
  post<T>(path: string, body: unknown, headers?: Record<string, string>) { return this.request<T>('POST', path, body, headers); }
  patch<T>(path: string, body: unknown, headers?: Record<string, string>) { return this.request<T>('PATCH', path, body, headers); }
  delete<T>(path: string, headers?: Record<string, string>) { return this.request<T>('DELETE', path, undefined, headers); }
}

function mapHTTPStatusToError(status: number, message: string, requestId?: string): RemoteDeskSDKError {
  const map: Record<number, any> = {
    400: 'validation_error',
    401: 'unauthorized',
    403: 'forbidden',
    404: 'not_found',
    409: 'conflict',
    429: 'rate_limited',
    500: 'server_error',
    502: 'server_error',
    503: 'server_error',
  };
  return new RemoteDeskSDKError(map[status] ?? 'unknown', message, status, requestId);
}


