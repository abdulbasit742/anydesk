# RemoteDesk Threat Model

## Scope

This document analyzes threats to the RemoteDesk remote desktop application, covering:
- WebRTC data channel communication
- Remote input injection
- Clipboard synchronization
- File transfer
- Session establishment and authentication

## Trust Boundaries

```
┌─────────────────────────────────────────────────────┐
│                    Viewer Device                     │
│  ┌──────────────┐      ┌────────────────────────┐   │
│  │  Renderer    │      │      Main Process       │   │
│  │  (Untrusted) │◄────►│      (Trusted)          │   │
│  └──────┬───────┘      └────────────────────────┘   │
│         │                                            │
└─────────┼────────────────────────────────────────────┘
          │ WebRTC Data Channel (DTLS)
┌─────────┼────────────────────────────────────────────┐
│         │            Host Device                       │
│  ┌──────┴───────┐      ┌────────────────────────┐    │
│  │  Renderer    │      │      Main Process       │    │
│  │  (Untrusted) │◄────►│   OS Input APIs         │    │
│  └──────────────┘      └────────────────────────┘    │
│                                                       │
└───────────────────────────────────────────────────────┘
```

**Trust Rule**: Renderer processes are untrusted. Only the main process can access OS-level APIs.

## STRIDE Analysis

### Spoofing (Identity)

| Threat | Risk | Mitigation |
|--------|------|------------|
| Impersonate a peer | High | Authenticated signaling via Socket.IO; verify RemoteDesk ID |
| Fake permission request | Medium | Requests include sender ID; host verifies identity |

### Tampering

| Threat | Risk | Mitigation |
|--------|------|------------|
| Modify input events | Medium | Sequence numbers; timestamps; discard out-of-order |
| Modify file chunks | Medium | Per-chunk SHA-256 hashes; verify on reassembly |
| Modify clipboard | Low | Size limits; content validation; no binary data |

### Repudiation

| Threat | Risk | Mitigation |
|--------|------|------------|
| Deny granting permission | Low | Full audit log on both sides |
| Deny sending malicious file | Medium | File hash + metadata logged |

### Information Disclosure

| Threat | Risk | Mitigation |
|--------|------|------------|
| Clipboard exposes passwords | High | Opt-in; disabled by default; text only |
| File transfer exposes documents | Medium | Per-file consent; extension filtering |
| Screen content leaked | High | Host must explicitly start sharing |

### Denial of Service

| Threat | Risk | Mitigation |
|--------|------|------------|
| Flood with input events | Medium | Mouse throttle; rate limiter; drop excess |
| Flood with file requests | Low | Max concurrent transfers; consent timeout |
| Fill disk with transfers | Medium | File size limits; temp file cleanup |

### Elevation of Privilege

| Threat | Risk | Mitigation |
|--------|------|------------|
| Escape renderer sandbox | Critical | No renderer filesystem access; IPC only |
| OS command via keyboard | Medium | Block dangerous keys; validate shortcuts |

## Attack Scenarios

### Scenario 1: Malicious Viewer

**Attacker**: Connected viewer wants unauthorized control
**Flow**:
1. Viewer requests remote input permission
2. Host receives prompt dialog
3. Host can DENY, BLOCK, or GRANT
4. Even if granted, host sees indicator and can emergency stop

**Mitigation**: Multi-layer consent + visibility + emergency stop

### Scenario 2: Clipboard Password Theft

**Attacker**: Wants to capture host's clipboard contents
**Flow**:
1. Clipboard sync is DISABLED by default
2. Attacker cannot read clipboard without host opt-in
3. Even with opt-in, only TEXT is synced (no images, files)
4. Debouncing prevents rapid polling

**Mitigation**: Opt-in + text-only + debounce + conflict resolution

### Scenario 3: Malicious File Transfer

**Attacker**: Wants to send malware to host
**Flow**:
1. Blocked extensions: .exe, .dll, .bat, .sh, .app, etc.
2. If extension passes, host sees consent dialog with file info
3. Executable files get red warning banner
4. Host can inspect SHA-256 hash before accepting

**Mitigation**: Extension block + consent dialog + hash verification

### Scenario 4: Input Injection Abuse

**Attacker**: Wants to execute commands on host
**Flow**:
1. Input disabled by default
2. Host must explicitly enable per-session
3. Velocity limits prevent runaway mouse
4. OS shortcuts blocked (Ctrl+Alt+Del, Cmd+Q, etc.)
5. Dangerous keys blocked (Power, Sleep)

**Mitigation**: Default deny + rate limits + shortcut blocking + dangerous key filter

## Risk Scoring

| Feature | Likelihood | Impact | Risk | Status |
|---------|-----------|--------|------|--------|
| Unauthorized input | Low | Critical | High | Mitigated |
| Clipboard leak | Medium | High | High | Mitigated |
| Malware transfer | Medium | Critical | High | Mitigated |
| DoS via flooding | Medium | Medium | Medium | Mitigated |
| Renderer escape | Low | Critical | High | Architecture prevents |

## Security Checklist

- [ ] Remote input disabled by default
- [ ] Host must explicitly enable per session
- [ ] Emergency stop works from both sides
- [ ] All input events validated before execution
- [ ] Clipboard sync disabled by default
- [ ] Only text clipboard (no binary)
- [ ] File transfer requires receiver consent
- [ ] Dangerous file extensions blocked
- [ ] Filename sanitized (no path traversal)
- [ ] No renderer filesystem access
- [ ] All permissions logged to audit trail
- [ ] Sequence numbers prevent replay
- [ ] Rate limiting on all operations
