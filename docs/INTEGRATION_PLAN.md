# Safe Integration Plan

**Date:** June 23, 2026
**Project:** RemoteDesk (anydesk + anydesklovable)

## 1. Architectural Strategy

The integration of the `anydesk` core platform and the `anydesklovable` web dashboard requires a unified architectural approach to prevent split-brain data management and ensure rigorous security enforcement. 

The `anydesk` repository will serve as the definitive source of truth. Its Express API, backed by Prisma, will handle all complex business logic, session authorization, signaling, and policy enforcement. The `anydesklovable` dashboard will be transitioned from a direct-to-database Supabase client model to a traditional frontend consuming the `anydesk` REST API and Socket.IO endpoints. Supabase will be retained strictly for user authentication and as the underlying PostgreSQL database engine accessed via Prisma.

The repositories will remain separate for the immediate future to minimize disruption, with integration occurring via shared npm packages and well-defined API contracts.

## 2. Shared Type Synchronization

To ensure consistency, `anydesk/packages/shared` must be established as the single source of truth for all data structures. The dashboard currently relies on local TypeScript interfaces generated from Supabase schemas and mock data definitions.

The immediate next step is to expand `packages/shared` to encompass the complete domain model, including Users, Teams, Devices, RemoteSessions, SecurityPolicies, and AuditLogs. Once these contracts are defined and published (or linked via workspace), the `anydesklovable` dashboard will be refactored to import these types, replacing its local definitions. This guarantees that both the desktop client and the web dashboard speak the exact same language when communicating with the signaling server.

## 3. Mock-to-Real Wiring Sequence

The `anydesklovable` dashboard currently relies heavily on a mock data fallback mechanism. The transition to real data must be phased carefully, prioritizing read-only operations before enabling mutations.

The wiring sequence will proceed as follows:
1.  **Devices and Presence:** Wire the dashboard to the `anydesk` API to display real-time device status (online/offline) via Socket.IO events, replacing the mock device list.
2.  **Team and RBAC:** Connect the team management UI to the backend API to enforce real Role-Based Access Control (owner, admin, technician, viewer).
3.  **Security Policies:** Wire the remote input, clipboard, and file transfer policy toggles to backend mutations. These must update the database and emit configuration updates to connected desktop clients.
4.  **Session Management:** Implement the session request flow. The dashboard will request a session via the API, which will signal the desktop client. The mock session list will be replaced by active sessions tracked by the signaling server.
5.  **Audit Logging:** Ensure all actions taken in the newly wired dashboard components correctly trigger audit log creation via the `anydesk` API.

## 4. Signaling and Desktop Integration

The connection between the web dashboard and the desktop client relies on the `anydesk` Socket.IO signaling server. 

The dashboard will maintain a secure Socket.IO connection to the backend. When a user initiates a connection to a device, the dashboard will emit a `session:request` event to the server. The server will validate the user's permissions against the target device's policies and team membership. If authorized, the server will forward the request to the target desktop client. 

The desktop client will handle the request based on its local configuration (e.g., prompting the host for consent). Once accepted, WebRTC signaling (Offer/Answer/ICE candidates) will be relayed through the secure Socket.IO channel. Direct peer-to-peer connections will be established for video and input streaming, but all policy changes and emergency stops will route through the authoritative signaling server.

## 5. Security Control Implementation

Before any live remote control is permitted, the foundational security controls must be fully operational. 

Remote input, clipboard sharing, and file transfer must be strictly disabled by default at the desktop client level. Enabling these features will require an explicit, cryptographically signed policy update from the backend, generated only after verifying the host's consent and the viewer's RBAC permissions. 

Furthermore, the "Emergency Stop" functionality must be implemented as an un-blockable hardware-level interrupt within the desktop client's Electron main process, capable of severing the WebRTC connection and terminating the session regardless of the application's current state. All policy changes, session requests, and emergency stops must be synchronously written to the immutable audit log.
