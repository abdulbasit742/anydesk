# File Transfer Protocol

## Design Goals

1. **Consent-first**: Receiver must accept each file
2. **Safe filenames**: Path traversal prevented; names sanitized
3. **Integrity**: SHA-256 per-file and per-chunk verification
4. **Resume support**: Chunk-level acks enable pause/resume
5. **No renderer FS**: All file operations via main process IPC

## Protocol Flow

### Sender Side

```
1. User selects file via dialog (main process)
2. Calculate SHA-256 hash of entire file
3. Send FT_OFFER with metadata
4. Wait for FT_ACCEPT or FT_REJECT
5. If accepted:
   a. Read file in 16KB chunks
   b. Send FT_CHUNK messages
   c. Wait for FT_CHUNK_ACK
   d. Send FT_COMPLETE when done
6. If rejected: cleanup
```

### Receiver Side

```
1. Receive FT_OFFER with metadata
2. Show consent dialog to user
3. If accepted:
   a. Open save dialog (main process)
   b. Create temp file
   c. Send FT_ACCEPT with save path
   d. Receive FT_CHUNK messages
   e. Write chunks to temp file
   f. Send FT_CHUNK_ACK for each
   g. On FT_COMPLETE: verify hash
   h. Rename temp to final file
4. If rejected: send FT_REJECT
```

## Message Types

| Type | Direction | Purpose |
|------|-----------|---------|
| `ft:offer` | Sender → Receiver | File metadata + transfer ID |
| `ft:accept` | Receiver → Sender | Consent + save path |
| `ft:reject` | Receiver → Sender | Denial + reason |
| `ft:cancel` | Either → Either | Cancel transfer |
| `ft:pause` | Either → Either | Pause transfer |
| `ft:resume` | Either → Either | Resume transfer |
| `ft:chunk` | Sender → Receiver | Chunk data (base64) |
| `ft:chunkAck` | Receiver → Sender | Chunk received |
| `ft:complete` | Sender → Receiver | All chunks sent |
| `ft:error` | Either → Either | Error occurred |

## Chunk Format

```typescript
interface ChunkPayload {
  transferId: string;   // Transfer ID
  sequence: number;     // 0-based chunk index
  data: string;         // Base64-encoded chunk
  isLast: boolean;      // True for final chunk
}
```

## State Machine

### Sender States
```
pending_consent ──► transferring ──► completed
       │                 │
       ▼                 ▼
   rejected           paused
       │                 │
       ▼                 ▼
                  cancelled/failed
```

### Receiver States
```
pending_consent ──► transferring ──► completed
       │                 │
       ▼                 ▼
   rejected           paused
       │                 │
       ▼                 ▼
                  cancelled/failed
```

## Size Limits

| Limit | Value |
|-------|-------|
| Max file size | 100MB |
| Chunk size | 16KB |
| Max concurrent transfers | 3 |
| Consent timeout | 60 seconds |
| Transfer timeout | 5 minutes |

## Filename Sanitization

```
1. Extract basename (remove all directory components)
2. Remove path traversal sequences (../, ..\)
3. Remove unsafe characters (<>:"/\|?*)
4. Prefix Windows reserved names (CON, COM1, etc.)
5. Trim spaces and dots from ends
6. Limit to 255 characters
7. Add timestamp prefix for uniqueness
```

## Blocked Extensions

```
.exe .dll .bat .cmd .com .scr
.sh .bash .zsh .fish
.app .dmg .pkg
.deb .rpm .msi .msp
.jar .js .vbs .wsf .hta
.ps1 .psm1 .ps1xml
.reg .inf .scf
```

## Error Codes

| Code | Meaning | Recoverable |
|------|---------|-------------|
| `SIZE_EXCEEDED` | File too large | No |
| `INVALID_FILE` | Bad filename or type | No |
| `CONSENT_TIMEOUT` | Receiver didn't respond | Yes (re-offer) |
| `TRANSFER_TIMEOUT` | Transfer stalled | Yes (resume) |
| `CHUNK_MISMATCH` | Chunk hash mismatch | Yes (resend) |
| `HASH_MISMATCH` | Final hash mismatch | Yes (retransfer) |
| `DISK_FULL` | No space left | No |
| `CANCELLED` | User cancelled | No |

## Security Features

1. **Consent dialog**: Shows filename, size, type, SHA hash
2. **Dangerous file warning**: Red banner for executables
3. **Extension blocking**: Known dangerous extensions rejected
4. **Path sanitization**: No directory traversal possible
5. **IPC only**: Renderer never touches filesystem directly
6. **Temp files**: Atomic write via temp + rename
