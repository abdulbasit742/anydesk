# Webhook Reference (Future)

## Events
- `session.started`
- `session.ended`
- `device.online`
- `device.offline`
- `team.invitation.accepted`

## Payload
```json
{
  "event": "session.started",
  "timestamp": 1718208000000,
  "data": { "sessionId": "...", "hostId": "...", "clientId": "..." }
}
```

## Verification
HMAC-SHA256 of payload using webhook secret.
