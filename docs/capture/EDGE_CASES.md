# Desktop Capture Edge Cases

## Source Removal
- Detect when selected window/screen closes
- Notify user and prompt for new selection
- Gracefully stop capture before source disappears

## Monitor Disconnection
- Track monitor state changes
- Detect when external monitor disconnects
- Fallback to primary monitor

## Permission Failures
- Browser permission denial
- System-level blocking (macOS Screen Recording)
- Admin privilege requirements
- Timeout handling

## Capture Restart
- Retry with exponential backoff
- Preserve source selection if possible
- Report progress to UI

## Quality Management
- Adaptive quality based on bandwidth
- User-selectable presets
- FPS and resolution limits enforced

## Events
- `capture:source-removed` - Source was closed
- `capture:monitor-disconnected` - Monitor unplugged
- `capture:permission-denied` - Permission blocked
- `capture:restarting` - Capture restarting
- `capture:quality-changed` - Quality adjusted
