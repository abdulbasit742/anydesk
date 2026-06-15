# Integration QA Guide

## API QA
- [ ] All endpoints return correct status codes
- [ ] Auth errors return 401
- [ ] Permission errors return 403
- [ ] Rate limiting returns 429 with Retry-After
- [ ] Validation errors return 400 with details
- [ ] Pagination works correctly
- [ ] Sorting works correctly
- [ ] Filtering works correctly

## Webhook QA
- [ ] Events delivered in order
- [ ] Signatures verified correctly
- [ ] Retries work as documented
- [ ] Failed deliveries logged
- [ ] Duplicate events handled

## Third-Party QA
- [ ] Stripe webhooks processed correctly
- [ ] SendGrid emails delivered
- [ ] Slack notifications formatted correctly
- [ ] Teams app loads in iframe

## SDK QA
- [ ] All clients work
- [ ] Error handling correct
- [ ] Types exported correctly
- [ ] Tree-shakeable
