# Remote Input QA Checklist

## Coordinate Normalization

- [ ] Normalized coordinates in range [0.0, 1.0]
- [ ] Values outside viewport are clamped
- [ ] Negative values are clamped to 0
- [ ] Values exceeding viewport are clamped to 1
- [ ] Division by zero handled for zero-size viewport
- [ ] NaN/Infinity values rejected
- [ ] Float precision maintained (no integer truncation)
- [ ] Multi-monitor support documented (future)

## Mouse Events

- [ ] Mouse move generates `mouse:move` events
- [ ] Mouse down generates `mouse:down` events
- [ ] Mouse up generates `mouse:up` events
- [ ] Double-click generates `mouse:dblclick` event
- [ ] Right-click prevented (context menu blocked)
- [ ] Button mapping correct (0=left, 1=middle, 2=right)
- [ ] Modifier keys extracted (Ctrl, Alt, Shift, Meta)
- [ ] Click count increments correctly for double-click
- [ ] Click count resets after window timeout

## Keyboard Events

- [ ] Key down generates `key:down` events
- [ ] Key up generates `key:up` events
- [ ] `event.code` preserved (e.g., "KeyA", "Space")
- [ ] `event.key` preserved (e.g., "a", " ")
- [ ] Modifier keys extracted correctly
- [ ] Repeat flag set on held keys
- [ ] Restricted keys flagged (F-keys, Delete, etc.)
- [ ] Browser defaults prevented for remote session keys
- [ ] Tab navigation contained within session

## Wheel/Scroll

- [ ] Scroll generates `wheel:scroll` events
- [ ] Delta values normalized across browsers
- [ ] Pixel, line, and page modes handled
- [ ] Delta values clamped to max magnitude
- [ ] Modifier keys extracted

## Throttle

- [ ] Mouse move throttled to ~60fps
- [ ] Clicks sent immediately (not batched)
- [ ] Keys sent immediately (not batched)
- [ ] Batch flushes on size limit
- [ ] Batch flushes on time limit
- [ ] Flush on mouse up (sends pending moves)
- [ ] No events lost during normal operation
- [ ] Adaptive throttle responds to latency changes

## Permission Gate

- [ ] All permissions denied by default
- [ ] Host can grant mouse permission
- [ ] Host can grant keyboard permission
- [ ] Host can grant clipboard permission
- [ ] Host can revoke individual permissions
- [ ] Host can revoke all permissions
- [ ] Viewer cannot send input without permission
- [ ] Permission revoked on disconnect
- [ ] Permission revoked on emergency stop
- [ ] Permission state visible in UI

## Emergency Stop

- [ ] Button visible during active session
- [ ] Button triggers emergency stop
- [ ] All permissions revoked immediately
- [ ] Visual overlay appears
- [ ] Cannot grant permissions during emergency stop
- [ ] Clearing emergency stop does not restore permissions
- [ ] Manual re-enable required after clear
- [ ] Works from both host and viewer sides
- [ ] Audit log records trigger event

## Input Sender

- [ ] Events sent via DataChannel
- [ ] Envelope includes version, sessionId, sequence
- [ ] Mouse moves batched
- [ ] Clicks sent immediately (reliable)
- [ ] Keys sent immediately (reliable)
- [ ] Permission check before send
- [ ] Events dropped when no permission
- [ ] Events dropped during emergency stop
- [ ] Diagnostics tracked (sent, dropped, queue depth)
- [ ] Flush sends pending batch

## Validation

- [ ] Coordinates validated [0.0, 1.0]
- [ ] Mouse buttons validated (0-4)
- [ ] Unknown event types rejected
- [ ] Malformed messages rejected
- [ ] Oversized messages rejected
- [ ] Protocol version validated
- [ ] Sequence numbers validated

## Security

- [ ] No native input from renderer process
- [ ] IPC validated in main process
- [ ] Permission checked before execution
- [ ] Rate limiting enforced
- [ ] Restricted key combos blocked
- [ ] Audit log records executions
- [ ] Emergency stop immediately effective
- [ ] No filesystem access from input pipeline
- [ ] No shell execution from input events

## Cross-Browser

- [ ] Chrome/Edge: Full functionality
- [ ] Firefox: Full functionality
- [ ] Safari: Full functionality (limited Keyboard Lock API)
- [ ] Mobile browsers: Graceful degradation

## Performance

- [ ] Mouse move: < 1ms processing overhead
- [ ] Click/key: < 2ms end-to-end latency
- [ ] Throttle reduces events by 50-80%
- [ ] No memory leaks on session end
- [ ] Dispose cleans up all resources