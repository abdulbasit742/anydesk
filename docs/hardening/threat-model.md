# Threat Model

## Scope
RemoteDesk application: API, Web dashboard, Desktop client.

## Threat Actors
| Actor | Motivation | Capability |
|-------|-----------|------------|
| Script kiddie | Reputation | Low |
| Cybercriminal | Financial | Medium |
| APT | Espionage | High |
| Insider | Various | High |

## Threat Scenarios

### T1: Session Hijacking
- **Threat**: Attacker intercepts WebRTC traffic
- **Mitigation**: DTLS encryption, no session data on servers
- **Risk**: Low (P2P encrypted)

### T2: Credential Theft
- **Threat**: Phishing or keylogger steals credentials
- **Mitigation**: 2FA, rate limiting, anomaly detection
- **Risk**: Medium

### T3: Unauthorized Access
- **Threat**: Attacker connects without permission
- **Mitigation**: Explicit accept required, audit logging
- **Risk**: Low

### T4: Data Exfiltration
- **Threat**: File transfer abuse
- **Mitigation**: DLP policies, file type restrictions, audit logs
- **Risk**: Medium

### T5: Infrastructure Attack
- **Threat**: DDoS, server compromise
- **Mitigation**: WAF, rate limiting, minimal data on servers
- **Risk**: Low

### T6: Insider Threat
- **Threat**: Employee abuses access
- **Mitigation**: RBAC, audit logs, least privilege
- **Risk**: Medium

## Risk Matrix
| Likelihood | Impact | Risk Level |
|------------|--------|------------|
| Low | Low | Low |
| Low | High | Medium |
| High | Low | Medium |
| High | High | Critical |
