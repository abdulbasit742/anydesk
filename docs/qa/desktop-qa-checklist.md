# Desktop QA Checklist

## Installation
- [ ] Windows installer works
- [ ] macOS DMG works
- [ ] Linux AppImage works
- [ ] Auto-update works

## Launch
- [ ] Cold start < 5s
- [ ] Warm start < 2s
- [ ] System tray icon appears
- [ ] Context menu works

## Session (Host)
- [ ] RemoteDesk ID displayed
- [ ] Incoming request dialog
- [ ] Accept works
- [ ] Reject works
- [ ] Screen capture starts
- [ ] Preview shows
- [ ] Disconnect stops capture

## Session (Viewer via desktop)
- [ ] Connect dialog
- [ ] Connect to valid ID
- [ ] Connect to invalid ID (error)
- [ ] Video displays
- [ ] Remote control works
- [ ] Chat works
- [ ] File transfer works
- [ ] Clipboard sync works

## Settings
- [ ] All settings persist
- [ ] Quality changes apply
- [ ] Feature toggles work

## Exit
- [ ] Graceful shutdown
- [ ] No orphaned processes
