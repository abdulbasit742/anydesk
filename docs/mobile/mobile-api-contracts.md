# Mobile API Contracts

## Authentication
Mobile uses same auth flow:
```
POST /auth/login
{ email, password }
-> { user, token }
```

Store token securely:
- iOS: Keychain
- Android: Keystore

## Device Registration
```
emit "device:register"
{ remoteDeskId, name: "iPhone-ABC123", platform: "ios" }
```

## Session Flow
Same as web:
1. Emit `session:request` with 9-digit ID
2. Wait for `session:accepted`
3. Create peer connection
4. Exchange offer/answer
5. Display remote video in native view

## Touch Input Protocol
```json
{
  "type": "touch",
  "action": "tap|longpress|drag|pinch",
  "x": 100,
  "y": 200,
  "fingers": 1,
  "scale": 1.0
}
```

## File Download
```
GET /files/{fileId}
Authorization: Bearer {token}
-> Binary file data
```

## Push Notifications
```
POST /users/{id}/push-token
{ token: "fcm_or_apns_token", platform: "ios|android" }
```

Notifications for:
- Incoming session request
- File transfer complete
- Organization invitation
