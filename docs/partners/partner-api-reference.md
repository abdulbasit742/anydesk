# Partner API Reference

## Endpoints

### GET /v1/partners/customers
List referred customers.

**Query Parameters:**
- page (number, default: 1)
- limit (number, default: 20)

**Response:**
```json
{
  "customers": [
    {
      "id": "cus_123",
      "email": "customer@example.com",
      "plan": "pro",
      "seats": 10,
      "referred_at": "2026-01-15T10:00:00Z"
    }
  ],
  "total": 150,
  "page": 1
}
```

### POST /v1/partners/deals
Register a new deal.

**Request Body:**
```json
{
  "customer_name": "Acme Corp",
  "estimated_value": 50000,
  "expected_close": "2026-09-01",
  "notes": "Enterprise opportunity"
}
```

### GET /v1/partners/commissions
Get commission report.

**Query Parameters:**
- month (string, format: YYYY-MM)

**Response:**
```json
{
  "month": "2026-06",
  "total_commission": 12500.00,
  "deals": [
    {
      "customer": "Acme Corp",
      "amount": 500.00,
      "status": "paid"
    }
  ]
}
```

## Webhooks
Partners receive webhooks for customer lifecycle events.

### Payload Structure
```json
{
  "event": "customer.subscribed",
  "timestamp": "2026-06-12T10:00:00Z",
  "data": {
    "customer_id": "cus_123",
    "plan": "enterprise",
    "seats": 50,
    "mrr": 2500
  }
}
```
