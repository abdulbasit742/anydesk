# RemoteDesk Mobile Touch Controls Specification

## View Mode (Default)
- Single finger drag: Pan remote view
- Pinch: Zoom in/out
- Double tap: Toggle full screen
- Two finger tap: Show/hide controls

## Input Mode
- Single tap: Click at location
- Long press: Right-click
- Drag: Mouse drag
- Scroll area: Two finger scroll

## Keyboard
- Show/hide button in toolbar
- Custom function keys row (Ctrl, Alt, Tab, Esc)
- Auto-hide after 5s of inactivity (configurable)

## Gestures
| Gesture | Action |
|---------|--------|
| Swipe from left edge | Show session panel |
| Swipe from right edge | Show chat panel |
| Swipe from bottom | Show keyboard |
| Swipe from top | Show status bar |
| Three finger swipe up | Disconnect |

## UI Layout
```
+------------------+
| [Back] Desk ID [Menu] |
+------------------+
|                  |
|   Remote View    |
|                  |
+------------------+
| [KB] [Mouse] [Chat] [More] |
+------------------+
```

## Accessibility
- VoiceOver/TalkBack support
- High contrast mode
- Adjustable touch target size (44pt minimum)

## Platform Specifics
### iOS
- Support for Apple Pencil pressure
- Dynamic Island safe area handling
- Background audio for session audio

### Android
- Support for S Pen
- Floating keyboard support
- Multi-window mode
