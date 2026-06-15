# Manual QA Checklist

## Pre-Release QA

### Remote Input Control

- [ ] **Default State**: Remote input is DISABLED when session starts
- [ ] **Enable Flow**: Host can enable remote control via toggle
- [ ] **Disable Flow**: Host can disable remote control via toggle
- [ ] **Mouse Move**: Viewer mouse movement reflects on host
- [ ] **Mouse Click**: Viewer clicks register on host
- [ ] **Mouse Scroll**: Viewer scroll events work on host
- [ ] **Keyboard**: Viewer keystrokes register on host
- [ ] **Modifier Keys**: Ctrl, Alt, Shift work correctly
- [ ] **Throttle**: Rapid mouse movement doesn't flood the channel
- [ ] **Normalization**: Mouse maps correctly regardless of window size
- [ ] **Object-Fit**: Mouse works with `contain`, `cover`, `fill` modes
- [ ] **Blocked Keys**: OS shortcuts (Cmd+Q, Ctrl+T) don't forward
- [ ] **Dangerous Keys**: Power/Sleep keys are blocked
- [ ] **Emergency Stop**: Button visible to both parties
- [ ] **Emergency Stop Works**: Stops all input immediately
- [ ] **Emergency Stop Confirmation**: Requires double-click to prevent accidents
- [ ] **Post-Emergency**: Re-enabling requires explicit toggle
- [ ] **Disconnect**: All keys released on disconnect
- [ ] **Visual Indicator**: Host sees indicator when control is active

### Permission System

- [ ] **Default Denied**: All permissions start as DENIED
- [ ] **Prompt Dialog**: Permission request shows consent modal
- [ ] **Grant**: Host can grant permission
- [ ] **Deny**: Host can deny permission
- [ ] **Block**: Host can block (permanently deny) permission
- [ ] **Revoke**: Host can revoke granted permission
- [ ] **Auto-Deny**: Request auto-denied after timeout (30s)
- [ ] **Audit Log**: All permission changes appear in audit log
- [ ] **Emergency Stop**: Revokes ALL permissions
- [ ] **Sync**: Permission state syncs between peers

### Clipboard Sync

- [ ] **Default Off**: Clipboard sync disabled by default
- [ ] **Toggle**: Can enable/disable via UI toggle
- [ ] **Text Only**: Binary clipboard content rejected
- [ ] **Send**: Local clipboard text syncs to remote
- [ ] **Receive**: Remote clipboard text syncs to local
- [ ] **No Echo**: Our own writes don't echo back
- [ ] **Conflict**: Concurrent edits resolved correctly
- [ ] **Size Limit**: Content over 1MB rejected
- [ ] **Debounce**: Rapid clipboard changes don't flood channel
- [ ] **Disabled State**: No clipboard traffic when disabled

### File Transfer

- [ ] **Consent Dialog**: Incoming file shows dialog with details
- [ ] **Accept**: Can accept incoming file
- [ ] **Reject**: Can reject incoming file
- [ ] **Auto-Reject**: File auto-rejected after timeout (60s)
- [ ] **Extension Block**: .exe, .dll, .bat blocked
- [ ] **Dangerous Warning**: Warning for executable file types
- [ ] **Progress Bar**: Shows transfer progress
- [ ] **Pause/Resume**: Can pause and resume transfer
- [ ] **Cancel**: Can cancel active transfer
- [ ] **Complete**: File saved to chosen location
- [ ] **Hash Verify**: SHA-256 shown and verified
- [ ] **Size Limit**: Files over 100MB rejected
- [ ] **Filename Sanitize**: Path traversal removed
- [ ] **No Renderer FS**: All file ops go through IPC

### Emergency Procedures

- [ ] **Emergency Stop Button**: Visible and accessible
- [ ] **Double-Click Required**: Can't trigger accidentally
- [ ] **Immediate Effect**: Input stops within 100ms
- [ ] **Key Release**: All virtual keys released
- [ ] **Permission Reset**: All permissions revoked
- [ ] **Session Optional**: Can end session or keep connected
- [ ] **Both Sides**: Either party can trigger

### Edge Cases

- [ ] **Rapid Connect/Disconnect**: No stuck keys or permissions
- [ ] **Network Loss**: Graceful degradation
- [ ] **Large Resolution**: 4K remote screen works
- [ ] **Multi-Monitor**: Remote with multiple displays
- [ ] **Unicode**: Non-ASCII text in clipboard
- [ ] **Empty Clipboard**: Handles empty clipboard gracefully
- [ ] **Very Long Filename**: Filename truncated safely
- [ ] **Zero-Byte File**: Zero-byte files handled

### Performance

- [ ] **Mouse Latency**: < 50ms perceived latency
- [ ] **Throttle Working**: CPU usage stable during rapid movement
- [ ] **Memory Stable**: No memory leaks during 1-hour session
- [ ] **File Transfer Speed**: Reasonable throughput (> 1MB/s)
