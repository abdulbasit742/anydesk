# File Transfer Hardening

## Size Limits
- Max single file: 100 MB (configurable)
- Max total transfer: 500 MB per session
- 64 KB chunk size for efficient streaming

## Dangerous Extension Detection
- Executable files (.exe, .dll, .app, etc.)
- Script files (.js, .vbs, .ps1, etc.)
- Installer packages (.msi, .pkg, .deb, etc.)
- Custom rules can be added per-organization

## Filename Sanitization
- Removes forbidden characters
- Handles Windows reserved names
- Truncates to 255 characters
- Prevents path traversal

## Partial File Cleanup
- Tracks incomplete transfers
- Auto-cleans on failure
- Periodic garbage collection

## Transfer Retry
- Max 5 retries with exponential backoff
- Configurable base delay and multiplier
- Tracks attempt history

## Incoming Consent
- 60-second auto-reject timeout
- Visual countdown in UI
- Manual accept/reject

## Events
- `file-transfer:request` - Incoming file
- `file-transfer:progress` - Chunk received
- `file-transfer:complete` - Transfer done
- `file-transfer:error` - Transfer failed
