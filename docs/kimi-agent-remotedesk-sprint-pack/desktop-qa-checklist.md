# RemoteDesk Desktop — QA Checklist

**STATUS:** SAFE_DIRECT_COPY  
**LABEL:** SAFE_DIRECT_COPY

## File Transfer

- [ ] Send single file (< 10MB) — verify progress, completion
- [ ] Send multiple files — verify queue behavior
- [ ] Receive file offer — verify modal appears
- [ ] Accept file — verify save dialog opens
- [ ] Reject file — verify transfer marked rejected
- [ ] Blocked extension (.exe) — verify auto-rejection
- [ ] Dangerous extension (.sh) — verify warning shown
- [ ] Pause/resume transfer — verify state changes
- [ ] Cancel transfer — verify cleanup
- [ ] Checksum failure — verify error shown, file not saved
- [ ] Resume interrupted transfer — verify retry logic
- [ ] Large file (> 100MB) — verify memory stays bounded
- [ ] No file auto-saved without user consent
- [ ] File paths redacted in audit logs

## Clipboard Sync

- [ ] Default state: clipboard sync OFF
- [ ] Enable sync — verify toggle works
- [ ] Send text to remote — verify received
- [ ] Receive text from remote — verify local clipboard updated
- [ ] HTML content rejected — verify validation
- [ ] Empty content not synced
- [ ] Content > 100KB rejected or truncated
- [ ] Debounce: rapid changes coalesced
- [ ] Conflict: newer data wins
- [ ] Disable send direction independently
- [ ] Disable receive direction independently
- [ ] Audit logs contain only hashes, never content
- [ ] Disabling master toggle disables both directions

## Native Input

- [ ] Default: NoOpExecutor active
- [ ] Mouse events logged but not executed (check audit)
- [ ] Keyboard events logged but not executed (check audit)
- [ ] Grant permission — verify input begins executing (if real executor)
- [ ] Revoke permission — verify input blocked
- [ ] Emergency stop — verify all input blocked immediately
- [ ] Clear emergency stop — verify still blocked (needs re-grant)
- [ ] Auto-revoke after timeout
- [ ] Blocked keys (Windows key) rejected
- [ ] Ctrl+Alt+Del blocked
- [ ] Invalid coordinates rejected
- [ ] Rate limiting kicks in under flood
- [ ] No-op executor stats tracked correctly

## Diagnostics

- [ ] WebRTC stats display correctly
- [ ] Stats history maintained
- [ ] Connection state accurate
- [ ] ICE state accurate
- [ ] DataChannel state accurate
- [ ] File transfer stats accurate
- [ ] Input stats accurate
- [ ] Clipboard stats accurate
- [ ] Support bundle generated
- [ ] Support bundle redacts sensitive data
- [ ] Copy diagnostics summary works

## Reconnect

- [ ] Disconnect detected within 2s
- [ ] ICE restart initiated
- [ ] Backoff increases with each attempt
- [ ] Manual retry resets backoff
- [ ] Recovery detected on reconnection
- [ ] Banner shows during reconnect
- [ ] Banner hides on recovery
- [ ] Banner shows "failed" after max attempts
- [ ] Disconnect button works in banner
- [ ] Existing WebRTC flow not broken

## Audit

- [ ] Events queue without blocking UX
- [ ] Events flush to API
- [ ] Failed events retry (max 3)
- [ ] Queue drops oldest at capacity
- [ ] No sensitive data in events
- [ ] Transport removal handled gracefully

## Cross-Cutting

- [ ] No console errors
- [ ] No memory leaks (check after 30min session)
- [ ] Responsive UI under load
- [ ] Dark mode consistent
- [ ] Keyboard navigation works
- [ ] Screen reader labels present
- [ ] Graceful degradation if API unreachable
