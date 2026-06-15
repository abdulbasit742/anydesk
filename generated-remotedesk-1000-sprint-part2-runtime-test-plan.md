# RemoteDesk Sprint Part 2 — Test Plan

**Generated:** 2026-06-14

## Test Coverage

### Unit Tests (10 test suites, 60+ assertions)

#### Desktop Tests

| Suite | File | Cases | Focus |
|-------|------|-------|-------|
| File Transfer Store | `fileTransferStore.test.ts` | 8 | CRUD, status, progress, cleanup, sorting |
| Input Validator | `inputValidator.test.ts` | 14 | Coordinates, keys, buttons, timestamps, HTML |
| Rate Limiter | `rateLimiter.test.ts` | 9 | Burst, separate buckets, peek, reset, config |
| Clipboard Types | `clipboardTypes.test.ts` | 11 | Validation, preview, hashing, defaults |
| Audit Queue | `auditQueue.test.ts` | 9 | Enqueue, flush, retry, overflow, transport |
| Reconnect Manager | `reconnectManager.test.ts` | 10 | States, backoff, recovery, user-initiated |
| Support Bundle | `supportBundle.test.ts` | 9 | Redaction of IPs, UUIDs, paths, emails |

#### API Tests

| Suite | File | Cases | Focus |
|-------|------|-------|-------|
| Audit Validators | `auditValidators.test.ts` | 8 | Body validation, pagination, dates, batch |
| Permission Middleware | `permissionMiddleware.test.ts` | 6 | Hierarchy, exact match, edge cases |
| Plan Limits | `planLimits.test.ts` | 7 | Plan definitions, limit enforcement logic |

### Integration Tests (recommended post-merge)

| Test | Description |
|------|-------------|
| File transfer end-to-end | Send file from host → verify received on viewer |
| Clipboard round-trip | Copy text on host → verify on viewer clipboard |
| Input permission flow | Grant permission → verify input works → revoke → verify blocked |
| Emergency stop | Trigger e-stop → verify all input blocked → clear → verify still blocked |
| Reconnect flow | Disconnect peer → verify ICE restart → verify recovery |
| Audit flush | Queue events → disconnect API → verify queue growth → reconnect → verify flush |
| Plan limit enforcement | Start max sessions → verify next blocked → upgrade plan → verify allowed |

### Manual QA Tests

See `docs/desktop-qa-checklist.md` for the full 50-item manual test checklist.

Key areas:
1. File transfer UI (send, receive, cancel, pause, progress)
2. Clipboard sync toggles and permissions
3. Remote input permission grant/revoke/e-stop
4. Diagnostics panel and support bundle
5. Reconnect banner and retry
6. API endpoints with various auth roles

## Test Execution Plan

### Phase 1: Unit Tests (pre-merge)
```bash
# Desktop tests
cd apps/desktop
npm test -- tests/desktop/

# API tests
cd apps/api
npm test -- tests/api/
```

### Phase 2: Integration Tests (post-merge)
```bash
# Full stack test
npm run test:integration

# Prisma migration test
npx prisma migrate dev --preview-feature
```

### Phase 3: Manual QA (pre-release)
- Execute all items in `docs/desktop-qa-checklist.md`
- Verify on Windows, macOS, Linux
- Test with various network conditions (throttle, disconnect)

## Test Data Requirements

| Resource | Purpose |
|----------|---------|
| Test files (1KB, 1MB, 100MB, 1GB) | File transfer boundary testing |
| HTML clipboard content | Validation rejection testing |
| Large text (150KB+) | Clipboard size limit testing |
| Multiple user accounts | Permission and plan limit testing |
| Network throttling tools | Reconnect and rate limit testing |

## Success Criteria

- All 10 unit test suites pass
- Integration test coverage > 70% for new code
- Manual QA checklist 100% complete
- No P1 or P2 bugs
- Security review approved
- Performance impact < 5% CPU during idle
