# Clipboard Sync Protocol

## Overview

Clipboard sync enables bidirectional clipboard sharing between host and viewer.

## Security

- **Disabled by default**
- Requires host permission
- Loop prevention (2s cooldown)
- Max size: 1MB
- Only text/HTML by default

## Flow

1. Both sides poll local clipboard at 500ms interval
2. On change, send via `rd-clipboard` channel
3. Receiving side ignores if matches last-sent content
4. Loop prevention timer prevents echo

## Message Format

```json
{
  "type": "text",
  "data": "clipboard content",
  "size": 17,
  "timestamp": 1704067200000,
  "sourceSessionId": "session_id"
}
```

## Implementation

- Contracts: `packages/shared/src/clipboard/`
- Desktop: `apps/desktop/src/renderer/src/features/clipboard/ClipboardSync.tsx`
- Main process: `apps/desktop/src/main/index.ts` (clipboard IPC)
