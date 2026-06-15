# RemoteDesk Sprint Part 2 — Risk Register

**Generated:** 2026-06-14

## Risk Matrix

| ID | Risk | Likelihood | Impact | Mitigation | Status |
|----|------|------------|--------|------------|--------|
| R1 | File transfer writes to unexpected path | Low | High | Electron save dialog + path validation in main process | Mitigated |
| R2 | Clipboard content leaks in audit logs | Low | High | Payload sanitization strips text/content fields; HTML rejected | Mitigated |
| R3 | Unauthorized native input execution | Low | Critical | No-op executor default; explicit permission; emergency stop | Mitigated |
| R4 | Emergency stop bypass | Low | Critical | Permission gate checks emergencyStopped before every execute | Mitigated |
| R5 | Audit queue memory exhaustion | Low | Medium | Max 1000 entries; oldest dropped; periodic flush | Mitigated |
| R6 | Prisma schema migration failure | Medium | Medium | Schema additions are additive only; no column changes | Accepted |
| R7 | Existing WebRTC flow broken | Low | High | No modification to existing offer/answer/ICE code | Mitigated |
| R8 | Rate limiter bypass via batch events | Low | Medium | Rate limiter checks every event individually | Mitigated |
| R9 | Trusted device fingerprint collision | Low | Medium | SHA-256 fingerprint with device name confirmation | Accepted |
| R10 | Plan limit enforcement bypass | Low | High | Middleware checks on every request; not cached | Mitigated |
| R11 | Support bundle contains PII | Low | Medium | Multi-layer redaction (IPs, UUIDs, paths, emails, tokens) | Mitigated |
| R12 | Clipboard HTML injection | Low | High | HTML pattern detection rejects all HTML-like content | Mitigated |

## Detailed Risk Descriptions

### R1: File Transfer Path Traversal

**Description:** Malicious file transfer could write to sensitive system paths.

**Mitigation:**
- User selects path via OS-native save dialog
- Main process validates path with `path.resolve()`
- Parent directory created with `recursive: true`
- Atomic write via temp file + rename

**Residual Risk:** User could still choose a sensitive path — but this is explicit user action.

### R2: Clipboard Content Leak

**Description:** Clipboard contents could appear in logs or audit events.

**Mitigation:**
- Audit payload sanitization strips `text`, `content`, `clipboard` fields
- Clipboard audit helpers perform double-check deletion
- Only SHA-256 hashes are logged
- HTML content rejected before any processing

**Verification:** Search for `"text"` in audit payload — should only appear as `[REDACTED]`.

### R3: Unauthorized Remote Control

**Description:** Remote party could execute native input without permission.

**Mitigation:**
- `NoOpExecutor` is the only constructor-default executor
- Real executor requires `setExecutor()` call
- Permission gate requires explicit `grantPermission()`
- Emergency stop immediately revokes all permissions
- Input validation rejects suspicious events

**Verification:** Fresh app install → connect to session → verify mouse moves don't affect host.

### R4: Emergency Stop Bypass

**Description:** Emergency stop could be circumvented.

**Mitigation:**
- `emergencyStopped` checked in `isInputPermitted()` before every event
- `isInputPermitted()` called in the main process pipeline
- Clearing emergency stop does NOT re-enable input (requires re-grant)

### R5: Audit Queue Memory Growth

**Description:** If API is unreachable, audit events accumulate in memory.

**Mitigation:**
- Hard cap of 1000 queued events
- Oldest events dropped on overflow
- Periodic flush attempts
- Events are small objects (~200 bytes each)
- Maximum memory impact: ~200KB

### R6: Prisma Migration

**Description:** Adding 8 new models could cause migration issues.

**Mitigation:**
- All additions are additive (no existing model changes)
- No foreign key constraints to existing models
- Can be rolled back by dropping new tables

**Action Required:** Review migration before applying to production.

### R7: WebRTC Flow Regression

**Description:** New code could interfere with existing WebRTC connection flow.

**Mitigation:**
- No changes to existing offer/answer/ICE code
- Reconnect manager calls standard `restartIce()` only
- New code is additive modules, not modifications
- Separate DataChannel for file transfer (doesn't conflict with existing)

### R8: Rate Limit Bypass

**Description:** Attacker could send events in rapid succession to bypass rate limit.

**Mitigation:**
- Every single event checked individually
- Token bucket refills at fixed rate
- Burst size limits initial flood
- Cooldown period after burst exhaustion

## Risk Acceptance Criteria

Risks R6 and R9 are accepted with monitoring:
- R6: Migration will be tested on staging before production
- R9: Device fingerprint collisions are statistically negligible with SHA-256
