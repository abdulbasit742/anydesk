# Escalation Matrix

## Levels

### L1: Support Agent
**Handles**:
- Account issues
- Basic troubleshooting
- Feature questions
- Billing inquiries

**Escalate to L2 when**:
- Technical investigation needed
- Bug confirmed
- Customer requests escalation
- Issue unresolved after 24h

### L2: Technical Support
**Handles**:
- Bug investigation
- Advanced troubleshooting
- Performance issues
- Integration questions

**Escalate to L3 when**:
- Code change required
- Security issue suspected
- Service degradation
- Issue unresolved after 48h

### L3: Engineering
**Handles**:
- Critical bugs
- Security incidents
- Infrastructure issues
- Complex code changes

**Escalate to On-call when**:
- P0 incident
- Security breach
- Service outage
- Data loss

## Escalation Paths
```
Customer -> L1 -> L2 -> L3 -> On-call
        \      /      /
         \    /      /
          Slack    PagerDuty
```

## Contact Methods
| Level | Channel | Response Time |
|-------|---------|---------------|
| L1 | Ticketing | 4h |
| L2 | Slack #support-l2 | 2h |
| L3 | Slack #engineering | 1h |
| On-call | PagerDuty | 15min |

## Escalation Criteria
Auto-escalate if:
- Customer mentions "urgent" or "critical"
- Enterprise customer (always L2 minimum)
- Security-related keywords detected
- Multiple tickets from same org
