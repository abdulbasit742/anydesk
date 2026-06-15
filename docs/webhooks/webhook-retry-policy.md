# Webhook Retry Policy

## Retry Schedule
| Attempt | Delay | Total Time |
|---------|-------|------------|
| 1 | Immediate | 0s |
| 2 | 2s | 2s |
| 3 | 4s | 6s |
| 4 | 8s | 14s |
| 5 | 16s | 30s |

## Failure Conditions
A delivery is considered failed if:
- HTTP status >= 400
- Connection timeout (> 30s)
- DNS resolution failure
- TLS handshake failure

## Success Conditions
- HTTP status 200-299
- Response received within 30 seconds

## After Max Retries
After 5 failed attempts:
- Delivery is dropped
- Event logged as failed
- No further attempts

## Idempotency
Webhook events include an `id` field. Consumers should:
- Track processed event IDs
- Ignore duplicate events
- Respond quickly (acknowledge, process async)

## Best Practices
1. Respond with 200 quickly, process async
2. Verify signature using secret
3. Handle duplicate events gracefully
4. Implement exponential backoff for your requests to us
