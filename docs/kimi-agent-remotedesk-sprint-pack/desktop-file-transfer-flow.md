# RemoteDesk Desktop — File Transfer Flow

**STATUS:** SAFE_DIRECT_COPY  
**LABEL:** SAFE_DIRECT_COPY

## Overview

RemoteDesk implements peer-to-peer file transfer over WebRTC DataChannels with explicit user consent, checksum validation, and retry logic.

## Architecture

```
Sender                               Receiver
------                               --------
1. Select file(s)
2. Compute SHA-256 checksum
3. Send "offer" control message ──>  4. Display ReceiveFileModal
                                      5. User clicks Accept
                                      6. Electron save dialog opens
6.1 Send "accept" <────────────────  6.2 User selects save path
7. Begin chunk transmission ──────>  8. Write chunks to temp buffer
   (16KB chunks with ACK/NACK)         (validate per-chunk checksum)
   <───────────────── "ack"         9. Send ACK for each chunk
   (pause/resume supported)           (pause/resume supported)
10. Send "complete" ─────────────> 11. Validate full checksum
                                      12. Atomic write to final path
                                      13. Send "complete" back
```

## Security Model

| Threat | Mitigation |
|--------|-----------|
| Silent file writes | User must explicitly accept + choose save location via OS dialog |
| Dangerous file types | `.exe`, `.dll`, `.bat` etc. are blocked; others show warning |
| File corruption | SHA-256 checksum validation per-file |
| Path traversal | All paths resolved and validated in main process |
| Node API exposure | Renderer only accesses filesystem via safe IPC bridge |
| Auto-accept | Never implemented — always requires explicit user action |

## File Type Blocking

### Blocked (rejected automatically)
`.exe`, `.dll`, `.bat`, `.cmd`, `.msi`, `.com`, `.pif`, `.scr`

### Warned (user sees warning but can proceed)
`.sh`, `.app`, `.pkg`, `.deb`, `.rpm`, `.jar`, `.py`, `.ps1`, `.vbs`, `.js`

## Chunk Protocol

Each chunk message is a binary frame with a 4-byte header length prefix:

```
[4 bytes: header JSON length][N bytes: JSON header][M bytes: binary data]
```

Header contains: `transferId`, `chunkIndex`, `totalChunks`

## Retry Flow

1. Receiver sends NACK with `chunkIndex`
2. Sender re-reads the chunk from the source File
3. Sender re-transmits the chunk
4. Up to 3 retries per transfer (configurable)
5. After max retries, transfer marked as failed

## IPC Surface

### Renderer → Main
- `file-transfer:show-open-dialog` — Open file picker
- `file-transfer:show-save-dialog` — Open save dialog
- `file-transfer:read-file` — Read file as ArrayBuffer
- `file-transfer:write-file` — Write file from Uint8Array

### Main → Renderer
- `file-transfer:action` — External file transfer action notification

## Integration Points

- **DataChannel**: File chunks and control messages flow through the existing `SessionDataChannel`
- **Audit**: Every transfer emits audit events via `fileTransferAudit` helper
- **Retry**: Uses shared `createRetryPolicy` from `@shared/retry`
- **Checksums**: Uses shared `computeChecksum` from `@shared/checksums`
