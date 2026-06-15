# RemoteDesk Manual QA Checklist

This document outlines the manual quality assurance (QA) checklist for the new features implemented in RemoteDesk, focusing on File Transfer, Clipboard Sync, and In-Session Chat. This checklist should be performed on both host and viewer clients in various scenarios.

## 1. General Setup

- [ ] Verify both host and viewer clients are running the latest build.
- [ ] Establish a stable remote desktop session between host and viewer.
- [ ] Ensure network conditions are normal (no artificial latency or packet loss).

## 2. File Transfer Protocol

### 2.1 Basic Functionality
- [ ] **Send File (Host to Viewer):**
    - [ ] Initiate file transfer from host to viewer.
    - [ ] Verify `IncomingFileConsent` dialog appears on viewer side.
    - [ ] Accept transfer on viewer side.
    - [ ] Verify file transfer completes successfully.
    - [ ] Verify transferred file integrity (e.g., open and check content).
    - [ ] Repeat with different file types (text, image, PDF, executable).
- [ ] **Send File (Viewer to Host):**
    - [ ] Initiate file transfer from viewer to host.
    - [ ] Verify `IncomingFileConsent` dialog appears on host side.
    - [ ] Accept transfer on host side.
    - [ ] Verify file transfer completes successfully.
    - [ ] Verify transferred file integrity.
- [ ] **Reject File Transfer:**
    - [ ] Initiate file transfer.
    - [ ] Reject transfer on receiving side.
    - [ ] Verify transfer is cancelled and no file is received.

### 2.2 Advanced Functionality
- [ ] **Pause/Resume Transfer:**
    - [ ] Start a large file transfer.
    - [ ] Pause the transfer mid-way.
    - [ ] Verify transfer status updates to PAUSED.
    - [ ] Resume the transfer.
    - [ ] Verify transfer resumes from where it left off and completes.
- [ ] **Cancel Transfer:**
    - [ ] Start a file transfer.
    - [ ] Cancel the transfer from sender side.
    - [ ] Verify transfer is terminated on both sides.
    - [ ] Cancel the transfer from receiver side (after accepting).
    - [ ] Verify transfer is terminated on both sides.
- [ ] **Network Interruption during Transfer:**
    - [ ] Start a large file transfer.
    - [ ] Simulate network disconnection (briefly).
    - [ ] Verify transfer attempts to retry or fails gracefully.
    - [ ] Reconnect network and observe behavior.
- [ ] **Large File Transfer:**
    - [ ] Transfer a file close to the `MAX_FILE_SIZE` limit (e.g., 1.5GB).
    - [ ] Verify successful completion.
- [ ] **File Size Limit Enforcement:**
    - [ ] Attempt to transfer a file larger than `MAX_FILE_SIZE`.
    - [ ] Verify transfer is prevented or an error message is displayed.
- [ ] **Filename Sanitization:**
    - [ ] Attempt to send a file with special characters or potentially malicious names (e.g., `../../../../etc/passwd`).
    - [ ] Verify the filename is sanitized on the receiving end.

### 2.3 UI/UX
- [ ] Verify `FileTransferPanel` accurately displays active transfers.
- [ ] Verify progress bars update correctly.
- [ ] Verify cancel/retry buttons function as expected.
- [ ] Verify `IncomingFileConsent` dialog is clear and responsive.

## 3. Clipboard Sync Protocol

### 3.1 Basic Functionality
- [ ] **Enable Sync:**
    - [ ] Verify clipboard sync is disabled by default.
    - [ ] Enable clipboard sync on both host and viewer.
    - [ ] Verify `ClipboardPanel` status updates.
- [ ] **Host to Viewer Sync:**
    - [ ] Copy text on host.
    - [ ] Verify text appears in viewer's clipboard.
    - [ ] Paste text on viewer to confirm.
- [ ] **Viewer to Host Sync:**
    - [ ] Copy text on viewer.
    - [ ] Verify text appears in host's clipboard.
    - [ ] Paste text on host to confirm.

### 3.2 Advanced Functionality
- [ ] **Disable Sync:**
    - [ ] Enable sync, then disable it on one side.
    - [ ] Verify clipboard content is no longer synchronized.
- [ ] **Conflict Prevention:**
    - [ ] Copy text on host, then immediately copy different text on viewer.
    - [ ] Verify the expected behavior (e.g., last copied wins).
- [ ] **Clipboard Size Limit:**
    - [ ] Attempt to copy a very large text block (e.g., 1MB).
    - [ ] Verify it syncs or an error/truncation occurs gracefully.

### 3.3 UI/UX
- [ ] Verify `ClipboardPanel` toggle works and reflects current state.
- [ ] Verify `Last synced preview` updates correctly.
- [ ] Verify permission indicators are accurate.

## 4. In-Session Chat

### 4.1 Basic Functionality
- [ ] **Send Message (Host to Viewer):**
    - [ ] Host sends a message.
    - [ ] Verify message appears in viewer's `ChatPanel`.
- [ ] **Send Message (Viewer to Host):**
    - [ ] Viewer sends a message.
    - [ ] Verify message appears in host's `ChatPanel`.
- [ ] **Multiple Messages:**
    - [ ] Send several messages rapidly from both sides.
    - [ ] Verify all messages appear in correct order with timestamps.

### 4.2 System Messages
- [ ] **Session Events:**
    - [ ] Verify system messages appear for events like user join/leave (if implemented).
    - [ ] Verify system messages for file transfer start/end (if integrated).

### 4.3 UI/UX
- [ ] Verify `ChatPanel` displays messages correctly.
- [ ] Verify message input field is functional.
- [ ] Verify scroll behavior (auto-scroll to bottom on new message).
- [ ] Verify timestamps are formatted correctly.

## 5. Backend Integration (Audit Events)

- [ ] **File Transfer Audit:**
    - [ ] Initiate, complete, and fail file transfers.
    - [ ] Verify corresponding audit events are logged on the backend.
- [ ] **Clipboard Sync Audit:**
    - [ ] Enable and disable clipboard sync.
    - [ ] Verify corresponding audit events are logged on the backend.
- [ ] **Chat Audit:**
    - [ ] Send chat messages.
    - [ ] Verify corresponding audit events are logged on the backend.

## 6. Performance & Resource Usage

- [ ] Monitor CPU/Memory usage during heavy file transfers.
- [ ] Monitor network bandwidth usage during file transfers.
- [ ] Verify application remains responsive during all operations.

## 7. Error Handling

- [ ] Verify appropriate error messages are displayed for failed operations (e.g., file transfer failed, permission denied).
- [ ] Check console logs for unexpected errors or warnings during all tests.
