# Observability & Reliability - Manual Test Plan

This document outlines the manual testing procedures to verify the backend observability infrastructure.

## 1. Health and Readiness Endpoints

*   **Test:** Send a GET request to `/health` and `/health/ready`.
*   **Expected Result:** The endpoints return a 200 OK status (if healthy). The JSON response contains only safe metadata (status, service name, uptime). **No internal IP addresses, database connection strings, or secrets are exposed.**

## 2. Safe Logger Redaction

*   **Test:** Temporarily modify a route to log an object containing a `password`, `token`, and `sessionId` using `safeLogger.info()`. Trigger the route.
*   **Expected Result:** Inspect the console output. The `sessionId` should be visible, but the values for `password` and `token` must be replaced with `[REDACTED]`.

## 3. Request ID Propagation

*   **Test:** Send a request to any API endpoint without an `x-request-id` header.
*   **Expected Result:** The response headers include a newly generated `x-request-id` (UUID).
*   **Test:** Send a request with a custom `x-request-id` header (e.g., `test-id-123`).
*   **Expected Result:** The response headers include `x-request-id: test-id-123`.

## 4. Ops Metrics Endpoint Access

*   **Test:** Attempt to access `/api/ops/metrics` without authentication or with a standard user token.
*   **Expected Result:** The request is rejected with a 401 or 403 status.
*   **Test:** Access `/api/ops/metrics` with an admin token.
*   **Expected Result:** The endpoint returns the aggregated metrics payload.

## 5. Graceful Shutdown

*   **Test:** Start the API server. Connect a Socket.IO client. Send a `SIGTERM` signal to the Node.js process (e.g., using `kill`).
*   **Expected Result:** The server logs "Graceful shutdown initiated". The connected Socket.IO client receives a `server:shutdown` event before the connection is severed. The server process exits cleanly.
