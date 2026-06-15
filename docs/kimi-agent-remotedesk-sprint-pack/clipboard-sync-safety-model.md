# RemoteDesk Desktop — Clipboard Sync Safety Model

**STATUS:** SAFE_DIRECT_COPY  
**LABEL:** SAFE_DIRECT_COPY

## Core Principle

Clipboard sync is **disabled by default**. It must be explicitly enabled by the user after understanding the privacy implications.

## Default State

```
enabled: false
allowSend: false
allowReceive: false
debounceMs: 500
maxTextLength: 100000 bytes (100KB)
```

## Security Properties

### What is synced
- Plain text only (`text/plain`)
- Maximum 100KB per sync
- SHA-256 content hash for deduplication (never the raw content)

### What is NOT synced
- HTML content (rejected — would require a strong sanitizer)
- Rich text formatting
- Images or binary data
- File references
- Clipboard metadata

### Privacy Protections

| Protection | Implementation |
|-----------|----------------|
| Disabled by default | `DEFAULT_CLIPBOARD_SETTINGS.enabled = false` |
| No content logging | Audit events log only content hash, never text |
| Deduplication | Prevents echo loops via hash tracking |
| Debounce | 500ms minimum between syncs |
| Conflict resolution | Newer data wins; local vs remote conflict detection |
| HTML rejection | `/<\w+[^>]*>/` pattern blocks HTML content |
| Preview only | UI shows truncated preview, never full content |
| Per-direction toggles | Send and receive can be enabled independently |

## Audit Events

All clipboard operations emit sanitized audit events:

| Event | Data Logged | Data NOT Logged |
|-------|------------|-----------------|
| `cb_sent` | contentHash, sizeBytes | clipboard text |
| `cb_received` | contentHash, sizeBytes | clipboard text |
| `cb_send_failed` | contentHash | error details |
| `cb_conflict_ignored` | contentHash, reason | — |

## IPC Surface

- `clipboard:read` — Read local clipboard (renderer → main)
- `clipboard:write` — Write to local clipboard (renderer → main)
- `clipboard:sync-text` — Incoming sync from remote peer (via DataChannel)

## Threat Mitigations

| Threat | Mitigation |
|--------|-----------|
| Clipboard theft | Disabled by default; requires explicit enable |
| Clipboard injection | Receive direction separate toggle; disabled by default |
| HTML injection | HTML content rejected at validation layer |
| Rapid sync spam | 500ms debounce + rate limiting |
| Content logging | Audit layer strips all text content |
| Echo loop | Deduplication via content hash + timestamp comparison |
