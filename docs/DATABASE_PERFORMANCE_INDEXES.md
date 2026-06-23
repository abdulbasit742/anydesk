# Database Performance & Indexes

This document outlines the recommended database indexes to ensure queries remain performant as the platform scales.

## Recommended Indexes

Before applying these indexes, ensure they do not conflict with existing schema definitions. Destructive migrations must be avoided.

| Table | Column(s) | Reason |
| :--- | :--- | :--- |
| `Device` | `teamId` | Frequently used to list all devices belonging to a specific team. |
| `Session` | `deviceId` | Required for fetching the session history of a specific device. |
| `Session` | `teamId`, `status` | Used to populate the active sessions view on the dashboard. |
| `AuditLog` | `teamId`, `createdAt` | Critical for paginated, time-based queries in the security and audit dashboards. |
| `AuditLog` | `actorUserId` | Allows filtering audit events by the user who performed the action. |
| `AuditLog` | `category`, `severity` | Needed for filtering operational alerts and security incidents. |
| `Notification` | `recipientId`, `createdAt` | Required for displaying the user's notification inbox in chronological order. |
| `SupportTicket` | `status`, `teamId` | Used to filter open vs. closed tickets for a team. |
| `Incident` | `status`, `severity` | Used by the operations dashboard to highlight active, critical incidents. |
| `WebhookDelivery` | `status`, `createdAt` | Needed to track failed deliveries and trigger retry mechanisms. |

## Pagination Strategy

All list endpoints must implement cursor-based or offset-based pagination. The standard contracts (`PaginationParams`, `PaginatedResponse`) are defined in `packages/shared/src/observability/pagination.ts`. Default page size is 25, with a maximum of 100 to prevent query timeouts.
