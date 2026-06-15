# RemoteDesk — Release Readiness Checklist

> **Version:** 1.0  
> **Last Updated:** 2026-06-12  
> **Release Version:** ___________________  
> **Release Manager:** ___________________  **Date:** ___________________

---

## How to Use

Each item must be marked **✅ Done**, **❌ Blocked**, or **⏭ N/A** (with justification).  
A release is blocked if any **P0** item is not ✅ Done.

---

## 1. Code Quality

| # | Priority | Check | Owner | Status | Notes |
|---|----------|-------|-------|--------|-------|
| 1.1 | P0 | `tsc --noEmit` passes with `strict: true` and `exactOptionalPropertyTypes: true` on all packages | Dev Lead | ☐ | |
| 1.2 | P0 | ESLint reports zero errors across the entire monorepo (`pnpm run lint`) | Dev Lead | ☐ | |
| 1.3 | P0 | All Vitest unit tests pass (`pnpm run test`) — zero failures, zero skipped critical tests | Dev Lead | ☐ | |
| 1.4 | P0 | All Playwright e2e tests pass on Windows and macOS CI runners | QA Lead | ☐ | |
| 1.5 | P1 | No `// TODO`, `// FIXME`, or `// HACK` comments in production code paths (grep scan clean) | Dev Lead | ☐ | |
| 1.6 | P1 | No `console.log` debug statements in production code (use structured logger) | Dev Lead | ☐ | |
| 1.7 | P1 | Bundle size budget not exceeded: renderer bundle < 2 MB gzipped | Dev Lead | ☐ | |
| 1.8 | P1 | No known critical or high CVEs in `pnpm audit` output | Dev Lead | ☐ | |
| 1.9 | P2 | Code coverage ≥ 80% on all shared packages (`packages/shared`, `packages/protocol`) | Dev Lead | ☐ | |
| 1.10 | P2 | All new APIs have JSDoc/TSDoc comments | Dev Lead | ☐ | |

---

## 2. Security

| # | Priority | Check | Owner | Status | Notes |
|---|----------|-------|-------|--------|-------|
| 2.1 | P0 | All threat model scenarios documented in `docs/security/threat-model.md` have been reviewed and signed off | Security Lead | ☐ | |
| 2.2 | P0 | Full penetration test executed (`docs/qa/penetration-test-checklist.md`) — all Critical and High items PASS | Security Lead | ☐ | |
| 2.3 | P0 | Emergency stop tested end-to-end: revokes all permissions in < 100 ms | QA Lead | ☐ | |
| 2.4 | P0 | File transfer path traversal sanitization verified (PT-005) | Security Lead | ☐ | |
| 2.5 | P0 | WebSocket server enforces rate limiting: ≤ 5 `connect:request` / min per source | Security Lead | ☐ | |
| 2.6 | P0 | All WebRTC data channels are DTLS-encrypted (no plaintext fallback) | Security Lead | ☐ | |
| 2.7 | P1 | Clipboard sync security warning dialog is shown and cannot be bypassed | QA Lead | ☐ | |
| 2.8 | P1 | All sensitive config values (TURN credentials, DB passwords) are env vars — not in source | Dev Lead | ☐ | |
| 2.9 | P1 | Content Security Policy headers set on signaling server HTTP responses | Dev Lead | ☐ | |
| 2.10 | P1 | Electron `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true` verified in main process config | Dev Lead | ☐ | |
| 2.11 | P1 | Remote content (if any) loaded only via HTTPS; `allowRunningInsecureContent: false` | Dev Lead | ☐ | |
| 2.12 | P2 | Source maps NOT included in production Electron build | Dev Lead | ☐ | |

---

## 3. Performance

