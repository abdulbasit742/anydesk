# Input Diagnostics

**Status:** SAFE_DIRECT_COPY  
**Last Updated:** 2026-06-12  
**Scope:** Privacy-Safe Diagnostics and Support Bundle Generation

---

## Privacy Principles

### What We Log
- Command types (e.g., "mouse move", "key press")
- Approximate screen regions (rounded to nearest 100px)
- Execution timing (performance metrics)
- Permission states (boolean flags only)
- Error codes (not error messages with data)

### What We Never Log
- Typed text or passwords
- Exact mouse coordinates (only regions)
- Clipboard contents
- Window titles or application names
- File paths
- Network addresses (beyond session ID)

---

## Diagnostics Counters

### Input Counters
| Counter | Description |
|---------|-------------|
| totalCommandsReceived | Total commands received from viewer |
| totalCommandsExecuted | Successfully executed commands |
| totalCommandsBlocked | Blocked by any mechanism |
| totalCommandsFailed | Failed during execution |
| blockedByPermission | Blocked due to missing permission |
| blockedByEmergencyStop | Blocked due to emergency stop |
| blockedByRateLimit | Blocked due to rate limiting |

### Rate Limit Counters
| Counter | Description |
|---------|-------------|
| totalChecks | Total rate limit checks performed |
| allowed | Commands allowed through |
| blocked | Commands blocked by rate limit |
| currentThrottledSessions | Currently throttled sessions |

### Session Counters
| Counter | Description |
|---------|-------------|
| totalSessions | Total sessions in current run |
| activeSessions | Currently active sessions |
| totalEmergencyStops | Emergency stop trigger count |

---

## Support Bundle Format

```json
{
  "metadata": {
    "generatedAt": 1718208000000,
    "version": "1.0.0",
    "platform": "win32",
    "arch": "x64"
  },
  "counters": { ... },
  "recentEvents": [ ... ],
  "rateLimitConfig": { ... },
  "executor": {
    "type": "noop",
    "platform": "win32",
    "ready": true
  },
  "emergencyStops": [ ... ],
  "permissionSummary": {
    "totalChanges": 5,
    "sessionsWithInputEnabled": 1
  }
}
```

---

## Generating Support Bundles

```typescript
import { getInputDiagnostics } from './inputDiagnostics';

const diagnostics = getInputDiagnostics();
const bundle = diagnostics.generateSupportBundle();

// Export as JSON file
const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
```

---

## Retention Policy

- Audit events: 10,000 most recent (in-memory)
- Support bundles: Generated on-demand
- No persistent storage without user consent
- Auto-purge on application exit
