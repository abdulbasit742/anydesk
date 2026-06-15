# RemoteDesk Service Level Objectives

## API SLOs
| SLO | Target | Measurement | Window |
|-----|--------|-------------|--------|
| Availability | 99.95% | Successful requests / Total | 30 days |
| Latency (p50) | < 100ms | Request duration | 30 days |
| Latency (p95) | < 500ms | Request duration | 30 days |
| Error Rate | < 0.1% | 5xx responses / Total | 30 days |

## WebSocket SLOs
| SLO | Target | Measurement | Window |
|-----|--------|-------------|--------|
| Connection Success | 99.9% | Successful connects / Attempts | 30 days |
| Message Delivery | 99.99% | Delivered / Sent | 30 days |
| Latency (p95) | < 100ms | Round-trip time | 7 days |

## WebRTC SLOs
| SLO | Target | Measurement | Window |
|-----|--------|-------------|--------|
| Connection Establishment | 95% | Connected within 10s | 30 days |
| Frame Rate | > 15fps | Frames per second | 7 days |
| Disconnect Rate | < 2% | Unexpected disconnects | 30 days |

## TURN SLOs
| SLO | Target | Measurement | Window |
|-----|--------|-------------|--------|
| Allocation Success | 99.9% | Successful allocations | 30 days |
| Bandwidth | > 90% | Actual / Requested | 7 days |

## Dashboard SLOs
| SLO | Target | Measurement | Window |
|-----|--------|-------------|--------|
| Page Load (p95) | < 3s | Time to interactive | 7 days |
| API Error Visibility | 100% | Errors appear in dashboard | 1 day |
