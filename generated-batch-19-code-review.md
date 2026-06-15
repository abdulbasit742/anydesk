# Kimi Batch 19 Runtime Code Review

## Decision

Kimi runtime code was reviewed as reference material and intentionally not merged. The current repository has newer RemoteDesk-specific backend/socket/desktop implementations, including screen capture preview and WebRTC offer/answer/ICE orchestration. Overwriting those files would regress the project.

## Skipped Code Findings

| File | Staged bytes | Current exists | Current bytes | Recommendation |
|---|---:|---|---:|---|
| apps/api/package.json | 383 | yes | 918 | Skip overwrite; staged manifest is older or narrower. Review dependencies manually only if needed. |
| apps/api/prisma/schema.prisma | 1457 | yes | 2457 | Skip overwrite; current API has existing Prisma/auth/socket flow. Manually port only small helpers after review. |
| apps/api/src/index.ts | 908 | no | 0 | Skip overwrite; current API has existing Prisma/auth/socket flow. Manually port only small helpers after review. |
| apps/api/src/lib/auth.ts | 826 | no | 0 | Skip overwrite; current API has existing Prisma/auth/socket flow. Manually port only small helpers after review. |
| apps/api/src/lib/logger.ts | 416 | no | 0 | Skip overwrite; current API has existing Prisma/auth/socket flow. Manually port only small helpers after review. |
| apps/api/src/lib/prisma.ts | 225 | yes | 118 | Skip overwrite; current API has existing Prisma/auth/socket flow. Manually port only small helpers after review. |
| apps/api/src/middleware/rateLimit.ts | 609 | no | 0 | Skip overwrite; current API has existing Prisma/auth/socket flow. Manually port only small helpers after review. |
| apps/api/src/routes/audit.ts | 442 | no | 0 | Skip overwrite; current API has existing Prisma/auth/socket flow. Manually port only small helpers after review. |
| apps/api/src/routes/auth.ts | 824 | no | 0 | Skip overwrite; current API has existing Prisma/auth/socket flow. Manually port only small helpers after review. |
| apps/api/src/routes/devices.ts | 563 | no | 0 | Skip overwrite; current API has existing Prisma/auth/socket flow. Manually port only small helpers after review. |
| apps/api/src/routes/sessions.ts | 651 | no | 0 | Skip overwrite; current API has existing Prisma/auth/socket flow. Manually port only small helpers after review. |
| apps/api/src/services/sessionService.ts | 654 | no | 0 | Skip overwrite; current API has existing Prisma/auth/socket flow. Manually port only small helpers after review. |
| apps/api/src/websocket/signaling.ts | 1274 | no | 0 | Skip overwrite; current API has existing Prisma/auth/socket flow. Manually port only small helpers after review. |
| apps/desktop/package.json | 338 | yes | 834 | Skip overwrite; staged manifest is older or narrower. Review dependencies manually only if needed. |
| apps/desktop/src/main/index.ts | 717 | yes | 1418 | Skip overwrite; current desktop has newer auth, capture, and WebRTC session work. |
| apps/desktop/src/preload/index.ts | 338 | yes | 380 | Skip overwrite; current desktop has newer auth, capture, and WebRTC session work. |
| apps/desktop/src/renderer/App.tsx | 322 | no | 0 | Skip overwrite; current desktop has newer auth, capture, and WebRTC session work. |
| apps/desktop/src/renderer/index.tsx | 178 | no | 0 | Skip overwrite; current desktop has newer auth, capture, and WebRTC session work. |
| apps/web/package.json | 355 | yes | 726 | Skip overwrite; staged manifest is older or narrower. Review dependencies manually only if needed. |
| apps/web/src/hooks/useAuth.ts | 709 | no | 0 | Skip overwrite; current web dashboard layout differs. Treat as reference only. |
| apps/web/src/lib/api.ts | 613 | no | 0 | Skip overwrite; current web dashboard layout differs. Treat as reference only. |
| apps/web/src/lib/webrtc.ts | 2025 | no | 0 | Skip overwrite; current web dashboard layout differs. Treat as reference only. |
| apps/web/src/pages/_app.tsx | 149 | no | 0 | Skip overwrite; current web dashboard layout differs. Treat as reference only. |
| apps/web/src/pages/index.tsx | 153 | no | 0 | Skip overwrite; current web dashboard layout differs. Treat as reference only. |
| package.json | 367 | yes | 695 | Skip overwrite; staged manifest is older or narrower. Review dependencies manually only if needed. |
| packages/shared/package.json | 130 | yes | 314 | Skip overwrite; staged manifest is older or narrower. Review dependencies manually only if needed. |
| packages/shared/src/constants/index.ts | 1446 | no | 0 | Skip overwrite; staged shared exports conflict with current ClientEvents/ServerEvents contracts. |
| packages/shared/src/index.ts | 106 | yes | 1667 | Skip overwrite; staged shared exports conflict with current ClientEvents/ServerEvents contracts. |
| packages/shared/src/schemas/index.ts | 757 | no | 0 | Skip overwrite; staged shared exports conflict with current ClientEvents/ServerEvents contracts. |
| packages/shared/src/types/index.ts | 1903 | no | 0 | Skip overwrite; staged shared exports conflict with current ClientEvents/ServerEvents contracts. |
| packages/shared/src/utils/index.ts | 539 | no | 0 | Skip overwrite; staged shared exports conflict with current ClientEvents/ServerEvents contracts. |
| tsconfig.json | 234 | no | 0 | Skip overwrite; runtime code was excluded by merge policy. |

## Useful Ideas To Port Later

- Review apps/api/src/lib/logger.ts as a possible seed for structured logging, but adapt it to the current Express server shape.
- Review apps/api/src/middleware/rateLimit.ts for simple request throttling ideas, but do not apply until API route integration is explicit.
- Review docs/sdk/*.ts and docs/webhooks/*.ts examples as documentation samples, not runtime SDK source.
- Keep current packages/shared/src/index.ts event contracts as the source of truth.
