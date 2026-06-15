# Abuse Prevention Checklist

## Input Permission Abuse

- [ ] Viewer cannot grant permissions to themselves
- [ ] Permission request requires host explicit approval
- [ ] Permission UI is clearly visible and cannot be hidden
- [ ] Permission state is validated server-side (if applicable)
- [ ] Permission changes are logged with timestamp and actor
- [ ] Old permissions are revoked before new session starts
- [ ] Permission defaults to DENY for all categories

## Input Flooding Abuse

- [ ] Mouse move events throttled to maximum rate
- [ ] Batch queue has maximum size limit
- [ ] Per-session event counter tracks volume
- [ ] Rate limit configurable per deployment
- [ ] Dropped events counted and reported in diagnostics
- [ ] Backpressure handling when send buffer full

## Malicious Input Abuse

- [ ] Restricted key combinations blocked
  - [ ] Ctrl+Alt+Delete (Windows)
  - [ ] Win+L (Windows lock)
  - [ ] Cmd+Tab (macOS app switcher)
  - [ ] Cmd+Q (macOS quit)
  - [ ] Ctrl+Alt+F1-F12 (Linux VT switch)
- [ ] Coordinates clamped to valid range
- [ ] Unknown event types rejected
- [ ] Oversized messages rejected
- [ ] Malformed input guard detects anomalies

## Session Abuse

- [ ] Session ID validated on every envelope
- [ ] Sequence numbers validated (no replay)
- [ ] Protocol version validated
- [ ] Session termination revokes all permissions
- [ ] Reconnection requires re-authorization
- [ ] Concurrent session limits enforced

## Architecture Abuse

- [ ] Renderer process cannot execute native input
- [ ] Preload API minimal and audited
- [ ] IPC messages validated in main process
- [ ] No-op mode available and used by default
- [ ] Native execution requires explicit enablement
- [ ] Audit log is append-only
- [ ] Audit log cannot be cleared by viewer

## Social Engineering Prevention

- [ ] Permission request shows clear viewer identity
- [ ] Permission request requires explicit user action (click)
- [ ] Permission request has auto-dismiss timeout
- [ ] Emergency stop always visible during session
- [ ] Emergency stop has distinctive appearance
- [ ] Host notified when permissions change

## Detection

- [ ] Anomaly detection for unusual input patterns
- [ ] Input velocity monitoring
- [ ] Permission change frequency monitoring
- [ ] Failed permission request tracking
- [ ] Emergency stop trigger alerting