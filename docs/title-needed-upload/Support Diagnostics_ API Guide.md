# Support Diagnostics: API Guide

This guide provides instructions for collecting diagnostic information related to the RemoteDesk backend API. This is primarily intended for developers, system administrators, and support engineers investigating API errors, performance issues, or integration problems.

## 1. Request and Response Details

For any problematic API call, provide the following information:

*   **Endpoint URL:** The full URL of the API endpoint (e.g., `https://api.remotedesk.com/v1/sessions`).
*   **HTTP Method:** (e.g., GET, POST, PUT, DELETE).
*   **Request Headers:** Especially `X-Correlation-ID`, `User-Agent`, and any custom headers (redact `Authorization` tokens).
*   **Request Body:** The JSON payload sent in the request (redact sensitive data like passwords).
*   **Response Status Code:** (e.g., 200 OK, 400 Bad Request, 500 Internal Server Error).
*   **Response Headers:** Especially `X-Correlation-ID` and any rate-limiting headers.
*   **Response Body:** The JSON payload received in the response, including any error messages or codes.

## 2. Correlation IDs

The `X-Correlation-ID` is the most important piece of information for tracing a request across the backend services. Always include it when reporting an API issue.

## 3. API Logs (for Administrators)

If you have access to the backend logs (e.g., via a centralized logging system like ELK or Splunk):

1.  Search for the `correlation_id` associated with the problematic request.
2.  Collect all log entries from all services (API Gateway, Auth Service, Session Service, etc.) related to that ID.
3.  Look for error messages, stack traces, and database query logs.

## 4. Performance Metrics

For API performance issues, provide:

*   **Latency:** The total time taken for the request to complete, as measured by the client.
*   **Server-Side Processing Time:** If available in the response headers or logs.
*   **Frequency:** Is the slowness consistent or intermittent?
*   **Payload Size:** The size of the request and response bodies.

## 5. Integration and Authentication Issues

*   **OAuth2 Flow:** If the issue is with authentication, describe which step of the OAuth2 flow is failing (e.g., obtaining a token, using a refresh token).
*   **Client ID:** Provide the `client_id` used for the request (but NEVER the `client_secret`).
*   **Scope:** The scopes requested and granted for the access token.

## 6. Rate Limiting

If you are receiving `429 Too Many Requests` errors:

*   Provide the values of the `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset` headers.
*   Describe the volume and frequency of your API requests.

## 7. Webhooks (if applicable)

For issues with webhooks:

*   **Webhook URL:** The URL where RemoteDesk is sending events.
*   **Event Type:** The type of event that failed to be delivered (e.g., `session.started`).
*   **Delivery Logs:** Any logs from your server showing the receipt (or lack thereof) of the webhook request.
*   **Payload Example:** An example of the webhook payload received.

## 8. Related Documents

*   `api-examples.md`
*   `audit-log-structure.md`
*   `audit-correlation-guide.md`
*   `backend-reliability-rate-limiting.md`
*   `error-handling-conventions.md`
