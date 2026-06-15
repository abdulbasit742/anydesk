# RemoteDesk Clipboard Sync and File Transfer Comprehensive QA Checklist

This document consolidates the quality assurance checklists and test plans for the RemoteDesk clipboard synchronization and file transfer features. It aims to provide a holistic view of the testing required to ensure functionality, security, performance, and user experience.

## 1. Clipboard Sync QA Checklist

### 1.1 Functional Tests

*   [ ] Verify clipboard sync is **disabled by default** on both host and viewer.
*   [ ] Verify host can **enable** clipboard sync.
*   [ ] Verify viewer can **enable** clipboard sync.
*   [ ] Verify clipboard sync only activates when **both host and viewer have opted-in**.
*   [ ] Verify text copied on host appears on viewer's clipboard when enabled.
*   [ ] Verify text copied on viewer appears on host's clipboard when enabled.
*   [ ] Verify clipboard sync **stops if host disables it**.
*   [ ] Verify clipboard sync **stops if viewer disables it**.
*   [ ] Verify clipboard status badge/indicator correctly reflects the state (Disabled, Pending Host, Pending Viewer, Enabled).
*   [ ] Verify clipboard warning banner appears when sync is disabled or pending.
*   [ ] Verify copying large text (e.g., 500KB, 1MB) works correctly within limits.
*   [ ] Verify copying text exceeding `MAX_CLIPBOARD_TEXT_SIZE_BYTES` fails gracefully and does not sync.
*   [ ] Verify duplicate clipboard content is not re-sent/re-processed unnecessarily.
*   [ ] Verify in-session chat functionality is not affected by clipboard sync state.
*   [ ] Verify clipboard content is correctly synchronized across different operating systems (if applicable, e.g., Windows host, macOS viewer).

### 1.2 Security Tests

*   [ ] Attempt to bypass clipboard sync permission toggles.
*   [ ] Attempt to send malformed clipboard messages to crash the application or gain unauthorized access.
*   [ ] Verify renderer process cannot directly access system clipboard.
*   [ ] Verify all clipboard operations are mediated via Electron main process.
*   [ ] Verify clipboard content is sanitized (if any non-text content were to be introduced).
*   [ ] Verify no sensitive data is logged unnecessarily during clipboard operations.

### 1.3 Performance Tests

*   [ ] Measure latency for small text transfers.
*   [ ] Measure latency for large text transfers (within limits).
*   [ ] Monitor CPU/memory usage during active clipboard sync.
*   [ ] Verify application remains responsive during clipboard sync.

### 1.4 Edge Cases & Error Handling

*   [ ] Verify behavior when network connection is lost during sync.
*   [ ] Verify behavior when one peer disconnects during sync.
*   [ ] Verify error messages are user-friendly and informative.
*   [ ] Verify clipboard history is cleared or handled appropriately on session end.

## 2. File Transfer QA Checklist

### 2.1 Functional Tests

*   [ ] Verify file transfer is **disabled by default** on both host and viewer.
*   [ ] Verify host can initiate a file transfer request.
*   [ ] Verify viewer receives file transfer request with correct file metadata (name, size, type).
*   [ ] Verify viewer can **accept** an incoming file transfer.
*   [ ] Verify viewer can **reject** an incoming file transfer.
*   [ ] Verify file transfer only proceeds when receiver explicitly accepts.
*   [ ] Verify transferred file integrity (checksum verification, if implemented).
*   [ ] Verify progress bar accurately reflects transfer progress.
*   [ ] Verify transfer speed and ETA are displayed and updated correctly.
*   [ ] Verify user can **cancel** an ongoing transfer (both sender and receiver).
*   [ ] Verify user can **pause and resume** an ongoing transfer (both sender and receiver).
*   [ ] Verify multiple concurrent file transfers are handled correctly (up to `MAX_CONCURRENT_FILE_TRANSFERS`).
*   [ ] Verify file transfer history is maintained (if implemented).
*   [ ] Verify transferred files are saved to the location chosen by the receiver.
*   [ ] Verify file transfer UI components (FileTransferPanel, IncomingFileConsentDialog, TransferRow, TransferProgressBar, FileDropZone, FilePickerButton, TransferErrorBanner) function as expected.

