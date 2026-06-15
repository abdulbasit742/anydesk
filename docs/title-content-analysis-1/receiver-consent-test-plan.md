# Receiver Consent Test Plan for RemoteDesk File Transfer

This document outlines the test plan for verifying the correct implementation and behavior of receiver consent for file transfers in RemoteDesk.

## Objectives

*   To ensure that no file transfer can proceed without explicit consent from the receiving user.
*   To verify that the consent dialog accurately displays file information and offers clear options to accept or reject.
*   To test various scenarios where consent is granted, denied, or times out.

## Test Environment

*   **Operating Systems**: Windows 10/11, macOS (latest two versions), Ubuntu (latest LTS).
*   **Network Conditions**: Stable network connection.
*   **Roles**: Host (sender), Viewer (receiver).

## Test Data

*   **Files**: Small, medium, and large files of various types (text, image, archive).
*   **Filenames**: Normal filenames, filenames with special characters, long filenames.

## Test Cases

### TC-RCT-001: Basic Accept Scenario

*   **Description**: Host initiates a file transfer. Viewer receives the consent dialog and clicks 
`Accept`.
*   **Expected Result**: The file transfer begins and completes successfully. The file is saved to the chosen location.

### TC-RCT-002: Basic Reject Scenario

*   **Description**: Host initiates a file transfer. Viewer receives the consent dialog and clicks `Reject`.
*   **Expected Result**: The file transfer is immediately cancelled. The host receives a notification that the transfer was rejected. No file data is transferred or saved on the viewer's side.

### TC-RCT-003: Consent Dialog with Detailed File Info

*   **Description**: Host initiates a file transfer with a file having a descriptive name, specific type, and reasonable size. Viewer receives the consent dialog.
*   **Expected Result**: The consent dialog accurately displays the file's name, size (in a human-readable format), and type. The information is clear and helps the user make an informed decision.

### TC-RCT-004: Multiple Concurrent Transfer Requests

*   **Description**: Host attempts to initiate multiple file transfer requests in quick succession.
*   **Expected Result**: The viewer receives consent dialogs sequentially or in a manageable queue. Each request requires individual consent. No transfers proceed without explicit acceptance.

### TC-RCT-005: Consent Timeout (if applicable)

*   **Description**: Host initiates a file transfer. Viewer receives the consent dialog but does not respond within a predefined timeout period.
*   **Expected Result**: The consent dialog automatically closes, and the transfer request is implicitly rejected. The host receives a notification that the transfer timed out or was rejected.

### TC-RCT-006: Viewer Disconnects During Consent Prompt

*   **Description**: Host initiates a file transfer. Viewer receives the consent dialog, but then the viewer application closes or the session disconnects.
*   **Expected Result**: The transfer request is cancelled. The host receives a notification that the transfer failed due to disconnection. No file data is transferred.

### TC-RCT-007: Host Cancels Request During Consent Prompt

*   **Description**: Host initiates a file transfer. Viewer receives the consent dialog. Before the viewer responds, the host cancels the transfer request.
*   **Expected Result**: The consent dialog on the viewer's side is dismissed. The viewer receives a notification that the transfer was cancelled by the sender.

## Pass/Fail Criteria

*   All test cases pass as expected.
*   No file data is transferred without explicit receiver consent.
*   Consent dialogs are clear, informative, and responsive.
*   Error and cancellation notifications are accurate and timely.
