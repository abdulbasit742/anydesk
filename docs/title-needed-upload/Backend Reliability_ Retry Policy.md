# Backend Reliability: Retry Policy

In a distributed system like RemoteDesk, transient failures (e.g., network glitches, temporary service unavailability, database timeouts) are inevitable. Implementing a robust retry policy is essential for improving the reliability and resilience of our backend services. This document outlines the standardized retry policy for RemoteDesk.

## 1. Principles for Retries

*   **Only Retry Idempotent Operations:** Retrying non-idempotent operations (e.g., a POST request that creates a new record) can lead to duplicate data or unintended side effects. Ensure the operation being retried is idempotent or use idempotency keys (refer to `backend-reliability-idempotency.md`).
*   **Use Exponential Backoff:** Avoid overwhelming a struggling service by increasing the delay between successive retry attempts exponentially.
*   **Add Jitter:** Introduce randomness to the retry delays to prevent "thundering herd" problems where many clients retry at the exact same time.
*   **Set a Maximum Number of Retries:** Do not retry indefinitely. Define a reasonable limit based on the operation's criticality and expected recovery time.
*   **Distinguish Between Retryable and Non-Retryable Errors:** Only retry errors that are likely to be transient (e.g., 503 Service Unavailable, 504 Gateway Timeout, network timeouts). Do not retry client errors (e.g., 400 Bad Request, 401 Unauthorized, 404 Not Found).
*   **Monitor and Log Retries:** Track the number of retries and their outcomes to identify persistent issues and optimize the retry policy.

## 2. Standard Retry Strategy

RemoteDesk will use a standard exponential backoff with jitter strategy for most transient failures.

### 2.1. Parameters

*   **`max_retries`:** 3 (Default)
*   **`initial_delay_ms`:** 100ms
*   **`max_delay_ms`:** 5000ms
*   **`backoff_factor`:** 2
*   **`jitter_factor`:** 0.1 (10% randomness)

### 2.2. Calculation Formula

`delay = min(max_delay, (initial_delay * (backoff_factor ^ attempt)) * (1 + random(-jitter_factor, jitter_factor)))`

## 3. Implementation Guidelines

### 3.1. Identifying Retryable Errors

The following types of errors are generally considered retryable:

*   **Network Errors:** Connection timeouts, DNS resolution failures, socket hangups.
*   **HTTP 5xx Errors:** 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout.
*   **Database Transient Errors:** Connection pool exhaustion, deadlocks (if safe to retry), temporary timeouts.
*   **Rate Limiting (429 Too Many Requests):** Only if a `Retry-After` header is provided or if using a conservative backoff.

### 3.2. Example Implementation (Conceptual TypeScript)

```typescript
async function withRetry<T>(
  operation: () => Promise<T>,
  options: { maxRetries?: number; initialDelay?: number } = {}
): Promise<T> {
  const { maxRetries = 3, initialDelay = 100 } = options;
  let attempt = 0;

  while (attempt <= maxRetries) {
    try {
      return await operation();
    } catch (error) {
      if (!isRetryable(error) || attempt === maxRetries) {
        throw error;
      }
      
      const delay = calculateDelay(attempt, initialDelay);
      await new Promise(resolve => setTimeout(resolve, delay));
      attempt++;
    }
  }
  throw new Error("Max retries exceeded");
}

function isRetryable(error: any): boolean {
  // Logic to determine if the error is transient and safe to retry
  // e.g., check HTTP status codes, error codes, etc.
  return error.status === 503 || error.code === 'ECONNRESET';
}
```

## 4. Specific Use Cases

*   **API Calls to External Services:** Always use retries for calls to third-party APIs (e.g., payment gateways, email services).
*   **Inter-Service Communication:** Implement retries for requests between internal microservices.
*   **Database Operations:** Use retries for transient database errors, ensuring the operations are wrapped in transactions if necessary.
*   **Signaling Server Communication:** The signaling server should handle transient connection issues with retries.

## 5. Monitoring and Alerting

*   **Log Retry Events:** Log each retry attempt, including the operation, the error, and the delay.
*   **Metric Collection:** Track the number of successful retries vs. final failures.
*   **Alerting:** Set up alerts if the retry rate exceeds a certain threshold, indicating a potential systemic issue.

## 6. Related Documents

*   `backend-reliability-idempotency.md`
*   `backend-reliability-transactions.md`
*   `backend-reliability-timeouts.md`
*   `error-handling-conventions.md`
*   `logging-conventions.md`
