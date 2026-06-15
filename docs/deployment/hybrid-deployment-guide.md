# RemoteDesk Hybrid Deployment Guide

## Architecture
```
On-Prem                      Cloud
[Session Hosts] <---VPN---> [Control Plane]
[Internal DB]             [Analytics]
[Coturn]                  [Email/SMS]
```

## Data Flow
| Data Type | Location | Notes |
|-----------|----------|-------|
| Session metadata | Cloud | For dashboard |
| Session content | On-prem | Never leaves premises |
| User data | On-prem | Primary store |
| Analytics | Cloud | Aggregated only |
| Audit logs | Both | Full on-prem, summary in cloud |

## VPN Requirements
- Site-to-site VPN between on-prem and cloud
- Latency < 100ms for signaling
- Bandwidth: 10Mbps minimum

## Configuration
```yaml
# Control plane in cloud
control_plane:
  location: cloud
  url: https://cloud.remotedesk.io

# Session hosts on-prem
session_hosts:
  location: on-prem
  coturn_internal: turn://10.0.0.10:3478

# Metadata sync
sync:
  direction: on-prem-to-cloud
  frequency: real-time
  encryption: AES-256
```
