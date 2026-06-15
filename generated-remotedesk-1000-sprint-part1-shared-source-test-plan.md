# RemoteDesk Sprint Pack Part 1 Test Plan

## Shared unit tests included

- File transfer reducer and progress behavior
- File chunk sizing/range behavior
- Clipboard debounce, conflict, and policy checks
- Retry backoff and retry budget behavior
- Team permission and invite guard behavior
- Audit event builder and guard behavior
- Billing plan limit enforcement
- WebRTC stats mapper and quality classification
- Data channel router dispatch behavior
- Support ticket workflow and validators

## Recommended commands

Adapt these to the repo's actual package manager and test runner:

```bash
pnpm --filter @remotedesk/shared typecheck
pnpm --filter @remotedesk/shared test
```

If the shared package currently has no TypeScript test runner, run the tests through the repo's existing Vitest/Jest setup or add a reviewed test script that compiles TypeScript before Node's built-in test runner executes emitted JavaScript.

## Manual validation

1. Confirm all `.js` import/export specifiers resolve after TypeScript compilation.
2. Confirm no runtime dependency was introduced.
3. Confirm the shared package can be consumed by API, desktop, and web builds.
4. Confirm shared contracts do not conflict with existing API Socket.IO event names.
