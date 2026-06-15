# Security Incident Runbook

## Severity Classification
| Level | Examples |
|-------|----------|
| Critical | Data breach, RCE, active exploitation |
| High | Auth bypass, privilege escalation |
| Medium | Vulnerability with no known exploit |
| Low | Policy violation, misconfiguration |

## Immediate Actions (First 15 minutes)
1. **Isolate**: Disable affected accounts/services
2. **Preserve**: Save logs before rotation
3. **Assess**: Determine scope of compromise
4. **Notify**: Security team, legal if needed

## Investigation
- Review audit logs
- Check access patterns
- Identify entry point
- Determine data accessed

## Containment
- Revoke compromised credentials
- Block malicious IPs
- Disable vulnerable features
- Force password resets

## Eradication
- Patch vulnerability
- Remove attacker access
- Fix misconfiguration
- Update security controls

## Recovery
- Restore from clean backups if needed
- Verify system integrity
- Gradual service restoration
- Enhanced monitoring

## Post-Incident
- Post-mortem within 48 hours
- Update security controls
- Notify affected parties (GDPR if needed)
- Regulatory reporting if required

## Contacts
- Security Team: security@remotedesk.io
- Legal: legal@remotedesk.io
- External IR: [retainer firm]
- Law enforcement: [if required]
