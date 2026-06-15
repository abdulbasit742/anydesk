# General Incident Runbook

## Severity Levels
| Level | Description | Response Time |
|-------|-------------|---------------|
| P1 | Service down / data loss | 5 min |
| P2 | Major feature degraded | 30 min |
| P3 | Minor feature issue | 2 hours |
| P4 | Question / documentation | 24 hours |

## Response Steps

### 1. Detect
- Alert from monitoring
- Customer report
- Team member report

### 2. Triage (5 min)
- Assess severity
- Identify scope
- Create incident channel
- Page on-call if P1/P2

### 3. Communicate (10 min)
- Update status page
- Notify stakeholders
- Create incident doc

### 4. Mitigate
- Find workaround
- Apply hotfix if available
- Scale resources if needed
- Enable feature flags

### 5. Resolve
- Deploy fix
- Verify resolution
- Monitor stability

### 6. Post-Incident
- All clear announcement
- Schedule post-mortem
- Update runbooks

## Communication Template
```
Incident: [Brief description]
Severity: P1/P2/P3/P4
Impact: [What's affected]
Started: [Time]
Status: Investigating/Mitigating/Resolved

Updates:
[Time] - [Update]
```
