# Backend Reliability: Idempotency Key Helper

Idempotency ensures that an operation can be performed multiple times without changing the result beyond the initial application. This is crucial for safely retrying operations that might have failed due to transient network issues. This document outlines the design and implementation of an idempotency key helper for the RemoteDesk backend.

## 1. Why Idempotency?

In a distributed system, a client might send a request, but the network connection could fail before the client receives the response. Without idempotency, if the client retries the request, the server might perform the action twice (e.g., creating two sessions, charging a user twice). By using an idempotency key, the server can recognize the retried request and return the same response as the first successful attempt without repeating the action.

## 2. Idempotency Key Strategy

RemoteDesk will use the following strategy for idempotency:

1.  **Client-Generated Key:** The client generates a unique, random string (e.g., a UUID) for each request that needs to be idempotent and sends it in a custom header (e.g., `X-Idempotency-Key`).
2.  **Server-Side Storage:** The server stores the idempotency key along with the corresponding response for a certain period (e.g., 24 hours).
3.  **Request Handling:**
    *   If the key is new, the server processes the request, stores the key and the response, and returns the response.
    *   If the key is already in storage, the server returns the stored response without re-processing the request.
    *   If the key is currently being processed by another request, the server returns a conflict error (e.g., 409 Conflict).

## 3. Idempotency Key Helper (Skeleton)

This skeleton demonstrates how an idempotency helper could be implemented in the backend (e.g., using Node.js/Express and Redis for storage).

### 3.1. Idempotency Middleware

```typescript
// apps/api/src/middleware/idempotency.ts

import { Request, Response, NextFunction } from 'express';
import { redisClient } from '../lib/redis';

export async function idempotencyMiddleware(req: Request, res: Response, next: NextFunction) {
  const idempotencyKey = req.headers['x-idempotency-key'] as string;

  if (!idempotencyKey) {
    return next();
  }

  try {
    const cachedResponse = await redisClient.get(`idempotency:${idempotencyKey}`);

    if (cachedResponse) {
      const { status, body, headers } = JSON.parse(cachedResponse);
      res.set(headers);
      return res.status(status).send(body);
    }

    // Mark as processing to prevent concurrent requests with the same key
    const wasSet = await redisClient.set(
      `idempotency_lock:${idempotencyKey}`,
      'processing',
      'EX',
      60, // 1-minute lock
      'NX'
    );

    if (!wasSet) {
      return res.status(409).send({ error: 'Request already in progress' });
    }

    // Wrap res.send to capture the response and store it
    const originalSend = res.send;
    res.send = function (body) {
      const responseData = {
        status: res.statusCode,
        body: body,
        headers: res.getHeaders(),
      };

      // Store response in Redis with an expiration
      redisClient.set(
        `idempotency:${idempotencyKey}`,
        JSON.stringify(responseData),
        'EX',
        86400 // 24-hour expiration
      );

      // Remove the lock
      redisClient.del(`idempotency_lock:${idempotencyKey}`);

      return originalSend.call(this, body);
    };

    next();
  } catch (error) {
    console.error('Idempotency error:', error);
    next(); // Continue without idempotency if Redis fails
  }
}
```

### 3.2. Usage in Routes

```typescript
// apps/api/src/routes/sessions.ts

import express from 'express';
import { idempotencyMiddleware } from '../middleware/idempotency';
import { createSession } from '../controllers/sessions';

const router = express.Router();

// Apply idempotency middleware to the session creation route
router.post('/', idempotencyMiddleware, createSession);

export default router;
```

## 4. Best Practices

*   **Scope of Idempotency:** Only apply idempotency to operations that modify state (POST, PUT, DELETE). GET requests are naturally idempotent.
*   **Key Expiration:** Set a reasonable expiration for stored idempotency keys and responses to manage storage costs.
*   **Handle Concurrent Requests:** Use locks (like in the example) to prevent multiple concurrent requests with the same key from being processed simultaneously.
*   **Consistency:** Ensure that the stored response is exactly what was returned to the client on the first successful attempt.
*   **Client Responsibility:** Clients must generate unique keys for different operations and reuse the same key for retries of the same operation.

## 5. Related Documents

*   `backend-reliability-retry-policy.md`
*   `backend-reliability-transactions.md`
*   `error-handling-conventions.md`
