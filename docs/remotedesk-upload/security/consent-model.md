# Consent Model

**Version:** 1.0.0  
**Last Updated:** 2026-06-12  
**Classification:** Internal — Security  
**Owner:** RemoteDesk Security Team

---

## 1. Overview

RemoteDesk operates under a **strict explicit consent model**: every privileged action requires active, informed approval from the affected party. Consent is:

- **Explicit**: A passive inaction (e.g., not declining a dialog) does not constitute consent. Only a positive affirmative action (clicking "Allow" or "Accept") grants permission.
- **Specific**: Each permission type is gated independently. Granting screen view access does not imply consent to remote input, clipboard sync, or file transfer.
- **Revocable**: Any permission granted during a session can be revoked at any time, immediately, without navigating menus.
- **Non-persistent**: All permissions expire at session disconnect. No permissions carry over to a subsequent session.
- **Audited**: Every consent grant and revocation is recorded in the immutable audit log.

---

## 2. Permission Types and Consent Requirements

### 2.1 `screenView` — Screen Sharing

**Description:** The host shares their screen with the viewer.

**Who must consent:** Host (the party whose screen is shared).

**Consent trigger:** The viewer sends a `connect:request` event. The host receives an `incoming:request` event and is presented with a connection consent dialog.

**Consent dialog must display:**
- Viewer's display name and connection ID.
- A visual representation of what will be shared (primary monitor indicator).
- The session duration limit (if set by enterprise policy).
- Two explicit options: "Allow" and "Decline."
- A countdown timer (default 60 seconds). If the host does not respond, the request is automatically declined.

**Grant action:** Host clicks "Allow." Session transitions to `SESSION_ACTIVE`.

**Decline action:** Host clicks "Decline" or the 60-second timer expires. The session is rejected and the viewer receives `request:rejected`.

**Implied permissions granted:** None. Screen view only.

---

### 2.2 `remoteInput` — Remote Keyboard and Mouse Control

**Description:** The viewer can inject keyboard and mouse events on the host machine.

**Who must consent:** Host.

**Consent trigger:** The viewer clicks the "Request Control" button in the session toolbar. The host receives a request in the session overlay.

**Consent dialog must display:**
- Viewer's name and session ID.
- Clear statement: "Granting control allows [ViewerName] to control your keyboard and mouse."
- Warning: "Do not grant control unless you trust this person completely."
- A countdown timer (30 seconds). If no response, the request is declined.
- Two options: "Allow Control" and "Deny."

**Grant action:** Host clicks "Allow Control." A 500ms delay is enforced before the first injected input is processed (anti-click-hijack delay). Session transitions to `SESSION_ACTIVE_INPUT_ENABLED`.

**Visual confirmation:** An always-on-top banner "🔴 [ViewerName] has keyboard/mouse control" is displayed on the host's screen throughout the period of active remote input.

**Re-consent required if:** The session transitions to a non-input state (e.g., due to emergency stop) and the viewer wishes to re-enable input. The full consent dialog is shown again; no single-click re-enable.

---

### 2.3 `clipboardSync` — Clipboard Synchronization

**Description:** Text clipboard contents are shared between viewer and host.

**Who must consent:** Both parties must independently enable clipboard sync. The party receiving clipboard data from the other must have opted in.

**Consent trigger:** Either party clicks the "Enable Clipboard Sync" button.

**Consent dialog must display:**
- Direction of sync requested (→ from viewer, ← from host, or ↔ bidirectional).
- Warning: "Clipboard sync shares text you copy with the remote party. Do not copy passwords or sensitive data while this is active."
- Checkbox: "I understand the privacy implications."
- Two options: "Enable Clipboard Sync" and "Cancel."

**Grant action:** User checks the acknowledgment checkbox and clicks "Enable." Clipboard sync activates for the permitted direction.

**Visual confirmation:** A clipboard sync indicator appears in the session status bar on both sides when sync is active.

**Bidirectional sync additional gate:** Bidirectional sync requires both parties to individually enable clipboard sync. Enabling one direction does not auto-enable the reverse direction.

---

### 2.4 `fileTransfer` — File Transfer

**Description:** A file is transferred from sender to receiver over the session.

**Who must consent:** The receiver, per-file.

**Consent trigger:** The sender initiates a file transfer. The receiver's application displays a per-file consent dialog before any bytes are transmitted.

