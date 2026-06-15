# macOS Screen Recording Permission Guide for RemoteDesk

This guide explains why RemoteDesk requires screen recording permissions on macOS and how users can grant them.

## Overview
On macOS Catalina (10.15) and later, applications must explicitly request and be granted permission to record the contents of the screen. This is a privacy and security feature designed to give users control over which applications can access their screen data. RemoteDesk, as a remote desktop application, fundamentally requires this permission to capture the host's screen and transmit it to the viewer.

## Why RemoteDesk Needs Screen Recording Permission
RemoteDesk needs to capture the entire screen content, including all open windows, applications, and the desktop itself, to provide a live view of the remote machine. Without this permission, the remote viewer will only see a black screen or an empty desktop.

## How to Grant Screen Recording Permission
When RemoteDesk attempts to capture the screen for the first time, macOS will display a privacy prompt. Users can also manually grant this permission:

1.  **Open System Settings (macOS Ventura and later) or System Preferences (macOS Monterey and earlier)**:
    -   Go to the Apple menu () in the top-left corner of your screen.
    -   Select "System Settings" or "System Preferences."

2.  **Navigate to Privacy & Security**:
    -   In System Settings, click "Privacy & Security" in the sidebar.
    -   In System Preferences, click "Security & Privacy," then select the "Privacy" tab.

3.  **Select "Screen Recording"**:
    -   Scroll down and click on "Screen Recording" in the list of privacy categories.

4.  **Enable RemoteDesk**:
    -   Locate "RemoteDesk" in the list of applications.
    -   Click the toggle switch next to "RemoteDesk" to grant it permission.
    -   If the application is running, macOS will prompt you to "Quit & Reopen" RemoteDesk for the changes to take effect. It is crucial to restart the application.

    *Note: If RemoteDesk is not listed, try launching the application and initiating a screen share once. This should trigger the system to add RemoteDesk to the list. If it still doesn't appear, ensure the application bundle is correctly signed and located in the `/Applications` folder.* 

## User Experience Considerations
- **Clear Instructions**: RemoteDesk should detect if screen recording permission is missing and provide clear, in-app instructions guiding the user to the System Settings/Preferences.
- **First-Run Experience**: Integrate a first-run wizard or prompt that explains the necessity of this permission and directs the user to grant it.
- **Troubleshooting**: Provide troubleshooting steps in the documentation for users who encounter issues with screen sharing.

## Testing
- Verify that the screen recording permission prompt appears on first use.
- Test granting and revoking the permission and observe RemoteDesk's behavior.
- Ensure the application correctly detects the permission status and guides the user accordingly.
- Test on different macOS versions (Catalina, Big Sur, Monterey, Ventura, Sonoma) to account for potential UI differences in System Settings/Preferences.
