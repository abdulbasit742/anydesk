# Webhook Retry Guide

## Retry Policy
- Max attempts: 3
- Backoff: exponential (1s, 2s, 4s)
- Timeout per attempt: 10 seconds
- Retry on: 5xx, 429, network errors
- No retry on: 2xx, 3xx, 4xx (except 429)

## Delivery Flow
```
Attempt 1: Immediate
  |-- Success (2xx) -> Done
  |-- Failure -> Wait 1 second
Attempt 2: After 1s delay
  |-- Success -> Done
  |-- Failure -> Wait 2 seconds
Attempt 3: After 2s delay
  |-- Success -> Done
  |-- Failure -> Mark failed, alert
```

## Handling Retries (Receiver Side)

### Idempotency
Your endpoint should be idempotent - processing the same event twice should not cause issues.

### Deduplication
Use the `x-webhook-id` header to deduplicate:
```typescript
const webhookId = req.headers["x-webhook-id"];
if (await isProcessed(webhookId)) {
  return res.status(200).send("Already processed");
}
```

### Quick Response
Respond quickly (< 5s) to avoid timeouts:
```typescript
app.post("/webhook", async (req, res) => {
  res.status(202).send("Accepted");  // Respond immediately
  await processEvent(req.body);      // Process async
});
```

## Monitoring
Track delivery stats:
- Success rate (target > 99%)
- Average delivery time
- Failure reasons
- Retry patterns
