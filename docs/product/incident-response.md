# Incident Response Guide

## Severity Levels

### SEV1: Critical
- Complete service outage
- Data loss or corruption
- Security breach
- **Response**: All hands, immediate

### SEV2: Major
- Significant feature degradation
- Performance issues affecting many users
- Billing system down
- **Response**: On-call + relevant team, within 30 min

### SEV3: Minor
- Single feature issue
- UI/UX problems
- Non-critical bugs
- **Response**: Normal ticket queue

## Response Process

### 1. Detect
- Automated alerts (PagerDuty, etc.)
- User reports
- Monitoring dashboards

### 2. Assess
- Determine severity
- Identify scope
- Assign incident commander

### 3. Communicate
- Internal: Slack #incidents channel
- External: Status page update if SEV1/SEV2
- Customers: Email for data-affecting issues

### 4. Resolve
- Implement fix
- Verify resolution
- Monitor for recurrence

### 5. Post-Incident
- Write incident report within 24 hours
- Conduct blameless post-mortem
- Create action items
- Update runbook

## Communication Templates

### Status Page Update
```
Investigating: We are investigating reports of [issue].
Users may experience [impact]. We will provide updates as available.
```

### Resolution Update
```
Resolved: The issue has been resolved. All services are operating normally.
We will provide a post-mortem within 24 hours.
```

## Security Incidents
1. Immediately page security team
2. Preserve logs and evidence
3. Contain the breach
4. Assess data exposure
5. Notify affected users if required
6. Report to authorities if legally required
