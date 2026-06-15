# RemoteDesk Webhook Catalog

## Available Events

### Session Events
| Event | Description | Payload |
|-------|-------------|---------|
| `session.started` | Session began | session_id, host_id, viewer_id, timestamp |
| `session.ended` | Session ended | session_id, duration, ended_by |
| `session.requested` | Connection requested | host_desk_id, viewer_desk_id |
| `session.accepted` | Request accepted | session_id, host_id |
| `session.rejected` | Request rejected | viewer_desk_id, host_id |

### User Events
| Event | Description | Payload |
|-------|-------------|---------|
| `user.created` | New user registered | user_id, email, timestamp |
| `user.deleted` | User account deleted | user_id, timestamp |
| `user.login` | User logged in | user_id, ip, timestamp |
| `user.logout` | User logged out | user_id, timestamp |

### Device Events
| Event | Description | Payload |
|-------|-------------|---------|
| `device.registered` | New device added | device_id, user_id, os |
| `device.trusted` | Device marked trusted | device_id, user_id |
| `device.revoked` | Device trust revoked | device_id, user_id |
| `device.blocked` | Device blocked | device_id, reason |

### Organization Events
| Event | Description | Payload |
|-------|-------------|---------|
| `policy.updated` | Policy changed | policy_id, changed_by, changes |
| `billing.invoice` | Invoice generated | invoice_id, amount, due_date |
| `billing.payment` | Payment received | invoice_id, amount |

## Event Payload Schema
```json
{
  "event": "session.started",
  "timestamp": "2026-06-12T10:00:00Z",
  "data": {
    "session_id": "sess_123456",
    "host_id": "user_789",
    "viewer_id": "user_abc",
    "host_desk_id": "123456789",
    "viewer_desk_id": "987654321"
  }
}
```

## Subscribing
Subscribe to events via the API or admin dashboard.

## Delivery
- HTTP POST to your URL
- JSON payload
- Signature header for verification
- Retry on failure (3 attempts)
