# RemoteDesk Partner Support Runbook

## Support Tiers

### Tier 1: Self-Service
- Partner Portal (partners.remotedesk.io)
- Knowledge Base (help.remotedesk.io/partners)
- API Documentation (docs.remotedesk.io/api)
- Community Forum (community.remotedesk.io)

### Tier 2: Partner Success Team
- Email: partners@remotedesk.io
- Hours: Mon-Fri 9AM-6PM ET
- SLA: Initial response 4 business hours
- Scope: Technical integration, sales support, billing questions

### Tier 3: Engineering Escalation
- Channel: partners-escalation@remotedesk.io
- SLA: Initial response 1 business hour
- Scope: API bugs, integration blockers, security concerns

## Common Partner Issues

### Issue: API key not working
1. Verify key is active in Partner Portal
2. Check key is for correct environment (sandbox vs production)
3. Ensure X-Partner-Key header is sent
4. Verify IP whitelist if configured
5. Escalate if still failing

### Issue: Webhook not receiving
1. Verify webhook URL is HTTPS
2. Check endpoint returns 200 within 10 seconds
3. Verify signature validation is correct
4. Check retry logs in Partner Portal
5. Test with webhook tester tool

### Issue: Commission discrepancy
1. Verify customer is linked to partner
2. Check commission calculation period
3. Confirm customer has not cancelled/refunded
4. Review deal registration status
5. Escalate to finance@remotedesk.io if unresolved

## Escalation Matrix
| Severity | Response | Resolution | Path |
|----------|----------|------------|------|
| P1 - Revenue at risk | 1h | 24h | Direct to VP Partners |
| P2 - Integration blocked | 4h | 72h | Partner Success -> Eng |
| P3 - General question | 24h | 1 week | Self-service or email |
