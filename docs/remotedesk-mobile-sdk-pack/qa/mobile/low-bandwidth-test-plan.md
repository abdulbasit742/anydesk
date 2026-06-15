# Low Bandwidth Mobile Test Plan

## Tools
- Network Link Conditioner (iOS)
- Charles Proxy throttling
- Android emulator network speed

## Scenarios
| Profile | Down | Up | Latency | Loss |
|---------|------|-----|---------|------|
| 3G | 1 Mbps | 0.5 Mbps | 300ms | 0% |
| Edge | 250 kbps | 100 kbps | 600ms | 2% |
| Satellite | 5 Mbps | 1 Mbps | 800ms | 1% |
| Congested | 10 Mbps | 5 Mbps | 50ms | 5% |

## Pass Criteria
- [ ] Connection establishes within 15s on 3G.
- [ ] Video renders at >= 5fps on Edge.
- [ ] UI remains responsive (input < 500ms).
- [ ] Auto-quality drops to fair/poor without crash.
- [ ] Reconnects successfully after 10s blackout.
