# RemoteDesk Security Model

## Core Principles

1. **Explicit Consent**: No remote operation happens without both parties agreeing
2. **Least Privilege**: Only the minimum necessary permissions are granted
3. **Host Control**: The host (person being accessed) always has final authority
4. **Audit Everything**: All permission changes and remote operations are logged
5. **Emergency Stop**: Either party can immediately terminate all remote operations

## Permission Architecture

```
┌─────────────────────────────────────┐
│           Session Start              │
│    All permissions = DENIED          │
└─────────────────┬───────────────────┘
                  │
    ┌─────────────┼─────────────┐
    ▼             ▼             ▼
┌───────┐    ┌───────┐    ┌───────┐
│ Input │    │Clipboard│   │ File  │
│ Gate  │    │  Gate   │   │ Gate  │
└───┬───┘    └───┬───┘    └───┬───┘
    │             │             │
    ▼             ▼             ▼
┌────────┐   ┌────────┐   ┌────────┐
│ PROMPT │   │ PROMPT │   │ PROMPT │
└───┬────┘   └───┬────┘   └───┬────┘
    │             │             │
    ▼             ▼             ▼
┌────────┐   ┌────────┐   ┌────────┐
│GRANTED │   │GRANTED │   │GRANTED │
│DENIED  │   │DENIED  │   │DENIED  │
└────────┘   └────────┘   └────────┘
```

## Permission States

| State | Meaning |
|-------|---------|
| `denied` | Permission not granted (default) |
| `prompt` | Will ask host when viewer requests |
| `granted` | Permission active |
| `unavailable` | Feature not available on this platform |

## State Transitions

```
denied ──► granted  (host enables)
         ◄── (host disables/revokes)

denied ──► prompt   (host configures)
         ◄── (host reverts)

prompt ──► granted  (host approves request)
         ◄── (host denies/revokes)
```

## Attack Mitigations

| Threat | Mitigation |
|--------|-----------|
| Unauthorized remote control | Input disabled by default; host must enable per-session |
| Keylogger via clipboard | Clipboard sync disabled by default; size limited |
| Malware via file transfer | Extensions blocked; receiver must accept each file |
| Privilege escalation | No OS-level access from renderer; IPC only |
| Session hijacking | All signaling authenticated; WebRTC DTLS |
| Replay attacks | Sequence numbers on all messages; timestamps |
| Runaway mouse | Velocity limits; emergency stop |
| Stuck keys | Automatic key release on disconnect/emergency stop |

## Emergency Stop

The emergency stop is the **nuclear option** for security:

1. Immediately sets all permissions to DENIED
2. Releases all pressed keys
3. Stops all input injection
4. Clears any pending permission requests
5. Optional: terminates the WebRTC session
6. Requires explicit re-enable to resume

Both host and viewer have an emergency stop button available at all times during a session.
