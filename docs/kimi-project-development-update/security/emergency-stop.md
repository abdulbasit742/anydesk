# Emergency Stop Safety Document

## Purpose

The Emergency Stop feature provides an immediate, unambiguous kill-switch that revokes all remote input permissions instantly. It is a critical safety feature that protects the host from unwanted remote control.

## Threat Model

### Scenarios Where Emergency Stop is Needed

1. **Unauthorized Access**: Viewer gains control without explicit permission
2. **Permission Escalation**: Viewer exploits a bug to bypass permission checks
3. **Social Engineering**: Host granted permission but viewer is malicious
4. **Accidental Grant**: Host enabled permission by mistake
5. **Session Hijacking**: Attacker intercepts an active session

### Safety Requirements

- Emergency stop MUST be immediately accessible during any active session
- Emergency stop MUST revoke ALL permissions instantly (< 50ms)
- Emergency stop MUST be visually prominent and unambiguous
- Emergency stop MUST NOT require confirmation (optionally with confirmation to prevent accidents)
- Emergency stop state MUST persist until explicitly cleared by host

## Behavior

### When Activated

1. **Immediate Revocation**: All input permissions (mouse, keyboard, clipboard, file transfer) set to `false`
2. **Emergency Flag Set**: `emergencyStopped` set to `true`
3. **Permission Lock**: No new permissions can be granted while emergency stop is active
4. **Visual Indication**: Full-screen overlay displayed with warning
5. **Audit Log**: Event logged with timestamp and trigger source

### When Cleared

1. **Emergency Flag Cleared**: `emergencyStopped` set to `false`
2. **Permissions Remain Revoked**: All permissions stay `false` - host must re-enable manually
3. **Session Continues**: Video/audio connection remains active
4. **Audit Log**: Clear event logged

### Recovery Flow

```
Emergency Stop Triggered
         |
    +----v----+
    | Overlay |
    | Shown   |
    +----+----+
         |
    +----v-----------+
    | Host chooses:  |
    | 1. Resume      | --> Permissions remain revoked
    | 2. End Session | --> Session terminated
    +----------------+
         |
    (If Resume)
         |
    +----v-------------------+
    | Host manually re-enables |
    | permissions via toggle   |
    +--------------------------+
```

## UI Requirements

### Emergency Stop Button

- **Color**: Red (#dc2626) - universally recognized as danger
- **Position**: Always visible during active session
- **Size**: Minimum 44x44px touch target (WCAG 2.5.5)
- **Label**: "EMERGENCY STOP" or universally recognized stop icon
- **Confirmation**: Optional two-click to prevent accidental activation

### Active State Overlay

- **Coverage**: Full screen modal overlay
- **Background**: Semi-transparent dark (rgba(0,0,0,0.85))
- **Content**: Clear warning message, trigger details, recovery options
- **Z-Index**: 9999 (above all other UI)
- **Animation**: Fade in 200ms

## Implementation

### Service

```typescript
const service = getEmergencyStopService();

// Trigger
service.trigger({
  triggeredBy: 'host',
  reason: 'Emergency stop activated by user',
  allSessions: true,
});

// Listen for changes
const unsubscribe = service.subscribe((event) => {
  console.log('Emergency stop:', event.triggeredBy, event.reason);
});

// Clear
service.clear('host');
```

### Permission Integration

```typescript
// Emergency stop action in permission reducer
// Automatically revokes all permissions:
{
  type: 'EMERGENCY_STOP',
  triggeredBy: 'host',
  reason: 'Emergency!'
}

// Permission grants are blocked during emergency:
if (state.emergencyStopped) return state; // No-op
```

## Testing

### Manual QA Checklist

- [ ] Button visible during active session
- [ ] Button triggers emergency stop on click
- [ ] All permissions revoked immediately (< 50ms)
- [ ] Overlay appears with correct information
- [ ] Cannot grant permissions while emergency active
- [ ] Clearing emergency stop keeps permissions revoked
- [ ] Can re-enable permissions manually after clear
- [ ] Emergency stop persists across permission state changes
- [ ] Works with both host and viewer trigger sources

### Automated Tests

- `emergencyStop.test.ts` - Service logic, subscription, state management
- `permissionReducer.test.ts` - Emergency stop action handling
- Integration tests - End-to-end trigger → revoke → clear flow

## Audit Requirements

Every emergency stop event MUST be logged:

```typescript
{
  event: 'emergency_stop',
  triggeredAt: 1700000000000,
  triggeredBy: 'host',
  reason: 'Emergency stop activated by user',
  sessionId: 'abc-123',
  permissionsBefore: { mouse: true, keyboard: true },
  permissionsAfter: { mouse: false, keyboard: false },
}
```

## References

- IEC 60947-5-5 (Emergency stop principles)
- ISO 13850 (Emergency stop design)
- WCAG 2.5.5 (Target Size)