# RemoteDesk — Sprint Part 2 Merge Guide

**STATUS:** SAFE_DIRECT_COPY  
**LABEL:** SAFE_DIRECT_COPY

## Files Overview

This sprint pack adds ~50 files across desktop runtime, API wiring, tests, and documentation.

## Merge Order

### 1. Desktop Features (REVIEW_REQUIRED)

```bash
# File Transfer
apps/desktop/src/features/fileTransfer/types.ts
apps/desktop/src/features/fileTransfer/fileTransferStore.ts
apps/desktop/src/features/fileTransfer/fileTransferManager.ts
apps/desktop/src/features/fileTransfer/FileTransferPanel.tsx
apps/desktop/src/features/fileTransfer/FileTransferPanel.module.css
apps/desktop/src/features/fileTransfer/FileTransferRow.tsx
apps/desktop/src/features/fileTransfer/FileTransferRow.module.css
apps/desktop/src/features/fileTransfer/ReceiveFileModal.tsx
apps/desktop/src/features/fileTransfer/ReceiveFileModal.module.css

# Clipboard Sync
apps/desktop/src/features/clipboard/clipboardTypes.ts
apps/desktop/src/features/clipboard/clipboardStore.ts
apps/desktop/src/features/clipboard/clipboardManager.ts
apps/desktop/src/features/clipboard/ClipboardPanel.tsx
apps/desktop/src/features/clipboard/ClipboardPanel.module.css

# Native Input
apps/desktop/src/features/input/inputTypes.ts
apps/desktop/src/features/input/inputValidator.ts
apps/desktop/src/features/input/rateLimiter.ts
apps/desktop/src/features/input/permissionGate.ts
apps/desktop/src/features/input/noopExecutor.ts
apps/desktop/src/features/input/inputManager.ts

# Diagnostics
apps/desktop/src/features/diagnostics/diagnosticsTypes.ts
apps/desktop/src/features/diagnostics/diagnosticsStore.ts
apps/desktop/src/features/diagnostics/diagnosticsCollector.ts
apps/desktop/src/features/diagnostics/supportBundle.ts

# Reconnect
apps/desktop/src/features/reconnect/reconnectManager.ts
apps/desktop/src/features/reconnect/ReconnectBanner.tsx
apps/desktop/src/features/reconnect/ReconnectBanner.module.css

# Audit
apps/desktop/src/features/audit/auditTypes.ts
apps/desktop/src/features/audit/auditQueue.ts
apps/desktop/src/features/audit/auditEmitter.ts
apps/desktop/src/features/audit/sessionAudit.ts
apps/desktop/src/features/audit/fileTransferAudit.ts
apps/desktop/src/features/audit/clipboardAudit.ts
apps/desktop/src/features/audit/inputAudit.ts

# IPC / Services
apps/desktop/src/services/fileSystem.ts
apps/desktop/src/preload/fileTransfer.ts
apps/desktop/src/main/fileTransfer.ts
```

### 2. API Wiring (REVIEW_REQUIRED)

```bash
apps/api/src/routes/audit.routes.ts
apps/api/src/routes/session.routes.ts
apps/api/src/routes/support.routes.ts
apps/api/src/routes/team.routes.ts
apps/api/src/routes/security.routes.ts
apps/api/src/services/auditLogService.ts
apps/api/src/services/sessionEventService.ts
apps/api/src/services/supportTicketService.ts
apps/api/src/services/teamInvitationService.ts
apps/api/src/services/securityEventService.ts
apps/api/src/services/billingUsageService.ts
apps/api/src/services/adminMetricsService.ts
apps/api/src/middleware/rolePermission.ts
apps/api/src/middleware/planLimits.ts
apps/api/src/validators/auditValidators.ts
apps/api/src/utils/errorMapper.ts
apps/api/src/socket/auditSocket.ts
```

### 3. Tests (SAFE_DIRECT_COPY)

