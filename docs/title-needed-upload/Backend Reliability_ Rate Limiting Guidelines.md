# Backend Reliability: Rate Limiting Guidelines

Rate limiting is a critical security and reliability measure that prevents abuse, protects against Denial-of-Service (DoS) attacks, and ensures fair resource allocation among users. This document outlines the rate limiting strategy for the RemoteDesk backend.

## 1. Why Use Rate Limiting?

*   **Prevent Abuse:** Protect against brute-force attacks on login and other sensitive endpoints.
*   **DoS Protection:** Mitigate the impact of malicious or accidental floods of requests.
*   **Fair Usage:** Ensure that a single user or client cannot monopolize system resources.
*   **Cost Management:** Reduce infrastructure costs by limiting unnecessary or excessive API calls.
*   **System Stability:** Prevent backend services from being overwhelmed by high request volumes.

## 2. Rate Limiting Strategy

RemoteDesk will implement rate limiting at multiple levels:

### 2.1. Global Rate Limits

Applied to all incoming requests to the API gateway or load balancer.

*   **Goal:** Protect the entire system from massive floods.
*   **Example:** 10,000 requests per minute per IP address.

### 2.2. Per-User/Per-Client Rate Limits

Applied to requests from a specific authenticated user or client application.

*   **Goal:** Ensure fair usage and prevent individual accounts from causing issues.
*   **Example:** 100 requests per minute for standard users, higher for enterprise users.

### 2.3. Endpoint-Specific Rate Limits

Applied to specific, sensitive, or resource-intensive API endpoints.

*   **Goal:** Protect critical functionalities.
*   **Examples:**
    *   **Login:** 5 attempts per minute per IP/Email.
    *   **Session Initiation:** 10 requests per minute per user.
    *   **Password Reset:** 3 requests per hour per Email.

## 3. Implementation Details

RemoteDesk will use a **token bucket** or **fixed window** algorithm for rate limiting, typically implemented using a fast, in-memory store like Redis.

### 3.1. Rate Limit Headers

When a request is rate-limited, the server will return a `429 Too Many Requests` status code and include the following headers:

*   **`X-RateLimit-Limit`:** The maximum number of requests allowed in the current window.
*   **`X-RateLimit-Remaining`:** The number of requests remaining in the current window.
*   **`X-RateLimit-Reset`:** The time (in seconds) until the current window resets.
*   **`Retry-After`:** (Optional) The time (in seconds) the client should wait before retrying.

### 3.2. Example Implementation (Conceptual Middleware)

```typescript
// apps/api/src/middleware/rateLimit.ts

import { Request, Response, NextFunction } from 'express';
import { redisClient } from '../lib/redis';

export const rateLimiter = (options: { limit: number; windowSeconds: number }) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = `rate_limit:${req.ip}:${req.path}`;
    const current = await redisClient.incr(key);

    if (current === 1) {
      await redisClient.expire(key, options.windowSeconds);
    }

    if (current > options.limit) {
      const ttl = await redisClient.ttl(key);
      res.set('X-RateLimit-Limit', options.limit.toString());
      res.set('X-RateLimit-Remaining', '0');
      res.set('X-RateLimit-Reset', ttl.toString());
      res.set('Retry-After', ttl.toString());
      return res.status(429).send({ error: 'Too many requests' });
    }

    res.set('X-RateLimit-Limit', options.limit.toString());
    res.set('X-RateLimit-Remaining', (options.limit - current).toString());
    next();
  };
};
```

## 4. Testing Rate Limiting

### 4.1. Unit Tests

*   Test the rate limiting logic (e.g., the `rateLimiter` function) in isolation using a mock Redis client.
*   Verify that it correctly increments counts and returns the expected status codes and headers when the limit is exceeded.

### 4.2. Integration Tests

*   Perform actual API requests to endpoints with rate limiting enabled.
*   Verify that the limits are enforced correctly and that the Redis state is updated as expected.
*   Test with multiple concurrent requests to ensure thread safety.

### 4.3. Load Testing

*   Simulate high volumes of requests to verify that the rate limiting mechanism itself doesn't become a bottleneck.
*   Ensure that the system remains stable and responsive even when under heavy rate-limiting pressure.

## 5. Monitoring and Alerting

*   **Log Rate Limit Events:** Log every `429 Too Many Requests` response, including the IP address, user ID, and endpoint.
*   **Metric Collection:** Track the rate of `429` errors to identify potential attacks or misconfigured clients.
*   **Alerting:** Set up alerts if the rate of `429` errors spikes significantly.

## 6. Related Documents

*   `backend-reliability-retry-policy.md`
*   `error-handling-conventions.md`
*   `audit-log-structure.md`
*   `security-developer-best-practices.md`
