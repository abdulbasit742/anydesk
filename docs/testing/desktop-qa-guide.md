# Desktop QA Guide

## Test Areas
1. **Capture Helper** - Screen source selection, stream acquisition
2. **WebRTC Helper** - Peer connection, offer/answer, ICE
3. **Input Normalization** - Mouse, keyboard, scroll events
4. **File Transfer** - Start, progress, complete, fail states
5. **Clipboard Sync** - Text sync, truncation, enable/disable
6. **Chat** - Message send/receive, unread count, clear
7. **Settings** - Persistence, defaults, feature toggles

## Manual Tests
See `apps/desktop/tests/manual/` for session, file transfer, clipboard, and input E2E scripts.

## Automated Tests
```bash
npm run test --workspace=@remotedesk/desktop
```

## Feature Toggles
All sensitive features default to OFF:
- unattendedAccess: false
- audioEnabled: false
- fileTransfer: true (per plan)
- remoteInput: true (per session)
