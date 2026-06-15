# Remote Session Support Tools Documentation

This document outlines the various support tools available within RemoteDesk to diagnose and manage remote sessions.

## Overview
RemoteDesk provides a suite of tools designed to assist users and administrators in troubleshooting, managing, and maintaining the stability of remote desktop sessions. These tools help in quickly identifying issues, performing corrective actions, and gathering necessary diagnostic information.

## Available Support Tools

### 1. Session Debug Panel
- **Purpose**: Provides real-time insights into the technical aspects of an active remote session.
- **Details**: Displays system information, network statistics, WebRTC connection details, and session logs. This panel is invaluable for diagnosing connectivity issues, performance bottlenecks, and application errors.
- **Access**: Typically accessible from within an active remote session interface (e.g., via a developer console or a dedicated debug menu).
- **Related File**: `session-debug-panel.tsx`

### 2. Copy Session Diagnostics
- **Purpose**: Allows users to easily collect and copy comprehensive diagnostic data to their clipboard.
- **Details**: Gathers system, network, and session-specific logs, redacting sensitive information by default, and formats it for easy sharing. This streamlines the process of providing information to support teams.
- **Access**: Available from the Session Debug Panel or a dedicated support menu.
- **Related File**: `copy-session-diagnostics.ts`

### 3. Reconnect Action
- **Purpose**: Enables users to attempt to re-establish a dropped or unstable remote session without having to start a new one.
- **Details**: Triggers the underlying connection logic to re-negotiate WebRTC peer connections and signaling. Useful for transient network issues.
- **Access**: A button or option in the session interface when a connection is lost or unstable.
- **Related File**: `reconnect-action.ts`

### 4. Force Disconnect Action
- **Purpose**: Allows a viewer or administrator to forcibly terminate an active remote session.
- **Details**: Sends a signal to both host and viewer applications to immediately close the WebRTC connection and end the session. Useful for security reasons or when a session becomes unresponsive.
- **Access**: Available in the viewer application or administrator dashboard.
- **Related File**: `force-disconnect-action.ts`

### 5. Host Emergency Stop Action
- **Purpose**: A critical security feature for the host to immediately terminate all remote access and potentially secure the host system.
- **Details**: Disconnects all active remote sessions and can optionally trigger system-level actions like locking the screen or logging off the user. This is an irreversible action for emergency situations.
- **Access**: A prominent button or hotkey on the host application, often requiring confirmation.
- **Related File**: `host-emergency-stop-action.ts`

### 6. Viewer Retry Connection Action
- **Purpose**: Allows the remote viewer to retry connecting to a host if the initial connection fails or drops.
- **Details**: Re-initiates the connection sequence from the viewer's side, attempting to establish a new WebRTC connection.
- **Access**: A button or option in the viewer application when a connection attempt fails.
- **Related File**: `viewer-retry-connection-action.ts`

## Usage Scenarios
- **Troubleshooting Connectivity**: Use the Session Debug Panel and Copy Diagnostics to gather information about network issues.
- **Resolving Unresponsive Sessions**: Use Reconnect Action or Force Disconnect Action.
- **Security Incidents**: Host Emergency Stop Action for immediate termination of access.
- **User Support**: Guide users to use these tools to provide information to support personnel.

## Testing
Refer to `support-tools.test.ts` for a comprehensive list of items to verify during testing.
