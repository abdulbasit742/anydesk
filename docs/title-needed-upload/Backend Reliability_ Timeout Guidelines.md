# Backend Reliability: Timeout Guidelines

Timeouts are a critical defense mechanism in distributed systems. They prevent a single slow component (like a database or an external API) from causing a cascade of failures across the entire system. This document outlines the guidelines for setting and managing timeouts in the RemoteDesk backend.

## 1. Why Use Timeouts?

*   **Prevent Resource Exhaustion:** Without timeouts, a slow operation can tie up a request handler, database connection, or thread indefinitely, eventually leading to the exhaustion of system resources.
*   **Improve System Responsiveness:** Timeouts ensure that the system fails fast and provides a response to the user or calling service, rather than leaving them waiting indefinitely.
*   **Isolate Failures:** Timeouts help isolate failures to the specific component that is performing poorly, preventing it from dragging down other parts of the system.
*   **Enable Retries:** A timeout provides a clear signal that an operation has failed, allowing the calling service to decide whether to retry the operation (refer to `backend-reliability-retry-policy.md`).

## 2. Types of Timeouts

### 2.1. Request Timeouts

The maximum time a client (e.g., the web dashboard or desktop app) will wait for a response from the backend API.

*   **Recommended Value:** 10-30 seconds for most operations. Longer for complex reports or large file transfers.

### 2.2. Database Timeouts

The maximum time a backend service will wait for a database query to complete.

*   **Connection Timeout:** Time to establish a connection to the database. (e.g., 2-5 seconds)
*   **Statement Timeout:** Time for a specific SQL query to execute. (e.g., 1-5 seconds for typical OLTP queries)
*   **Recommended Value:** Keep these as low as possible for standard operations to ensure fast failure and resource release.

### 2.3. External API Timeouts

The maximum time a backend service will wait for a response from a third-party API (e.g., Stripe, SendGrid).

*   **Recommended Value:** 5-10 seconds, depending on the expected latency of the external service.

### 2.4. Inter-Service Timeouts

The maximum time one microservice will wait for a response from another internal microservice.

*   **Recommended Value:** 2-5 seconds, as internal communication should be fast.

## 3. How to Set Timeouts

*   **Configuration-Based:** Store timeout values in configuration files or environment variables, allowing them to be adjusted without code changes.
*   **Context-Specific:** Use different timeouts for different types of operations. A simple user lookup should have a much shorter timeout than a complex data export.
*   **Library Support:** Utilize the timeout features provided by your libraries (e.g., `axios` for HTTP requests, Prisma for database queries).

### 3.1. Example (Prisma Statement Timeout)

```typescript
const user = await prisma.user.findUnique({
  where: { id: 'user_id' },
  // Prisma doesn't have a direct statement timeout per query yet, 
  // but it can be set at the connection level or via raw SQL.
});
```

### 3.2. Example (Axios Request Timeout)

```typescript
const response = await axios.get('https://api.example.com/data', {
  timeout: 5000, // 5-second timeout
});
```

## 4. Handling Timeout Failures

*   **Log Timeout Events:** Log every timeout occurrence, including the operation, the target service, and the timeout value.
*   **Return Appropriate Error Codes:** Use 504 Gateway Timeout for request timeouts and 500 Internal Server Error for internal timeouts.
*   **Implement Retries:** For transient failures, consider retrying the operation with an exponential backoff (refer to `backend-reliability-retry-policy.md`).
*   **Circuit Breakers:** For persistent timeout issues with a specific service, use a circuit breaker to stop making requests to that service until it recovers.

## 5. Monitoring and Tuning

*   **Monitor Latency:** Track the 95th and 99th percentile latency for all operations.
*   **Analyze Timeout Trends:** Look for patterns in timeout events to identify failing components or overloaded resources.
*   **Tune Timeouts:** Regularly review and adjust timeout values based on observed performance and business requirements.

## 6. Related Documents

*   `backend-reliability-retry-policy.md`
*   `error-handling-conventions.md`
*   `logging-conventions.md`
