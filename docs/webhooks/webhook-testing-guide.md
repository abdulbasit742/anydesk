# Webhook Testing Guide

## Local Testing

### Using ngrok
```bash
# Start your local server
npm run dev:webhook

# Expose to internet
ngrok http 3001

# Use ngrok URL as webhook URL
# https://abc123.ngrok.io/webhooks/remotedesk
```

### Using Webhook.site
1. Go to https://webhook.site
2. Copy unique URL
3. Register as webhook endpoint
4. Inspect received payloads

### Using CLI
```bash
# Listen for webhooks locally
npx webhook-listener 3001

# Test signature verification
npx remotedesk-webhook-test --secret your-secret --payload '{"test":"data"}'
```

## Testing Scenarios
- [ ] Event delivery
- [ ] Signature verification
- [ ] Retry behavior
- [ ] Timeout handling
- [ ] Error response handling
- [ ] Duplicate event handling
- [ ] Large payload handling
