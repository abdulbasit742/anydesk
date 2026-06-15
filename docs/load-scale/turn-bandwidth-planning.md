# TURN Bandwidth Planning

## Bandwidth per Session
| Quality | Video | Audio | Total |
|---------|-------|-------|-------|
| Low (480p) | 500 Kbps | 64 Kbps | ~600 Kbps |
| Medium (720p) | 1.5 Mbps | 128 Kbps | ~1.7 Mbps |
| High (1080p) | 4 Mbps | 128 Kbps | ~4.2 Mbps |

## Concurrent Sessions
| Sessions | Low Quality | Medium | High |
|----------|:-----------:|:------:|:----:|
| 10 | 6 Mbps | 17 Mbps | 42 Mbps |
| 50 | 30 Mbps | 85 Mbps | 210 Mbps |
| 100 | 60 Mbps | 170 Mbps | 420 Mbps |
| 500 | 300 Mbps | 850 Mbps | 2.1 Gbps |
| 1000 | 600 Mbps | 1.7 Gbps | 4.2 Gbps |

## Server Sizing
| Sessions | CPU | RAM | Network |
|----------|-----|-----|---------|
| 100 | 2 cores | 4 GB | 500 Mbps |
| 500 | 4 cores | 8 GB | 1 Gbps |
| 1000 | 8 cores | 16 GB | 5 Gbps |
| 5000 | 16 cores | 32 GB | 10 Gbps |

## Coturn Configuration for Scale
```
max-allocate-lifetime=3600
max-allocate-bandwidth=10000000
no-udp-relay
no-tcp-relay
```

## Monitoring
- Current allocations: `turnserver -l`
- Bandwidth usage: `iftop` / `vnstat`
- Packet loss: `dropwatch`
