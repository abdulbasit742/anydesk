# PDF Code Batches Code Review - 2026-06-14

## Batch 5 - Desktop Remote Input

Status: **partially ported**.

Useful code from the PDF was adapted into the current desktop renderer instead of copied as a parallel module.

Ported:

- Blocked key policy for protected system shortcuts.
- Viewer-side filter before forwarding keyboard input.
- Host-side permission check now also rejects protected keyboard messages.
- Remote input batcher helper for future data-channel batching.

Files changed:

- `apps/desktop/src/renderer/src/services/remoteInput.ts`
- `apps/desktop/src/renderer/src/components/RemoteSessionView.tsx`
- `apps/desktop/test/remoteInputPolicy.test.ts`

## Batch 4 - Desktop WebRTC Engine

Status: **review-only**.

Direct merge was skipped because the extracted files depend on generated shared contracts that do not match the current project:

- enum-style `ConnectionStatus.Idle`, `ConnectionStatus.Connecting`, etc.
- `AppError` and `ErrorCodes` from `@remotedesk/shared`.
- a separate `apps/desktop/src/webrtc/**` engine tree that overlaps the current `PeerConnectionManager`, reconnect manager, and stats collector.

Useful ideas to port later:

- Keep connection state transitions explicit.
- Add more unit tests for ICE candidate queues and reconnect behavior.
- Add a controlled ICE restart action from the current reconnect manager rather than replacing the existing engine.

## Batch 6 - Desktop Remote Session UI

Status: **review-only**.

Direct merge was skipped because it duplicates the live `RemoteSessionView` and uses stale shared contracts. It also contains mojibake UI strings such as `Connectingâ€¦`.

Useful ideas to port later:

- Session timeline drawer.
- Connection status badge variants.
- Quality labels derived from stats, if not already covered by current diagnostics.

## Batch 8 - Tests, Docs & Shared Contract Tests

Status: **docs imported, tests review-only**.

Docs were imported under `docs/pdf-code-batches-20260614/batch8-tests-docs-shared-contract-tests/`.

Generated tests stay review-only until current shared contracts are aligned with the expected generated interfaces.

## Phase 6 Batch 1 - Stripe Billing, Seats & Usage Metering

Status: **docs imported, runtime review-only**.

`billing.md` was imported. Runtime code was skipped because it expects schema/routes that are not present in the current API yet.

Useful next work:

- Add Prisma models for usage metering and subscription seats.
- Port Stripe service code after environment variables and price IDs are formalized.
- Add webhook idempotency checks before enabling production billing actions.

## Phase 6 Batch 2 - Admin Console, RBAC & Billing Portal

Status: **docs imported, runtime review-only**.

`admin-and-rbac.md` was imported. Runtime code was skipped because organization/member RBAC models and web route contracts need to be added first.

Useful next work:

- Add organization and membership schema.
- Add server-side RBAC middleware in current Express style.
- Wire admin UI to real API endpoints after schema is live.

## Phase 6 Batch 3 - Audit-Compliance Export + SSO-SAML

Status: **docs imported, runtime review-only**.

`audit-and-sso.md` was imported. Runtime code was skipped because audit export and SSO/SAML models need a deliberate security design before merge.

Useful next work:

- Add append-only audit log schema.
- Add export job tracking.
- Add SSO provider metadata schema and security review before enabling SAML flows.
