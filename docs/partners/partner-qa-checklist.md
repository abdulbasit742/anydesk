# RemoteDesk Partner QA Checklist

## Pre-Launch Checklist

### Portal & API
- [ ] Partner can log into Partner Portal
- [ ] API key generation works
- [ ] API key revocation works
- [ ] Rate limits are enforced correctly
- [ ] Sandbox environment is accessible
- [ ] Webhook configuration UI works
- [ ] Commission dashboard loads accurately

### Integration
- [ ] OAuth flow completes successfully
- [ ] Customer provisioning API works
- [ ] Usage reporting API returns correct data
- [ ] Webhook events are delivered within SLA
- [ ] Webhook signatures validate correctly
- [ ] Error responses are helpful and documented

### Billing & Commissions
- [ ] Commission calculations are accurate
- [ ] Payout reports match earned commissions
- [ ] Currency conversion is correct
- [ ] Refund handling reduces commission correctly
- [ ] Minimum payout threshold is enforced

### Security
- [ ] API keys are rotated successfully
- [ ] IP whitelisting works
- [ ] Suspicious activity triggers alerts
- [ ] Partner data is isolated from other partners
- [ ] Audit logs capture all partner actions

### Documentation
- [ ] API docs are complete and accurate
- [ ] Code samples compile and run
- [ ] Postman collection is importable
- [ ] Error code reference is complete
- [ ] Changelog is up to date

## Acceptance Criteria
- All P0 items pass
- < 1% error rate on API calls
- Webhook delivery rate > 99.9%
- Documentation accuracy verified by new partner
