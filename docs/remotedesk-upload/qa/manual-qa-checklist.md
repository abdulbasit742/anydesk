# RemoteDesk — Manual QA Checklist

> **Version:** 1.0  
> **Last Updated:** 2026-06-12  
> **Environment:** Electron desktop (Windows/macOS/Linux)  
> **Tester:** ___________________  **Date:** ___________________

---

## How to Use This Checklist

- Run each test in order within a feature area.
- Mark each item **PASS ✅**, **FAIL ❌**, or **SKIP ⏭** (with reason).
- Record any failure with a screenshot path and a brief description.
- A release is not ready if any **P0** item fails or more than two **P1** items fail.

| Priority | Meaning |
|----------|---------|
| P0 | Blocker — release cannot proceed |
| P1 | High — must fix before release |
| P2 | Medium — fix in next patch |
| P3 | Low — cosmetic / nice-to-have |

---

## 1. Auth & Connection

### 1.1 RemoteDesk ID Display

| # | Priority | Steps | Expected Result | Result | Notes |
|---|----------|-------|----------------|--------|-------|
| 1.1.1 | P0 | Launch the app as a new user with no prior session. Observe the "Your RemoteDesk ID" section in the main panel. | A 9-digit numeric ID is displayed prominently (e.g., `123 456 789`) with correct spacing/formatting. | ☐ Pass ☐ Fail | |
| 1.1.2 | P1 | Close the app and reopen it. Observe the displayed ID. | The same 9-digit ID is shown — it persists across restarts. | ☐ Pass ☐ Fail | |
| 1.1.3 | P1 | Click the "Copy ID" button next to the displayed ID. Open a text editor and paste. | The pasted value is exactly the 9-digit ID without extra spaces or formatting characters. | ☐ Pass ☐ Fail | |
| 1.1.4 | P2 | Observe the status indicator next to the ID while offline (no internet). | Indicator shows "Offline" or similar; ID is still visible but grayed out. | ☐ Pass ☐ Fail | |
| 1.1.5 | P1 | Connect to internet and observe the status indicator. | Indicator transitions to "Ready" / green within 5 seconds of connectivity. | ☐ Pass ☐ Fail | |

### 1.2 Password Setup

| # | Priority | Steps | Expected Result | Result | Notes |
|---|----------|-------|----------------|--------|-------|
| 1.2.1 | P0 | Navigate to Settings → Security → Set Password. Enter a password less than 6 characters. Click Save. | Validation error shown: "Password must be at least 6 characters". Password is not saved. | ☐ Pass ☐ Fail | |
| 1.2.2 | P0 | Enter a valid password in the "New Password" field and a different value in "Confirm Password". Click Save. | Error shown: "Passwords do not match". Password is not saved. | ☐ Pass ☐ Fail | |
| 1.2.3 | P0 | Enter matching valid passwords (≥ 6 chars). Click Save. | Success toast appears. Password hash stored. On next connection attempt by a viewer, password is required. | ☐ Pass ☐ Fail | |
| 1.2.4 | P1 | With a password set, attempt to view the stored password in plain text from the Settings UI. | No plain-text password is visible; only masked dots (••••••). | ☐ Pass ☐ Fail | |
| 1.2.5 | P1 | With a password set, open Settings → Security → Change Password. Enter the wrong old password. Click Save. | Error shown: "Incorrect current password". New password is not applied. | ☐ Pass ☐ Fail | |
| 1.2.6 | P1 | Enter the correct old password and a valid new password. Click Save. | Password updated successfully. A viewer using the old password is rejected. | ☐ Pass ☐ Fail | |

### 1.3 Connection Request Flow