### 2.2 Security Tests

*   [ ] Attempt to send files exceeding `MAX_FILE_SIZE_BYTES` (should be rejected).
*   [ ] Attempt path traversal attacks in filenames (e.g., `../secret.txt`, `..\..\windows\system32\evil.dll`).
*   [ ] Attempt to use Windows reserved names as filenames (e.g., `CON.txt`, `NUL.jpg`).
*   [ ] Attempt to send files with excessively long filenames.
*   [ ] Verify renderer process cannot directly access the file system for read/write operations.
*   [ ] Verify all file operations are mediated via Electron main process using token-based access.
*   [ ] Verify no arbitrary file writes are possible; files are only written to user-approved save locations.
*   [ ] Verify file content is not modified during transfer (if checksums are implemented).
*   [ ] Verify error handling for corrupted file chunks.
*   [ ] Verify sensitive data is not logged unnecessarily during file transfer operations.

### 2.3 Performance Tests

*   [ ] Measure transfer speed for small files (e.g., 1KB, 100KB).
*   [ ] Measure transfer speed for medium files (e.g., 1MB, 10MB).
*   [ ] Measure transfer speed for large files (e.g., 50MB, 100MB).
*   [ ] Monitor CPU/memory usage during active file transfers.
*   [ ] Verify application remains responsive during file transfers.

### 2.4 Edge Cases & Error Handling

*   [ ] Verify behavior when network connection is lost during transfer.
*   [ ] Verify behavior when one peer disconnects during transfer.
*   [ ] Verify behavior when disk space is insufficient at the receiver.
*   [ ] Verify behavior when file permissions prevent saving at the chosen location.
*   [ ] Verify error messages are user-friendly and informative.
*   [ ] Verify behavior when a file is deleted or moved on the sender's side after selection but before transfer.
*   [ ] Verify behavior when a file is corrupted on the sender's side.

## 3. Large File Test Plan

*   [ ] **TC-LFT-001: Successful Large File Transfer (Max Size)**: Transfer a file of `MAX_FILE_SIZE_BYTES` from host to viewer under optimal network conditions. Expected: File transfers successfully, data integrity is maintained, and transfer status is reported as `Completed`.
*   [ ] **TC-LFT-002: Large File Transfer under Constrained Network**: Transfer a file of `MAX_FILE_SIZE_BYTES` from host to viewer under simulated constrained network conditions (e.g., high latency, low bandwidth, packet loss). Expected: File transfer eventually completes (may take longer), data integrity is maintained, and transfer status is `Completed`. Application remains responsive.
*   [ ] **TC-LFT-003: Transfer File Exceeding Max Size**: Attempt to initiate a transfer of a file slightly larger than `MAX_FILE_SIZE_BYTES`. Expected: The transfer request is rejected by the main process before initiation, and an appropriate error message is displayed to the user.
*   [ ] **TC-LFT-004: Cancel Large File Transfer Mid-way**: Initiate a transfer of a large file and cancel it from the sender side after approximately 50% completion. Expected: The transfer is aborted on both sender and receiver sides. No partial file remains on the receiver, or if it does, it's clearly marked as incomplete/corrupted and cleaned up.
*   [ ] **TC-LFT-005: Pause/Resume Large File Transfer**: Initiate a transfer of a large file, pause it after some progress, and then resume it. Expected: The transfer pauses and resumes correctly, continuing from where it left off. The file completes successfully.
*   [ ] **TC-LFT-006: Multiple Concurrent Large File Transfers**: Initiate multiple large file transfers concurrently (up to `MAX_CONCURRENT_FILE_TRANSFERS`). Expected: All transfers proceed, potentially with reduced individual speeds. The application remains stable, and all files complete successfully.
*   [ ] **TC-LFT-007: Disconnect During Large File Transfer**: Initiate a large file transfer and then abruptly disconnect the remote session (e.g., close the viewer application). Expected: The transfer is terminated. Resources are cleaned up on both sides. Reconnecting should not automatically resume the transfer (requires re-initiation).

