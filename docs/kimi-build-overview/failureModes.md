# Failure Modes and Recovery

## Remote Input Failures

### Stuck Keys

**Symptom**: Keys remain pressed on host after disconnect
**Root Cause**: `keyup` event lost during network disruption
**Detection**: Host observes unexpected repeated keystrokes
**Recovery**:
1. Emergency stop (releases all tracked keys)
2. Automatic reset on disconnect event
3. Host can manually press/release the stuck key

**Prevention**: 
- Track pressed keys in `AbstractInputExecutor`
- Auto-release all on `peer:disconnected` event
- Periodic ping/pong to detect stale sessions

### Runaway Mouse

**Symptom**: Mouse moves uncontrollably across host screen
**Root Cause**: Malicious or malfunctioning viewer; velocity limit bypass
**Detection**: Velocity exceeds `maxMouseVelocity` threshold
**Recovery**:
1. Emergency stop immediately
2. Check audit log for injection source
3. Revoke remote input permission

### Coordinate Mapping Failure

**Symptom**: Mouse clicks don't hit intended targets
**Root Cause**: `object-fit` mode mismatch; wrong `remoteDimensions`
**Detection**: Click test pattern fails
**Recovery**:
1. Refresh remote dimensions from video metadata
2. Re-sync with host on dimension change

## Permission System Failures

### Desync

**Symptom**: Viewer thinks permission granted, host thinks denied
**Root Cause**: Message loss in data channel
**Detection**: Permission check mismatch
**Recovery**:
1. Periodic `PERMISSION_SYNC` messages
2. Viewer re-requests on operation denial
3. Host re-broadcasts on state change

### Audit Log Overflow

**Symptom**: Memory growth over long sessions
**Root Cause**: Unlimited audit log growth
**Recovery**:
1. Automatic ring buffer (max 10000 entries)
2. Export log to disk for long sessions

## Clipboard Failures

### Echo Loop

**Symptom**: Same text keeps bouncing between peers
**Root Cause**: Conflict resolution failure
**Detection**: Same hash received within debounce window
**Recovery**:
1. `WriteTracker` records last write hash
2. Echo detection rejects matching inbound hash

### Binary Content Leak

**Symptom**: Binary data in clipboard sync
**Root Cause**: Clipboard API returns non-text data
**Recovery**:
1. Null byte detection in validation
2. Reject content with >50% non-printable characters

## File Transfer Failures

### Corrupted File

**Symptom**: Received file doesn't match sent file
**Root Cause**: Chunk loss or corruption
**Detection**: Final SHA-256 hash mismatch
**Recovery**:
1. Per-chunk hash verification
2. Request missing chunks via `getMissingSequences()`
3. Full re-transfer if chunk recovery fails

### Disk Full

**Symptom**: Transfer fails mid-way
**Root Cause**: Insufficient disk space for temp + final file
**Detection**: Write error on `fs.write`
**Recovery**:
1. Pre-check available disk space
2. Atomic write (temp file + rename)
3. Cleanup temp file on failure

### Path Traversal Attempt

**Symptom**: Filename contains `../` or absolute path
**Root Cause**: Malicious sender
**Recovery**:
1. `sanitizeFilename` strips all path components
2. Main process validates final path
3. Log attempt to audit log

## Network-Related Failures

### Data Channel Closed

**Symptom**: All remote features stop working
**Root Cause**: WebRTC connection lost
**Recovery**:
1. Fall back to signaling channel for critical messages
2. Auto-reconnect via ICE restart
3. Show connection status to user

### Message Flood

**Symptom**: UI freezes; high CPU/memory
**Root Cause**: Malicious peer sends excessive messages
**Recovery**:
1. Rate limiter on all data channel handlers
2. Drop messages over threshold
3. Optionally disconnect peer
