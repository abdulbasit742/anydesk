# RemoteDesk Multi-Monitor Support

This document outlines the implementation and usage of multi-monitor support within RemoteDesk, allowing users to view and control specific displays on a remote machine.

## Overview
Multi-monitor support enhances the remote control experience by providing granular control over which displays are shared or viewed during a session. This is crucial for users with complex workstation setups or for support scenarios where focusing on a single screen is necessary.

## Features
- **Display Detection**: Automatically detects all connected displays on the remote host.
- **Primary Display Identification**: Clearly identifies the primary display.
- **Selective Sharing**: Allows the host to choose which displays to share.
- **Viewer Selection**: Allows the viewer to select which shared display to view.
- **Dynamic Switching**: Ability to switch between shared displays during an active session.

## Implementation Details

### Data Transfer Objects (DTOs)
- **`DisplayInfo`**: Defines the properties of a single display, including ID, name, primary status, bounds (x, y, width, height), and scale factor.
- **`MultiMonitorConfig`**: Stores the configuration for multi-monitor usage, including whether it's enabled and a list of selected display IDs.
- **Location**: `remotedesk/packages/shared/src/remote-control/multi-monitor.dto.ts`

### User Interface (UI)
- **`MultiMonitorSelectionUI.tsx`**: A React component for the desktop application that allows users to enable/disable multi-monitor support and select specific displays from a list of `availableDisplays`.
- **Location**: `remotedesk/apps/desktop/src/remote-control/MultiMonitorSelectionUI.tsx`

### Desktop Application Logic
- The desktop application is responsible for:
  - Detecting local display configurations using native OS APIs.
  - Communicating display information to the remote viewer.
  - Capturing screen content from selected displays.
  - Handling dynamic switching requests from the viewer.

## Usage

### Host Side
1. During session setup or within an active session, navigate to the multi-monitor settings.
2. Enable multi-monitor control.
3. Select the specific displays you wish to share with the remote viewer.

### Viewer Side
1. Once connected to a multi-monitor host, the viewer will see options to switch between the shared displays.
2. Select the desired display to view its content.

## Technical Considerations
- **Performance**: Capturing and streaming multiple high-resolution displays simultaneously can be resource-intensive. Optimization techniques like adaptive bitrate streaming and region-of-interest encoding are crucial.
- **Compatibility**: Ensuring consistent display detection and capture across different operating systems (Windows, macOS, Linux) and display configurations.
- **Scaling**: Handling various display scaling factors and resolutions to provide a clear and correctly scaled remote view.

## Future Enhancements
- **Virtual Displays**: Support for creating virtual displays on the remote host.
- **Layout Management**: Ability for the viewer to arrange multiple shared displays in a custom layout.
- **Per-Display Quality Settings**: Configure streaming quality independently for each display.