| # | Priority | Steps | Expected Result | Result | Notes |
|---|----------|-------|----------------|--------|-------|
| 1.3.1 | P0 | On the Viewer app, enter the Host's 9-digit ID in the "Connect To" field. Click Connect. | A connection request is sent. Viewer shows "Waiting for host to accept…" state. | ☐ Pass ☐ Fail | |
| 1.3.2 | P0 | Observe the Host app after the viewer sends a connection request. | Host receives an incoming request dialog showing the viewer's display name / ID. Dialog has **Accept** and **Reject** buttons. | ☐ Pass ☐ Fail | |
| 1.3.3 | P1 | Enter an invalid (non-existent) 9-digit ID in the viewer and click Connect. | Viewer shows error: "Host not found or offline" within the timeout period (≤ 10 s). | ☐ Pass ☐ Fail | |
| 1.3.4 | P1 | Enter a malformed ID (e.g., letters, fewer than 9 digits) and click Connect. | Input is rejected with a validation error before any network request is made. | ☐ Pass ☐ Fail | |
| 1.3.5 | P1 | Send a connection request from viewer. Let the host ignore it for 60 seconds. | Viewer times out with message "Connection request timed out". Host dialog dismisses automatically. | ☐ Pass ☐ Fail | |
| 1.3.6 | P1 | Host has a password set. Viewer enters the correct password before clicking Connect. | Connection proceeds normally after host accepts. | ☐ Pass ☐ Fail | |
| 1.3.7 | P0 | Host has a password set. Viewer enters the wrong password. | Viewer sees "Incorrect password" error. Connection is not established. | ☐ Pass ☐ Fail | |

### 1.4 Accept / Reject

| # | Priority | Steps | Expected Result | Result | Notes |
|---|----------|-------|----------------|--------|-------|
| 1.4.1 | P0 | Host receives incoming request dialog. Click **Accept**. | Viewer UI transitions from "Waiting…" to the active session screen. WebRTC negotiation begins. | ☐ Pass ☐ Fail | |
| 1.4.2 | P0 | Host receives incoming request dialog. Click **Reject**. | Viewer sees "Connection rejected by host" message. No session is created. | ☐ Pass ☐ Fail | |
| 1.4.3 | P1 | Host accepts. Verify the session panel shows on both ends with the connected peer's identifier. | Both ends display a session panel with peer name/ID. | ☐ Pass ☐ Fail | |
| 1.4.4 | P2 | While one session is active, a second viewer attempts to connect to the same host. | Host receives new request dialog. Host can accept or reject independently. (Or system enforces single-viewer policy — document the actual behavior.) | ☐ Pass ☐ Fail | |

---

## 2. Screen Sharing

### 2.1 Source Picker

| # | Priority | Steps | Expected Result | Result | Notes |
|---|----------|-------|----------------|--------|-------|
| 2.1.1 | P0 | After session is established, Host clicks "Share Screen". | A source picker dialog appears listing all screens and open application windows with thumbnail previews. | ☐ Pass ☐ Fail | |
| 2.1.2 | P1 | In the source picker, observe screen thumbnails. Open a new application and re-open picker. | New application window appears in the list. Thumbnails are accurate (not stale). | ☐ Pass ☐ Fail | |
| 2.1.3 | P1 | Select a screen source and confirm. | Dialog closes; screen capture begins; source picker closes. | ☐ Pass ☐ Fail | |
| 2.1.4 | P1 | Click "Cancel" in the source picker. | Dialog closes without starting any capture. Session remains active but no stream is sent. | ☐ Pass ☐ Fail | |
| 2.1.5 | P2 | In source picker, hover over a thumbnail. | Tooltip or label shows the window/screen name. | ☐ Pass ☐ Fail | |

### 2.2 Capture Preview

| # | Priority | Steps | Expected Result | Result | Notes |
|---|----------|-------|----------------|--------|-------|
| 2.2.1 | P0 | Host selects a source. Observe the Viewer's session window. | Viewer's video feed begins displaying the host's screen within 3 seconds of source selection. | ☐ Pass ☐ Fail | |
| 2.2.2 | P1 | Move windows on the host's screen. Observe viewer feed. | Viewer feed updates in near-real-time (perceived latency < 150 ms on LAN). | ☐ Pass ☐ Fail | |
| 2.2.3 | P1 | On the host, switch to sharing a different source via the source picker. | Viewer feed transitions to the new source without full reconnect. | ☐ Pass ☐ Fail | |
| 2.2.4 | P1 | Host minimizes the shared application window. | Viewer sees a black or frozen frame (expected behavior is documented in UI); stream does not crash. | ☐ Pass ☐ Fail | |
| 2.2.5 | P2 | Resize the viewer window. | Video feed scales proportionally; no letterboxing overflow or clipping. | ☐ Pass ☐ Fail | |

