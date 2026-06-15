# RemoteDesk Mobile API Contracts

## Overview
Mobile apps use the same REST API and WebSocket signaling as desktop/web clients.

## Base URLs
```
Production:  https://api.remotedesk.io/v1
Staging:     https://api-staging.remotedesk.io/v1
```

## Authentication
### Login
```
POST /v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "device": {
    "platform": "ios",
    "os_version": "17.0",
    "app_version": "1.0.0",
    "push_token": "apns_token_here"
  }
}

Response: 200 OK
{
  "token": "jwt_token",
  "desk_id": "123456789",
  "user": {
    "id": "usr_123",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "refresh_token": "refresh_token_here"
}
```

### Token Refresh
```
POST /v1/auth/refresh
Content-Type: application/json

{
  "refresh_token": "refresh_token_here"
}

Response: 200 OK
{
  "token": "new_jwt_token",
  "expires_in": 3600
}
```

## Push Notifications
| Event | Payload | Action |
|-------|---------|--------|
| session.requested | { viewer_desk_id, viewer_name } | Open accept/reject screen |
| session.ended | { session_id, reason } | Return to home screen |
| message.received | { sender, text } | Show in-app notification |

## WebRTC for Mobile
- Use Google WebRTC library (iOS/Android)
- Camera capture for mobile-to-desktop
- Screen capture via ReplayKit (iOS) / MediaProjection (Android)
- Adaptive bitrate for cellular networks

## Response Format
```json
{
  "data": { ... },
  "meta": {
    "request_id": "req_abc123",
    "timestamp": "2026-06-12T10:00:00Z"
  }
}
```

## Error Format
```json
{
  "error": {
    "code": "RD_E002",
    "message": "Desk ID must be 9 digits",
    "details": {}
  },
  "meta": {
    "request_id": "req_abc123"
  }
}
```
