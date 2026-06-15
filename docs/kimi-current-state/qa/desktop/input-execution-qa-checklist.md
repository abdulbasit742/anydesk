# Native Input Execution QA Checklist

**Status:** SAFE_DIRECT_COPY  
**Last Updated:** 2026-06-12  
**Scope:** QA Testing Checklist for Native Input Execution Feature

---

## Pre-Test Setup

- [ ] Build desktop app in development mode
- [ ] Verify NoopInputExecutor is default
- [ ] Check that platform executors are NOT loaded
- [ ] Confirm audit logging is enabled
- [ ] Open developer console for log inspection

---

## Basic Functionality

### Command Validation
- [ ] Send valid mouse move command -> passes validation
- [ ] Send invalid command (missing fields) -> blocked with error
- [ ] Send out-of-bounds coordinates -> sanitized
- [ ] Send non-finite coordinates -> sanitized to 0
- [ ] Send unknown command type -> blocked with error

### No-op Execution
- [ ] Execute mouse move -> logged, no OS movement
- [ ] Execute mouse click -> logged, no OS click
- [ ] Execute wheel scroll -> logged, no OS scroll
- [ ] Execute key press -> logged, no OS keypress
- [ ] Check console output shows "Would execute" messages

### Permission Checks
- [ ] Default permissions deny all input
- [ ] Grant mouse move -> mouse move commands succeed
- [ ] Deny mouse move -> mouse move commands blocked
- [ ] Grant keyboard -> key commands succeed
- [ ] Deny keyboard -> key commands blocked
- [ ] Mixed permissions -> only granted types succeed

---

## Rate Limiting

### Mouse Move Coalescing
- [ ] Send 1000 mouse moves rapidly -> coalesced to ~120
- [ ] Verify no commands dropped below limit
- [ ] Check average position is maintained

### Command Rate Limit
- [ ] Send 100 commands/sec -> throttled to 60
- [ ] Exceed violation threshold -> session throttled
- [ ] Throttle persists for 5 seconds
- [ ] After throttle -> commands resume normally

### Keyboard Repeat Guard
- [ ] Hold key down -> repeat rate limited to ~30Hz
- [ ] Rapid key presses -> blocked if too fast
- [ ] Normal typing -> allowed without issue

---

## Emergency Stop

### Trigger
- [ ] Trigger emergency stop -> all input blocked immediately
- [ ] Verify blocked commands show emergency stop reason
- [ ] Check audit log records trigger event

### Persistence
- [ ] Trigger emergency stop -> active after UI refresh
- [ ] Trigger emergency stop -> active after reconnection
- [ ] Cannot execute input while emergency stop active

### Release
- [ ] Release emergency stop -> input resumes
- [ ] Release requires host confirmation
- [ ] Audit log records release event

---

## Audit and Diagnostics

### Audit Logging
- [ ] Each executed command logged with type
- [ ] Each blocked command logged with reason
- [ ] No sensitive data in logs (no passwords, exact coordinates)
- [ ] Emergency stops logged with timestamp and actor

### Support Bundle
- [ ] Generate support bundle -> valid JSON
- [ ] Bundle contains counters
- [ ] Bundle contains recent events
- [ ] Bundle contains no sensitive data

---

## Edge Cases

- [ ] Session ends while commands pending -> graceful cleanup
- [ ] Renderer crashes -> main process continues safely
- [ ] Network disconnect -> pending commands fail gracefully
- [ ] Very large coordinates -> sanitized to bounds
- [ ] Negative coordinates -> handled correctly
- [ ] Unicode keys -> handled without crash
- [ ] Modifier combinations (Ctrl+Alt+Del) -> blocked or sanitized

---

## Performance

- [ ] 1000 commands processed without memory leak
- [ ] Average execution time < 1ms (no-op)
- [ ] No UI freezing during command processing
- [ ] Audit log rotation works (max 10,000 events)
