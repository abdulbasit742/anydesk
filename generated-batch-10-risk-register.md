# Risk Register

## High Risks

### R1: Recording Backend Not Implemented
- **Impact**: High (feature advertised but not working)
- **Likelihood**: Certain (already known)
- **Mitigation**: Keep feature flag disabled, implement in next batch
- **Owner**: @platform-team

### R2: Desktop App Incomplete
- **Impact**: High (core product)
- **Likelihood**: Certain
- **Mitigation**: Web app works as fallback, prioritize desktop
- **Owner**: @desktop-team

### R3: TURN Server Not Deployed
- **Impact**: Medium (connectivity issues for some users)
- **Likelihood**: High
- **Mitigation**: Document workaround, deploy ASAP
- **Owner**: @devops-team

## Medium Risks

### R4: No Load Testing
- **Impact**: Medium (unknown scale limits)
- **Likelihood**: High
- **Mitigation**: Implement load testing before public launch
- **Owner**: @platform-team

### R5: Security Not Pen-Tested
- **Impact**: High (potential vulnerabilities)
- **Likelihood**: Medium
- **Mitigation**: Internal security review, schedule pen test
- **Owner**: @security-team

### R6: Browser Compatibility
- **Impact**: Medium (some users can't connect)
- **Likelihood**: Medium
- **Mitigation**: Test matrix, graceful degradation
- **Owner**: @web-team

## Low Risks

### R7: Documentation Gaps
- **Impact**: Low (developer friction)
- **Likelihood**: Low
- **Mitigation**: This batch addresses most gaps
- **Owner**: @docs-team

### R8: Mobile Experience
- **Impact**: Low (web app works)
- **Likelihood**: Low
- **Mitigation**: Mobile web improvements planned
- **Owner**: @web-team

## Risk Matrix
| Risk | Impact | Likelihood | Score |
|------|--------|-----------|-------|
| R1 | High | Certain | 12 |
| R2 | High | Certain | 12 |
| R3 | Medium | High | 8 |
| R4 | Medium | High | 8 |
| R5 | High | Medium | 8 |
| R6 | Medium | Medium | 6 |
| R7 | Low | Low | 2 |
| R8 | Low | Low | 2 |
