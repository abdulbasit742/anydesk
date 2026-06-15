# Creating Title Content (1) Code Review

Source: `_incoming/creating-title-content-1/`

## Verdict

Useful as a data-channel design/reference pack. Safe direct runtime merge is not appropriate.

## Ported Now

- Message routing was adapted as `createDataChannelRouter`.
- Heartbeat behavior was adapted as `createDataChannelHeartbeat`.
- Imported docs cover data-channel architecture, file transfer protocol, clipboard sync security, chat data channel, troubleshooting, QA, and batch risk notes.

## Kept Review-Only

- `MultiplexedDataChannel.ts`: good concept, but imports `uuid`, local validation, and a different envelope shape.
- `FileTransferSender.ts` / `FileTransferReceiver.ts`: useful ACK/NACK/windowing ideas, but depend on mismatched file-transfer types and browser-only base64 handling.
- `ClipboardSyncManager.ts`: useful debounce/conflict idea, but depends on mismatched permission/data-channel modules.
- `*Validation.ts`: depends on `zod`, which is not currently part of `@remotedesk/shared`.
- TSX UI files: useful visual references, but they are not wired into current desktop/web components.

## Best Next Ports

1. Wire `createDataChannelRouter` into the desktop `SessionDataChannel` class.
2. Add a file-transfer message type over the existing `control` data channel.
3. Port ACK/NACK retry logic from `FileTransferSender.ts` into current shared contracts.
4. Add clipboard debounce/conflict handling using the current clipboard helpers.

## Risks

- Direct import would introduce broken paths like `../types/dataChannel`.
- Direct import would require new dependencies and could break the shared package.
- Some incoming code logs errors instead of surfacing typed errors to UI.
