# Permission Security Model

## Principles
1. **Deny by default**: All features require explicit permission
2. **Least privilege**: Grant only what's needed
3. **User control**: User can revoke at any time
4. **Audit everything**: All permission changes logged
5. **Time-bound**: Session permissions auto-expire

## Threat Mitigation
- Malicious remote input blocked without consent
- Clipboard data leakage prevented
- Unauthorized file transfers blocked
- Unattended access requires setup approval

## Implementation
- Permissions stored per-device
- IPC for main/renderer coordination
- Server-side audit logging
- Reset on disconnect prevents stale permissions
