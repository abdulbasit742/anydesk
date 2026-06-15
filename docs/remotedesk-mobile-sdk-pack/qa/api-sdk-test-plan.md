# API SDK Test Plan

## Unit Tests
- [ ] Retry helper: success, retry, non-retryable
- [ ] Error mapper: status codes, network errors
- [ ] Token refresh: expiry detection, scheduling
- [ ] Pagination: merge, cursor handling

## Integration Tests
- [ ] Full auth flow against staging
- [ ] Device CRUD
- [ ] Session list filtering
- [ ] Audit export

## Contract Tests
- [ ] OpenAPI spec matches implementation
- [ ] Response types compile against real payloads

## Performance
- [ ] 100 concurrent requests
- [ ] 1MB payload upload
- [ ] Timeout respected
