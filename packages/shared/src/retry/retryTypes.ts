export type RetryBackoffOptions = {
  readonly baseDelayMs: number;
  readonly maxDelayMs: number;
  readonly multiplier: number;
  readonly jitterRatio: number;
};

export type RetryState = {
  readonly attempts: number;
  readonly maxAttempts: number;
  readonly lastError?: string;
};
