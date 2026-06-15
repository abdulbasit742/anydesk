# RemoteDesk Desktop Client: Screen Source Picker Test Plan

This test plan outlines the procedures for verifying the functionality and reliability of the screen source picker in the RemoteDesk desktop client. The screen source picker allows users to select which screen or application window to share during a remote session.

## 1. Test Objectives

*   Verify that the screen source picker accurately lists all available screens and windows.
*   Verify that selecting a screen or window correctly updates the local preview.
*   Verify that the picker handles dynamic changes (e.g., new window opened, monitor disconnected).
*   Verify the picker's usability and responsiveness.

## 2. Test Environment

*   RemoteDesk Desktop Client running.
*   Multiple monitors connected (if available).
*   Various applications running (e.g., browser, text editor, video player) to provide different window sources.

## 3. Test Cases

### 3.1 TC-SSP-001: List All Available Screens/Windows

*   **Description**: Verify that the screen source picker dialog accurately displays all active screens and open application windows.
*   **Steps**:
    1.  Launch the RemoteDesk desktop client.
    2.  Navigate to the screen sharing initiation section (where the picker is displayed).
    3.  Open various applications (e.g., Chrome, Notepad, File Explorer).
    4.  Connect/disconnect an external monitor.
    5.  Open the screen source picker dialog.
    6.  Visually inspect the list of available sources.
*   **Expected Result**: The picker lists all connected monitors and all open application windows. The list updates dynamically when monitors are connected/disconnected or new windows are opened/closed.

### 3.2 TC-SSP-002: Select a Primary Monitor

*   **Description**: Verify that selecting the primary monitor in the picker correctly updates the local preview.
*   **Steps**:
    1.  Open the screen source picker.
    2.  Select the primary monitor from the list.
    3.  Observe the local screen capture preview.
*   **Expected Result**: The local preview accurately displays the content of the primary monitor.

### 3.3 TC-SSP-003: Select a Secondary Monitor

*   **Description**: Verify that selecting a secondary monitor (if available) in the picker correctly updates the local preview.
*   **Steps**:
    1.  Ensure a secondary monitor is connected and active.
    2.  Open the screen source picker.
    3.  Select the secondary monitor from the list.
    4.  Observe the local screen capture preview.
*   **Expected Result**: The local preview accurately displays the content of the secondary monitor.

### 3.4 TC-SSP-004: Select an Application Window

*   **Description**: Verify that selecting a specific application window in the picker correctly updates the local preview.
*   **Steps**:
    1.  Open several distinct application windows (e.g., a browser, a text editor).
    2.  Open the screen source picker.
    3.  Select one of the application windows from the list.
    4.  Observe the local screen capture preview.
*   **Expected Result**: The local preview accurately displays only the content of the selected application window.

### 3.5 TC-SSP-005: Dynamic Window Changes

*   **Description**: Verify the picker's behavior when application windows are opened or closed while the picker is active.
*   **Steps**:
    1.  Open the screen source picker.
    2.  While the picker is open, open a new application window.
    3.  Verify the new window appears in the picker's list.
    4.  Close an existing application window.
    5.  Verify the closed window disappears from the picker's list.
*   **Expected Result**: The list of available sources in the picker updates dynamically and accurately reflects changes in open windows.

### 3.6 TC-SSP-006: Picker Responsiveness

*   **Description**: Verify that the screen source picker dialog is responsive and does not freeze or lag.
*   **Steps**:
    1.  Open the screen source picker.
    2.  Rapidly switch between different screen and window selections.
    3.  Observe the responsiveness of the UI and the local preview.
*   **Expected Result**: The picker UI and local preview update smoothly and without noticeable lag.

### 3.7 TC-SSP-007: No Available Sources

*   **Description**: Verify the behavior when no screen or window sources are available (e.g., in a headless environment or if all apps are minimized).
*   **Steps**:
    1.  Minimize all applications and disconnect all external monitors (if possible).
    2.  Open the screen source picker.
*   **Expected Result**: The picker displays an appropriate message indicating no sources are available, or lists only the primary screen if always present.

---

**Author**: Manus AI
**Date**: June 12, 2026
