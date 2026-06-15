# Data Channel Protocol

## Overview

RemoteDesk uses multiple WebRTC data channels for different traffic types, each with its own reliability and ordering guarantees.

## Channel Types

| Channel | Label | Ordered | Priority |
|---------|-------|---------|----------|
| Control | rd-control | Yes | 1 |
| Input | rd-input | No | 2 |
| Clipboard | rd-clipboard | Yes | 3 |
| Chat | rd-chat | Yes | 4 |
| Diagnostics | rd-diag | No | 5 |
| File Transfer | rd-files | No | 6 |

## Message Format

```json
{
  "v": 1,
  "ch": "control",
  "t": "ping",
  "p": { "nonce": 123 },
  "ts": 1704067200000,
  "seq": 42
}
```

## Backpressure

- High water mark: 1MB
- Low water mark: 256KB
- Max buffered: 16MB
- Throttle delay: 50ms

## Heartbeat

- Ping interval: 5000ms
- Pong timeout: 15000ms

## Implementation

- Core: `packages/shared/src/data-channel/`
- Desktop: `apps/desktop/src/renderer/src/features/data-channel/DataChannelProvider.tsx`
