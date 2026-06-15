# Remote Input Architecture

## Overview

The RemoteDesk remote input system enables a viewer to control the host's mouse and keyboard during a remote session. This document describes the architecture, data flow, and security model.

## Architecture Diagram

```
+------------------------------------------------------------------+
|                         VIEWER SIDE                              |
|                                                                  |
|  +----------------+     +----------------+     +-------------+  |
|  |  User Input    |---->|  Normalization |---->|  Throttle   |  |
|  |  (Mouse/Key)   |     |  (0.0-1.0)     |     |  (Batch)    |  |
|  +----------------+     +----------------+     +------+------+  |
|                                                       |         |
|  +----------------+     +----------------+           |         |
|  |  Remote Input  |<----|  Input Sender  |<----------+         |
|  |  Capture (UI)  |     |  (DataChannel) |                      |
|  +----------------+     +--------+-------+                      |
|                                  |                               |
+------------------------------- | -------------------------------+
                                 |
                          WebRTC DataChannel
                          (SessionDataChannel)
                                 |
+------------------------------- | -------------------------------+
|                         HOST SIDE                              |
|                                |                                |
|  +----------------+     +------v-------+     +-------------+  |
|  |  Permission    |<----|  Input       |<----|  Validation |  |
|  |  Gate          |     |  Receiver    |     |  & Filter   |  |
|  +--------+-------+     +------+-------+     +-------------+  |
|           |                    |                                |
|           |  Denied            | Permitted                     |
|           v                    v                                |
|  +----------------+     +----------------+     +-------------+  |
|  |  Drop + Log    |     |  Input         |---->|  Executor   |  |
|  |                |     |  Executor      |     |  (Main Proc)|  |
|  +----------------+     |  (IPC)         |     +-------------+  |
|                         +----------------+                      |
+------------------------------------------------------------------+
```

## Components

### Viewer Side

#### RemoteInputCapture
- React component overlaying the remote video
- Captures all mouse and keyboard events
- Normalizes coordinates to 0.0-1.0 range
- Prevents default browser behaviors
- Manages pointer capture and focus trap

#### Normalization
- Converts viewport coordinates to normalized space
- Handles different video aspect ratios
- Clamps values to valid range

#### Throttle
- Reduces mouse move event frequency
- Batches low-priority events
- Sends clicks/keys immediately
- Adaptive throttling based on latency

#### Input Sender
- Sends events via WebRTC DataChannel
- Envelopes events with version, session ID, sequence
- Batches mouse moves (4 events or 16ms)
- Sends clicks/keys immediately with reliable mode

### Host Side

#### Permission Gate
- All input must pass permission check
- Host explicitly grants each category
- Permission revoked on disconnect
- Permission revoked on emergency stop

#### Input Receiver
- Receives events from DataChannel
- Validates envelope format and version
- Checks permission state
- Drops unauthorized input

#### Input Executor (Main Process)
- Executes input via OS-specific APIs
- Runs in Electron main process only
- No-op mode for development
- Rate limited to prevent abuse

## Data Flow

### Mouse Move
1. User moves mouse over remote video
2. `RemoteInputCapture` normalizes coordinates
3. `MouseMoveThrottler` batches events (max 4 or 16ms)
4. `InputSender` creates envelope and sends via DataChannel
5. Host validates and executes (or drops if no permission)

### Mouse Click
1. User clicks on remote video
2. `RemoteInputCapture` normalizes and determines click count
3. `InputSender` flushes any pending moves, sends click immediately
4. Host validates permission and executes via native API

### Keyboard
1. User presses key while remote video focused
2. `RemoteInputCapture` maps to standard key code
3. `shouldPreventDefault` blocks browser shortcuts
4. `InputSender` sends key event immediately
5. Host validates and executes (blocks restricted combos)

## Security Model

### Permission Gating
- Remote input is **disabled by default**
- Host must **explicitly enable** each category
- Viewer **cannot** send input until permission granted
- Permission **revoked** on disconnect or emergency stop

### Input Validation
- All events validated before execution
- Coordinates clamped to [0, 1]
- Unknown event types rejected
- Rate limiting prevents flooding

### Sandboxing
- Renderer process **never** executes native input
- All native input goes through **main process IPC**
- Preload API is **context-isolated**
- No direct OS API access from renderer

## Envelope Format

```typescript
interface RemoteInputEnvelope {
  version: 1;              // Protocol version
  sessionId: string;       // Session identifier
  sequence: number;        // Monotonic sequence
  timestamp: number;       // Unix timestamp (ms)
  events: InputEvent[];    // One or more input events
}
```

## Event Types

| Event | Type | Priority | Delivery |
|-------|------|----------|----------|
| mouse:move | NormalizedPoint | Low | Batched |
| mouse:down | MouseDownEvent | Critical | Immediate |
| mouse:up | MouseUpEvent | High | Immediate |
| mouse:dblclick | MouseDoubleClickEvent | Critical | Immediate |
| wheel:scroll | WheelEvent | Normal | Immediate |
| key:down | KeyboardDownEvent | Critical | Immediate |
| key:up | KeyboardUpEvent | High | Immediate |

## Constants

| Constant | Value | Description |
|----------|-------|-------------|
| MOUSE_MOVE_THROTTLE_HZ | 60 | Max mouse move sends/sec |
| MOUSE_QUEUE_MAX_SIZE | 8 | Max queued mouse events |
| BATCH_FLUSH_INTERVAL_MS | 16 | Batch flush interval |
| DOUBLE_CLICK_WINDOW_MS | 500 | Double-click detection window |
| MAX_SCROLL_DELTA | 24 | Max scroll delta magnitude |
| INPUT_PROTOCOL_VERSION | 1 | Current protocol version |
| MAX_INPUT_MESSAGE_SIZE | 4096 | Max message size in bytes |

## Error Codes

| Code | Meaning | Recoverable |
|------|---------|-------------|
| INPUT_1000 | Permission denied | Yes |
| INPUT_1004 | Emergency stop active | No |
| INPUT_1100 | Invalid coordinates | No |
| INPUT_1106 | Malformed message | No |
| INPUT_1200 | Data channel closed | Yes |
| INPUT_1300 | Rate limit exceeded | Yes |
| INPUT_1400 | Executor not initialized | Yes |

## Files

| Path | Purpose |
|------|---------|
| `packages/shared/src/remoteInput/` | Shared types, constants, validation |
| `apps/desktop/src/renderer/src/features/remoteInput/` | Viewer capture, sender, throttle |
| `apps/desktop/src/main/input/` | Host executor interface |
| `apps/desktop/src/preload/input/` | IPC contract |