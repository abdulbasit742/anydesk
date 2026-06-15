import { isRetryable, computeDelay, RemoteDeskSDKError, RetryConfig, defaultRetryConfig } from '@remotedesk/shared';

export async function withRetry<T>(
  fn: () => Promise<T>,
  cfg: RetryConfig = defaultRetryConfig,
  onRetry?: (attempt: number, error: RemoteDeskSDKError) => void
): Promise<T> {
  let lastErr: RemoteDeskSDKError | undefined;
  for (let i = 0; i <= cfg.maxRetries; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e instanceof RemoteDeskSDKError ? e : new RemoteDeskSDKError('unknown', String(e));
      if (i === cfg.maxRetries || !isRetryable(lastErr.code, cfg)) throw lastErr;
      const delay = computeDelay(i, cfg);
      onRetry?.(i + 1, lastErr);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastErr ?? new RemoteDeskSDKError('unknown', 'Retry exhausted');
}


