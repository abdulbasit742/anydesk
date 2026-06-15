# Audit/Forensics: Session Forensic Timeline

A session forensic timeline is a chronological reconstruction of all events related to a specific remote desktop session. It is an essential tool for investigating security incidents, troubleshooting connection issues, and auditing user activity. This document describes how to build and analyze a session forensic timeline using RemoteDesk audit logs.

## 1. Overview

The timeline combines logs from the client application, the host application, the signaling server, and the backend API, all linked by a common `session_id`.

## 2. Key Events in a Session Timeline

A typical session timeline includes the following events, in chronological order:

| Event Type | Component | Description |
| :--------- | :-------- | :---------- |
| **`session_initiation_request`** | Backend API | Client requests to start a session with a target host. |
| **`session_authorized`** | Backend API | Backend verifies permissions and authorizes the session. |
| **`signaling_connected`** | Signaling Server | Both client and host connect to the signaling server. |
| **`sdp_offer_sent`** | Client App | Client sends its WebRTC session description offer. |
| **`sdp_answer_sent`** | Host App | Host responds with its WebRTC session description answer. |
| **`ice_candidate_exchanged`** | Signaling Server | Peers exchange network candidates. |
| **`webrtc_connection_state_change`** | Client/Host App | WebRTC connection moves through `checking`, `connected`, `completed`. |
| **`data_channel_opened`** | Client/Host App | Data channels for input, file transfer, etc., are established. |
| **`remote_input_event`** | Host App | Keyboard or mouse events are received and processed on the host. |
| **`file_transfer_initiated`** | Client/Host App | A file transfer request is made. |
| **`file_transfer_completed`** | Client/Host App | A file transfer is successfully finished. |
| **`session_ended_by_user`** | Client/Host App | A user explicitly ends the session. |
| **`session_disconnected`** | Signaling Server | The connection is lost unexpectedly. |
| **`session_cleanup_completed`** | Backend API | Backend performs final cleanup and logging for the session. |

## 3. How to Construct the Timeline

1.  **Identify the `session_id`:** Obtain the ID of the session you want to investigate.
2.  **Query Centralized Logs:** Search for all audit log entries where `session_id` matches the target ID.
3.  **Sort by Timestamp:** Order the resulting log entries chronologically by their `timestamp` field.
4.  **Enrich with Context:** For each event, look at the `details` object and other fields (e.g., `user_id`, `ip_address`, `level`) to understand the full context.
5.  **Correlate with Other Logs:** If necessary, use `correlation_id` to find related API logs or system logs that might not have the `session_id` directly.

## 4. Analyzing the Timeline

When reviewing the timeline, look for:

*   **Gaps in Time:** Large gaps between expected events might indicate performance issues or network interruptions.
*   **Unexpected Events:** Any event that shouldn't occur in a normal session flow (e.g., unauthorized access attempts, critical errors).
*   **Failed Transitions:** Instances where the session failed to move from one state to the next (e.g., SDP exchange succeeded but ICE gathering failed).
*   **High Frequency Events:** An unusually high number of certain events (e.g., rapid-fire input events, repeated reconnection attempts).
*   **Anomalous IP Addresses:** Connections or actions originating from unexpected or suspicious network locations.

## 5. Example Timeline Analysis

**Scenario:** User reports a session disconnected unexpectedly.

1.  **10:00:00:** `session_initiation_request` (Success)
2.  **10:00:05:** `webrtc_connection_state_change` (Connected)
3.  **10:15:30:** `remote_input_event` (Ongoing activity)
4.  **10:15:45:** `webrtc_connection_state_change` (Disconnected)
5.  **10:15:45:** `session_disconnected` (Reason: `heartbeat_timeout`)
6.  **10:15:50:** `session_cleanup_completed`

**Analysis:** The timeline shows the session was active for 15 minutes and then disconnected due to a heartbeat timeout, suggesting a sudden network failure on either the client or host side.

## 6. Related Documents

*   `audit-log-structure.md`
*   `audit-correlation-guide.md`
*   `audit-log-forensic-analysis.md`
*   `webrtc-getstats-debugging-guide.md` (for correlating with real-time stats)
