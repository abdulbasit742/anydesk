# Metrics Reference

| Metric | Type | Labels | Description |
|--------|------|--------|-------------|
| api_requests_total | Counter | method, path, status | Total API requests |
| api_duration_seconds | Histogram | method, path | Request duration |
| webrtc_connections | Gauge | state | Active WebRTC connections |
| sessions_active | Gauge | - | Active sessions |
| turn_allocations | Gauge | - | TURN allocations |
