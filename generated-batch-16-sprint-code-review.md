# Kimi Batch 16 Sprint Code Review

## Decision

Runtime/shared code and tests from this sprint were not merged directly. Current RemoteDesk has newer event contracts and desktop WebRTC/capture code, while the staged shared package introduces a different module layout. Treat skipped files as implementation ideas only.

## Skipped Findings

| File | Staged bytes | Current exists | Current bytes | Recommendation |
|---|---:|---|---:|---|
| .gitignore | 120 | yes | 108 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/api/package.json | 1252 | yes | 918 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/api/prisma/schema.prisma | 4290 | yes | 2457 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/api/src/middleware/auth.ts | 858 | yes | 1003 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/api/src/middleware/error.ts | 717 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/api/src/middleware/logger.ts | 337 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/api/src/middleware/rate-limit.ts | 705 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/api/src/middleware/roles.ts | 371 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/api/src/routes/admin.ts | 834 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/api/src/routes/auth.ts | 3070 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/api/src/routes/billing.ts | 1545 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/api/src/routes/devices.ts | 1224 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/api/src/routes/metrics.ts | 1470 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/api/src/routes/organizations.ts | 978 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/api/src/routes/sessions.ts | 529 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/api/src/routes/webhook-delivery.ts | 2379 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/api/src/routes/webhooks.ts | 808 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/api/src/server.ts | 1689 | yes | 998 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/api/src/socket/handlers.ts | 3800 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/api/src/utils/id.ts | 133 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/api/src/utils/log-redaction.ts | 1084 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/api/src/utils/webhook-signing.ts | 575 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/api/tests/billing/cancel-resume.test.ts | 1760 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/api/tests/billing/checkout-state.test.ts | 1200 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/api/tests/billing/past-due.test.ts | 877 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/api/tests/billing/plan-gate.test.ts | 1651 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/api/tests/billing/stripe-webhook.test.ts | 2256 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/api/tests/billing/trial-state.test.ts | 1543 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/api/tests/enterprise/admin-guard.test.ts | 1125 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/api/tests/enterprise/audit-log.test.ts | 2267 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/api/tests/enterprise/invitation.test.ts | 2032 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/api/tests/enterprise/organization.test.ts | 1379 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/api/tests/enterprise/policy.test.ts | 1845 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/api/tests/enterprise/rbac.test.ts | 1996 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/api/tests/enterprise/team.test.ts | 1294 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/api/tests/security/auth-token.test.ts | 2357 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/api/tests/security/cors.test.ts | 1074 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/api/tests/security/headers.test.ts | 1570 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/api/tests/security/input-validation.test.ts | 1571 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/api/tests/security/permission-gate.test.ts | 1757 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/api/tests/security/rate-limit.test.ts | 1480 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/api/tests/security/socket-payload-validation.test.ts | 2087 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/api/tsconfig.json | 444 | yes | 257 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/desktop/package.json | 587 | yes | 834 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/desktop/src/main.ts | 1509 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/desktop/src/preload.ts | 1231 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/desktop/src/renderer/App.tsx | 4654 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/desktop/src/renderer/index.html | 208 | yes | 305 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/desktop/src/renderer/main.tsx | 214 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/desktop/tests/capture-helper.test.ts | 1658 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/desktop/tests/chat-reducer.test.ts | 2221 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/desktop/tests/clipboard-sync.test.ts | 1846 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/desktop/tests/file-transfer-reducer.test.ts | 3367 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/desktop/tests/input-normalization.test.ts | 1943 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/desktop/tests/manual/e2e-clipboard-sync.md | 717 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/desktop/tests/manual/e2e-file-transfer.md | 854 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/desktop/tests/manual/e2e-host-session.md | 991 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/desktop/tests/manual/e2e-remote-input.md | 782 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/desktop/tests/settings-persistence.test.ts | 1629 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/desktop/tests/webrtc-helper.test.ts | 1913 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/web/next.config.js | 164 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/web/package.json | 869 | yes | 726 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/web/src/app/connect/[id]/page.tsx | 3181 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/web/src/app/dashboard/page.tsx | 2322 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/web/src/app/layout.tsx | 266 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/web/src/app/login/page.tsx | 2017 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/web/src/app/page.tsx | 1021 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/web/src/lib/api.ts | 461 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/web/src/lib/store.ts | 480 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/web/tailwind.config.js | 283 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/web/tests/e2e/admin.spec.ts | 1740 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/web/tests/e2e/auth.setup.ts | 495 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/web/tests/e2e/auth-flow.spec.ts | 2738 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/web/tests/e2e/billing.spec.ts | 1339 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/web/tests/e2e/dashboard.spec.ts | 1539 | no | 0 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| apps/web/tsconfig.json | 505 | yes | 576 | Skip overwrite by policy; runtime/config code requires manual review before merge. |
| IMPLEMENTATION_NOTES.md | 2470 | yes | 2153 | Skip overwrite; local notes have current WebRTC/capture state. Merge summary added separately. |
| package.json | 366 | yes | 695 | Skip overwrite; dependency/package shape differs from current workspace. |
| packages/shared/package.json | 313 | yes | 314 | Skip overwrite; dependency/package shape differs from current workspace. |
| packages/shared/src/constants.ts | 1381 | no | 0 | Skip overwrite; conflicts with current RemoteDesk ClientEvents/ServerEvents and DTO names. |
| packages/shared/src/error-catalog.ts | 2290 | no | 0 | Skip overwrite; conflicts with current RemoteDesk ClientEvents/ServerEvents and DTO names. |
| packages/shared/src/events.ts | 1714 | no | 0 | Skip overwrite; conflicts with current RemoteDesk ClientEvents/ServerEvents and DTO names. |
| packages/shared/src/index.ts | 165 | yes | 1667 | Skip overwrite; conflicts with current RemoteDesk ClientEvents/ServerEvents and DTO names. |
| packages/shared/src/sdk/auth.ts | 850 | no | 0 | Useful SDK idea; port manually into a dedicated SDK package later, not into current shared runtime now. |
| packages/shared/src/sdk/client.ts | 1915 | no | 0 | Useful SDK idea; port manually into a dedicated SDK package later, not into current shared runtime now. |
| packages/shared/src/sdk/devices.ts | 961 | no | 0 | Useful SDK idea; port manually into a dedicated SDK package later, not into current shared runtime now. |
| packages/shared/src/sdk/index.ts | 240 | no | 0 | Useful SDK idea; port manually into a dedicated SDK package later, not into current shared runtime now. |
| packages/shared/src/sdk/sessions.ts | 671 | no | 0 | Useful SDK idea; port manually into a dedicated SDK package later, not into current shared runtime now. |
| packages/shared/src/sdk/types.ts | 536 | no | 0 | Useful SDK idea; port manually into a dedicated SDK package later, not into current shared runtime now. |
| packages/shared/src/sdk/webhooks.ts | 668 | no | 0 | Useful SDK idea; port manually into a dedicated SDK package later, not into current shared runtime now. |
| packages/shared/src/types.ts | 2923 | no | 0 | Skip overwrite; conflicts with current RemoteDesk ClientEvents/ServerEvents and DTO names. |
| packages/shared/src/validators.ts | 2773 | no | 0 | Skip overwrite; conflicts with current RemoteDesk ClientEvents/ServerEvents and DTO names. |
| packages/shared/tests/api-contract.test.ts | 3919 | no | 0 | Review later; tests target Kimi shared contracts and may not compile against current shared event contracts without adaptation. |
| packages/shared/tests/dto-validation.test.ts | 4510 | no | 0 | Review later; tests target Kimi shared contracts and may not compile against current shared event contracts without adaptation. |
| packages/shared/tests/error-code-contract.test.ts | 1614 | no | 0 | Review later; tests target Kimi shared contracts and may not compile against current shared event contracts without adaptation. |
| packages/shared/tests/permission-contract.test.ts | 2826 | no | 0 | Review later; tests target Kimi shared contracts and may not compile against current shared event contracts without adaptation. |
| packages/shared/tests/plan-limit-contract.test.ts | 1848 | no | 0 | Review later; tests target Kimi shared contracts and may not compile against current shared event contracts without adaptation. |
| packages/shared/tests/sdk.test.ts | 1082 | no | 0 | Review later; tests target Kimi shared contracts and may not compile against current shared event contracts without adaptation. |
| packages/shared/tests/socket-contract.test.ts | 3214 | no | 0 | Review later; tests target Kimi shared contracts and may not compile against current shared event contracts without adaptation. |
| packages/shared/tsconfig.json | 367 | yes | 261 | Skip overwrite by policy; runtime/config code requires manual review before merge. |

## Useful Ideas To Port Later

- Shared SDK files can become a separate packages/sdk package after current API contracts stabilize.
- Contract tests are useful, but must be rewritten against current packages/shared/src/index.ts event names.
- Performance/load test scripts under docs can be promoted into tests/load when the API is runnable in CI.
- Root .lighthouserc.js is safe only if web app gets a stable localhost preview command.
