# Remote Input Safety

## Permission Reset on Disconnect
- All input permissions revoked when session ends
- Focus loss pauses remote input

## Blocked OS Shortcuts
- Ctrl+Alt+Del (Windows)
- Cmd+Space (macOS Spotlight)
- Alt+Tab / Cmd+Tab (App switcher)
- Screenshots, lock screen, etc.

## Input Rate Limiting
- Token bucket algorithm (60/sec default)
- Burst protection and cooldown
- Audit logging of blocked events

## Input Event Audit
- All remote input events logged
- Queryable by session, viewer, event type
- JSON export for compliance

## Host Emergency Stop
- Triple-tap Escape to kill all remote input
- 5-second cooldown before re-arm
- Visual banner when triggered

## Viewer Focus Guard
- Input paused when viewer window loses focus
- Prevents accidental input to wrong window

## Events
- `input:permission-changed` - Permissions updated
- `input:shortcut-blocked` - Shortcut intercepted
- `input:rate-limited` - Event throttled
- `input:emergency-stop` - Emergency stop triggered
- `input:focus-changed` - Focus state changed