**Consent dialog must display:**
- Sender's name and session ID.
- Sanitized filename.
- File size.
- Detected file type / extension.
- A prominent warning if the file has a dangerous extension (e.g., `.exe`, `.ps1`).
- Two options: "Accept" and "Decline."
- A 60-second countdown timer. If no response, the transfer is declined.

**Grant action:** Receiver clicks "Accept." Transfer begins. Data channel is unpaused. Post-transfer, the receiver must choose a save location via file picker — files are never auto-saved.

**Note:** Consent is per-file. Accepting one file from a sender does not grant blanket acceptance of subsequent files. Each file requires its own consent step.

---

## 3. Consent UI Requirements

All consent dialogs must meet the following design and engineering requirements:

### 3.1 Appearance
- Dialogs must use a distinct modal style that visually differentiates them from normal application UI.
- Permission grants (allowing control, enabling sync) must use a distinct color (e.g., amber/orange) to signal elevated security significance.
- Decline / Cancel buttons must be equally prominent and easy to click. Dialogs must not use dark patterns to obscure the "Decline" option.
- Dialogs must be rendered by the Electron main process (BrowserWindow with `modal: true`) to prevent renderer-side UI spoofing.

### 3.2 Countdown Timer
- Each consent dialog has a visible countdown timer.
- Timer behavior on expiry:
  - `screenView`: Request declined.
  - `remoteInput`: Request declined.
  - `clipboardSync`: Dialog closes; clipboard sync remains off.
  - `fileTransfer`: Transfer declined; sender notified.
- The timer cannot be paused or reset by the remote party.

### 3.3 Accessibility
- All consent dialogs must be fully keyboard-navigable.
- Default focus must be on the "Decline" / "Cancel" button, not "Allow." This prevents accidental grants via Enter key.
- Screen reader accessible (ARIA roles, labels).

### 3.4 Positioning
- Consent dialogs must be always-on-top (window flag `alwaysOnTop: true`) to prevent them from being hidden behind the screen share overlay.
- On multi-monitor setups, the dialog appears on the monitor where the host is actively working (determined by mouse cursor position at dialog creation time).

---

## 4. Consent Revocation

### 4.1 Normal Revocation

Any permission can be revoked by the granting party at any time:

| Permission | Revocation Action | Mechanism |
|---|---|---|
| `remoteInput` | Host clicks "Stop Control" in overlay | IPC → main process sets `inputEnabled = false`; sends `session:end-input` event |
| `clipboardSync` | Either party clicks "Disable Clipboard Sync" | Sync state machine transitions to `CLIPBOARD_DISABLED` |
| `fileTransfer` | Receiver clicks "Cancel" during transfer | Data channel paused; temp buffer cleared; sender notified |
| `screenView` | Host clicks "End Session" | Full session termination |

Revocation takes effect **immediately** — within one event loop tick in the main process. There is no grace period for ongoing operations.

### 4.2 Emergency Stop

The emergency stop is a special revocation mechanism that bypasses all normal UI flows and terminates remote input **immediately** without requiring dialog navigation:

- **Trigger:** Host presses the configured emergency stop hotkey (default: `F12`; enterprise configurable).
- **Implementation:** An OS-level global hotkey hook (registered via `globalShortcut.register` in Electron main) that fires regardless of window focus state.
- **Effect:**
  1. `remoteInput` permission is revoked immediately.
  2. All queued input events are flushed (not processed).
  3. The viewer receives a `peer:disconnected` event with reason `EMERGENCY_STOP`.
  4. The session continues (screen share remains active) — only input control is revoked.
  5. An `EMERGENCY_STOP` event is appended to the audit log with timestamp and triggering session ID.
- **Re-enable:** Requires full re-consent (§2.2 dialog shown again).
- **Cannot be intercepted by viewer:** The emergency stop hotkey is registered at the OS level. Even if the viewer has input control at the time of the keypress, the OS processes the global hotkey before forwarding it to the application input pipeline.

### 4.3 Session-Level Revocation

Disconnecting the session (`session:end` event or network disconnection) revokes all active permissions atomically:

- All permission flags are reset to `false` in the session state machine.
- All permission-specific UI (overlay, status bar indicators) is cleared.
- An `SESSION_ENDED` audit event is recorded noting all permissions that were active at the time of disconnect.

---

## 5. Persistence Model

**Core principle: No permissions persist across session disconnects.**

| Scenario | Permission State After |
|---|---|
| Session disconnects normally | All permissions reset to `false` |
| Network interruption with reconnection | All permissions reset to `false`; re-consent required for all |
| Application restart | All permissions reset to `false` |
| Host machine sleep/wake | All permissions reset to `false`; session considered ended |
| Multiple sessions with same party | Each session starts with zero permissions; no "remembered" grants |

