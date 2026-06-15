# Audit/Forensics: Security Event Timeline

A security event timeline is a specialized reconstruction of all audit logs related to a specific security incident or a suspected threat. Unlike a session timeline, which focuses on a single remote session, a security event timeline can span multiple users, sessions, devices, and time periods to provide a holistic view of a security-related occurrence.

## 1. Overview

The goal of a security event timeline is to:
*   Identify the scope and impact of a security incident.
*   Determine the initial point of entry or compromise.
*   Trace the lateral movement of an attacker.
*   Identify all affected resources and data.
*   Support incident response and remediation efforts.

## 2. Key Events in a Security Event Timeline

A security event timeline includes events from various categories, such as:

| Category | Event Types | Description |
| :------- | :---------- | :---------- |
| **Authentication** | `user_login` (success/failure), `mfa_verification`, `password_change`, `account_lockout`. | Tracks attempts to gain access to the system. |
| **Authorization** | `access_denied`, `role_change`, `permission_update`. | Tracks attempts to access restricted resources or elevate privileges. |
| **Session Activity** | `session_start`, `session_end`, `remote_input_enabled`, `file_transfer_start`. | Tracks the use of remote access capabilities. |
| **Configuration** | `setting_change` (especially security settings), `api_key_created/deleted`. | Tracks changes to system or security configurations. |
| **Administrative** | `user_created/deleted`, `group_created/deleted`, `policy_updated`. | Tracks actions performed by administrators. |
| **System/Security** | `critical_error`, `malicious_activity_detected` (from IDS/IPS). | Tracks system health and potential threats. |

## 3. How to Construct a Security Event Timeline

1.  **Define the Incident Scope:** Identify the suspected time frame, affected users, devices, or systems.
2.  **Gather Initial Indicators (IOCs):** Start with known indicators like a suspicious IP address, a compromised user account, or a specific error message.
3.  **Query Centralized Logs:** Perform broad searches across all audit logs using the identified IOCs and time frame.
4.  **Correlate and Expand:** Use `correlation_id`, `user_id`, `device_id`, and `ip_address` to find related events and expand the timeline.
5.  **Sort and Filter:** Order the logs chronologically and filter out irrelevant events to focus on the security-relevant activity.
6.  **Analyze and Reconstruct:** Build a narrative of the event, identifying the sequence of actions taken by the actor.

## 4. Analyzing the Security Event Timeline

Look for patterns and anomalies that indicate malicious activity:

*   **Brute-Force Patterns:** Multiple failed login attempts followed by a successful one.
*   **Unusual Access Times/Locations:** Logins or actions occurring outside of normal business hours or from unexpected geographical locations.
*   **Privilege Escalation:** A standard user account suddenly performing administrative actions or having its role changed.
*   **Data Exfiltration Indicators:** Large or frequent file transfers, especially to unusual destinations.
*   **Tampering with Logs/Security:** Attempts to disable logging, delete audit logs, or modify security configurations.
*   **Lateral Movement:** A single user account or IP address accessing multiple different devices or systems in a short period.

## 5. Example Security Event Analysis

**Scenario:** Suspicious activity detected on an administrator account.

1.  **02:00:00:** `user_login` (Success) - Admin user `admin_jane` logs in from an IP in a different country.
2.  **02:05:00:** `role_change` - `admin_jane` changes the role of a standard user `user_bob` to `admin`.
3.  **02:10:00:** `session_start` - `user_bob` (now an admin) starts a session with a critical production server.
4.  **02:15:00:** `file_transfer_start` - `user_bob` initiates a large file transfer from the production server.
5.  **02:20:00:** `setting_change` - `admin_jane` disables audit log monitoring for a specific component.

**Analysis:** This timeline strongly suggests a compromise of the `admin_jane` account, followed by privilege escalation for `user_bob` and subsequent data exfiltration and attempts to cover tracks.

## 6. Related Documents

*   `audit-log-structure.md`
*   `audit-correlation-guide.md`
*   `audit-log-forensic-analysis.md`
*   `audit-log-monitoring-alerting.md`
*   `security-developer-best-practices.md`
