# Admin Session Visibility for RemoteDesk

This document outlines the features and tools available to administrators for monitoring and managing active and historical remote desktop sessions within RemoteDesk.

## Overview
Effective administration of a remote desktop solution requires clear visibility into ongoing operations. RemoteDesk provides a dedicated admin dashboard with tools to view session details, monitor quality, audit events, and take control actions.

## Key Features

### 1. Active Sessions Admin Table
- **Purpose**: Provides a real-time overview of all currently active remote sessions.
- **Details**: Displays key information such as Session ID, Host Device ID, Viewer User ID, session start time, and current status. Allows administrators to quickly identify ongoing sessions.
- **Access**: Accessible via the main admin dashboard.
- **Related File**: `ActiveSessionsTable.tsx`

### 2. Session Detail Admin Page
- **Purpose**: Offers an in-depth view of a specific remote session.
- **Details**: Includes comprehensive information about a session, such as connection details, participant information, and access to quality metrics and audit timelines. This page is crucial for detailed investigation.
- **Access**: Navigable from the Active Sessions Admin Table by clicking on a session.
- **Related File**: `SessionDetailPage.tsx`

### 3. Session Quality Metrics
- **Purpose**: Provides insights into the performance and stability of individual sessions.
- **Details**: Displays metrics like average latency, bandwidth usage, packet loss rate, and frame rate. These metrics help administrators diagnose network-related issues or performance bottlenecks.
- **Access**: Integrated into the Session Detail Admin Page.
- **Related File**: `session.types.ts` (definitions), `session.api.ts` (fetching), `SessionDetailPage.tsx` (display)

### 4. Session Audit Timeline
- **Purpose**: Records and displays a chronological log of significant events within a session.
- **Details**: Captures events such as session start/end, input granted/revoked, file transfers, and administrative actions. This provides an auditable trail for security and compliance.
- **Access**: Integrated into the Session Detail Admin Page.
- **Related File**: `session.types.ts` (definitions), `session.api.ts` (fetching), `SessionDetailPage.tsx` (display)

### 5. Force End Session Action
- **Purpose**: Allows administrators to forcibly terminate an active remote session.
- **Details**: Provides a mechanism to immediately disconnect a session, useful for security incidents, unresponsive sessions, or policy enforcement. All such actions are recorded in the audit timeline.
- **Access**: Available from the Active Sessions Admin Table and Session Detail Admin Page.
- **Related File**: `force-disconnect-action.ts` (reused from desktop), `session.api.ts` (API call)

### 6. Admin Session Filters
- **Purpose**: Enables administrators to filter and search for sessions based on various criteria.
- **Details**: Allows filtering by session status (active, ended), host device ID, viewer user ID, and potentially other parameters. This helps in managing a large number of sessions.
- **Access**: Available on the Active Sessions Admin Table.
- **Related File**: `session.api.ts` (API call for filtered sessions)

## API Endpoints (Backend)
- `/api/admin/sessions/active`: Get all active sessions.
- `/api/admin/sessions/:sessionId`: Get details for a specific session.
- `/api/admin/sessions/:sessionId/force-end`: Force end a session.
- `/api/admin/sessions/:sessionId/quality-metrics`: Get quality metrics for a session.
- `/api/admin/sessions/:sessionId/audit-timeline`: Get audit timeline for a session.
- `/api/admin/sessions/filtered`: Get sessions based on filters.
- **Related File**: `session.routes.ts`

## Testing
Refer to `admin-session-visibility.test.ts` for a comprehensive list of items to verify during testing.
