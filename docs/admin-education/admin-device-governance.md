# Admin Device Governance Guide

## Device Management

### Viewing Devices
- Admin Dashboard -> Devices
- Filter by user, team, OS, trust status
- Sort by last seen, name, OS

### Trusting Devices
- Untrusted: Requires approval each session
- Trusted: Auto-approved for that user
- To trust: Select device -> "Trust Device"
- To revoke: Select device -> "Revoke Trust"

### Device Compliance
Compliance checks verify:
- OS version up to date
- Disk encryption enabled
- Firewall active
- No jailbreak/root

### Remote Actions
| Action | Effect | Audit Log |
|--------|--------|-----------|
| Revoke trust | Requires re-approval | Yes |
| Block device | Prevents all access | Yes |
| Wipe data | Remove org data only | Yes |
| Unregister | Remove from system | Yes |

## Policies

### Device Requirements
- Minimum OS versions
- Encryption required
- Corporate network for sensitive access
- Approved device types only

### Auto-Actions
- Auto-trust corporate devices
- Block non-compliant after grace period
- Notify user of compliance issues
- Create IT ticket for violations

## Monitoring
- New device alerts
- Compliance violations
- Unusual access patterns
- Inactive devices
