# RemoteDesk Clipboard Sync Security

## 1. Overview

The Clipboard Sync feature in RemoteDesk allows seamless sharing of clipboard content (primarily text) between the host and viewer sessions. Security is paramount to prevent unauthorized data access and ensure user privacy.

## 2. Security Principles

### 2.1 Explicit Opt-in
Clipboard synchronization is an **explicitly opt-in feature**. It is disabled by default and must be enabled by both the host and the viewer to become active. This prevents accidental or unwanted sharing of sensitive clipboard data.

### 2.2 Permission Gating
Access to clipboard synchronization is controlled by a permission gate. This gate ensures that only authorized users can initiate or participate in clipboard sync. The `ClipboardPermissionState` enum defines the possible states: `GRANTED`, `DENIED`, and `PENDING`.

### 2.3 Size Limits
To prevent potential denial-of-service attacks or excessive memory consumption, a strict clipboard size limit is enforced. This limit applies primarily to text content, preventing the transfer of extremely large text blocks that could impact performance or stability.

### 2.4 Conflict Prevention
Mechanisms are in place to prevent clipboard content conflicts when both host and viewer attempt to sync simultaneously. This typically involves a last-write-wins or a priority-based system, ensuring a consistent state.

### 2.5 Audit Events
All significant clipboard sync events, such as enabling/disabling sync and actual data transfers, are logged via the `AuditService` on the backend. This provides an auditable trail for security monitoring and incident response.

## 3. Data Handling

### 3.1 Supported Content Types
Currently, the primary supported content type for clipboard sync is plain text. Future enhancements may include image or file clipboard support, which will be subject to similar stringent security controls.

### 3.2 Data Channel Encryption
As clipboard data is transmitted over WebRTC data channels, it benefits from the inherent encryption provided by WebRTC (DTLS/SRTP), ensuring that data is encrypted in transit between the host and viewer.

## 4. User Interface Controls

### 4.1 Clipboard Sync Toggle
Both host and viewer clients provide a clear UI toggle to enable or disable clipboard synchronization at any time during a session.

### 4.2 Permission Panel
A dedicated permission panel or indicator shows the current state of clipboard sync permissions, allowing users to easily understand and manage access.

### 4.3 Last Synced Preview
For user convenience and verification, a preview of the last synced clipboard content (e.g., the first few characters of text) may be displayed in the UI.

## 5. Implementation Notes

- **Debounce Helper:** A debounce mechanism is used to prevent excessive clipboard sync messages from being sent when a user rapidly copies multiple items, optimizing network usage.
- **Conflict Resolution:** When both sides copy content, a clear conflict resolution strategy is applied (e.g., the most recent copy takes precedence, or the host's clipboard has priority).
