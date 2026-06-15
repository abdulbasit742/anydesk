# PDF Code Batches Merge Summary - 2026-06-14

## Result

Build status after this merge: **35-42%**.

Seven real-code PDFs were extracted into:

`C:/Users/bsphy2304/Documents/New project/_incoming/pdf-code-batches-20260614`

Total extracted files: **163**.

The useful compatible runtime code was manually ported. Stale or schema-dependent runtime code stayed review-only.

## Imported Runtime Work

- `apps/desktop/src/renderer/src/services/remoteInput.ts`
  - Added protected keyboard shortcut policy.
  - Added `shouldForwardKeyboardEvent`.
  - Added remote-input batch envelope and batcher helper.
  - Hardened `canSendRemoteInput` so host-side enforcement also blocks protected keys.
- `apps/desktop/src/renderer/src/components/RemoteSessionView.tsx`
  - Viewer-side keyboard forwarding now filters protected system shortcuts before sending over the data channel.
  - Viewer UI now states that protected system shortcuts stay local.
- `apps/desktop/test/remoteInputPolicy.test.ts`
  - Added coverage for blocked system keys and batch flushing.

## Imported Docs

- `docs/pdf-code-batches-20260614/batch8-tests-docs-shared-contract-tests/desktop-manual-qa-checklist.md`
- `docs/pdf-code-batches-20260614/batch8-tests-docs-shared-contract-tests/error-codes-reference.md`
- `docs/pdf-code-batches-20260614/batch8-tests-docs-shared-contract-tests/local-run-guide.md`
- `docs/pdf-code-batches-20260614/batch8-tests-docs-shared-contract-tests/testing-strategy.md`
- `docs/pdf-code-batches-20260614/batch8-tests-docs-shared-contract-tests/architecture/session-pipeline.md`
- `docs/pdf-code-batches-20260614/batch8-tests-docs-shared-contract-tests/architecture/shared-contracts.md`
- `docs/pdf-code-batches-20260614/phase6-batch1-stripe-billing-seats-usage/billing.md`
- `docs/pdf-code-batches-20260614/phase6-batch2-admin-rbac-billing-portal/admin-and-rbac.md`
- `docs/pdf-code-batches-20260614/phase6-batch3-audit-compliance-sso-saml/audit-and-sso.md`

## Review-Only Runtime Code

- Phase 6 API billing/admin/audit/SSO code was not copied into `apps/api`.
- Phase 6 web admin code was not copied into `apps/web`.
- Batch 4 desktop WebRTC engine code was not copied into runtime.
- Batch 6 desktop session UI code was not copied into runtime.
- Generated shared barrels/types were not allowed to overwrite current `packages/shared/src/index.ts`.

## Why Runtime Code Was Limited

- The Phase 6 API code assumes schema objects that do not exist in the current Prisma schema yet, including organization/member/usage/audit/SSO-style tables.
- Some generated API files assume `apps/api/src/app.ts`, while the current app uses its existing server structure.
- The Batch 4/6 desktop code references stale shared contracts such as enum-style `ConnectionStatus.*`, `AppError`, and `ErrorCodes`.
- Batch 6 includes mojibake UI strings like `Connectingâ€¦`, so direct copying would lower quality.
- The current desktop already has newer WebRTC/session primitives, so the safest progress was to port the compatible remote-input safety logic.

## Next Best Merge

The next valuable merge is API schema work for Phase 6:

1. Add real Prisma models/migrations for organizations, org members, usage records, audit exports, and SSO providers.
2. Port Phase 6 services route-by-route after schema exists.
3. Add tests after the schema and route contracts match current API conventions.
