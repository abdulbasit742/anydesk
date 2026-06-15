# RemoteDesk Alert Routing

## Severity Levels
| Severity | Response Time | Escalation | Channel |
|----------|--------------|------------|---------|
| Critical | 5 minutes | 15 min | PagerDuty + Slack #alerts-critical |
| Warning | 30 minutes | 2 hours | Slack #alerts-warning + Email |
| Info | None | None | Slack #alerts-info |

## Routing Rules
```yaml
groups:
  - name: api
    rules:
      - alert: APIHighErrorRate
        severity: critical
        annotations:
          runbook_url: https://wiki.remotedesk.io/runbooks/api-high-error-rate
          team: backend

      - alert: APIHighLatency
        severity: warning
        annotations:
          team: backend

  - name: webrtc
    rules:
      - alert: WebRTCConnectionFailure
        severity: critical
        annotations:
          team: media

      - alert: TURNAllocationFailure
        severity: warning
        annotations:
          team: infrastructure

  - name: infrastructure
    rules:
      - alert: DiskSpaceLow
        severity: warning
        annotations:
          team: sre

      - alert: DatabaseConnectionsHigh
        severity: critical
        annotations:
          team: sre
```

## On-call Rotations
- Primary: Backend team (weekly rotation)
- Secondary: SRE team (weekly rotation)
- Escalation: Engineering manager
