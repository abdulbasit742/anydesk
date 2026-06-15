# Audit/Forensics: Audit Correlation Guide

In a distributed system like RemoteDesk, a single user action or transaction often spans multiple services and components. Correlating audit logs across these boundaries is essential for understanding the full context of events, performing forensic investigations, and troubleshooting complex issues. This document provides a guide for effective audit log correlation.

## 1. The Role of Correlation IDs

The primary mechanism for correlating logs is the **Correlation ID**. A Correlation ID is a unique, random identifier generated at the start of a request or transaction and passed along to all subsequent services and components involved in processing that request.

### 1.1. Generation and Propagation

1.  **Generation:** The entry point of a request (e.g., the API Gateway or the Web/Desktop client) generates a new Correlation ID (e.g., a UUID).
2.  **Propagation via Headers:** The ID is included in the headers of all outgoing requests (e.g., `X-Correlation-ID`).
3.  **Propagation to Logs:** Every service that receives a Correlation ID MUST include it in every audit log entry related to that request (as defined in `audit-log-structure.md`).

## 2. Key Correlation Points in RemoteDesk

To reconstruct a complete event timeline, correlate logs using the following identifiers:

| Identifier | Description | Where to Find It |
| :--------- | :---------- | :--------------- |
| **`correlation_id`** | Links all logs for a single API request or transaction. | All audit log entries. |
| **`session_id`** | Links all logs related to a specific remote desktop session. | Signaling, Backend, and Client logs for that session. |
| **`user_id`** | Links all actions performed by a specific user. | Most audit log entries. |
| **`device_id`** | Links all events occurring on a specific device (host or client). | Signaling, Backend, and Client logs. |
| **`ip_address`** | Can be used to correlate activity from a specific network location. | Most audit log entries. |

## 3. Correlation Scenarios

### 3.1. Reconstructing a Remote Session

To understand the full lifecycle of a remote session:

1.  Find the `session_id` for the session in question.
2.  Search the centralized logging system for all logs containing that `session_id`.
3.  Sort the results by `timestamp`.
4.  This will show the session initiation, signaling events, WebRTC connection progress, data channel activity (e.g., file transfers), and the final session termination across all involved components.

### 3.2. Investigating a Failed API Request

To diagnose why a specific API request failed:

1.  Identify the `correlation_id` from the failed request's response header or initial log entry.
2.  Search for all logs with that `correlation_id`.
3.  This will trace the request as it passed through the API Gateway, authentication service, business logic services, and database interactions, revealing where the error occurred and providing the relevant context from each service.

### 3.3. Tracking User Activity

To see all actions performed by a user over a specific period:

1.  Search for all logs containing the user's `user_id`.
2.  Filter by the desired time range.
3.  This provides a comprehensive audit trail of the user's logins, session activities, setting changes, and other interactions with the system.

## 4. Tools and Techniques for Correlation

*   **Centralized Logging Platform (e.g., ELK, Splunk):** Use the search and filtering capabilities to query logs by Correlation ID, Session ID, etc.
*   **Log Visualization:** Create dashboards that group related logs or show a chronological timeline of events for a specific ID.
*   **Distributed Tracing (e.g., Jaeger, Zipkin):** While primarily for performance monitoring, distributed tracing tools can also be used to visualize the flow of requests and correlate logs across services.
*   **Scripting:** Use tools like `jq` or custom scripts to parse and correlate exported log files.

## 5. Best Practices for Effective Correlation

*   **Consistent Naming:** Ensure the Correlation ID header and log field name are standardized across all services.
*   **Mandatory Inclusion:** Make it a requirement for all new services and features to support Correlation ID propagation and logging.
*   **Clock Synchronization:** Ensure all servers and devices have synchronized clocks (e.g., using NTP) to ensure accurate chronological ordering of logs.
*   **Avoid ID Collisions:** Use high-entropy identifiers (like UUID v4) to minimize the risk of ID collisions.

## 6. Related Documents

*   `audit-log-structure.md`
*   `audit-log-monitoring-alerting.md`
*   `audit-log-forensic-analysis.md`
*   `backend-reliability-retry-policy.md` (where Correlation IDs are vital for tracing retries)
