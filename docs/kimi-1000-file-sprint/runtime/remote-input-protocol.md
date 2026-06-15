# Remote Input Protocol

## Overview

The Remote Input Protocol enables viewers to send mouse and keyboard events to a host device over WebRTC data channels.

## Architecture

- **Viewer**: Captures local input events, normalizes coordinates, sends via data channel
- **Host**: Receives input events, validates permissions, executes via native OS APIs

## Security Model

1. Remote input is **disabled by default**
2. Host must explicitly grant permission per session
3. Permission auto-revokes on disconnect
4. Dangerous shortcuts are blocked
5. Emergency stop button immediately revokes all access

## Event Types

| Type | Description | Throttle |
|------|-------------|----------|
| mouse_move | Mouse movement | 16ms |
| mouse_down | Mouse button press | None |
| mouse_up | Mouse button release | None |
| mouse_wheel | Scroll wheel | None |
| key_down | Keyboard press | None |
| key_up | Keyboard release | None |

## Coordinate Normalization

All mouse events use normalized coordinates (0.0-1.0) relative to the remote video dimensions.

```
normalizedX = (clientX - videoLeft) / videoWidth
normalizedY = (clientY - videoTop) / videoHeight
```

## Implementation

- Viewer: `apps/desktop/src/renderer/src/features/input/viewer/useRemoteInput.ts`
- Host Gate: `apps/desktop/src/renderer/src/features/input/host/HostInputGate.tsx`
- Execution: `apps/desktop/src/main/input/` (IPC handlers)
