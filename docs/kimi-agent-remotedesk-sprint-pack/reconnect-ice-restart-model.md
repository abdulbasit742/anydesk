# RemoteDesk Desktop — Reconnect & ICE Restart Model

**STATUS:** SAFE_DIRECT_COPY  
**LABEL:** SAFE_DIRECT_COPY

## Overview

Handles peer disconnections gracefully using ICE restart with exponential backoff. Does NOT modify existing WebRTC offer/answer/ICE flow.

## State Machine

```
                    connected
                        │
           peerconnectionstate = disconnected/failed
                        │
                        ▼
              detected_disconnect ──(2s timeout)──┐
                        │                          │
                        ▼                          │
               ice_restarting ◄────────────────────┘
                        │
            ┌───────────┼───────────┐
            ▼           ▼           ▼
       connected   reconnecting   failed
       (recovered)  (backoff)    (max attempts)
            │           │
            └─────┬─────┘
                  ▼
              recovered ──(3s)──► stable
```

## Reconnect States

| State | Description | Transitions |
|-------|-------------|-------------|
| `stable` | Connection healthy | → `detected_disconnect` on disconnect |
| `detected_disconnect` | Transient disconnect detected | → `ice_restarting` after 2s timeout |
| `ice_restarting` | ICE restart in progress | → `recovered` on ICE connect; → `reconnecting` on timeout |
| `reconnecting` | Waiting with backoff | → `ice_restarting` on retry; → `failed` at max attempts |
| `recovered` | Reconnection successful | → `stable` after 3s |
| `failed` | Max attempts exhausted | Manual reconnection required |
| `user_initiated` | User clicked retry | → `ice_restarting` immediately |

## Backoff Strategy

```
delay = min(initialDelay * (multiplier ^ (attempt - 1)), maxDelay)
```

Defaults: `initialDelay=1s`, `multiplier=2`, `maxDelay=30s`

| Attempt | Delay |
|---------|-------|
| 1 | 1s |
| 2 | 2s |
| 3 | 4s |
| 4 | 8s |
| 5 | 16s |
| 6+ | 30s (capped) |

Max attempts: 5 (configurable)

## ICE Restart Sequence

1. Disconnect detected via `peerconnectionstatechange`
2. Wait 2s for transient recovery
3. If still disconnected, signal ICE restart to peer via Socket.IO
4. Peer calls `pc.restartIce()` (existing WebRTC API)
5. New ICE gathering begins
6. On `iceconnectionstatechange = "connected"` → recovered
7. On timeout (10s) → schedule retry with backoff

## Socket.IO Messages

| Direction | Event | Payload |
|-----------|-------|---------|
| Client → Server | `peer:ice-restart` | `{ targetSocketId, sessionId }` |
| Server → Client | `peer:ice-restart-request` | `{ fromSocketId, sessionId }` |
| Client → Server | `session:reconnecting` | `{ sessionId }` |
| Server → Client | `peer:reconnecting` | `{ socketId, timestamp }` |

## UI Integration

The `ReconnectBanner` component:
- Shows when state is NOT `stable` or `recovered`
- Displays attempt count and elapsed time
- Provides "Retry Now" and "Disconnect" buttons
- Animates in with slide-down transition

## Safety Guarantees

- Existing peer connection is never destroyed
- Existing DataChannel is not recreated
- No offer/answer exchange is triggered by reconnect logic
- ICE restart is a WebRTC standard API, not a custom protocol
- If reconnect fails, session can still be re-established manually
