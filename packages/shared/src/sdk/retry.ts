export interface RetryConfig {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
  retryableCodes: string[];
}

export const defaultRetryConfig: RetryConfig = {
  maxRetries: 3,
  baseDelayMs: 500,
  maxDelayMs: 8000,
  backoffMultiplier: 2,
  retryableCodes: ['network_error', 'timeout', 'rate_limited', 'server_error'],
};

export function computeDelay(attempt: number, cfg: RetryConfig): number {
  const exp = cfg.baseDelayMs * Math.pow(cfg.backoffMultiplier, attempt);
  const jitter = Math.random() * 0.3 * exp;
  return Math.min(cfg.maxDelayMs, exp + jitter);
}

export function isRetryable(errorCode: string, cfg: RetryConfig): boolean {
  return cfg.retryableCodes.includes(errorCode);
}