| # | Priority | Check | Owner | Status | Benchmark Target | Actual Result |
|---|----------|-------|-------|--------|-----------------|--------------|
| 3.1 | P0 | Screen capture sustained at 30 FPS on LAN under normal conditions | QA Lead | ☐ | ≥ 30 FPS | |
| 3.2 | P0 | Remote input round-trip latency (pointer event → cursor movement visible) < 50 ms on LAN | QA Lead | ☐ | < 50 ms | |
| 3.3 | P1 | File transfer throughput ≥ 5 MB/s on 1 Gbps LAN | QA Lead | ☐ | ≥ 5 MB/s LAN | |
| 3.4 | P1 | File transfer throughput ≥ 2 MB/s on WiFi (802.11ac) | QA Lead | ☐ | ≥ 2 MB/s WiFi | |
| 3.5 | P1 | Clipboard sync latency < 500 ms on LAN | QA Lead | ☐ | < 500 ms | |
| 3.6 | P1 | App startup time (cold start to "Ready" state) < 3 s on target hardware | Dev Lead | ☐ | < 3 s | |
| 3.7 | P1 | Memory usage during active session with screen share < 500 MB RSS | Dev Lead | ☐ | < 500 MB | |
| 3.8 | P2 | CPU usage during screen share (host) < 30% on a modern 4-core machine | Dev Lead | ☐ | < 30% CPU | |
| 3.9 | P2 | Video quality adapts downward within 5 s when bandwidth drops below 1 Mbps | QA Lead | ☐ | ≤ 5 s | |

---

## 4. UX / Accessibility

| # | Priority | Check | Owner | Status | Notes |
|---|----------|-------|-------|--------|-------|
| 4.1 | P0 | All permission dialogs tested on both host and viewer sides: grant, deny, and revoke paths | QA Lead | ☐ | |
| 4.2 | P0 | Emergency stop button is visible and reachable in ≤ 1 click from any host UI state | QA Lead | ☐ | |
| 4.3 | P0 | Emergency stop keyboard shortcut works when app is in background / minimized (where applicable) | QA Lead | ☐ | |
| 4.4 | P1 | Warning banner is shown when risky permissions (remote input) are active | QA Lead | ☐ | |
| 4.5 | P1 | Session connect / disconnect flows tested on both Windows and macOS | QA Lead | ☐ | |
| 4.6 | P1 | All toasts and error messages have clear, non-technical language | Product Lead | ☐ | |
| 4.7 | P1 | App is keyboard navigable for all primary flows (no mouse-only traps) | QA Lead | ☐ | |
| 4.8 | P2 | Color contrast ratios meet WCAG AA (4.5:1 for body text, 3:1 for large text) | Design Lead | ☐ | |
| 4.9 | P2 | App tested with Windows High Contrast Mode and macOS Increase Contrast | QA Lead | ☐ | |

---

## 5. API / Audit Logging

| # | Priority | Check | Owner | Status | Notes |
|---|----------|-------|-------|--------|-------|
| 5.1 | P0 | Audit log is populated for all permission grant events (source peer ID, timestamp, permission type) | Dev Lead | ☐ | |
| 5.2 | P0 | Audit log is populated for all permission revocation events (including emergency stop) | Dev Lead | ☐ | |
| 5.3 | P0 | Audit log is populated for session start and session end events | Dev Lead | ☐ | |
| 5.4 | P1 | Audit log is populated for file transfer events (init, accept, reject, complete, cancel) | Dev Lead | ☐ | |
| 5.5 | P1 | Audit log is populated for failed authentication attempts | Dev Lead | ☐ | |
| 5.6 | P1 | Rate limiter configuration is documented and matches enforced limits | Dev Lead | ☐ | |
| 5.7 | P1 | Audit log entries include a structured, machine-parseable format (JSON lines) | Dev Lead | ☐ | |
| 5.8 | P2 | Audit log rotation policy is defined and tested (max file size, retention period) | Ops Lead | ☐ | |

---

## 6. Documentation

