# Emergency Procedures

## Emergency Stop

### When to Use
- Unwanted remote control activity
- Suspicious input from connected peer
- Any security concern during session
- Accidental permission grant

### How to Trigger

**Host**:
1. Click red "EMERGENCY STOP" button in bottom-right corner
2. Click again to confirm within 3 seconds
3. Or use keyboard shortcut: `Ctrl+Shift+Escape` (customizable)

**Viewer**:
1. Click red "EMERGENCY STOP" button in session toolbar
2. Click again to confirm within 3 seconds

### What Happens
1. All remote input immediately disabled
2. All pressed keys released on host
3. All permissions revoked (input, clipboard, file transfer)
4. Pending permission requests cleared
5. Visual indicator shows "Emergency Stop Active"
6. Data channel optionally closed (configurable)

### Recovery
1. Host must explicitly re-enable permissions individually
2. Emergency stop state persists for duration of session
3. New session required to fully reset emergency stop

## Session Termination

### Normal Termination
1. Click "Disconnect" button
2. Graceful cleanup:
   - Release all keys
   - Reset mouse position (optional)
   - Clear all permissions
   - Close data channels
   - Disconnect WebRTC

### Forced Termination
1. Close application window
2. Process exit handles cleanup via `disposeInputExecutor()`

## Post-Incident Steps

1. **Check audit log**: Review `PermissionAuditLog` for activity during incident
2. **Review file transfers**: Check `TransferStore` for any completed transfers
3. **Report**: Document incident for security review
4. **Change device password**: If compromise suspected

## Contact

| Issue | Contact |
|-------|---------|
| Security incident | security@remotedesk.io |
| Technical support | support@remotedesk.io |
| Emergency hotline | +1-800-REMOTEDESK |

## Runbook for Common Scenarios

### Scenario: Host Reports Unwanted Control

```
1. Confirm emergency stop was triggered
2. Check audit log for permission grants
3. Verify who granted permission (should be host)
4. If permission granted by host: user education
5. If no grant in audit log: security incident - escalate
```

### Scenario: Suspicious File Transfer

```
1. Check transfer log for recent transfers
2. If transfer completed:
   - Locate file on disk
   - DO NOT OPEN
   - Submit to security team for analysis
3. If transfer pending:
   - Reject immediately
   - Revoke file transfer permission
4. Check filename against known malware signatures
```

### Scenario: Clipboard Data Leak Suspected

```
1. Check clipboard sync was enabled
2. Review clipboard history (if logging enabled)
3. Check if sensitive data was in clipboard during sync window
4. Disable clipboard sync
5. Clear local clipboard history
6. Reset any credentials that may have been exposed
```

## Recovery Checklist

- [ ] Emergency stop triggered
- [ ] Audit log reviewed
- [ ] Permissions reset to defaults
- [ ] If file transferred: file quarantined
- [ ] If clipboard synced: sensitive data assessed
- [ ] Session disconnected
- [ ] New session password set (if needed)
- [ ] Incident documented
- [ ] Security team notified (if applicable)
