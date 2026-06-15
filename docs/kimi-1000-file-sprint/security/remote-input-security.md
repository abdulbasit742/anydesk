# Remote Input Security

## Threat Model

Remote input is the highest-risk feature in RemoteDesk. This document outlines the security controls.

## Attack Vectors

1. **Unauthorized input** - Attacker gains input without permission
2. **Privilege escalation** - Input used to gain system access
3. **Session hijacking** - Attacker takes over active session
4. **Keylogging** - Malicious capture of host keystrokes

## Controls

| Control | Status | Description |
|---------|--------|-------------|
| Permission gate | Implemented | Host must explicitly enable |
| Auto-revoke | Implemented | Disabled on disconnect |
| Dangerous shortcut block | Implemented | Blocks Alt+F4, Ctrl+Alt+Del |
| Dry-run adapter | Implemented | Safe fallback for missing native deps |
| Input validation | Implemented | Coordinates clamped 0-1 |
| Emergency stop | Implemented | One-click revoke all |
| Audit logging | Implemented | All input events logged |

## Dry-Run Adapter

When native input libraries are unavailable, the system logs events without executing them. This is clearly marked with [DRY-RUN] prefix in logs.

## Future Enhancements

- Keystroke pattern analysis for anomaly detection
- Time-based permission expiry
- Input sandboxing for untrusted connections
