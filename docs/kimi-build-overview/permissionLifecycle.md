# Permission Lifecycle

## Overview

Every permission starts at `denied` and must transition through explicit user action to become `granted`. No permission is ever granted automatically.

## State Diagram

```
                    ┌──────────────┐
         ┌─────────│   DENIED     │◄────────────────┐
         │         │  (default)   │                 │
         │         └──────┬───────┘                 │
         │                │ host enables            │ host disables
         │                ▼                         │ emergency stop
         │         ┌──────────────┐                 │
         │    ┌───►│   PROMPT     │────┐            │
         │    │    │ (ask first)  │    │            │
         │    │    └──────────────┘    │            │
         │    │           ▲            │            │
         │ deny           │ grant      │            │
         │    │           │            │            │
         │    │    ┌──────┴───────┐    │            │
         │    └───┘│   GRANTED    ├────┘            │
         │         │  (active)    │─────────────────┘
         │         └──────────────┘
         │
         │         ┌──────────────┐
         └────────►│ UNAVAILABLE  │
                   │(not supported│
                   └──────────────┘
```

## Permission Types

### Remote Input (`remoteInput`)

**Risk**: Critical - allows full control of host machine
**Default**: `denied`
**Enable requirements**:
1. Host clicks "Enable Remote Control" toggle
2. Visual indicator shows control is active
3. Emergency stop button visible

**Transitions**:
- `denied` → `granted`: Host clicks toggle ON
- `granted` → `denied`: Host clicks toggle OFF, or emergency stop
- `denied` → `prompt`: Host changes setting (future feature)

### Clipboard Sync (`clipboard`)

**Risk**: High - may expose sensitive clipboard data
**Default**: `denied`
**Enable requirements**:
1. Both sides must opt-in
2. Only TEXT content is synced
3. Size limited to 1MB

**Transitions**:
- `denied` → `granted`: Both sides enable toggle
- `granted` → `denied`: Either side disables

### File Transfer (`fileTransfer`)

**Risk**: High - may deliver malware
**Default**: `denied`
**Enable requirements**:
1. Receiver accepts each file individually
2. Dangerous extensions blocked
3. Filename sanitized

**Transitions**:
- `denied` → `granted`: Receiver accepts file offer
- `granted` → `denied`: Transfer completes or is cancelled

## Audit Events

Every permission transition generates an audit entry:

```typescript
interface PermissionAuditEntry {
  id: string;           // Unique ID
  timestamp: number;    // When it happened
  sessionId: string;    // Which session
  peerId: string;       // Who triggered it
  action: 'requested' | 'granted' | 'denied' | 'revoked' | 'expired' | 'emergency_stop';
  permission: PermissionType;
  details?: string;     // Human-readable context
}
```

## Security Invariants

1. **No automatic grants**: Permissions never transition to `granted` without explicit user action
2. **Revoke on disconnect**: All permissions reset to `denied` on session end
3. **Emergency stop wins**: Emergency stop overrides all permissions
4. **Audit completeness**: Every transition is logged
5. **Host authority**: Host can always revoke any granted permission

## Implementation Notes

- Permission state is managed by `permissionReducer` (pure function)
- Changes are synced over data channel via `PERMISSION_SYNC` messages
- Audit log is maintained in renderer state (not persisted by default)
- Emergency stop is handled as a special action that resets all permissions
