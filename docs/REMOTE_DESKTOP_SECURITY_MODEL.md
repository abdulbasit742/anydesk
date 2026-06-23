# Remote Desktop Security Model

**Date:** June 23, 2026
**Project:** RemoteDesk (anydesk)

This document defines the strict security constraints and architectural rules that govern the RemoteDesk platform. These rules must be enforced across the Express API, Socket.IO signaling server, and the Electron desktop client.

## Core Principles

1.  **No Silent Access:** The platform is designed fundamentally to prevent unauthorized, silent surveillance or control. Every session must be visible to the device owner.
2.  **Explicit Consent:** Remote control capabilities are disabled by default and require explicit, active consent from the host.
3.  **Immutable Auditing:** Every significant action, policy change, and session lifecycle event must be recorded in an immutable audit log.

## Session Lifecycle Security

*   **User Login Required:** All viewers must be fully authenticated and belong to the same Team as the target device to initiate a session request.
*   **Device Registration Required:** Devices must be explicitly registered to a Team using a secure pairing code or authenticated login. Unregistered devices cannot receive connections.
*   **Session Request Required:** A viewer cannot arbitrarily connect to a device. They must send a formal `session:request` through the signaling server.
*   **Session Accept/Deny Required:** The desktop client must present a clear UI prompt to the host for every incoming session request. The session remains in a `pending` state until explicitly accepted.
*   **Viewer Identity Visible:** The identity of the user requesting the session (name, email, role) must be clearly displayed to the host before and during the session.

## Feature Access Controls

*   **Remote Input Disabled by Default:** Upon session acceptance, the connection is strictly view-only. Remote keyboard and mouse input injection is blocked at the desktop client level. Enabling remote input requires a separate, explicit action.
*   **File Transfer Disabled by Default:** File transfer capabilities are disabled by default and subject to team-level policies.
*   **Clipboard Sharing Disabled by Default:** Synchronization of the clipboard between host and viewer is disabled by default to prevent accidental data leakage.

## Policy Enforcement

*   **Centralized Policy Authority:** The backend Express API and database act as the absolute source of truth for all security policies. The desktop client must fetch and adhere to these policies upon connection.
*   **Policy Override:** While team administrators can set default policies, the local device host retains the ultimate authority to downgrade permissions (e.g., disabling remote input mid-session) regardless of team policy.

## Emergency Controls

*   **Emergency Disconnect Always Visible:** The desktop client must display a persistent, un-hideable UI element during an active session that allows the host to immediately terminate the connection.
*   **Hardware-Level Interrupt:** The emergency disconnect action must bypass normal application logic and immediately sever the WebRTC peer connection and signaling socket, ensuring instantaneous termination.

## Abuse Prevention

*   **No Hidden Background Control:** The desktop client must not run stealth services that allow remote control without a visible system tray icon or active session indicator.
*   **No Bypass of Auth/RLS:** All signaling and API requests must pass through rigorous authentication and Row Level Security (RLS) checks to ensure users can only interact with devices within their authorized Teams.
