# macOS Privacy Prompts Documentation for RemoteDesk

This document details the various privacy prompts users may encounter when using RemoteDesk on macOS and how to address them.

## Overview
Modern macOS versions (Catalina and later) have significantly enhanced privacy and security features. Applications that require access to sensitive user data or system controls must explicitly request and be granted permission by the user. RemoteDesk, as a remote desktop application, interacts with several such areas.

## Key Privacy Prompts
Users may encounter prompts for the following permissions:

### 1. Screen Recording
- **Purpose**: Essential for RemoteDesk to capture the host's screen content and transmit it to the remote viewer.
- **Trigger**: The first time RemoteDesk attempts to capture the screen.
- **Resolution**: Users must grant permission in `System Settings/Preferences > Privacy & Security > Screen Recording`.
- **Documentation**: Refer to `screen-recording-permission-guide.md` for detailed instructions.

### 2. Accessibility (Input Monitoring)
- **Purpose**: Required for RemoteDesk to simulate keyboard and mouse input, allowing the remote viewer to control the host machine.
- **Trigger**: The first time RemoteDesk attempts to control input.
- **Resolution**: Users must grant permission in `System Settings/Preferences > Privacy & Security > Accessibility` (or `Input Monitoring`).
- **Documentation**: Refer to `accessibility-permission-guide.md` for detailed instructions.

### 3. Full Disk Access
- **Purpose**: While not strictly required for basic remote control, Full Disk Access might be needed if RemoteDesk implements features like file transfer that require access to arbitrary locations on the user's disk, or if it needs to access system-level logs for diagnostics.
- **Trigger**: If RemoteDesk attempts to access protected files or directories without specific permissions.
- **Resolution**: Users must grant permission in `System Settings/Preferences > Privacy & Security > Full Disk Access`.
- **Note**: This permission should only be requested if absolutely necessary, following the principle of least privilege.

### 4. Microphone
- **Purpose**: If RemoteDesk supports audio transmission from the host machine's microphone to the remote viewer.
- **Trigger**: The first time RemoteDesk attempts to access the microphone.
- **Resolution**: Users must grant permission in `System Settings/Preferences > Privacy & Security > Microphone`.

### 5. Camera
- **Purpose**: If RemoteDesk supports webcam sharing from the host machine to the remote viewer.
- **Trigger**: The first time RemoteDesk attempts to access the camera.
- **Resolution**: Users must grant permission in `System Settings/Preferences > Privacy & Security > Camera`.

## User Experience and Best Practices
- **In-App Guidance**: RemoteDesk should detect when a required permission is missing and provide clear, actionable in-app messages guiding the user to the correct System Settings/Preferences pane.
- **First-Run Wizard**: Consider an onboarding wizard that explains all necessary permissions upfront and directs the user through the process.
- **Just-in-Time Prompts**: For less critical permissions (e.g., Microphone, Camera), trigger the system prompt only when the user attempts to use the corresponding feature.
- **Restart Requirement**: Emphasize that for some permissions (especially Screen Recording and Accessibility), the application must be quit and reopened for the changes to take effect.

## Testing
- Verify that all relevant privacy prompts appear as expected.
- Test granting and revoking each permission and observe RemoteDesk's behavior.
- Ensure the application provides helpful feedback when permissions are denied or missing.
- Test on various macOS versions to ensure consistent behavior and correct UI guidance.
