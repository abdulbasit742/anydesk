# Permission Denial Test Plan for RemoteDesk File Transfer and Clipboard Sync

This document outlines the test plan for verifying the correct behavior of RemoteDesk when permissions for file transfer and clipboard synchronization are denied or revoked.

## Objectives

*   To ensure that file transfers and clipboard sync do not proceed when permissions are explicitly denied by either the host or the viewer.
*   To verify that the application provides clear feedback and appropriate error states when permissions are denied.
*   To test scenarios where permissions are revoked during an active operation.

## Test Environment

*   **Operating Systems**: Windows 10/11, macOS (latest two versions), Ubuntu (latest LTS).
*   **Network Conditions**: Stable network connection.
*   **Roles**: Host, Viewer.

## Test Data

*   **Clipboard**: Various text content (small, large, special characters).
*   **Files**: Small and medium files of various types.

## Test Cases: Clipboard Sync Permission Denial

### TC-CPD-001: Host Denies Clipboard Sync

*   **Description**: Host disables clipboard sync while viewer has it enabled.
*   **Expected Result**: Clipboard sync immediately stops. Both host and viewer UIs reflect the disabled state. No further clipboard content is synchronized.

### TC-CPD-002: Viewer Denies Clipboard Sync

*   **Description**: Viewer disables clipboard sync while host has it enabled.
*   **Expected Result**: Clipboard sync immediately stops. Both host and viewer UIs reflect the disabled state. No further clipboard content is synchronized.

### TC-CPD-003: Attempt Sync When Disabled by Default

*   **Description**: Attempt to copy/paste content when clipboard sync is in its default (disabled) state.
*   **Expected Result**: No clipboard content is synchronized. No errors are displayed, as this is the expected behavior.

### TC-CPD-004: Attempt Sync When One Side is Pending

*   **Description**: Host enables clipboard sync, but viewer has not yet enabled it (or vice-versa). Attempt to copy/paste content.
*   **Expected Result**: No clipboard content is synchronized. The UI clearly indicates that sync is pending consent from the other party.

## Test Cases: File Transfer Permission Denial

### TC-FTPD-001: Receiver Rejects File Transfer Request

*   **Description**: Host initiates a file transfer. Viewer receives the consent dialog and explicitly clicks `Reject`.
*   **Expected Result**: The file transfer is cancelled. The host receives a notification that the transfer was rejected. No file data is transferred.

### TC-FTPD-002: Receiver Denies Save Location

*   **Description**: Host initiates a file transfer. Viewer accepts the transfer, but then cancels the native save file dialog.
*   **Expected Result**: The file transfer is cancelled. The host receives a notification that the transfer was cancelled by the receiver. No file data is transferred.

### TC-FTPD-003: Host Cancels Transfer After Receiver Acceptance

*   **Description**: Host initiates a file transfer. Viewer accepts the transfer, and the transfer begins. Host then cancels the transfer.
*   **Expected Result**: The transfer is aborted on both sides. Any partially transferred file on the receiver side is cleaned up or marked as incomplete.

### TC-FTPD-004: Attempt Transfer When Disabled by Default

*   **Description**: Attempt to initiate a file transfer when the feature is in its default (disabled) state.
*   **Expected Result**: The transfer initiation is blocked, and the UI indicates that file transfer is disabled. No errors are displayed, as this is the expected behavior.

### TC-FTPD-005: Insufficient Disk Space on Receiver

*   **Description**: Host initiates a file transfer to a viewer with insufficient disk space at the chosen save location.
*   **Expected Result**: The transfer fails. The receiver receives an error notification about insufficient disk space. The host receives a notification about the transfer failure.

## Pass/Fail Criteria

*   All test cases pass as expected.
*   No clipboard or file transfer operations proceed without explicit, mutual consent.
*   User interfaces accurately reflect permission states.
*   Error messages and notifications are clear, timely, and informative.
*   No application crashes or unexpected behavior occurs due to permission denials.
