# Windows Firewall Notes for RemoteDesk

This document outlines the necessary Windows Firewall configurations for RemoteDesk to function correctly.

## Overview
RemoteDesk requires specific network access to establish and maintain remote desktop sessions. The Windows Firewall, by default, may block these connections, necessitating explicit rules to allow communication.

## Required Firewall Rules
RemoteDesk typically operates over a custom port (e.g., `TCP 50000`) for its signaling server and uses WebRTC for peer-to-peer connections, which might involve a range of UDP ports for media streams (e.g., `UDP 1024-65535`).

### Inbound Rules
- **Program Rule**: Allow inbound connections for the `RemoteDesk.exe` application.
  - **Protocol**: Any
  - **Local Port**: Any
  - **Remote Port**: Any
  - **Action**: Allow the connection
  - **Profile**: Domain, Private, Public (as appropriate for the user's network environment)

- **Port Rule (if specific ports are used)**: Allow inbound TCP/UDP connections on specific ports if the application does not handle dynamic port negotiation or if a fixed signaling port is used.
  - **Protocol**: TCP (for signaling), UDP (for WebRTC media)
  - **Local Port**: `[RemoteDesk Signaling Port]`, `[WebRTC UDP Port Range]`
  - **Action**: Allow the connection
  - **Profile**: Domain, Private, Public

### Outbound Rules
- **Program Rule**: Allow outbound connections for the `RemoteDesk.exe` application.
  - **Protocol**: Any
  - **Local Port**: Any
  - **Remote Port**: Any
  - **Action**: Allow the connection
  - **Profile**: Domain, Private, Public

## Configuration Methods
### 1. Automatic Configuration (Installer)
The RemoteDesk installer (NSIS script) should ideally configure these firewall rules automatically during installation. This provides the best user experience.

### 2. Manual Configuration (User Instructions)
If automatic configuration is not feasible or fails, users will need clear instructions to manually add firewall exceptions:

1. Open **Windows Defender Firewall with Advanced Security**.
2. Navigate to **Inbound Rules** or **Outbound Rules**.
3. Click **New Rule...** and follow the wizard to create a program or port rule for `RemoteDesk.exe`.

## Security Considerations
- **Least Privilege**: Only open ports and allow connections that are strictly necessary for RemoteDesk functionality.
- **Profile Awareness**: Ensure rules are applied to the correct network profiles (Domain, Private, Public) to avoid unnecessary exposure.
- **User Notification**: Inform users about firewall requirements and how to resolve potential blocking issues.

## Testing
- Verify that RemoteDesk can establish and maintain connections with the firewall enabled and configured.
- Test scenarios where firewall rules are missing or incorrect to ensure appropriate error handling and user guidance.