### 2.3 Stream Quality Badge

| # | Priority | Steps | Expected Result | Result | Notes |
|---|----------|-------|----------------|--------|-------|
| 2.3.1 | P1 | With active stream, observe the quality badge in the viewer toolbar. | Badge displays a quality indicator (e.g., "HD", "SD", "Low") and updates dynamically. | ☐ Pass ☐ Fail | |
| 2.3.2 | P1 | Throttle network bandwidth (using OS network limiter or Clumsy on Windows) to simulate a poor connection. | Quality badge downgrades (e.g., from "HD" to "Low") within 5 seconds. | ☐ Pass ☐ Fail | |
| 2.3.3 | P2 | Restore full bandwidth. | Quality badge upgrades back toward "HD" within 10 seconds. | ☐ Pass ☐ Fail | |
| 2.3.4 | P2 | Hover over the quality badge. | Tooltip shows approximate FPS, resolution, and estimated bitrate. | ☐ Pass ☐ Fail | |

---

## 3. Remote Input

### 3.1 Viewer Indicator

| # | Priority | Steps | Expected Result | Result | Notes |
|---|----------|-------|----------------|--------|-------|
| 3.1.1 | P0 | Viewer requests remote input control; host grants it. | Viewer UI displays a visible **"Remote Input Active"** indicator (banner or badge). Host UI shows a matching indicator that a viewer has control. | ☐ Pass ☐ Fail | |
| 3.1.2 | P0 | Host revokes remote input. | Both indicators disappear within 100 ms of revocation. | ☐ Pass ☐ Fail | |
| 3.1.3 | P1 | Viewer has remote input. Viewer clicks "Release Control" button. | Indicator disappears; input events are no longer forwarded. | ☐ Pass ☐ Fail | |

### 3.2 Pointer Events

