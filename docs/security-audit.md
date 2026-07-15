# Changed-area security audit — 2026-07-15

## Fixed

- Removed stale documentation describing webcam substitution for identity-verification services.
- Removed fabricated connected-platform counts, random latency, and random FPS from the active remote-support pages.
- Replaced one-click Connect simulation with an explicit request and consent lifecycle.
- Added a fixed capability allowlist and separate confirmation for keyboard, pointer, clipboard, and file scopes.
- Added a 15-minute maximum request lifetime and fail-closed expiry checks.
- Added validated state transitions; a preview cannot start before approval.
- Made the only available post-consent state a local preview with `transport: not_configured`.
- Added a bounded, session-local audit timeline and clearly documented that it is not durable or tamper-evident.
- Added focused tests and an active-surface security regression scanner.

## Residual risks

- Root authentication still depends on the existing Supabase/browser implementation and was not redesigned in this change.
- The repository contains thousands of legacy/generated feature files whose behavior is not covered by the focused remote-support tests.
- The audit timeline is browser memory only.
- There is no authenticated signalling server, device identity, tenant authorization, TURN credential service, consent proof store, revocation channel, transport encryption review, or abuse monitoring.
- The project name may be confused with the commercial AnyDesk product. SkyDesk should be used consistently in product-facing copy, and trademark/legal review is still needed.

## Deployment gate

Do not describe or ship this repository as a working remote desktop product until two-device testing demonstrates authenticated signalling, informed host consent, immediate revocation, encrypted media/control channels, safe reconnect behavior, scoped permissions, and durable security audit records.
