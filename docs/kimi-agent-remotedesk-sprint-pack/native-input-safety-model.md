# RemoteDesk Desktop — Native Input Safety Model

**STATUS:** SAFE_DIRECT_COPY  
**LABEL:** SAFE_DIRECT_COPY

## Core Principle

Native OS input execution is **disabled by default**. The host must explicitly grant remote control permission per session. No unattended or hidden control is possible.

## Default Executor: No-Op

The `NoOpExecutor` is the only executor enabled by default. It:
- Logs audit events for every input event received
- Never executes any native OS calls
- Is always safe to enable

## Enabling Remote Control

Remote control requires ALL of the following:

1. **Host action**: User clicks "Grant Remote Control" in the UI
2. **Explicit permission**: `permissionGate.grantPermission(hostUserId)` called
3. **No emergency stop**: `emergencyStopped` must be `false`
4. **Not auto-revoked**: Permission granted within `autoRevokeMinutes` (default 30)
5. **Active session**: Session must be active

## Input Pipeline

Every remote input event flows through this pipeline:

```
Incoming Event
     |
     v
[Format Validation]      ← Rejects invalid coords, unknown types, blocked keys
     |
     v
[Permission Gate]        ← Checks permission granted + no emergency stop
     |
     v
[Rate Limiter]           ← Token bucket: 60 events/s, 30 mouse moves/s, 20 keys/s
     |
     v
[Executor]               ← NoOpExecutor (default) or platform executor (opt-in)
```

## Validation Rules

### Rejected Events
- Coordinates outside [0, 1] range
- Unknown event types
- Mouse buttons other than 0 (left), 1 (middle), 2 (right)
- Key codes outside [0, 255]
- Windows/Super keys (91, 92)
- Ctrl+Alt+Del combination
- Events older than 30 seconds or more than 5 seconds in the future

### Blocked Keys
- 91: Left Windows
- 92: Right Windows
- 124: Sleep

## Rate Limiting

| Event Type | Max Rate | Burst |
|-----------|----------|-------|
| All events | 60/s | 10 |
| Mouse move | 30/s | 10 |
| Keyboard | 20/s | 10 |

Burst cooldown: 1000ms after exhaustion

## Emergency Stop

The emergency stop:
- Immediately revokes all input permissions
- Sets `emergencyStopped = true`
- Cannot be overridden without clearing the stop first
- Does NOT automatically re-enable input when cleared
- Triggers audit event `in_emergency_stop`

## Permission State

```typescript
interface InputPermissionState {
  granted: boolean;          // false by default
  grantedAt: string | null;  // ISO timestamp
  grantedBy: string | null;  // host user ID
  emergencyStopped: boolean; // false by default
  autoRevokeMinutes: number; // 30 minutes
}
```

## Audit Events

| Event | Trigger |
|-------|---------|
| `in_permission_granted` | Host grants remote control |
| `in_permission_revoked` | Permission revoked or expired |
| `in_emergency_stop` | Emergency stop activated |
| `in_emergency_stop_cleared` | Emergency stop cleared |
| `in_executor_changed` | Real executor enabled |
| `in_executor_reset` | Reset to no-op |
| `in_invalid_event` | Validation failed |
| `in_rate_limited` | Rate limit exceeded |
| `in_execute_error` | Execution failure |
| `in_dropped_all` | All input dropped (disconnect/permission loss) |

## Platform Executor Placeholders

Real platform executors (robotjs, nut.js) exist as placeholder modules but:
- Are **not imported by default**
- Require explicit `setExecutor()` call
- Must only be called after user consent flow
- Are disabled in build until explicitly enabled