RemoteDesk does **not** persist consent decisions to disk, localStorage, or any database. There is no "always allow from [ContactName]" feature. This is a deliberate security design choice to ensure every session is fresh.

---

## 6. Re-Consent Conditions

Re-consent (i.e., the full consent dialog is shown again, not a single-click re-enable) is required when:

| Condition | Permission | Re-Consent Required |
|---|---|---|
| Emergency stop was triggered | `remoteInput` | ✅ Yes |
| Input was revoked by host clicking "Stop Control" | `remoteInput` | ✅ Yes |
| Session was briefly interrupted and reconnected | All | ✅ Yes |
| A different viewer connects to the same host | All | ✅ Yes |
| Enterprise policy changes during an active session | Affected permission | ✅ Yes |
| 30-minute inactivity timeout on remote input | `remoteInput` | ✅ Yes |
| Viewer requests control a second time in same session | `remoteInput` | ✅ Yes |

There is no "fast re-enable" shortcut. The full dialog with timer is always shown.

---

## 7. Audit Trail of Consent Events

Every consent-related event is recorded as an `AuditEvent` in the database. The audit trail is:

- **Append-only**: Records cannot be modified or deleted (table-level constraint).
- **Tamper-evident**: Each record includes a hash chain (each event's `previousHash` field contains the SHA256 of the previous event for that session).
- **Queryable by session**: Indexed on `(sessionId, timestamp)`.

### 7.1 Consent Events Logged

| Event Type | Trigger | Fields Logged |
|---|---|---|
| `CONSENT_SCREEN_VIEW_GRANTED` | Host clicks Allow on connection dialog | sessionId, viewerId, hostId, timestamp, dialogVersion |
| `CONSENT_SCREEN_VIEW_DECLINED` | Host declines or timer expires | sessionId, viewerId, hostId, timestamp, reason (DECLINED/TIMEOUT) |
| `CONSENT_INPUT_GRANTED` | Host allows remote input | sessionId, viewerId, hostId, timestamp, dialogVersion |
| `CONSENT_INPUT_DECLINED` | Host declines or timer expires | sessionId, viewerId, hostId, timestamp, reason |
| `CONSENT_INPUT_REVOKED` | Host clicks "Stop Control" | sessionId, viewerId, hostId, timestamp |
| `CONSENT_INPUT_EMERGENCY_STOP` | Emergency stop hotkey triggered | sessionId, viewerId, hostId, timestamp, hotkey |
| `CONSENT_CLIPBOARD_ENABLED` | Party enables clipboard sync | sessionId, actorId, direction, timestamp |
| `CONSENT_CLIPBOARD_DISABLED` | Party disables clipboard sync | sessionId, actorId, direction, timestamp |
| `CONSENT_FILE_TRANSFER_ACCEPTED` | Receiver accepts file | sessionId, senderId, receiverId, filename (sanitized), fileSize, timestamp |
| `CONSENT_FILE_TRANSFER_DECLINED` | Receiver declines or timer expires | sessionId, senderId, receiverId, filename (sanitized), timestamp, reason |
| `CONSENT_SESSION_ENDED` | Session terminates | sessionId, initiatorId, activePermissionsAtEnd, timestamp |

---

## 8. Compliance Mapping

| Requirement | Source | RemoteDesk Control |
|---|---|---|
| User must provide informed consent before data collection | GDPR Art. 7 | Per-feature consent dialogs with explicit warning text |
| Consent must be as easy to withdraw as to give | GDPR Art. 7(3) | One-click revocation; emergency stop hotkey |
| Processing must not exceed what user consented to | GDPR Art. 5(1)(b) | Per-permission state machine; no blanket consent |
| Audit records of consent | GDPR Art. 7(1) | Immutable `AuditEvent` table |
| Right to know what data is shared | GDPR Art. 15 | Privacy model and audit log export |
| No consent inferred from silence | GDPR Recital 32 | Countdown expiry = decline, not grant |

---

## 9. References

- `docs/security/threat-model-remote-input.md` — Input control threats
- `docs/security/audit-logging-model.md` — AuditEvent schema and storage
- `docs/security/privacy-model.md` — Data handling after consent
- `docs/security/enterprise-policy.md` — Policy overrides for consent flows
- GDPR Article 7 — Conditions for consent
- ISO/IEC 29101:2018 — Privacy architecture framework
