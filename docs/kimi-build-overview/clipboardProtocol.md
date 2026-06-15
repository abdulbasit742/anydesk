# Clipboard Sync Protocol

## Design Goals

1. **Privacy-first**: Disabled by default; both sides must opt-in
2. **Text-only**: No binary data; prevents executable injection
3. **No echo**: Local writes don't bounce back
4. **Secure**: Size limits; content validation; no filesystem access

## Protocol Flow

```
Viewer                              Host
  │                                   │
  │  ┌─── User enables clipboard ──┐ │
  │  ▼                               ▼ │
  │ CLIPBOARD_STATE(enabled)    ─────►│
  │◄────── CLIPBOARD_STATE(enabled) ──│
  │                                   │
  │  ┌─── User copies text ─────────┐ │
  │  ▼                               │ │
  │  Read clipboard                  │ │
  │  Hash = H(text)                  │ │
  │  Record lastWriteHash = H        │ │
  │  Debounce 500ms                  │ │
  │                                   │ │
  │ CLIPBOARD_TEXT(hash, text) ─────►│
  │◄──────── CLIPBOARD_ACK ──────────││
  │                                   │ │
  │  ┌─── Host receives ────────────┐ │
  │  │  Check hash == lastWriteHash │ │
  │  │  YES → ECHO, ignore         │ │
  │  │  NO  → Accept, write to     │ │
  │  │        local clipboard       │ │
  │  ▼                               │ │
```

## Message Types

| Type | Direction | Payload |
|------|-----------|---------|
| `clip:text` | Either | `{ text, hash, size, timestamp, source }` |
| `clip:ack` | Either | `{ hash }` |
| `clip:state` | Either | `{ state, direction, maxSizeBytes }` |
| `clip:error` | Either | `{ code, message, originalHash }` |

## Conflict Resolution

When both sides have clipboard sync enabled:

1. Each side records `lastWriteHash` when writing to local clipboard
2. Incoming text with matching hash is treated as echo → ignored
3. Non-echo conflicts resolved by `conflictStrategy`:
   - `local_wins`: Always keep local clipboard
   - `remote_wins`: Always accept remote
   - `timestamp_wins`: Use most recent (default)

## Size Limits

| Limit | Value | Purpose |
|-------|-------|---------|
| Max item size | 1MB | Prevent memory exhaustion |
| Debounce interval | 500ms | Prevent rapid polling |
| Rate limit | 30/min | Prevent DoS |

## Content Validation

```
1. Must be string type
2. Must be non-empty
3. Must be under 1MB
4. Must not contain null bytes (>50%)
5. Control characters stripped
6. Truncated to 100KB if needed
```

## Security Considerations

- No binary content (prevents executable injection)
- No HTML/RTF (prevents phishing via formatted text)
- No images or file references
- Local clipboard API access only in main process

## QA Checklist

- [ ] Disabled by default
- [ ] Both sides must enable
- [ ] Text only - binary rejected
- [ ] No echo loop
- [ ] Conflict resolution works
- [ ] Size limit enforced
- [ ] Debounce working
- [ ] Error handling
- [ ] Visual feedback
