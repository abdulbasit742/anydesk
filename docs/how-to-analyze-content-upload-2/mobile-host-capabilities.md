# RemoteDesk Mobile Host Capabilities

This document details the Mobile Host capabilities within RemoteDesk, allowing mobile devices to act as hosts for remote sessions.

## Overview
The Mobile Host feature transforms a mobile device into a full-fledged remote host, enabling users to share their mobile screen and potentially allow remote control from another device (viewer). This is particularly useful for mobile device troubleshooting, demonstrations, or providing support for mobile applications. The system includes mechanisms for requesting, accepting, and managing these mobile-initiated sessions securely.

## Features
- **Mobile Screen Sharing**: Share the mobile device's screen with a remote viewer.
- **Remote Control (Optional)**: Allow a remote viewer to control the mobile device (requires explicit user permission).
- **File Transfer**: Securely transfer files between the mobile host and the viewer.
- **In-session Chat**: Communicate with the remote viewer during the session.
- **Audio Streaming**: Stream audio from the mobile device to the viewer.
- **Session Request & Approval**: Viewers can request a session, and the mobile host must explicitly approve it.
- **Configurable Capabilities**: Administrators can define which capabilities (e.g., remote control, file transfer) are enabled by default or require explicit approval.

## Implementation Details

### Data Transfer Objects (DTOs)
- **`MobileHostSessionStatus`**: An enum defining the status of a mobile host session request (`PENDING`, `ACTIVE`, `ENDED`, `REJECTED`).
- **`MobileHostSessionRequest`**: Represents a request for a mobile host session, including `sessionId`, `hostDeviceId`, `viewerDeviceId`, `requestedAt`, and `status`.
- **`MobileHostCapabilities`**: Defines the specific features available during a mobile host session (e.g., `screenSharing`, `remoteControl`, `fileTransfer`).
- **`MobileHostConfig`**: Configuration settings for the mobile host system, such as `enabled`, `defaultCapabilities`, and `maxSessionDurationMinutes`.
- **Location**: `remotedesk/packages/shared/src/mobile-advanced/mobile-host.dto.ts`

### API Service Logic
- **`MobileHostService.ts`**: Manages the lifecycle of mobile host sessions on the API server.
  - **Configuration Management**: Loads and updates mobile host settings.
  - **Session Request Handling**: Processes requests from viewers to initiate a mobile host session, notifying the mobile device via push notifications.
  - **Session Response Handling**: Processes the mobile host's acceptance or rejection of a session request.
  - **Session Management**: Tracks active mobile host sessions and provides functionality to end them.
  - **Integration with Push Notifications**: Uses `PushNotificationService` to alert mobile devices about session requests and responses.
- **Location**: `remotedesk/apps/api/src/mobile/MobileHostService.ts`

### API Routes
- **`/api/mobile/host/request-session` (POST)**: Request a mobile device to act as a host.
- **`/api/mobile/host/respond-session` (POST)**: Respond to a mobile host session request.
- **`/api/mobile/host/end-session` (POST)**: End an active mobile host session.
- **`/api/mobile/host/config` (POST/GET)**: Manage the global configuration for mobile host features.
- **Location**: `remotedesk/apps/api/src/mobile/mobile-advanced.routes.ts`

### Mobile Application Integration
- The mobile application (host) will receive push notifications for session requests.
- It will present a UI to the user to accept or reject the request and grant specific capabilities.
- Upon acceptance, it will initiate screen sharing and other requested features, connecting to the RemoteDesk session infrastructure.

## Technical Considerations
- **Platform-Specific Implementations**: Screen sharing and remote control on mobile devices require platform-specific APIs (e.g., Android MediaProjection, iOS ReplayKit for screen sharing; accessibility services for remote control).
- **Performance**: Optimizing video encoding and streaming for mobile networks and device capabilities is crucial.
- **Battery Life**: Continuous screen sharing and remote control can significantly impact mobile device battery life.
- **Security & Privacy**: Strict permission handling and clear user consent are paramount for screen sharing and remote control.
- **Network Connectivity**: Handling fluctuating mobile network conditions and ensuring session stability.

## Future Enhancements
- **Gesture-based Remote Control**: Integrate with mobile gestures for intuitive remote control.
- **Augmented Reality Overlays**: For physical device support, overlay instructions on the mobile host's camera feed.
- **Enhanced Offline Capabilities**: Allow limited functionality or data caching when network connectivity is poor.
- **Mobile-to-Mobile Remote Control**: Enable one mobile device to control another mobile device directly.
