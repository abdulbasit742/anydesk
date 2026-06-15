# Clipboard Sync QA Checklist

This checklist outlines the quality assurance steps for the RemoteDesk clipboard synchronization feature.

## Functional Tests

- [ ] Verify clipboard sync is disabled by default on both host and viewer.
- [ ] Verify host can enable clipboard sync.
- [ ] Verify viewer can enable clipboard sync.
- [ ] Verify clipboard sync only activates when both host and viewer have opted-in.
- [ ] Verify text copied on host appears on viewer's clipboard when enabled.
- [ ] Verify text copied on viewer appears on host's clipboard when enabled.
- [ ] Verify clipboard sync stops if host disables it.
- [ ] Verify clipboard sync stops if viewer disables it.
- [ ] Verify clipboard sync status badge/indicator correctly reflects the state (Disabled, Pending Host, Pending Viewer, Enabled).
- [ ] Verify clipboard warning banner appears when sync is disabled or pending.
- [ ] Verify copying large text (e.g., 500KB, 1MB) works correctly within limits.
- [ ] Verify copying text exceeding `MAX_CLIPBOARD_TEXT_SIZE_BYTES` fails gracefully and does not sync.
- [ ] Verify duplicate clipboard content is not re-sent/re-processed unnecessarily.
- [ ] Verify in-session chat functionality is not affected by clipboard sync state.
- [ ] Verify clipboard content is correctly synchronized across different operating systems (if applicable, e.g., Windows host, macOS viewer).

## Security Tests

- [ ] Attempt to bypass clipboard sync permission toggles.
- [ ] Attempt to send malformed clipboard messages to crash the application or gain unauthorized access.
- [ ] Verify renderer process cannot directly access system clipboard.
- [ ] Verify all clipboard operations are mediated via Electron main process.
- [ ] Verify clipboard content is sanitized (if any non-text content were to be introduced).
- [ ] Verify no sensitive data is logged unnecessarily during clipboard operations.

## Performance Tests

- [ ] Measure latency for small text transfers.
- [ ] Measure latency for large text transfers (within limits).
- [ ] Monitor CPU/memory usage during active clipboard sync.
- [ ] Verify application remains responsive during clipboard sync.

## Edge Cases & Error Handling

- [ ] Verify behavior when network connection is lost during sync.
- [ ] Verify behavior when one peer disconnects during sync.
- [ ] Verify error messages are user-friendly and informative.
- [ ] Verify clipboard history is cleared or handled appropriately on session end.
