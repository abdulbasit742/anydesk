# RemoteDesk Sprint Pack Part 1 Merge Summary

This Part 1 pack focuses on `packages/shared` and establishes production-grade contracts and pure helpers for file transfer, clipboard sync, data-channel routing, heartbeat/reconnect, retry policy, audit events, billing limits, team permissions, security events, support tickets, WebRTC stats, and Socket.IO event typing.

## Merge labels

- `REVIEW_REQUIRED`: Shared protocol contracts and barrel exports. These are meaningful production files, but they define cross-app contracts and should be reviewed against the existing API/web/desktop code before copying.
- `SAFE_DIRECT_COPY`: Shared tests and documentation/report files. Tests are additive and should not alter runtime behavior.
- `DO_NOT_MERGE`: No files generated in this category for Part 1.

## Expected impact

If merged carefully, this pack gives the API, web, and desktop apps a common vocabulary for the major blockers: file transfer, clipboard sync, safe remote input state, audit events, plan enforcement, support tickets, diagnostics, and WebRTC quality decisions.

## Merge notes

1. Copy `REVIEW_REQUIRED/packages/shared/src/**` into `packages/shared/src/**` after checking for existing filenames and exports.
2. If existing `packages/shared/src/index.ts` already exports app contracts, merge exports manually instead of replacing the file.
3. Copy `SAFE_DIRECT_COPY/packages/shared/test/**` into `packages/shared/test/**` after confirming the package test runner supports TypeScript tests or transpilation.
4. Run package typecheck and tests before using these contracts in API/desktop/web.
