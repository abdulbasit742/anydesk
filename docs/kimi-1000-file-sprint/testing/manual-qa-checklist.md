# Manual QA Checklist

## Connection Flow

- [ ] Generate 9-digit session ID
- [ ] Host can share screen
- [ ] Viewer can connect via 9-digit ID
- [ ] Connection rejected if host declines
- [ ] Video stream displays correctly
- [ ] Audio works if enabled
- [ ] Disconnect ends session properly

## Remote Input

- [ ] Input disabled by default
- [ ] Host can enable remote input
- [ ] Mouse movement works
- [ ] Mouse clicks work
- [ ] Scroll wheel works
- [ ] Keyboard input works
- [ ] Emergency stop works
- [ ] Input disabled on disconnect

## File Transfer

- [ ] Transfer requires permission
- [ ] Sender can offer files
- [ ] Receiver can accept/reject
- [ ] Transfer progress displays
- [ ] Cancel works mid-transfer
- [ ] Completed files are usable
- [ ] Large files handled correctly

## Clipboard

- [ ] Sync disabled by default
- [ ] Can enable clipboard sync
- [ ] Text syncs bidirectionally
- [ ] Loop prevention works
- [ ] Disabled on disconnect

## Chat

- [ ] Messages send/receive
- [ ] Typing indicator works
- [ ] System messages display
- [ ] Messages persist in session

## Permissions

- [ ] All permissions default to off
- [ ] Host can grant/revoke
- [ ] Auto-revoke on disconnect
- [ ] Dangerous permissions show warning

## UI

- [ ] Dashboard loads
- [ ] Device list displays
- [ ] Session history shows
- [ ] Billing page loads
- [ ] Settings work
- [ ] Admin panel (admin only)

## Performance

- [ ] Connection under 5 seconds
- [ ] Latency under 100ms (local)
- [ ] Smooth video (30fps)
- [ ] No memory leaks (30min session)

## Security

- [ ] Unauthorized access blocked
- [ ] Rate limiting works
- [ ] Invalid tokens rejected
- [ ] XSS prevention
- [ ] Input validation