| # | Priority | Steps | Expected Result | Result | Notes |
|---|----------|-------|----------------|--------|-------|
| 3.2.1 | P0 | With remote input active, move the mouse in the viewer window. | A cursor moves on the host's screen at the corresponding position (accounting for coordinate scaling). | ☐ Pass ☐ Fail | |
| 3.2.2 | P0 | Click the left mouse button in the viewer window on a known UI element (e.g., a button on host's Notepad). | The host's Notepad button is clicked; expected action occurs. | ☐ Pass ☐ Fail | |
| 3.2.3 | P1 | Perform a right-click in the viewer window. | Context menu appears on the host at the correct position. | ☐ Pass ☐ Fail | |
| 3.2.4 | P1 | Scroll the mouse wheel in the viewer window. | Host's active window scrolls in the expected direction and amount. | ☐ Pass ☐ Fail | |
| 3.2.5 | P1 | Move the cursor to the edges and corners of the viewer video feed. | Cursor on host reaches the edges of the screen without going out of bounds. | ☐ Pass ☐ Fail | |
| 3.2.6 | P2 | Attempt to move the cursor outside the viewer video area (over viewer's own UI chrome). | No pointer events are forwarded when cursor leaves the video element. | ☐ Pass ☐ Fail | |

### 3.3 Keyboard Capture

| # | Priority | Steps | Expected Result | Result | Notes |
|---|----------|-------|----------------|--------|-------|
| 3.3.1 | P0 | With remote input active, click inside the viewer video feed. Type characters in the viewer. | Characters appear on the host's focused application (e.g., Notepad) in the correct order. | ☐ Pass ☐ Fail | |
| 3.3.2 | P1 | Press modifier keys (Ctrl, Alt, Shift) in combination (e.g., Ctrl+C, Ctrl+V). | The corresponding keyboard shortcut executes on the host. | ☐ Pass ☐ Fail | |
| 3.3.3 | P1 | Press the Windows key (Win) or Cmd key (macOS) while in the viewer. | Platform behavior is documented; either the key is forwarded to the host or is intentionally blocked (verify whichever is intended). | ☐ Pass ☐ Fail | |
| 3.3.4 | P1 | Click outside the viewer video area. Type characters. | Characters are NOT forwarded to the host; the viewer's own UI receives the key events. | ☐ Pass ☐ Fail | |
| 3.3.5 | P2 | Use IME input (e.g., Japanese, Chinese) in the viewer. | IME composed text is correctly forwarded to the host. | ☐ Pass ☐ Fail | |

### 3.4 Emergency Stop

| # | Priority | Steps | Expected Result | Result | Notes |
|---|----------|-------|----------------|--------|-------|
| 3.4.1 | P0 | With remote input active, press the emergency stop keyboard shortcut on the **host** (document the shortcut, e.g., Ctrl+Alt+F12). | All remote input is revoked **immediately** (within one frame / < 16 ms). The viewer loses control; indicators disappear. | ☐ Pass ☐ Fail | |
| 3.4.2 | P0 | Click the Emergency Stop button in the host's session panel. | Same immediate revocation behavior as 3.4.1. Requires at most one confirmation click. | ☐ Pass ☐ Fail | |
| 3.4.3 | P0 | After emergency stop, verify that the viewer cannot re-take control without a new explicit grant from the host. | Viewer's "Request Control" button is enabled again, but input does not resume until the host re-grants. | ☐ Pass ☐ Fail | |
| 3.4.4 | P1 | Trigger emergency stop while the viewer is actively typing. | In-flight keystrokes are not delivered after stop. No extra characters appear on host. | ☐ Pass ☐ Fail | |

### 3.5 Visual Feedback on Host

| # | Priority | Steps | Expected Result | Result | Notes |
|---|----------|-------|----------------|--------|-------|
| 3.5.1 | P1 | With remote input active, move the cursor on the viewer side. | Host screen shows a colored ring or cursor overlay indicating the remote cursor position (or the system cursor moves as expected). | ☐ Pass ☐ Fail | |
| 3.5.2 | P2 | Verify the host's taskbar / system tray shows a "being controlled" indicator during remote input. | Tray icon or taskbar badge is visible while remote input is active. | ☐ Pass ☐ Fail | |

---

## 4. Clipboard Sync

### 4.1 Security Warning

| # | Priority | Steps | Expected Result | Result | Notes |
|---|----------|-------|----------------|--------|-------|
| 4.1.1 | P0 | With an active session, navigate to the Clipboard Sync toggle (host or viewer side). Enable it. | A security warning dialog appears **before** sync is activated, explaining that clipboard content will be shared with the remote peer. User must explicitly confirm. | ☐ Pass ☐ Fail | |
| 4.1.2 | P1 | Click "Cancel" on the security warning. | Clipboard sync is NOT enabled. Toggle remains off. | ☐ Pass ☐ Fail | |
| 4.1.3 | P1 | Enable clipboard sync. Disable it. Re-enable it. | Security warning appears again on re-enable (not bypassed after first confirmation). | ☐ Pass ☐ Fail | |

### 4.2 Bidirectional Sync

| # | Priority | Steps | Expected Result | Result | Notes |
|---|----------|-------|----------------|--------|-------|
| 4.2.1 | P0 | With clipboard sync enabled, copy text "Hello from Host" on the host machine. | Within 500 ms, "Hello from Host" is available on the viewer's clipboard. Paste in viewer's text editor to confirm. | ☐ Pass ☐ Fail | |
| 4.2.2 | P0 | Copy text "Hello from Viewer" on the viewer machine. | Within 500 ms, "Hello from Viewer" is available on the host's clipboard. | ☐ Pass ☐ Fail | |
| 4.2.3 | P1 | Copy text on the host. Immediately copy different text on the viewer before sync completes. | The most recent copy (viewer's) wins on both ends, or the system resolves the race gracefully without crashing. | ☐ Pass ☐ Fail | |
| 4.2.4 | P2 | Copy a URL string (including https:// and query parameters). | URL is synced exactly, including all special characters. | ☐ Pass ☐ Fail | |

### 4.3 Large Text Rejection

| # | Priority | Steps | Expected Result | Result | Notes |
|---|----------|-------|----------------|--------|-------|
| 4.3.1 | P0 | Generate a string larger than 1 MB. Copy it to the clipboard. | Clipboard sync does NOT attempt to transmit it. A toast or indicator message explains "Clipboard content too large to sync (limit: 1 MB)". | ☐ Pass ☐ Fail | |
| 4.3.2 | P1 | Copy text exactly at the limit boundary (e.g., 1,048,576 bytes). | Behavior at the boundary is documented (inclusive/exclusive). Either syncs or is rejected consistently. | ☐ Pass ☐ Fail | |

### 4.4 Sync Indicator

| # | Priority | Steps | Expected Result | Result | Notes |
|---|----------|-------|----------------|--------|-------|
| 4.4.1 | P1 | Observe the clipboard sync indicator while sync is enabled. | A visual indicator (icon or badge) shows that sync is active. | ☐ Pass ☐ Fail | |
| 4.4.2 | P1 | After a successful sync event (copy on one side, paste on other), observe the indicator. | Indicator briefly animates / pulses to show a sync event occurred. | ☐ Pass ☐ Fail | |
| 4.4.3 | P1 | Disable clipboard sync. | Indicator disappears or changes to "off" state. | ☐ Pass ☐ Fail | |

---

## 5. File Transfer

### 5.1 Consent Dialog

| # | Priority | Steps | Expected Result | Result | Notes |
|---|----------|-------|----------------|--------|-------|
| 5.1.1 | P0 | Viewer initiates a file transfer (drags a file to the transfer zone or uses "Send File" button). | Host receives a consent dialog showing: sender's ID, filename, and file size. Dialog has **Accept** and **Reject** buttons. | ☐ Pass ☐ Fail | |
| 5.1.2 | P0 | Host clicks **Reject** on the consent dialog. | Transfer is cancelled. Viewer sees "Transfer rejected by host". No file is written to host disk. | ☐ Pass ☐ Fail | |
| 5.1.3 | P0 | Host clicks **Accept**. | Transfer begins; progress bar appears on both host and viewer. | ☐ Pass ☐ Fail | |
| 5.1.4 | P1 | Let the consent dialog time out (if a timeout is implemented). | Transfer is auto-rejected after timeout. Viewer is notified. | ☐ Pass ☐ Fail | |

### 5.2 Progress Bar

| # | Priority | Steps | Expected Result | Result | Notes |
|---|----------|-------|----------------|--------|-------|
| 5.2.1 | P0 | Transfer a 10 MB file. Observe the progress bar. | Progress bar updates smoothly from 0% to 100% showing transferred / total bytes. | ☐ Pass ☐ Fail | |
| 5.2.2 | P1 | Observe the transfer speed indicator (if present). | Transfer speed is displayed in MB/s or KB/s and updates every second. | ☐ Pass ☐ Fail | |
| 5.2.3 | P1 | After transfer completes, verify the file on the host. | File exists in the designated download directory with the correct filename and size. | ☐ Pass ☐ Fail | |

### 5.3 Cancel

| # | Priority | Steps | Expected Result | Result | Notes |
|---|----------|-------|----------------|--------|-------|
| 5.3.1 | P0 | Start a 50 MB file transfer. Click Cancel when the progress bar is at approximately 50%. | Transfer halts immediately. Both progress bars disappear or show "Cancelled". | ☐ Pass ☐ Fail | |
| 5.3.2 | P0 | After cancelling, check the host's download directory. | No partial file (or a clearly named `.part` file that is subsequently cleaned up). No orphan files remain after cleanup. | ☐ Pass ☐ Fail | |
| 5.3.3 | P1 | Both host and viewer have Cancel buttons during transfer. Test cancel from the viewer side. | Transfer is cancelled from the viewer side with the same cleanup behavior. | ☐ Pass ☐ Fail | |

### 5.4 Large Files Rejected

| # | Priority | Steps | Expected Result | Result | Notes |
|---|----------|-------|----------------|--------|-------|
| 5.4.1 | P0 | Attempt to send a file exactly at 100 MB. | Transfer is allowed (or rejected if the limit is < 100 MB — confirm the defined limit). | ☐ Pass ☐ Fail | |
| 5.4.2 | P0 | Attempt to send a file of 101 MB (exceeding the 100 MB limit). | Transfer is rejected **before** the consent dialog appears. Viewer sees "File too large (max: 100 MB)". | ☐ Pass ☐ Fail | |
| 5.4.3 | P0 | Attempt to send a 1 GB file. | Same rejection behavior as 5.4.2. No buffer is allocated; the rejection is immediate. | ☐ Pass ☐ Fail | |

### 5.5 Path Traversal Filename Sanitization

| # | Priority | Steps | Expected Result | Result | Notes |
|---|----------|-------|----------------|--------|-------|
| 5.5.1 | P0 | Craft a file transfer request with filename `../../../etc/passwd` (test via developer tooling / data channel injection). | Host receives the transfer but filename is sanitized to `passwd` or `_etc_passwd`. File is written to the designated download directory, NOT to a system path. | ☐ Pass ☐ Fail | |
| 5.5.2 | P0 | Test filename with Windows path traversal: `..\..\..\Windows\System32\evil.dll`. | Filename is sanitized; no file is written to system directories. | ☐ Pass ☐ Fail | |
| 5.5.3 | P1 | Test filename with null bytes: `evil\0.txt`. | Null bytes are stripped or the transfer is rejected. | ☐ Pass ☐ Fail | |
| 5.5.4 | P1 | Test filename with only dots: `...`. | Filename is sanitized to a safe alternative (e.g., `download`). | ☐ Pass ☐ Fail | |

---

## 6. Session Permissions

### 6.1 Grant / Revoke UI

| # | Priority | Steps | Expected Result | Result | Notes |
|---|----------|-------|----------------|--------|-------|
| 6.1.1 | P0 | Viewer requests remote input permission. Host's permission panel shows an incoming request. | Request is clearly labeled; host can grant or deny in one click. | ☐ Pass ☐ Fail | |
| 6.1.2 | P0 | Host grants remote input. Verify both UIs update. | Host's permission panel shows "Remote Input: Granted". Viewer's UI shows the "Remote Input Active" indicator. Update is reflected within 100 ms. | ☐ Pass ☐ Fail | |
| 6.1.3 | P0 | Host revokes remote input via the permission panel. | Both UIs update to show "Remote Input: Revoked" within 100 ms. Viewer loses input control immediately. | ☐ Pass ☐ Fail | |
| 6.1.4 | P1 | Grant clipboard sync permission. Revoke it. Re-grant it. | UI state is consistent across all three transitions. No stale state remains. | ☐ Pass ☐ Fail | |
| 6.1.5 | P1 | Grant file transfer permission. Verify the viewer's file transfer UI becomes active. | Viewer's "Send File" button is enabled only when file transfer permission is granted. | ☐ Pass ☐ Fail | |

### 6.2 Permission Denied Toast

| # | Priority | Steps | Expected Result | Result | Notes |
|---|----------|-------|----------------|--------|-------|
| 6.2.1 | P0 | Without remote input permission, viewer attempts to click inside the video feed to trigger input. | A toast notification appears on the viewer: "Remote input not permitted. Request access from host." | ☐ Pass ☐ Fail | |
| 6.2.2 | P1 | Without clipboard permission, viewer tries to paste into a clipboard sync field. | Toast appears: "Clipboard sync not enabled. Ask host to enable it." | ☐ Pass ☐ Fail | |
| 6.2.3 | P1 | Verify the toast auto-dismisses after a defined period (e.g., 3 seconds). | Toast disappears without user interaction after the timeout. | ☐ Pass ☐ Fail | |
| 6.2.4 | P2 | Trigger multiple denied actions in quick succession. | Toasts do not stack infinitely; they are deduplicated or rate-limited. | ☐ Pass ☐ Fail | |

### 6.3 Emergency Stop Revokes All

| # | Priority | Steps | Expected Result | Result | Notes |
|---|----------|-------|----------------|--------|-------|
| 6.3.1 | P0 | Grant all permissions (remote input, clipboard, file transfer). Trigger emergency stop. | All three permissions are revoked simultaneously. All UI indicators update within 100 ms. | ☐ Pass ☐ Fail | |
| 6.3.2 | P0 | After emergency stop, verify no permissions are auto-re-granted. | Host must explicitly re-grant each permission after emergency stop. | ☐ Pass ☐ Fail | |

---

## 7. Safety

### 7.1 Warning Banner for Risky Permissions

| # | Priority | Steps | Expected Result | Result | Notes |
|---|----------|-------|----------------|--------|-------|
| 7.1.1 | P0 | Grant remote input permission to a viewer. Observe the host's session panel. | A warning banner appears prominently: e.g., "⚠️ Remote control is active — a viewer can control your mouse and keyboard." | ☐ Pass ☐ Fail | |
| 7.1.2 | P1 | Grant clipboard sync. Observe warning state. | Warning banner updates or a separate indicator appears for clipboard sync risk. | ☐ Pass ☐ Fail | |
| 7.1.3 | P1 | Revoke all risky permissions. | Warning banner disappears. | ☐ Pass ☐ Fail | |
| 7.1.4 | P2 | Minimize the host app to the tray while remote input is active. | System tray icon or OS notification indicates that remote control is still active. | ☐ Pass ☐ Fail | |

### 7.2 Emergency Stop Button

| # | Priority | Steps | Expected Result | Result | Notes |
|---|----------|-------|----------------|--------|-------|
| 7.2.1 | P0 | Locate the Emergency Stop button in the host's UI. Count the number of clicks required to activate it. | Emergency stop requires **at most 1 confirmation click** (single-click to activate; optional single confirmation dialog). | ☐ Pass ☐ Fail | |
| 7.2.2 | P0 | Trigger emergency stop via the button. | All remote permissions are revoked. Session may continue (host decides) or disconnect. An audit event is logged. | ☐ Pass ☐ Fail | |
| 7.2.3 | P1 | Verify Emergency Stop button is visible and accessible from all host UI states (permission panel minimized, fullscreen sharing active, etc.). | Button is always reachable without more than 1 navigation step. | ☐ Pass ☐ Fail | |
| 7.2.4 | P1 | Trigger emergency stop via keyboard shortcut. | Same behavior as button press. Shortcut is documented in the UI (e.g., tooltip on hover). | ☐ Pass ☐ Fail | |

---

## 8. Disconnection

### 8.1 Graceful Disconnect

| # | Priority | Steps | Expected Result | Result | Notes |
|---|----------|-------|----------------|--------|-------|
| 8.1.1 | P0 | With an active session (no special permissions), click "End Session" on the **host**. | Session is terminated. Viewer sees "Host ended the session" message. Both UIs return to the idle/home state cleanly. | ☐ Pass ☐ Fail | |
| 8.1.2 | P0 | With an active session, click "Disconnect" on the **viewer**. | Session is terminated. Host sees "Viewer disconnected" message. Both UIs return to idle/home state. | ☐ Pass ☐ Fail | |
| 8.1.3 | P0 | After disconnect, verify all permissions are cleared. | No residual "Active" indicators for remote input, clipboard, or file transfer remain. | ☐ Pass ☐ Fail | |
| 8.1.4 | P0 | After disconnect, verify no WebRTC or WebSocket connections remain open (check DevTools Network tab). | All RTC peer connections and data channels are closed. No memory leaks from dangling connection objects. | ☐ Pass ☐ Fail | |
| 8.1.5 | P1 | After disconnect, the host is immediately ready to accept new connections. | The "Your RemoteDesk ID" panel is shown and status is "Ready". No restart required. | ☐ Pass ☐ Fail | |
| 8.1.6 | P1 | After disconnect, the viewer can immediately start a new connection to the same or different host. | "Connect To" field is cleared and re-enabled. | ☐ Pass ☐ Fail | |
| 8.1.7 | P1 | During an active session with remote input enabled, abruptly kill the viewer process (via Task Manager / kill). | Host detects the disconnection within the heartbeat timeout (≤ 30 s). All permissions are revoked. UI returns to idle. | ☐ Pass ☐ Fail | |
| 8.1.8 | P1 | During an active session, simulate network loss (disable network adapter). | Both sides detect network loss within the heartbeat timeout. UI shows "Connection lost" or similar. No crash. | ☐ Pass ☐ Fail | |

---

## Sign-Off

| Area | Tester | Date | Pass / Fail / Partial |
|------|--------|------|----------------------|
| 1. Auth & Connection | | | |
| 2. Screen Sharing | | | |
| 3. Remote Input | | | |
| 4. Clipboard Sync | | | |
| 5. File Transfer | | | |
| 6. Session Permissions | | | |
| 7. Safety | | | |
| 8. Disconnection | | | |

**Overall Release Recommendation:** ☐ APPROVED ☐ CONDITIONAL ☐ BLOCKED

**Notes / Blockers:**

```
(free text)
```
