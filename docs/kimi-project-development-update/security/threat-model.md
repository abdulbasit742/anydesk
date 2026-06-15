# Threat Model: Remote Input Control

## Scope

This threat model covers the remote input control feature of RemoteDesk, which allows a remote viewer to control the host's mouse and keyboard.

## Threat Actors

| Actor | Description | Motivation |
|-------|-------------|------------|
| Malicious Viewer | Authorized viewer with bad intent | Steal data, install malware, disrupt system |
| Session Hijacker | Unauthorized party who intercepts session | Gain unauthorized access |
| Insider Threat | Employee/team member abusing access | Steal sensitive information |
| Accidental User | Well-meaning user who makes mistakes | Cause unintended actions |

## STRIDE Analysis

### Spoofing

| Threat | Risk | Mitigation |
|--------|------|------------|
| Viewer spoofs host identity | High | Auth tokens, session IDs |
| MITM on signaling server | Medium | HTTPS, socket auth |
| Fake permission grants | Medium | Host-side UI only |

### Tampering

| Threat | Risk | Mitigation |
|--------|------|------------|
| Modify input events in transit | Medium | DTLS encryption (WebRTC) |
| Tamper with permission state | High | Immutable transitions, reducer pattern |
| Modify audit logs | Low | Append-only logs |

### Repudiation

| Threat | Risk | Mitigation |
|--------|------|------------|
| Deny sending malicious input | Medium | Comprehensive audit logging |
| Deny granting permission | Low | Permission history stored |

### Information Disclosure

| Threat | Risk | Mitigation |
|--------|------|------------|
| Leak permission state | Low | State not exposed externally |
| Least input patterns | Low | No telemetry without consent |

### Denial of Service

| Threat | Risk | Mitigation |
|--------|------|------------|
| Input event flooding | High | Rate limiting, throttle |
| Rapid permission toggling | Medium | Debounce, transition history |
| Emergency stop abuse | Low | Host-side only, logged |

### Elevation of Privilege

| Threat | Risk | Mitigation |
|--------|------|------------|
| Escape sandbox via input | Critical | Renderer never executes native input |
| Gain admin via key combos | High | Restricted key combo blocking |
| Bypass permission check | Critical | Permission gate on every event |
| Escape no-op mode | High | Config loaded at startup, main process only |

## Risk Assessment Matrix

| Threat | Likelihood | Impact | Risk Level |
|--------|-----------|--------|------------|
| Malicious viewer with granted permission | Medium | Critical | **HIGH** |
| Input event flooding | Medium | Medium | **MEDIUM** |
| Session hijacking | Low | Critical | **MEDIUM** |
| Sandbox escape via input | Low | Critical | **LOW** (mitigated) |
| Accidental permission grant | High | Low | **MEDIUM** |
| Emergency stop needed but unavailable | Low | Critical | **LOW** (mitigated) |

## Key Controls

### Permission Gating (Primary Defense)

- All input disabled by default
- Host explicitly enables per category
- Viewer cannot enable own permissions
- Revoked on disconnect and emergency stop

### Emergency Stop (Kill Switch)

- Always accessible during session
- Revokes all permissions instantly
- Persists until explicitly cleared
- Audit logged

### Rate Limiting

- Max 1000 input events/second
- Mouse move throttled to ~60fps
- Batch queue max size enforced

### Input Validation

- All events validated before execution
- Coordinates clamped to [0, 1]
- Unknown event types rejected
- Restricted key combos blocked

### Architecture Isolation

- Renderer: Capture only, no native execution
- Main Process: Native execution only, no DOM access
- Preload: Minimal API exposure
- IPC: Validated on both ends

## Abuse Prevention Checklist

- [ ] Viewer cannot grant own permissions
- [ ] Host must explicitly approve each category
- [ ] Permission UI cannot be bypassed via API calls
- [ ] Emergency stop works even if viewer tries to block it
- [ ] Rate limiting prevents input flooding
- [ ] Restricted key combos blocked (Ctrl+Alt+Del, Win+L, etc.)
- [ ] Audit log records all permission changes
- [ ] Audit log records all emergency stop events
- [ ] Input events validated before execution
- [ ] No filesystem access via input pipeline
- [ ] No shell/command execution via input events
- [ ] Session termination revokes all permissions
- [ ] Permission state cleared on application restart

## Incident Response

### If Malicious Input Detected

1. **Immediate**: Trigger emergency stop
2. **Short-term**: End session, revoke all permissions
3. **Medium-term**: Review audit logs, identify affected systems
4. **Long-term**: Report incident, review access controls

### Forensics

Audit logs capture:
- Every permission grant/revoke with timestamp
- Every emergency stop trigger/clear
- Input event counts (not contents, for privacy)
- Session start/end times
- Viewer and host identities

## Review Cycle

This threat model should be reviewed:
- Quarterly during active development
- After any security incident
- Before major feature releases
- When new platform support is added