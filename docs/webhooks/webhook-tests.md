# Webhook Testing Guide

## Unit Tests
```typescript
import { signWebhookPayload, verifyWebhookSignature } from "../src/utils/webhook-signing";

describe("Webhook Signing", () => {
  it("signs payload consistently", () => {
    const sig1 = signWebhookPayload("test", "secret");
    const sig2 = signWebhookPayload("test", "secret");
    expect(sig1).toBe(sig2);
  });

  it("verifies valid signature", () => {
    const sig = signWebhookPayload("test", "secret");
    expect(verifyWebhookSignature("test", sig, "secret")).toBe(true);
  });

  it("rejects invalid signature", () => {
    expect(verifyWebhookSignature("test", "invalid", "secret")).toBe(false);
  });

  it("rejects tampered payload", () => {
    const sig = signWebhookPayload("test", "secret");
    expect(verifyWebhookSignature("tampered", sig, "secret")).toBe(false);
  });
});
```

## Integration Testing
```bash
# Start local receiver
node docs/webhooks/webhook-receiver-example.ts

# Send test webhook
curl -X POST http://localhost:3001/webhooks/remotedesk \
  -H "Content-Type: application/json" \
  -H "X-Webhoo-Signature: <signature>" \
  -d '{"type":"session.started","data":{"session_id":"test"}}'
```

## Testing Retry Logic
1. Configure webhook endpoint
2. Make receiver return 500
3. Verify retries with exponential backoff
4. Verify max retry limit enforced
