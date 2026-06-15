# Audit/Forensics: Audit Log Structure

This document defines the standardized structure and content of audit logs within the RemoteDesk system. Comprehensive and well-structured audit logs are crucial for security monitoring, forensic analysis, compliance, and troubleshooting. They provide an immutable record of significant events and user actions.

## 1. Overview

Audit logs capture critical security and operational events across all components of the RemoteDesk ecosystem (Web application, Desktop application, Backend API, and WebRTC signaling server). The goal is to provide sufficient detail to reconstruct events, identify actors, and understand the impact of actions.

## 2. Log Format

All audit logs will be generated in a structured JSON format to facilitate automated parsing, indexing, and analysis by log management systems (e.g., ELK Stack, Splunk).

```json
{
  "timestamp": "2023-10-27T10:30:00.123Z",
  "level": "INFO",
  "service": "backend-api",
  "component": "auth",
  "event_type": "user_login",
  "user_id": "usr_abc123",
  "session_id": "sess_xyz789",
  "ip_address": "203.0.113.45",
  "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
  "details": {
    "status": "success",
    "method": "password",
    "mfa_used": true,
    "device_id": "dev_pqr456"
  },
  "target": {
    "type": "user",
    "id": "usr_abc123"
  },
  "correlation_id": "corr_12345"
}
```

## 3. Core Fields

Every audit log entry MUST include the following core fields:

*   **`timestamp` (ISO 8601 String):** The exact time the event occurred, in UTC, with millisecond precision (e.g., `2023-10-27T10:30:00.123Z`).
*   **`level` (String):** The severity of the log entry. Recommended values: `INFO`, `WARN`, `ERROR`, `CRITICAL`.
*   **`service` (String):** The name of the microservice or application component generating the log (e.g., `backend-api`, `web-app`, `desktop-app`, `signaling-server`).
*   **`component` (String):** A more granular identifier within the service (e.g., `auth`, `session-manager`, `file-transfer`, `webrtc`).
*   **`event_type` (String):** A standardized, concise identifier for the type of event (e.g., `user_login`, `session_start`, `file_download`, `setting_change`).
*   **`user_id` (String, Optional):** The unique identifier of the user who initiated the action. Present if the action is user-driven.
*   **`session_id` (String, Optional):** The unique identifier of the remote desktop session, if the event is related to an active session.
*   **`ip_address` (String, Optional):** The IP address from which the action originated.
*   **`user_agent` (String, Optional):** The user-agent string of the client application or browser.
*   **`details` (Object):** A flexible JSON object containing event-specific details. This is where additional context relevant to the `event_type` is stored.
*   **`target` (Object, Optional):** Describes the primary entity affected by the event. Contains `type` (e.g., `user`, `device`, `file`) and `id`.
*   **`correlation_id` (String, Optional):** A unique identifier that links related log entries across different services or components for a single transaction or request.

## 4. Event Types and Details (Examples)

### 4.1. Authentication Events

*   **`event_type`: `user_login`**
    *   `details.status`: `success` | `failure`
    *   `details.method`: `password` | `oauth` | `mfa`
    *   `details.mfa_used`: `true` | `false`
    *   `details.failure_reason`: (if status is `failure`) `invalid_credentials` | `account_locked` | `mfa_failed`
*   **`event_type`: `user_logout`**
*   **`event_type`: `password_change`**
    *   `details.initiated_by`: `user` | `admin`
*   **`event_type`: `mfa_enabled` / `mfa_disabled`**

### 4.2. Session Management Events

*   **`event_type`: `session_start`**
    *   `details.host_device_id`: Unique ID of the remote device.
    *   `details.client_device_id`: Unique ID of the client device.
    *   `details.connection_type`: `p2p` | `turn`
*   **`event_type`: `session_end`**
    *   `details.duration_ms`: Session duration in milliseconds.
    *   `details.reason`: `user_ended` | `disconnected` | `timeout`
*   **`event_type`: `session_reconnect`**

### 4.3. Remote Control Events

*   **`event_type`: `remote_input_enabled` / `remote_input_disabled`**
*   **`event_type`: `screen_share_start` / `screen_share_end`**
*   **`event_type`: `file_transfer_start`**
    *   `details.file_name`: Name of the file.
    *   `details.file_size`: Size in bytes.
    *   `details.direction`: `upload` | `download`
*   **`event_type`: `file_transfer_complete` / `file_transfer_failed`**
*   **`event_type`: `clipboard_sync_enabled` / `clipboard_sync_disabled`**

### 4.4. Configuration Changes

*   **`event_type`: `setting_change`**
    *   `details.setting_name`: Name of the setting changed.
    *   `details.old_value`: Previous value.
    *   `details.new_value`: New value.

## 5. Log Retention and Security

*   **Retention Policy:** Audit logs will be retained for a minimum of [X] days/months/years as per compliance requirements.
*   **Immutability:** Logs, once written, MUST NOT be altered. Mechanisms like write-once storage or cryptographic hashing will be employed.
*   **Access Control:** Access to audit logs will be strictly controlled and limited to authorized personnel only.
*   **Encryption:** Logs will be encrypted at rest and in transit.

## 6. Logging Best Practices

*   **Avoid Sensitive Data:** DO NOT log sensitive user data (e.g., passwords, PII) in plain text. If necessary, hash or redact such information.
*   **Contextual Logging:** Ensure logs contain enough context to be useful for troubleshooting and forensics.
*   **Performance:** Logging should be asynchronous and non-blocking to minimize impact on application performance.
*   **Centralized Logging:** All logs should be sent to a centralized log management system for aggregation, analysis, and alerting.

## 7. Audit Log Review

Regular reviews of audit logs will be conducted to:

*   Detect suspicious activities.
*   Monitor for security breaches.
*   Ensure compliance with policies.
*   Identify operational issues.
