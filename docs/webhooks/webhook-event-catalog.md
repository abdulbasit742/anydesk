# Webhook Event Catalog

## Format
```json
{
  "id": "evt_123",
  "type": "session.started",
  "created_at": "2024-01-01T00:00:00Z",
  "data": { ... }
}
```

## Events

### session.started
A remote session has started.
```json
{
  "type": "session.started",
  "data": {
    "session_id": "ses_123",
    "from_device_id": "dev_456",
    "to_device_id": "dev_789",
    "started_at": "2024-01-01T00:00:00Z"
  }
}
```

### session.ended
A remote session has ended.
```json
{
  "type": "session.ended",
  "data": {
    "session_id": "ses_123",
    "ended_at": "2024-01-01T01:00:00Z",
    "duration_seconds": 3600
  }
}
```

### device.registered
A new device has been registered.
```json
{
  "type": "device.registered",
  "data": {
    "device_id": "dev_123",
    "remote_desk_id": "123456789",
    "name": "My Laptop",
    "user_id": "usr_456"
  }
}
```

### billing.plan_changed
A subscription plan has changed.
```json
{
  "type": "billing.plan_changed",
  "data": {
    "organization_id": "org_123",
    "old_plan": "FREE",
    "new_plan": "PRO",
    "changed_at": "2024-01-01T00:00:00Z"
  }
}
```

### billing.payment_succeeded
A payment was successful.
```json
{
  "type": "billing.payment_succeeded",
  "data": {
    "invoice_id": "in_123",
    "amount": 2900,
    "currency": "usd"
  }
}
```

### billing.payment_failed
A payment failed.
```json
{
  "type": "billing.payment_failed",
  "data": {
    "invoice_id": "in_123",
    "amount": 2900,
    "next_retry": "2024-01-02T00:00:00Z"
  }
}
```
