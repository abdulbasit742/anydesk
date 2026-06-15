# RemoteDesk Retry Policy

## Default Policy
```typescript
interface RetryPolicy {
  maxAttempts: number;      // 3
  baseDelay: number;        // 1000ms
  maxDelay: number;         // 30000ms
  backoffMultiplier: number; // 2
  retryableStatusCodes: number[]; // [408, 429, 500, 502, 503, 504]
}
```

## Backoff Strategy
```
Attempt 1: immediate
Attempt 2: 1000ms delay
Attempt 3: 2000ms delay
Attempt 4: 4000ms delay
Attempt 5: 8000ms delay (capped at maxDelay)
```

## Implementation
```typescript
async function withRetry<T>(
  operation: () => Promise<T>,
  policy: RetryPolicy = defaultPolicy
): Promise<T> {
  let lastError: Error | undefined;
  
  for (let attempt = 1; attempt <= policy.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (!isRetryable(error, policy)) {
        throw error;
      }
      
      if (attempt < policy.maxAttempts) {
        const delay = Math.min(
          policy.baseDelay * Math.pow(policy.backoffMultiplier, attempt - 1),
          policy.maxDelay
        );
        await sleep(delay + jitter(delay));
      }
    }
  }
  
  throw lastError;
}

function jitter(delay: number): number {
  return Math.random() * delay * 0.1; // 10% jitter
}

function isRetryable(error: unknown, policy: RetryPolicy): boolean {
  if (error instanceof RemoteDeskError) {
    return error.retryable;
  }
  if (error instanceof AxiosError) {
    return policy.retryableStatusCodes.includes(error.response?.status ?? 0);
  }
  return false;
}
```

## Per-Endpoint Policies
| Endpoint | Max Attempts | Base Delay |
|----------|:------------:|:----------:|
| Auth | 1 | - |
| Sessions | 3 | 1000ms |
| Upload | 5 | 2000ms |
| WebSocket | infinite | 1000ms |