| # | Priority | Check | Owner | Status | Notes |
|---|----------|-------|-------|--------|-------|
| 6.1 | P0 | Security threat model document complete and reviewed (`docs/security/threat-model.md`) | Security Lead | ☐ | |
| 6.2 | P1 | User guide covers: first setup, connecting, screen share, permissions, emergency stop | Product Lead | ☐ | |
| 6.3 | P1 | API / protocol documentation complete (`docs/architecture/`) | Dev Lead | ☐ | |
| 6.4 | P1 | All QA test plans in `docs/qa/` are complete and signed off | QA Lead | ☐ | |
| 6.5 | P1 | CHANGELOG.md updated with all user-facing changes for this release | Dev Lead | ☐ | |
| 6.6 | P2 | README.md reflects current architecture and setup instructions | Dev Lead | ☐ | |
| 6.7 | P2 | Known limitations section updated (if any) | Product Lead | ☐ | |

---

## 7. Deployment & Infrastructure

| # | Priority | Check | Owner | Status | Notes |
|---|----------|-------|-------|--------|-------|
| 7.1 | P0 | All required environment variables are documented in `.env.example` | Dev Lead | ☐ | |
| 7.2 | P0 | STUN servers are configured and tested (connectivity check passes) | Ops Lead | ☐ | |
| 7.3 | P0 | TURN server is configured and tested (relay path works when P2P is blocked) | Ops Lead | ☐ | |
| 7.4 | P0 | TLS is enabled on the signaling server (`wss://` only, no `ws://` in production) | Ops Lead | ☐ | |
| 7.5 | P0 | TLS certificate is valid and not within 30 days of expiry | Ops Lead | ☐ | |
| 7.6 | P1 | Database (if applicable) connection pooling and timeout settings are documented | Ops Lead | ☐ | |
| 7.7 | P1 | Health check endpoint (`/health` or equivalent) is operational | Ops Lead | ☐ | |
| 7.8 | P1 | Application logging / monitoring (e.g., structured logs shipped to aggregator) is configured | Ops Lead | ☐ | |
| 7.9 | P1 | Electron auto-update mechanism tested end-to-end (update available → apply → relaunch) | Dev Lead | ☐ | |
| 7.10 | P2 | CI/CD pipeline runs all tests on PR merge to `main` | Dev Lead | ☐ | |

---

## 8. Rollback Plan

| # | Priority | Check | Owner | Status | Notes |
|---|----------|-------|-------|--------|-------|
| 8.1 | P0 | Rollback procedure is documented: steps to revert signaling server to previous version | Ops Lead | ☐ | |
| 8.2 | P0 | Previous Electron installer artifacts are retained for emergency rollback distribution | Ops Lead | ☐ | |
| 8.3 | P0 | Database migration rollback script is prepared and tested (if schema changes in this release) | Dev Lead | ☐ | |
| 8.4 | P1 | Rollback can be completed in < 30 minutes by on-call engineer | Ops Lead | ☐ | |
| 8.5 | P1 | On-call runbook updated with escalation contacts for this release | Ops Lead | ☐ | |
| 8.6 | P2 | Feature flags in place so risky new features can be disabled without a full rollback | Dev Lead | ☐ | |

---

## Final Sign-Off

| Area | Responsible | Status | Date |
|------|------------|--------|------|
| 1. Code Quality | Dev Lead | ☐ Approved ☐ Blocked | |
| 2. Security | Security Lead | ☐ Approved ☐ Blocked | |
| 3. Performance | QA Lead | ☐ Approved ☐ Blocked | |
| 4. UX / Accessibility | Product Lead | ☐ Approved ☐ Blocked | |
| 5. API / Audit | Dev Lead | ☐ Approved ☐ Blocked | |
| 6. Documentation | Product Lead | ☐ Approved ☐ Blocked | |
| 7. Deployment | Ops Lead | ☐ Approved ☐ Blocked | |
| 8. Rollback Plan | Ops Lead | ☐ Approved ☐ Blocked | |

**Final Decision:**

☐ **GO** — All P0 items are ✅ Done. Release approved.  
☐ **NO GO** — One or more P0 items are blocked. Release cannot proceed.  
☐ **CONDITIONAL GO** — All P0 items done; P1 issues tracked in follow-up tickets: ___________________

**Release Manager Sign-off:** ___________________  **Date:** ___________________