## 4. Receiver Consent Test Plan

*   [ ] **TC-RCT-001: Basic Accept Scenario**: Host initiates a file transfer. Viewer receives the consent dialog and clicks `Accept`. Expected: The file transfer begins and completes successfully. The file is saved to the chosen location.
*   [ ] **TC-RCT-002: Basic Reject Scenario**: Host initiates a file transfer. Viewer receives the consent dialog and clicks `Reject`. Expected: The file transfer is immediately cancelled. The host receives a notification that the transfer was rejected. No file data is transferred or saved on the viewer's side.
*   [ ] **TC-RCT-003: Consent Dialog with Detailed File Info**: Host initiates a file transfer with a file having a descriptive name, specific type, and reasonable size. Viewer receives the consent dialog. Expected: The consent dialog accurately displays the file's name, size (in a human-readable format), and type. The information is clear and helps the user make an informed decision.
*   [ ] **TC-RCT-004: Multiple Concurrent Transfer Requests**: Host attempts to initiate multiple file transfer requests in quick succession. Expected: The viewer receives consent dialogs sequentially or in a manageable queue. Each request requires individual consent. No transfers proceed without explicit acceptance.
*   [ ] **TC-RCT-005: Consent Timeout (if applicable)**: Host initiates a file transfer. Viewer receives the consent dialog but does not respond within a predefined timeout period. Expected: The consent dialog automatically closes, and the transfer request is implicitly rejected. The host receives a notification that the transfer timed out or was rejected.
*   [ ] **TC-RCT-006: Viewer Disconnects During Consent Prompt**: Host initiates a file transfer. Viewer receives the consent dialog, but then the viewer application closes or the session disconnects. Expected: The transfer request is cancelled. The host receives a notification that the transfer failed due to disconnection. No file data is transferred.
*   [ ] **TC-RCT-007: Host Cancels Request During Consent Prompt**: Host initiates a file transfer. Viewer receives the consent dialog. Before the viewer responds, the host cancels the transfer request. Expected: The consent dialog on the viewer's side is dismissed. The viewer receives a notification that the transfer was cancelled by the sender.

## 5. Permission Denial Test Plan

### 5.1 Clipboard Sync Permission Denial

*   [ ] **TC-CPD-001: Host Denies Clipboard Sync**: Host disables clipboard sync while viewer has it enabled. Expected: Clipboard sync immediately stops. Both host and viewer UIs reflect the disabled state. No further clipboard content is synchronized.
*   [ ] **TC-CPD-002: Viewer Denies Clipboard Sync**: Viewer disables clipboard sync while host has it enabled. Expected: Clipboard sync immediately stops. Both host and viewer UIs reflect the disabled state. No further clipboard content is synchronized.
*   [ ] **TC-CPD-003: Attempt Sync When Disabled by Default**: Attempt to copy/paste content when clipboard sync is in its default (disabled) state. Expected: No clipboard content is synchronized. No errors are displayed, as this is the expected behavior.
*   [ ] **TC-CPD-004: Attempt Sync When One Side is Pending**: Host enables clipboard sync, but viewer has not yet enabled it (or vice-versa). Attempt to copy/paste content. Expected: No clipboard content is synchronized. The UI clearly indicates that sync is pending consent from the other party.

### 5.2 File Transfer Permission Denial