```bash
tests/desktop/fileTransferStore.test.ts
tests/desktop/inputValidator.test.ts
tests/desktop/rateLimiter.test.ts
tests/desktop/clipboardTypes.test.ts
tests/desktop/auditQueue.test.ts
tests/desktop/reconnectManager.test.ts
tests/desktop/supportBundle.test.ts
tests/api/auditValidators.test.ts
tests/api/permissionMiddleware.test.ts
tests/api/planLimits.test.ts
```

### 4. Documentation (SAFE_DIRECT_COPY)

```bash
docs/desktop-file-transfer-flow.md
docs/clipboard-sync-safety-model.md
docs/native-input-safety-model.md
docs/audit-event-catalog.md
docs/api-audit-session-support-wiring-guide.md
docs/reconnect-ice-restart-model.md
docs/desktop-qa-checklist.md
docs/merge-guide.md
```

## Prisma Schema Changes Required

Add the following models (REVIEW_REQUIRED):

```prisma
model AuditLog {
  id        String   @id @default(cuid())
  category  String
  action    String
  level     String   @default("info")
  payload   Json     @default("{}")
  userId    String?
  deviceId  String?
  sessionId String?
  ipAddress String?
  createdAt DateTime @default(now())

  @@index([userId])
  @@index([sessionId])
  @@index([category, createdAt])
  @@index([createdAt])
}

model SessionEvent {
  id        String   @id @default(cuid())
  sessionId String
  eventType String
  payload   Json     @default("{}")
  userId    String?
  deviceId  String?
  createdAt DateTime @default(now())

  @@index([sessionId])
  @@index([createdAt])
}

model SupportTicket {
  id          String   @id @default(cuid())
  title       String
  description String
  status      String   @default("open")
  priority    String   @default("medium")
  category    String   @default("general")
  requesterId String
  assignedToId String?
  deviceId    String?
  sessionId   String?
  resolvedAt  DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([requesterId])
  @@index([status])
}

model SupportTicketComment {
  id        String   @id @default(cuid())
  ticketId  String
  content   String
  authorId  String
  isInternal Boolean @default(false)
  createdAt DateTime @default(now())

  @@index([ticketId])
}

model TeamInvitation {
  id          String   @id @default(cuid())
  teamId      String
  email       String
  role        String
  invitedById String
  status      String   @default("pending")
  message     String?
  expiresAt   DateTime
  createdAt   DateTime @default(now())

  @@index([teamId, status])
  @@index([email, status])
}

model SecurityEvent {
  id          String   @id @default(cuid())
  category    String
  severity    String
  description String
  details     Json     @default("{}")
  userId      String?
  deviceId    String?
  sessionId   String?
  ipAddress   String?
  userAgent   String?
  createdAt   DateTime @default(now())

  @@index([userId])
  @@index([severity, createdAt])
}

model TrustedDevice {
  id          String   @id @default(cuid())
  userId      String
  deviceName  String
  fingerprint String
  ipAddress   String?
  userAgent   String?
  lastUsedAt  DateTime @default(now())
  createdAt   DateTime @default(now())

  @@index([userId])
}

model UsageRecord {
  id         String   @id @default(cuid())
  userId     String
  metric     String
  value      Float
  sessionId  String?
  recordedAt DateTime @default(now())

  @@index([userId, metric, recordedAt])
}
```

## Integration Steps

1. Apply Prisma schema changes: `npx prisma migrate dev`
2. Register API routes in main Express app
3. Register Socket.IO handlers in connection handler
4. Register IPC handlers in Electron main process
5. Register preload bridges
6. Add UI components to appropriate layout/panels
7. Run tests: `npm test`
8. Verify no existing WebRTC flow is broken
9. Verify no existing screen capture is affected
10. Check audit events flow to API

## Risk Checklist

- [ ] Verify existing `SessionDataChannel` not overwritten
- [ ] Verify existing `RemoteSessionView` not modified
- [ ] Verify existing WebRTC offer/answer/ICE flow intact
- [ ] Verify root `package.json` not modified
- [ ] Verify `packages/shared/src/index.ts` not overwritten
- [ ] Confirm Prisma schema changes reviewed
- [ ] Confirm IPC surfaces documented
