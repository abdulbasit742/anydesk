# Native Input Threat Model

**Status:** SAFE_DIRECT_COPY  
**Last Updated:** 2026-06-12  
**Scope:** Security Threat Model for Native Input Execution

---

## Threat Actors

### T1: Remote Viewer (Authenticated)
An authenticated viewer with active session trying to abuse remote input.

### T2: Remote Viewer (Compromised)
A viewer whose device/account has been compromised by a malicious actor.

### T3: Network Attacker
An attacker intercepting or modifying data channel messages.

### T4: Local Attacker (Renderer Compromise)
An attacker who has compromised the renderer process (e.g., XSS).

### T5: Malicious Host
A host user attempting to exploit the input system.

---

## Threat Scenarios

### S1: Command Injection via Data Channel
**Threat:** T3 modifies data channel messages to inject malicious commands.  
**Mitigation:**
- All commands validated against schema
- All values sanitized (clamped to valid ranges)
- Sequence numbers checked for gaps/reordering

### S2: Input Flood Attack
**Threat:** T1/T2 sends commands at extreme rates to overwhelm host.  
**Mitigation:**
- Per-session rate limiting (60 cmd/s default)
- Mouse move coalescing (120 moves/s)
- Automatic throttling after violation threshold
- Suspicious pattern detection

### S3: Screen Corner Escape
**Threat:** T1/T2 moves mouse to corners to trigger OS shortcuts.  
**Mitigation:**
- Corner flood detection
- Coordinate bounds checking
- Permission-based input restrictions

### S4: Renderer Process Bypass
**Threat:** T4 compromises renderer to bypass permission checks.  
**Mitigation:**
- All permission checks in main process
- Renderer cannot directly execute OS APIs
- IPC is the only path to native input

### S5: Permission Escalation
**Threat:** T1/T2 attempts to gain input permissions without host consent.  
**Mitigation:**
- Only host can grant permissions
- Permission changes require host authentication
- All permission changes logged and auditable

### S6: Emergency Stop Bypass
**Threat:** T1/T2 attempts to disable emergency stop remotely.  
**Mitigation:**
- Emergency stop can only be released by host
- Release requires confirmation
- State managed in main process (not renderer)

### S7: Keylogger-like Behavior
**Threat:** T5 (host) logs viewer keystrokes for surveillance.  
**Mitigation:**
- Audit log only records command types, not content
- Privacy-safe logging by design
- Viewer sees all logged data via audit log viewer

---

## Attack Surface

```
Data Channel (encrypted WebRTC)
    |
    v
Renderer Process (untrusted)
    |
    v
Preload IPC Bridge (contextBridge)
    |
    v
Main Process (trusted)
    |
    v
[Permission Check] -> [Rate Limit] -> [Audit Log] -> [Executor]
    |                       |              |               |
    v                       v              v               v
Block                  Throttle       Log Event      No-op (safe)
```

---

## Risk Ratings

| Scenario | Likelihood | Impact | Risk Level | Status |
|----------|-----------|--------|------------|--------|
| S1 Command Injection | Low | Medium | Low | Mitigated |
| S2 Input Flood | Medium | Low | Low | Mitigated |
| S3 Corner Escape | Low | Medium | Low | Mitigated |
| S4 Renderer Bypass | Low | Critical | Medium | Mitigated |
| S5 Permission Escalation | Low | High | Low | Mitigated |
| S6 Emergency Stop Bypass | Very Low | Critical | Low | Mitigated |
| S7 Keylogger Behavior | Low | Medium | Low | Mitigated |

---

## Trust Boundaries

1. **Network to Renderer:** Data channel messages are untrusted
2. **Renderer to Preload:** Renderer code is untrusted
3. **Preload to Main:** IPC is intra-process but crossing context boundaries
4. **Main to OS:** Main process is trusted, OS APIs are privileged

---

## Assumptions

- A1: The main process has not been compromised
- A2: The Electron framework's contextIsolation works as designed
- A3: The host user is the legitimate owner of the device
- A4: WebRTC data channel encryption is secure
- A5: The no-op executor is safe (no OS calls)
