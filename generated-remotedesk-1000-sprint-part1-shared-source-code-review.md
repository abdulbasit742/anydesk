# RemoteDesk Sprint Pack Part 1 Code Review Guide

## Highest priority review areas

1. `packages/shared/src/index.ts`: Review barrel exports to avoid breaking existing public package contracts.
2. `packages/shared/src/socket/*`: Confirm event names match existing Socket.IO server/client behavior.
3. `packages/shared/src/file-transfer/*`: Confirm chunk size, blocked extensions, ACK/NACK semantics, and status transitions align with UX and backend audit plans.
4. `packages/shared/src/clipboard/*`: Confirm direction policies and max byte defaults match product/security requirements.
5. `packages/shared/src/team/*`: Confirm role-permission matrix matches RemoteDesk billing and admin model.
6. `packages/shared/src/billing/*`: Confirm default plan limits with product/pricing before enforcing in API.

## TypeScript / ESM review

All internal package imports and exports use `.js` extensions for NodeNext-style ESM output. Do not remove those extensions unless the repo uses a different module resolution strategy.

## Safety review

The remote input work in this part is limited to shared state modeling. Native input execution is intentionally not implemented here. Runtime native input modules should remain disabled by default and must be host-consented in later desktop/API parts.
