export type ReconnectDecision =
  | { readonly action: 'wait'; readonly delayMs: number; readonly attempt: number }
  | { readonly action: 'give-up'; readonly attempt: number; readonly reason: string };

export function nextReconnectDecision(input: {
  readonly attempt: number;
  readonly maxAttempts: number;
  readonly baseDelayMs: number;
  readonly maxDelayMs: number;
  readonly jitterRatio?: number;
  readonly random?: () => number;
}): ReconnectDecision {
  if (input.attempt >= input.maxAttempts) return { action: 'give-up', attempt: input.attempt, reason: 'maximum reconnect attempts reached' };
  const jitterRatio = input.jitterRatio ?? 0.2;
  const random = input.random ?? Math.random;
  const exponential = Math.min(input.maxDelayMs, input.baseDelayMs * 2 ** input.attempt);
  const jitter = exponential * jitterRatio * (random() * 2 - 1);
  return { action: 'wait', delayMs: Math.max(0, Math.round(exponential + jitter)), attempt: input.attempt + 1 };
}
