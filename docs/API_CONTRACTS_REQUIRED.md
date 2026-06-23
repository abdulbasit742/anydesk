# Required API Contracts

**Date:** June 23, 2026
**Project:** RemoteDesk (anydesk)

This document outlines the necessary REST API endpoints required to bridge the `anydesklovable` dashboard with the `anydesk` core backend. These endpoints must be implemented in the Express API to replace the dashboard's current reliance on mock data and direct Supabase queries.

## Authentication and Session Validation

| Endpoint | Method | Purpose | Required Payload | Expected Response |
| :--- | :--- | :--- | :--- | :--- |
| `/api/auth/me` | GET | Validates the current user session and retrieves profile data. | None | `UserProfile` object including current team context. |
| `/api/auth/logout` | POST | Terminates the current session and invalidates tokens. | None | Success confirmation. |

## Team Management

| Endpoint | Method | Purpose | Required Payload | Expected Response |
| :--- | :--- | :--- | :--- | :--- |
| `/api/teams` | GET | Retrieves a list of teams the user belongs to. | None | Array of `Team` objects. |
| `/api/teams/:teamId` | GET | Retrieves detailed information for a specific team. | None | Detailed `Team` object including policies. |
| `/api/teams/:teamId/members` | GET | Retrieves all members of a team. | None | Array of `TeamMember` objects with roles. |
| `/api/teams/:teamId/invites` | POST | Creates a new invitation for a user to join the team. | `{ email: string, role: string }` | Created `TeamInvite` object. |
| `/api/teams/:teamId/members/:memberId` | PATCH | Updates a team member's role. | `{ role: string }` | Updated `TeamMember` object. |

## Device Fleet Management

| Endpoint | Method | Purpose | Required Payload | Expected Response |
| :--- | :--- | :--- | :--- | :--- |
| `/api/devices` | GET | Retrieves all devices registered to the current team. | None | Array of `Device` objects. |
| `/api/devices/:deviceId` | GET | Retrieves detailed information for a specific device. | None | Detailed `Device` object. |
| `/api/devices/register` | POST | Registers a new desktop client to a team. | `{ hardwareId: string, os: string, hostname: string }` | `DeviceRegistrationResponse` with auth token. |
| `/api/devices/:deviceId/heartbeat` | POST | Updates the online status and metrics of a device. | `{ status: string, metrics: object }` | Success confirmation. |
| `/api/devices/:deviceId/revoke` | POST | Permanently revokes a device's access to the team. | None | Success confirmation. |

## Remote Session Lifecycle

| Endpoint | Method | Purpose | Required Payload | Expected Response |
| :--- | :--- | :--- | :--- | :--- |
| `/api/sessions` | GET | Retrieves active and historical sessions for the team. | Query parameters (status, limit) | Array of `RemoteSession` objects. |
| `/api/sessions/:sessionId` | GET | Retrieves details for a specific session. | None | Detailed `RemoteSession` object. |
| `/api/sessions/request` | POST | Initiates a new remote session request to a device. | `{ deviceId: string }` | `SessionRequest` object with pending status. |
| `/api/sessions/:sessionId/accept` | POST | Host accepts a pending session request. | None | Updated `RemoteSession` object. |
| `/api/sessions/:sessionId/reject` | POST | Host rejects a pending session request. | `{ reason: string }` | Updated `RemoteSession` object. |
| `/api/sessions/:sessionId/disconnect` | POST | Terminates an active session (can be called by host or viewer). | `{ reason: string }` | Success confirmation. |

## Security Policies

| Endpoint | Method | Purpose | Required Payload | Expected Response |
| :--- | :--- | :--- | :--- | :--- |
| `/api/policies` | GET | Retrieves the current security policies for the team. | None | `SecurityPolicy` object. |
| `/api/policies/remote-input` | PATCH | Updates the team's remote input policy. | `{ enabled: boolean, defaultMode: string }` | Updated policy object. |
| `/api/policies/clipboard` | PATCH | Updates the team's clipboard sharing policy. | `{ enabled: boolean, direction: string }` | Updated policy object. |
| `/api/policies/file-transfer` | PATCH | Updates the team's file transfer policy. | `{ enabled: boolean, requireApproval: boolean }` | Updated policy object. |

## Audit and Compliance

| Endpoint | Method | Purpose | Required Payload | Expected Response |
| :--- | :--- | :--- | :--- | :--- |
| `/api/audit-logs` | GET | Retrieves audit events for the team. | Query parameters (severity, action, limit) | Array of `AuditLog` objects. |
| `/api/audit-logs` | POST | Records a new audit event (used internally by desktop/web clients). | `AuditEventPayload` | Created `AuditLog` confirmation. |

## Billing and Support

| Endpoint | Method | Purpose | Required Payload | Expected Response |
| :--- | :--- | :--- | :--- | :--- |
| `/api/billing/subscription` | GET | Retrieves current subscription status and limits. | None | `Subscription` object. |
| `/api/support/tickets` | GET | Retrieves support tickets for the team. | None | Array of `SupportTicket` objects. |
| `/api/support/tickets` | POST | Creates a new support ticket. | `{ subject: string, description: string, category: string }` | Created `SupportTicket` object. |
