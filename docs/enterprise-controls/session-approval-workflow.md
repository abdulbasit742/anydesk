# RemoteDesk Session Approval Workflow

## Approval Types
| Type | When Required | Approver |
|------|---------------|----------|
| Host-initiated | Policy requires approval | Designated approver |
| Unattended | Always requires approval | Device owner or admin |
| After-hours | Outside business hours | Security team |
| Elevated | Admin-level remote input | Security admin |
| External | Guest/external user | Session owner |

## Workflow
```
Session Requested
  -> Check policy
    -> If auto-approve: proceed
    -> If requires approval:
      -> Notify approver (push/email/SMS)
      -> Approver reviews session details
      -> Approver approves/rejects
      -> If approved: session proceeds
      -> If rejected: requester notified
      -> If timeout (15 min): auto-reject
```

## Approval UI Elements
- Requester identity and desk ID
- Requested permissions (input, file, clipboard)
- Session duration estimate
- Risk score (based on device, user, time)
- Approve / Reject / Escalate buttons

## Emergency Override
- Security admins can force-approve
- Override is heavily audit-logged
- Post-incident review required within 24h
- Auto-notify security team on override

## Configuration
```typescript
interface ApprovalConfig {
  enabled: boolean;
  approverRoles: string[];
  timeoutMinutes: number;
  escalationEnabled: boolean;
  emergencyOverrideEnabled: boolean;
  requireJustification: boolean;
}
```
