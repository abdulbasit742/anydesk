# RemoteDesk — Audit Event Catalog

**STATUS:** SAFE_DIRECT_COPY  
**LABEL:** SAFE_DIRECT_COPY

## Categories

### session

| Action | Level | Payload | Description |
|--------|-------|---------|-------------|
| `session_connected` | info | remoteId, durationMs | Session established |
| `session_disconnected` | info | reason, durationMs | Session ended |
| `session_viewer_joined` | info | viewerId | Viewer connected |
| `session_viewer_left` | info | viewerId, durationMs | Viewer disconnected |
| `session_started` | info | sessionType | Session initialized |
| `session_ended` | info | reason, durationMs, bytesTransferred | Session closed |
| `session_quality_changed` | info | quality, reason | Quality adapted |
| `session_error` | error | error, context | Session error occurred |

### file_transfer

| Action | Level | Payload | Description |
|--------|-------|---------|-------------|
| `ft_send_offered` | info | transferId, fileName, fileSize | Send offer sent |
| `ft_send_started` | info | transferId, totalChunks | Transfer began |
| `ft_send_completed` | info | transferId, durationMs | Transfer succeeded |
| `ft_send_failed` | error | transferId, reason | Transfer failed |
| `ft_receive_offered` | info | transferId, fileName, fileSize | Offer received |
| `ft_receive_accepted` | info | transferId | Offer accepted |
| `ft_receive_rejected` | warn | transferId, reason | Offer rejected |
| `ft_receive_completed` | info | transferId, durationMs | Receive succeeded |
| `ft_cancelled` | info | transferId | Transfer cancelled |
| `ft_checksum_failed` | error | transferId | Checksum mismatch |
| `ft_send_blocked_extension` | warn | fileName, reason | Blocked file type |

### clipboard

| Action | Level | Payload | Description |
|--------|-------|---------|-------------|
| `cb_sync_enabled` | info | enabled | Sync toggled |
| `cb_sent` | info | contentHash, sizeBytes | Clipboard sent |
| `cb_received` | info | contentHash, sizeBytes | Clipboard received |
| `cb_send_failed` | warn | contentHash | Send failed |
| `cb_write_failed` | error | contentHash | Local write failed |
| `cb_conflict_ignored` | warn | contentHash, reason | Conflict resolved |
| `cb_receive_invalid` | warn | contentHash | Invalid data received |

### input

| Action | Level | Payload | Description |
|--------|-------|---------|-------------|
| `in_permission_granted` | info | grantedBy | Control granted |
| `in_permission_revoked` | info | reason | Control revoked |
| `in_emergency_stop` | warn | — | E-stop activated |
| `in_emergency_stop_cleared` | info | — | E-stop cleared |
| `in_executor_changed` | info | executor | Real executor enabled |
| `in_executor_reset` | info | — | Reset to no-op |
| `in_invalid_event` | warn | type, reason | Validation failed |
| `in_rate_limited` | warn | type | Rate limit hit |
| `in_execute_error` | error | type, error | Execution error |
| `in_dropped_all` | warn | reason | Bulk drop event |

### connection

| Action | Level | Payload | Description |
|--------|-------|---------|-------------|
| `conn_disconnect_detected` | warn | lastStableConnection | Disconnect detected |
| `conn_ice_restart_initiated` | info | attempt | ICE restart started |
| `conn_reconnect_recovered` | info | attempts, durationMs | Reconnection success |
| `conn_reconnect_failed` | error | attempts | Reconnection failed |
| `conn_reconnect_user_initiated` | info | — | User triggered reconnect |

### security

| Action | Level | Payload | Description |
|--------|-------|---------|-------------|
| `sec_device_registered` | info | deviceName | Trusted device added |
| `sec_device_removed` | info | deviceName | Trusted device removed |
| `sec_device_mismatch` | high | deviceId | Fingerprint mismatch |
| `sec_brute_force_detected` | critical | — | Too many failed attempts |

## Payload Sanitization Rules

1. **Never include**: Passwords, tokens, clipboard text, file paths, file contents
2. **Truncate**: Strings > 256 characters
3. **Hash**: Content identifiers use SHA-256
4. **Strip**: Internal fields prefixed with `_`
5. **Redact**: IP addresses, UUIDs, emails in text fields

## Transport

- Desktop client queues events in memory
- Flushed to API via Socket.IO or HTTP batch endpoint
- If transport unavailable, queued for retry (max 3 attempts)
- Queue drops oldest events at 1000 entry capacity
