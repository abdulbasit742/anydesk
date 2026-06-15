# RemoteDesk Pack 10 Code Review

## Verdict

**Docs + pure shared helpers imported. Runtime marketplace code remains review-only.**

Pack 10 is more useful than filler packs because it contains specific connector marketplace domains: OAuth connections, webhook endpoints, SIEM exports, Slack/Teams/Jira/Zendesk mappings, storage connectors, connector audit, and marketplace UI shells. However, its runtime files are generated into isolated `apps/*/src/pack10` folders and do not match the current Express/Next/Electron contracts closely enough for direct mounting.

## Safe Helpers Imported

- `connectorAuthState.ts`
- `connectorDisplayName.ts`
- `connectorRateLimit.ts`
- `externalLinkSafety.ts`
- `marketplaceCategory.ts`
- `oauthStateToken.ts`
- `webhookEventFilter.ts`

These helpers are dependency-free and exported as `pack10` from `@remotedesk/shared`.

## Runtime Risks

- OAuth token storage is not backed by a real encrypted secret manager.
- Webhook signing keys, HTTPS enforcement, retries, and payload redaction need production-grade implementation.
- Connector admin authorization must be tied to the current auth/RBAC model.
- Generated web pages are under `apps/web/src/pack10`, while the current app uses `apps/web/app/...`.
- Generated API route patterns are isolated under `apps/api/src/pack10` and are not mounted in current Express routes.
- Desktop connector status UI is separate from the current Electron session/dashboard flow.

## Test Triage

Kept tests that import copied shared helpers:

- `tests/pack10/connectorAuthState.test.ts`
- `tests/pack10/externalLinkSafety.test.ts`
- `tests/pack10/oauthStateToken.test.ts`
- `tests/pack10/webhookEventFilter.test.ts`

Skipped tests that import `../../REVIEW_REQUIRED/...` runtime files:

- `connectorStatusStore.test.ts`
- `oauthScopePolicy.test.ts`
- `webhookEndpointPolicy.test.ts`
- `webhookRetryPolicy.test.ts`

## Recommended Next Runtime Work

Do not start with OAuth or webhooks. First implement:

1. `ConnectorDefinition` Prisma model with static seed data.
2. `GET /api/connectors/catalog` read-only endpoint.
3. `/dashboard/connectors` read-only marketplace page.
4. Audit event when a connector is viewed/configuration is opened.

Only after that should OAuth, webhook delivery, SIEM export, and provider-specific mappings be wired.
