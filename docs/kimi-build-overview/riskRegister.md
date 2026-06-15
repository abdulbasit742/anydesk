# Risk Register

## Active Risks

| ID | Risk | Likelihood | Impact | Score | Mitigation | Owner |
|----|------|-----------|--------|-------|------------|-------|
| R1 | Input velocity limits bypassed | Low | High | Medium | Hard caps in AbstractInputExecutor + audit | Platform team |
| R2 | Native module not available for platform | Medium | High | High | Graceful degradation + platform notes | Platform team |
| R3 | Clipboard leaks sensitive data | Medium | High | High | Opt-in + text-only + size limits | Security |
| R4 | File transfer delivers malware | Medium | Critical | High | Extension block + consent + hash check | Security |
| R5 | Emergency stop doesn't release keys | Low | Critical | Medium | Key tracking + reset on stop | Input team |
| R6 | Renderer escapes sandbox via file IPC | Low | Critical | High | Validate all paths in main process | Security |
| R7 | Permission audit log overflows | Medium | Low | Low | Ring buffer + max entry limits | Backend |
| R8 | Chunk reassembly corruption | Low | Medium | Low | Per-chunk hash verification | Transfer |
| R9 | Consent timeout too long | Low | Medium | Low | Configurable timeout (default 60s) | UX |
| R10 | Path traversal in filename | Low | Critical | Medium | Sanitizer + main process validation | Security |

## Risk Score Matrix

| | Low Impact | Medium Impact | High Impact | Critical Impact |
|---|-----------|--------------|------------|----------------|
| **High Likelihood** | Low | Medium | High | Critical |
| **Medium Likelihood** | Low | Medium | High | High |
| **Low Likelihood** | Very Low | Low | Medium | Medium |

## Mitigation Status

| ID | Mitigation | Status | Target Date |
|----|-----------|--------|-------------|
| R1 | Velocity caps implemented | Complete | - |
| R2 | Platform detection + fallback | In Progress | v1.1 |
| R3 | Text-only + opt-in implemented | Complete | - |
| R4 | Extension block + consent dialog | Complete | - |
| R5 | Key tracking + emergency reset | In Progress | v1.0 |
| R6 | Path validation in IPC handlers | Complete | - |
| R7 | Ring buffer for audit log | Complete | - |
| R8 | Chunk hash verification | In Progress | v1.0 |
| R9 | Configurable timeouts | Complete | - |
| R10 | Filename sanitizer + validation | Complete | - |

## Residual Risks (After Mitigation)

| Risk | Residual Level | Acceptable? |
|------|---------------|-------------|
| Input injection on unsupported platforms | Medium | Yes - graceful degradation |
| Social engineering to accept malicious file | Medium | Yes - user education + UI warnings |
| Clipboard polling via rapid enable/disable | Low | Yes - debounce prevents |

## Risk Monitoring

- Review this register after each release
- Update scores based on incident data
- Track mitigation completion in sprint planning
