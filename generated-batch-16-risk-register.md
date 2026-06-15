# Risk Register

## Active Risks

### R1: Webhook Delivery Reliability
**Likelihood**: Medium | **Impact**: Medium
**Description**: In-memory webhook delivery will lose events on restart.
**Mitigation**: Migrate to Redis-backed queue before production.
**Owner**: Backend team

### R2: Incomplete Load Testing
**Likelihood**: High | **Impact**: Medium
**Description**: Load test scripts exist but not validated in CI.
**Mitigation**: Set up k6 Cloud or local k6 runner in CI pipeline.
**Owner**: QA team

### R3: No Penetration Testing
**Likelihood**: Medium | **Impact**: High
**Description**: No third-party security assessment completed.
**Mitigation**: Schedule penetration test with approved vendor.
**Owner**: Security team

### R4: Mobile App Not Implemented
**Likelihood**: High | **Impact**: Medium
**Description**: Mobile is architecture docs only.
**Mitigation**: Begin React Native viewer MVP development.
**Owner**: Mobile team

### R5: Compliance Documentation Gap
**Likelihood**: Low | **Impact**: High
**Description**: Templates exist but not filled with actual data.
**Mitigation**: Complete evidence collection before audit.
**Owner**: Compliance officer

### R6: Performance at Scale
**Likelihood**: Medium | **Impact**: Medium
**Description**: WebRTC signaling may bottleneck with >10k concurrent.
**Mitigation**: Horizontal scaling with Redis adapter for Socket.IO.
**Owner**: Infrastructure team

## Risk Matrix
| Risk | Likelihood | Impact | Score | Priority |
|------|-----------|--------|-------|----------|
| R1 | M | M | 6 | Medium |
| R2 | H | M | 9 | High |
| R3 | M | H | 12 | Critical |
| R4 | H | M | 9 | High |
| R5 | L | H | 6 | Medium |
| R6 | M | M | 6 | Medium |
