# Terraform Webhook Config

```hcl
resource 'remotedesk_webhook' 'example' {
  url    = 'https://example.com/webhook'
  events = ['session.started', 'session.ended']
  secret = var.webhook_secret
}
```
