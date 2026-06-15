# Performance Test Plan

## Scenarios
- 100 concurrent sessions
- 1000 API requests/minute
- WebSocket 10k connections

## Tools
- k6 for API
- Artillery for WebSocket
- Custom for WebRTC

## Acceptance
- p95 latency < 500ms
- Error rate < 0.1%
