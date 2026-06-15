# Emergency Stop System

**Status:** SAFE_DIRECT_COPY  
**Last Updated:** 2026-06-12  
**Scope:** Emergency Stop Architecture and Safety Guarantees

---

## Safety Guarantees

### G1: Immediate Block
When emergency stop is triggered, ALL subsequent native input commands are blocked within one IPC round-trip time. No command queued after trigger will execute.

### G2: Permission Override
Emergency stop takes precedence over ALL permissions. Even if all input permissions are granted, emergency stop blocks execution.

### G3: Renderer Cannot Bypass
The renderer process cannot disable emergency stop. Release requires main process confirmation and can only be initiated by the host user.

### G4: Persistence
Emergency stop state persists for the duration of the session. It is not affected by page reloads, renderer crashes, or reconnections.

### G5: Audit Trail
Every emergency stop trigger and release is logged with timestamp, initiator, and reason.

---

## State Machine

```
                    TRIGGER              TRIGGERED
    [normal] ----------------> [triggering] --------> [active]
       ^                                                    |
       |                                                    | RELEASE
       |                                                    v
    [normal] <---------------- [releasing] <---------------+
       ^                    RELEASED
       |
     RESET

    [error] (entered on system errors)
```

---

## Trigger Sources

| Source | Priority | Requires Confirmation |
|--------|----------|----------------------|
| Host keyboard shortcut (Ctrl+Shift+End) | 1 | No |
| Host UI button | 2 | No |
| Viewer request | 3 | Yes (host must confirm) |
| System watchdog | 4 | No (automatic) |

---

## Release Protocol

1. Host initiates release request
2. System verifies host identity (session ownership)
3. Release is granted (single confirmation for now)
4. All parties are notified
5. Input permissions return to pre-stop state

---

## Data Channel Messages

### Host -> Viewer
- `emergency:stop` - Stop triggered on host
- `emergency:status` - Current stop status

### Viewer -> Host
- `emergency:stop` - Viewer requests stop (host must confirm)
- `emergency:release` - Viewer requests release (host must confirm)

---

## IPC Messages (Renderer <-> Main)

### Renderer -> Main
- `triggerEmergencyStop(reason)` - Trigger immediately
- `releaseEmergencyStop()` - Request release
- `getEmergencyState()` - Query current state

### Main -> Renderer
- `onEmergencyStop(state)` - Push notification on state change

---

## Implementation Checklist

- [x] Emergency stop message types defined
- [x] State machine reducer implemented
- [x] IPC handlers registered
- [x] Permission override verified
- [x] Audit logging added
- [x] UI warning banner created
- [x] Release confirmation flow designed
- [ ] Host keyboard shortcut wired
- [ ] System watchdog implemented
- [ ] Automated QA tests for guarantees G1-G5
