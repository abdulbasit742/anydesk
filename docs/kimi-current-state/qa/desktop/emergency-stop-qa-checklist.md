# Emergency Stop QA Checklist

**Status:** SAFE_DIRECT_COPY  
**Last Updated:** 2026-06-12  
**Scope:** QA Testing Checklist for Emergency Stop Feature

---

## Immediate Block (G1)

- [ ] Trigger emergency stop during active input -> commands blocked within 100ms
- [ ] Trigger via host UI -> blocks immediately
- [ ] Trigger via keyboard shortcut -> blocks immediately
- [ ] Commands in flight are dropped
- [ ] No commands execute after trigger

## Permission Override (G2)

- [ ] Grant all permissions -> input works
- [ ] Trigger emergency stop -> all input blocked despite permissions
- [ ] Emergency stop takes precedence over all permissions
- [ ] Release emergency stop -> permissions restored

## Renderer Cannot Bypass (G3)

- [ ] Attempt to release from viewer -> denied
- [ ] Attempt to modify permissions during stop -> blocked
- [ ] Renderer reload during stop -> stop persists
- [ ] Only host can release emergency stop

## Persistence (G4)

- [ ] Trigger stop -> active after page refresh
- [ ] Trigger stop -> active after renderer crash/restart
- [ ] Trigger stop -> active after network reconnect
- [ ] Stop survives main process IPC handler re-registration

## Audit Trail (G5)

- [ ] Trigger event logged with timestamp
- [ ] Trigger event logged with initiator
- [ ] Trigger event logged with reason
- [ ] Release event logged with timestamp
- [ ] Release event logged with initiator
- [ ] Both events in same session log

---

## UI Tests

- [ ] Emergency stop banner displays full-screen overlay
- [ ] Banner shows who triggered
- [ ] Banner shows reason
- [ ] Banner shows trigger time
- [ ] Release button visible to host
- [ ] Viewer sees warning (not release button)
- [ ] Warning cannot be dismissed without release

---

## State Machine Tests

- [ ] Normal -> Trigger -> Triggering -> Triggered -> Active
- [ ] Active -> Release -> Releasing -> Normal
- [ ] Normal -> Release (invalid) -> Error logged
- [ ] Triggering (timeout) -> Active
- [ ] Active -> Trigger again -> stays Active, count increments

---

## Multi-Session

- [ ] Stop in session A -> only A blocked
- [ ] Session B continues normally
- [ ] Release session A -> A resumes, B unaffected
