# Push Notification Specification

## Providers
- iOS: APNS (Apple Push Notification Service)
- Android: FCM (Firebase Cloud Messaging)

## Notification Types

### Session Request
```json
{
  "to": "device_token",
  "notification": {
    "title": "RemoteDesk",
    "body": "John wants to connect to your computer"
  },
  "data": {
    "type": "session_request",
    "viewer_desk_id": "123456789"
  }
}
```

## Handling
- Foreground: Show in-app notification
- Background: Show system notification
- Tapped: Navigate to relevant screen
