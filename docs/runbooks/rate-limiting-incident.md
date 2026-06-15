# Rate Limiting Incident Runbook

## Symptoms
- Many 429 errors
- Legitimate users blocked
- Support tickets about access

## Diagnosis
1. Check rate limit metrics
2. Identify source of traffic
3. Determine if attack or misconfiguration

## Response
### Legitimate Spike
- Temporarily increase limits
- Scale infrastructure
- Communicate to users

### Attack
- Block source IPs
- Enable CAPTCHA
- Enable WAF rules
- Contact upstream provider