*   [ ] **TC-FTPD-001: Receiver Rejects File Transfer Request**: Host initiates a file transfer. Viewer receives the consent dialog and explicitly clicks `Reject`. Expected: The file transfer is cancelled. The host receives a notification that the transfer was rejected. No file data is transferred.
*   [ ] **TC-FTPD-002: Receiver Denies Save Location**: Host initiates a file transfer. Viewer accepts the transfer, but then cancels the native save file dialog. Expected: The file transfer is cancelled. The host receives a notification that the transfer was cancelled by the receiver. No file data is transferred.
*   [ ] **TC-FTPD-003: Host Cancels Transfer After Receiver Acceptance**: Host initiates a file transfer. Viewer accepts the transfer, and the transfer begins. Host then cancels the transfer. Expected: The transfer is aborted on both sides. Any partially transferred file on the receiver side is cleaned up or marked as incomplete.
*   [ ] **TC-FTPD-004: Attempt Transfer When Disabled by Default**: Attempt to initiate a file transfer when the feature is in its default (disabled) state. Expected: The transfer initiation is blocked, and the UI indicates that file transfer is disabled. No errors are displayed, as this is the expected behavior.
*   [ ] **TC-FTPD-005: Insufficient Disk Space on Receiver**: Host initiates a file transfer to a viewer with insufficient disk space at the chosen save location. Expected: The transfer fails. The receiver receives an error notification about insufficient disk space. The host receives a notification about the transfer failure.

## 6. Abuse Prevention Checklist

*   [ ] **Disabled by Default**: Both file transfer and clipboard sync are disabled by default and require explicit user opt-in.
*   [ ] **Mutual Consent**: Both features require mutual consent from both the host and the viewer to operate.
*   [ ] **Renderer Isolation**: The Electron renderer process is strictly isolated from direct file system and system clipboard access. All operations are mediated by the Electron main process.
*   [ ] **Token-Based Access Control**: File operations use a token-based access control model to prevent arbitrary path access.
*   [ ] **Input Sanitization**: All incoming data, including filenames and clipboard content, is rigorously sanitized.
*   [ ] **Receiver Consent (File Transfer)**: Every incoming file transfer requires explicit consent from the receiver via a clear and informative dialog.
*   [ ] **Filename Sanitization (File Transfer)**: Filenames are sanitized to prevent path traversal attacks (`../`, `..\`), invalid characters, and Windows reserved names.
*   [ ] **File Size Limits (File Transfer)**: File transfers are subject to strict size limits (`MAX_FILE_SIZE_BYTES`) to prevent resource exhaustion and denial-of-service attacks.
*   [ ] **No Arbitrary Path Writes (File Transfer)**: Files are only written to locations explicitly chosen by the receiver via a native save dialog.
*   [ ] **Concurrent Transfer Limits (File Transfer)**: The number of concurrent file transfers is limited (`MAX_CONCURRENT_FILE_TRANSFERS`) to prevent overwhelming the system or network.
*   [ ] **Transfer Cancellation (File Transfer)**: Both sender and receiver can cancel an ongoing transfer at any time.
*   [ ] **File Type Restrictions (Optional)**: Consider implementing restrictions on potentially dangerous file types (e.g., executables, scripts) if deemed necessary for the specific use case.
*   [ ] **Size Limits (Clipboard Sync)**: Clipboard synchronization is subject to strict size limits (`MAX_CLIPBOARD_TEXT_SIZE_BYTES`) to prevent resource exhaustion.
*   [ ] **Duplicate Prevention (Clipboard Sync)**: Mechanisms are in place to prevent redundant clipboard updates, reducing unnecessary processing and potential loops.
*   [ ] **Text-Only Support (Clipboard Sync - Current)**: Currently, only text clipboard synchronization is supported, reducing the risk of malicious payloads embedded in rich text or files.
*   [ ] **Sanitization (Clipboard Sync - Future)**: If rich text or file clipboard sync is added, rigorous sanitization and validation must be implemented.
*   [ ] **Logging**: Implement robust logging for file transfer and clipboard sync operations, including successes, failures, and permission changes, for security auditing purposes.
*   [ ] **Rate Limiting**: Consider implementing rate limiting for file transfer requests and clipboard updates to prevent abuse.
*   [ ] **Anomaly Detection**: Monitor for unusual patterns of activity, such as excessive file transfer requests or unusually large clipboard updates.
*   [ ] **Clear Warnings**: Display clear warnings and explanations when users enable file transfer or clipboard sync, highlighting the potential risks.
*   [ ] **Documentation**: Provide comprehensive documentation on the security features and best practices for using file transfer and clipboard sync safely.
