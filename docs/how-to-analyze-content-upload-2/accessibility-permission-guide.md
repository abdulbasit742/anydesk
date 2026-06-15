# macOS Accessibility Permission Guide for RemoteDesk

This guide explains why RemoteDesk requires accessibility permissions on macOS and how users can grant them.

## Overview
On macOS, applications that need to control the computer using keyboard and mouse input, or interact with other applications at a deeper level, require "Accessibility" access (also known as "Input Monitoring" on newer macOS versions). This is a critical privacy and security feature that prevents malicious applications from silently controlling the user's system. RemoteDesk, as a remote desktop application, needs this permission to allow the remote viewer to control the host machine.

## Why RemoteDesk Needs Accessibility Permission
RemoteDesk requires accessibility permissions to:
- **Simulate Keyboard and Mouse Input**: Allow the remote user to type and move the mouse on the host machine.
- **Interact with System UI**: Potentially interact with system dialogs, menus, and other UI elements across different applications.

Without this permission, the remote viewer will be able to see the screen but will not be able to control the host machine, severely limiting the utility of the remote session.

## How to Grant Accessibility Permission
When RemoteDesk attempts to use accessibility features for the first time, macOS will display a privacy prompt. Users can also manually grant this permission:

1.  **Open System Settings (macOS Ventura and later) or System Preferences (macOS Monterey and earlier)**:
    -   Go to the Apple menu () in the top-left corner of your screen.
    -   Select "System Settings" or "System Preferences."

2.  **Navigate to Privacy & Security**:
    -   In System Settings, click "Privacy & Security" in the sidebar.
    -   In System Preferences, click "Security & Privacy," then select the "Privacy" tab.

3.  **Select "Accessibility" (or "Input Monitoring" on newer macOS)**:
    -   Scroll down and click on "Accessibility" (or "Input Monitoring") in the list of privacy categories.

4.  **Enable RemoteDesk**:
    -   Locate "RemoteDesk" in the list of applications.
    -   Click the toggle switch next to "RemoteDesk" to grant it permission.
    -   If the application is running, macOS will prompt you to "Quit & Reopen" RemoteDesk for the changes to take effect. It is crucial to restart the application.

    *Note: If RemoteDesk is not listed, try launching the application and attempting to control the remote session once. This should trigger the system to add RemoteDesk to the list. If it still doesn't appear, ensure the application bundle is correctly signed and located in the `/Applications` folder.* 

## User Experience Considerations
- **Clear Instructions**: RemoteDesk should detect if accessibility permission is missing and provide clear, in-app instructions guiding the user to the System Settings/Preferences.
- **First-Run Experience**: Integrate a first-run wizard or prompt that explains the necessity of this permission and directs the user to grant it.
- **Troubleshooting**: Provide troubleshooting steps in the documentation for users who encounter issues with remote control.

## Testing
- Verify that the accessibility permission prompt appears on first use when attempting remote control.
- Test granting and revoking the permission and observe RemoteDesk's behavior (e.g., input works/stops working).
- Ensure the application correctly detects the permission status and guides the user accordingly.
- Test on different macOS versions to account for potential UI differences in System Settings/Preferences.
