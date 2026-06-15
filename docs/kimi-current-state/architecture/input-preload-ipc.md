# Input Preload IPC Architecture

**Status:** SAFE_DIRECT_COPY  
**Last Updated:** 2026-06-12  
**Scope:** Electron Renderer to Main Process Communication for Native Input

---

## Security Model

### Threat: Renderer Compromise

If the renderer process is compromised (XSS, RCE in webpage content), the attacker gains access to the preload API.

**Mitigations:**
1. Preload API only accepts structured command objects - no raw shell commands
2. All commands are validated and sanitized in main process
3. Permission checks happen in main process, not renderer
4. Emergency stop can be triggered from renderer but requires confirmation to release
5. Audit logging captures all command attempts

### Threat: Man-in-the-Middle (Renderer to Main)

An attacker with local access might try to intercept IPC messages.

**Mitigations:**
1. IPC is intra-process (renderer to main within same application)
2. No network transmission for IPC
3. Command IDs enable audit trail reconstruction

---

## IPC Channel Reference

| Channel | Direction | Auth Required | Description |
|---------|-----------|---------------|-------------|
| `nativeInput:execute` | Renderer → Main | Active session | Execute input command |
| `nativeInput:getPermissions` | Renderer → Main | None | Read current permissions |
| `nativeInput:setPermissions` | Renderer → Main | Host only | Change permissions |
| `nativeInput:emergencyStop` | Renderer → Main | None | Trigger emergency stop |
| `nativeInput:releaseEmergencyStop` | Renderer → Main | Host only | Release emergency stop |
| `nativeInput:getEmergencyState` | Renderer → Main | None | Read emergency state |
| `nativeInput:onPermissionChange` | Main → Renderer | None | Permission update events |
| `nativeInput:onEmergencyStop` | Main → Renderer | None | Emergency stop events |
| `nativeInput:getExecutionStats` | Renderer → Main | Diagnostics role | Execution statistics |
| `nativeInput:getAuditLog` | Renderer → Main | Diagnostics role | Privacy-safe audit log |

---

## Data Flow

```
Renderer Process                    Main Process
--------------                    ------------
Remote Input Message
       │
       ▼
┌──────────────┐
│   Receiver   │  ──Parse/Sanitize──▶
│   Service    │
└──────┬───────┘
       │ NativeInputCommand
       ▼
┌──────────────┐
│   preload    │  ───ipcRenderer.invoke──▶
│    invoke    │
└──────────────┘
                                    ┌──────────────┐
                                    │  IPC Handler │
                                    └──────┬───────┘
                                           │
                                    ┌──────▼───────┐
                                    │   Validator  │
                                    └──────┬───────┘
                                           │
                                    ┌──────▼───────┐
                                    │  Permission  │
                                    │   Check      │
                                    └──────┬───────┘
                                           │
                                    ┌──────▼───────┐
                                    │ Rate Limiter │
                                    └──────┬───────┘
                                           │
                                    ┌──────▼───────┐
                                    │   Executor   │
                                    │   (no-op)    │
                                    └──────┬───────┘
                                           │
                                    ┌──────▼───────┐
                                    │  Audit Log   │
                                    └──────────────┘
```

---

## Renderer API Usage

```typescript
// Execute a command (checks permissions in main)
const result = await window.electronInput.executeCommand({
  type: 'mouse:move',
  commandId: crypto.randomUUID(),
  timestamp: Date.now(),
  sessionId: 'session-abc',
  sequenceNumber: 1,
  x: 100,
  y: 200,
  coordinateSystem: 'absolute',
});

if (!result.success) {
  console.error('Input blocked:', result.errorCode, result.message);
}

// Subscribe to permission changes
const unsub = window.electronInput.onPermissionChange((ctx) => {
  console.log('Permissions updated:', ctx.permissions);
});

// Trigger emergency stop
await window.electronInput.triggerEmergencyStop('User requested stop');
```

---

## Implementation Notes

### Why invoke (not send) for executeCommand?

`ipcRenderer.invoke` provides request/response semantics with built-in correlation. This ensures the renderer knows whether each command was accepted, blocked, or failed.

### Why expose emergency stop to renderer?

The emergency stop must be triggerable even when the renderer is in a bad state. Since the renderer detects the emergency stop condition (user presses hotkey), it must be able to signal main immediately.

### Why separate channels instead of one generic channel?

Separate channels enable fine-grained permission control and audit logging. Each channel can have different authorization requirements.
