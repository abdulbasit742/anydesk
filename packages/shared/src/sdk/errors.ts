export type SDKErrorCode =
  | 'network_error'
  | 'timeout'
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'conflict'
  | 'rate_limited'
  | 'server_error'
  | 'validation_error'
  | 'unknown';

export class RemoteDeskSDKError extends Error {
  constructor(
    public code: SDKErrorCode,
    message: string,
    public status?: number,
    public requestId?: string
  ) {
    super(message);
    this.name = 'RemoteDeskSDKError';
  }
}

export function mapHTTPStatusToError(status: number, message: string, requestId?: string): RemoteDeskSDKError {
  const map: Record<number, SDKErrorCode> = {
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


