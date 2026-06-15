# RemoteDesk Mobile Gestures for Remote Control

This document describes the implementation of mobile-specific gestures for controlling remote desktops within RemoteDesk.

## Overview
Mobile gestures provide an intuitive and natural way for users to interact with a remote desktop from their mobile devices. Instead of relying solely on a virtual mouse and keyboard, users can perform common actions like tapping, swiping, and pinching directly on their mobile screen, which are then translated into corresponding actions on the remote desktop. This enhances the user experience, especially for touch-first mobile environments.

## Features
- **Common Gesture Recognition**: Support for standard mobile gestures such as tap, double-tap, long-press, swipes (up, down, left, right), pinch-in, and pinch-out.
- **Configurable Sensitivity**: Adjust the sensitivity of gesture recognition to suit user preferences.
- **Custom Gesture Mapping**: (Future) Allow users to map custom gestures to specific remote desktop actions.
- **Real-time Translation**: Gestures are translated into mouse clicks, scrolls, and keyboard events in real-time on the remote desktop.

## Implementation Details

### Data Transfer Objects (DTOs)
- **`MobileGestureType`**: An enum defining the types of mobile gestures recognized (e.g., `TAP`, `SWIPE_UP`, `PINCH_IN`).
- **`MobileGestureEvent`**: Represents a detected gesture event, including `sessionId`, `deviceId`, `gestureType`, `x`, `y` coordinates (relative to the remote screen), and optional `pressure` data.
- **`MobileGestureConfig`**: Configuration settings for mobile gestures, such as `enabled`, `sensitivity`, and `customGestures`.
- **Location**: `remotedesk/packages/shared/src/mobile-advanced/mobile-gestures.dto.ts`

### Mobile Application Service Logic
- **`MobileGestureService.ts`**: Runs on the mobile client to detect and process gestures.
  - **Gesture Recognition**: Utilizes native mobile platform APIs or a gesture recognition library to detect various touch gestures.
  - **Coordinate Translation**: Translates mobile touch coordinates to the corresponding coordinates on the remote desktop screen.
  - **Action Mapping**: Maps detected `MobileGestureType` to appropriate remote control actions (e.g., `TAP` to a left mouse click, `SWIPE_UP` to a scroll up event).
  - **Remote Control Service Integration**: Sends the translated remote control commands to the desktop client via a WebSocket or similar real-time communication channel.
- **Location**: `remotedesk/apps/mobile/src/MobileGestureService.ts`

## Usage

### Configuration
1. **Enable Mobile Gestures**: In the mobile application settings, enable gesture-based remote control.
2. **Adjust Sensitivity**: Fine-tune gesture sensitivity for optimal responsiveness.

### During a Remote Session
- Users perform gestures on their mobile device screen.
- The `MobileGestureService` detects the gesture, translates it into a remote control command, and sends it to the remote desktop.
- The remote desktop responds as if a mouse or keyboard action was performed directly.

## Technical Considerations
- **Platform Differences**: Gesture recognition and touch event handling can vary between iOS and Android, requiring platform-specific implementations.
- **Accuracy and Latency**: Ensuring accurate gesture detection and minimal latency in command transmission is crucial for a good user experience.
- **Conflict with Native UI**: Care must be taken to avoid conflicts between remote control gestures and native mobile application UI gestures.
- **Accessibility**: Provide alternative input methods for users who may not be able to use gestures effectively.

## Future Enhancements
- **Haptic Feedback**: Provide haptic feedback on gesture recognition for a more tactile experience.
- **Customizable Gestures**: Allow users to define their own custom gestures and map them to specific actions.
- **Multi-touch Gestures**: Support for more complex multi-touch gestures beyond pinch-in/out.
- **On-screen Gesture Guides**: Visual overlays on the mobile screen to guide users on available gestures.
