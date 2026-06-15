# Windows Accessibility Permission Notes

This document outlines the accessibility permissions required by RemoteDesk on Windows to function as a remote control application.

## Overview
To provide full remote control capabilities, including simulating keyboard and mouse input, RemoteDesk requires specific permissions on the Windows operating system. These permissions are often categorized under accessibility or UI automation.

## Required Permissions
RemoteDesk needs the ability to:
- **Simulate Input**: Inject keyboard strokes and mouse movements/clicks into the system to control the remote desktop.
- **Read Screen Content**: Capture the screen to transmit it to the remote viewer.
- **Interact with UI Elements**: Potentially interact with system dialogs or elevated applications (UAC prompts).

## Implementation Details
On Windows, these capabilities are typically achieved using APIs such as:
- `SendInput` or `mouse_event`/`keybd_event` for simulating input.
- Desktop Duplication API or GDI for screen capture.
- UI Automation API for interacting with specific UI elements.

## User Experience and Prompts
Unlike macOS, Windows does not have a centralized "Accessibility" privacy setting that users must explicitly toggle for an application to simulate input. However, there are important considerations:

### 1. UAC (User Account Control)
If RemoteDesk needs to interact with applications running with elevated privileges (e.g., Task Manager, installers), RemoteDesk itself must be running with elevated privileges (as Administrator).
- **Prompt**: If RemoteDesk is not running elevated, it may need to prompt the user to restart the application as an administrator to gain full control.
- **Installer**: The installer should ideally configure RemoteDesk to run as a service or with appropriate privileges to minimize UAC prompts during remote sessions.

### 2. Secure Desktop
When a UAC prompt appears, Windows switches to the "Secure Desktop," which isolates the prompt from other applications.
- **Limitation**: Standard applications cannot capture or interact with the Secure Desktop.
- **Solution**: RemoteDesk must be running as a system service or have specific configurations to interact with the Secure Desktop, allowing the remote user to see and respond to UAC prompts.

## Security Considerations
- **Least Privilege**: Only request elevated privileges when necessary.
- **User Awareness**: Clearly inform the user why RemoteDesk needs these permissions and the implications of granting them.
- **Auditing**: Log actions performed with elevated privileges for security auditing.

## Testing
- Verify that RemoteDesk can simulate input correctly in standard applications.
- Test interaction with elevated applications and UAC prompts.
- Ensure appropriate error handling and user guidance when permissions are insufficient.
