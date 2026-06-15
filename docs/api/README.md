# RemoteDesk API Documentation

## Getting Started
1. Register at `/auth/register`
2. Login at `/auth/login` to get tokens
3. Use Bearer token for all subsequent requests
4. Connect to Socket.IO for real-time features

## Base URLs
- Production: `https://api.remotedesk.io/v1`
- Staging: `https://staging-api.remotedesk.io/v1`

## Authentication
All endpoints (except auth) require a Bearer JWT token.

## Rate Limits
- 100 requests/minute for standard endpoints
- 10 requests/second for WebRTC signaling

## WebSocket
Connect to `/socket.io` with auth token.

## Error Format
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```
