# RemoteDesk Device Compliance Workflow

## Compliance Policies
```
Policy: Enforce OS Updates
  -> Check: OS version >= minimum
  -> Action: Block connection if non-compliant

Policy: Require Disk Encryption
  -> Check: BitLocker/FileVault enabled
  -> Action: Warn user, log incident

Policy: Anti-virus Present
  -> Check: AV software running
  -> Action: Block unattended access only
```

## Compliance States
| State | Description | User Impact |
|-------|-------------|-------------|
| Compliant | All checks pass | Full access |
| Warning | Minor issue | Access allowed, warning shown |
| Non-compliant | Critical issue | Access blocked |
| Unknown | Check failed | Access restricted |
| Exempt | Admin override | Full access, flagged |

## Check Execution
- Checks run every 15 minutes
- Results cached for 5 minutes
- Checks execute locally (privacy-preserving)
- Results sent encrypted to server

## Non-compliance Remediation
1. User notified on connection attempt
2. Self-service remediation guide shown
3. IT ticket auto-created (if configured)
4. Grace period: 24 hours for critical, 7 days for warning

## API
```
GET  /api/v1/devices/:id/compliance    - Get compliance state
POST /api/v1/devices/:id/exempt        - Create exemption
GET  /api/v1/compliance/reports        - Compliance report
```
