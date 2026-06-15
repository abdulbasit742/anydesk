import { RemoteDeskSDKError, mapHTTPStatusToError } from '@remotedesk/shared';

export function mapFetchError(err: unknown, requestId?: string): RemoteDeskSDKError {
  if (err instanceof RemoteDeskSDKError) return err;
  if (err instanceof Error) {
    if (err.message.includes('fetch') || err.message.includes('network')) {
      return new RemoteDeskSDKError('network_error', err.message, undefined, requestId);
    }
    if (err.name === 'AbortError') {
      return new RemoteDeskSDKError('timeout', 'Request timed out', undefined, requestId);
    }
    return new RemoteDeskSDKError('unknown', err.message, undefined, requestId);
  }
  return new RemoteDeskSDKError('unknown', 'Unknown error', undefined, requestId);
}


