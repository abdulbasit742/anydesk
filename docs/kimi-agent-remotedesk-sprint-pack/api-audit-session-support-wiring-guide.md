# RemoteDesk API — Audit/Session/Support Wiring Guide

**STATUS:** SAFE_DIRECT_COPY  
**LABEL:** SAFE_DIRECT_COPY

## Route Registration

```typescript
import express from "express";
import auditRoutes from "./routes/audit.routes";
import sessionRoutes from "./routes/session.routes";
import supportRoutes from "./routes/support.routes";
import teamRoutes from "./routes/team.routes";
import securityRoutes from "./routes/security.routes";

const app = express();

app.use("/api/audit", auditRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/security", securityRoutes);
```

## Socket.IO Integration

```typescript
import { Server } from "socket.io";
import { registerAuditSocketHandlers } from "./socket/auditSocket";

const io = new Server(server);

io.on("connection", (socket) => {
  registerAuditSocketHandlers(io, socket);
});
```

## Middleware Stack

| Middleware | Routes | Purpose |
|-----------|--------|---------|
| `authenticate` | All | JWT validation |
| `requireRole(["admin"])` | /api/audit/summary, /api/sessions/active/count | Admin only |
| `requireRole(["admin", "support"])` | /api/audit/log, /api/support/metrics | Staff access |
| `requireTeamOwnership()` | /api/teams/:teamId/invitations | Team admin only |
| `limitConcurrentSessions()` | Session start | Enforce plan limits |
| `limitFileTransferSize()` | File transfer | Enforce plan limits |
| `requirePlanFeature(feature)` | Feature routes | Feature gating |

## Audit Log Flow

```
Desktop Client                    API Server
------------                    ----------
Audit Queue ──batch──> POST /api/audit/log/batch
                    or
            Socket.IO emit "audit:events:batch"
                        │
                        v
              AuditLogService.createLogsBatch()
                        │
                        v
                   Prisma.auditLog.createMany()
```

## Session Event Flow

```
Desktop Client                    API Server
------------                    ----------
Session Events ──> Socket.IO "session:events:batch"
                        │
                        v
              SessionEventService.createEventsBatch()
                        │
                        v
                   Prisma.sessionEvent.createMany()
```

## Support Ticket Flow

```
User                      API Server
----                      ----------
POST /api/support/tickets
  { title, description, priority }
              │
              v
  SupportTicketService.createTicket()
              │
              v
  Prisma.supportTicket.create()

GET /api/support/tickets
  (requester sees own; staff sees all)

POST /api/support/tickets/:id/comments
  { content, isInternal }
  (isInternal forced false for non-staff)
```

## Team Invitation Flow

```
Team Admin                API Server
----------                ----------
POST /api/teams/invitations
  { teamId, email, role }
              │
              v
  TeamInvitationService.createInvitation()
  (checks for existing member/pending invite)
              │
              v
  Email sent to invitee

Invitee                   API Server
-------                   ----------
GET /api/teams/invitations/me
  (lists pending for user's email)

POST /api/teams/invitations/:id/respond
  { accept: true/false }
              │
              v
  Adds to team_members if accepted
```

## Prisma Schema Additions Required

See `REVIEW_REQUIRED` notes in the manifest for schema changes.

## Error Handling

All routes use `mapServiceError()` for consistent error responses:

```json
{
  "success": false,
  "error": "Human readable message",
  "code": "ERROR_CODE",
  "details": { "field": "validation message" }
}
```

## Rate Limiting

Recommended rate limits:
- Audit batch: 100 requests/minute
- Session events: 1000 events/minute per session
- Support tickets: 10 creates/hour per user
- Team invitations: 50/hour per team
