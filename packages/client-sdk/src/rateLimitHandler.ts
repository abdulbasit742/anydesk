export interface RateLimitState {
  remaining: number;
  resetAt: number;
  limit: number;
}

export function parseRateLimitHeaders(headers: Headers): RateLimitState {
  return {
    remaining: parseInt(headers.get('x-ratelimit-remaining') ?? '0', 10),
    resetAt: parseInt(headers.get('x-ratelimit-reset') ?? '0', 10) * 1000,
    limit: parseInt(headers.get('x-ratelimit-limit') ?? '0', 10),
  };
}

export function waitForReset(state: RateLimitState): Promise<void> {
  const delay = Math.max(0, state.resetAt - Date.now());
  return new Promise((r) => setTimeout(r, delay + 100));
}


