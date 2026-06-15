# RemoteDesk Push Notification System

This document describes the architecture and functionality of the push notification system within RemoteDesk, enabling real-time alerts and updates to mobile devices.

## Overview
The push notification system is a critical component for engaging mobile users and providing timely information about important events, such as session activities, invitations, and security alerts. It leverages platform-specific services (FCM for Android, APNS for iOS) to deliver notifications efficiently.

## Features
- **Platform-Specific Delivery**: Utilizes Firebase Cloud Messaging (FCM) for Android and Apple Push Notification Service (APNS) for iOS.
- **Subscription Management**: Allows mobile devices to subscribe and unsubscribe from push notifications.
- **Event-Driven Notifications**: Sends notifications based on various events (session started/ended, chat messages, invitations, alerts).
- **Configurable Payloads**: Supports custom data payloads to enable deep linking and specific actions within the mobile app.

## Implementation Details

### Data Transfer Objects (DTOs)
- **`PushNotificationType`**: An enum defining the various types of push notifications.
- **`PushNotificationPayload`**: Defines the structure of a notification payload, including `type`, `title`, `body`, and optional `data` for custom information.
- **`PushNotificationSubscription`**: Describes a mobile device's subscription, including `userId`, `deviceId`, `platform`, `token` (device push token), and `subscribedAt` timestamp.
- **Location**: `remotedesk/packages/shared/src/mobile/push-notification.dto.ts`

### API Service Logic
- **`PushNotificationService.ts`**: Manages push notification subscriptions and sending logic on the API server.
  - **Subscription Handling**: Stores and retrieves device push tokens associated with users and devices.
  - **Notification Dispatch**: Orchestrates sending notifications to the appropriate platform-specific service (FCM or APNS) based on the device's platform.
  - **Error Handling**: Manages failed notification deliveries and token expiration.
- **Location**: `remotedesk/apps/api/src/mobile/PushNotificationService.ts`

## Usage

### Mobile Client (iOS/Android)
1. **On App Launch/Login**: The mobile app obtains a device push token from the respective platform service (FCM/APNS).
2. **Subscribe**: The app sends the `PushNotificationSubscription` details to the RemoteDesk backend via an API endpoint (e.g., `/api/mobile/subscribe-push`).
3. **Receive Notifications**: The mobile app receives notifications from FCM/APNS, which are then processed to display alerts or trigger in-app actions.
4. **Unsubscribe**: If a user logs out or disables notifications, the app sends an unsubscribe request to the backend.

### Backend Services
1. **Triggering Notifications**: Any backend service (e.g., `SessionService`, `ChatService`, `MultiUserSessionService`) can call `pushNotificationService.sendNotification(userId, payload)` to send a notification to a specific user.
2. **Payload Customization**: The `payload.data` field can be used to pass additional context, allowing the mobile app to handle notifications intelligently (e.g., navigate to a specific session screen).

## Technical Considerations
- **Security**: Protecting push tokens and ensuring that only authorized services can send notifications.
- **Reliability**: Implementing retry mechanisms and fallbacks for notification delivery failures.
- **Payload Size Limits**: Adhering to payload size limits imposed by FCM and APNS.
- **Quiet Hours/Do Not Disturb**: Respecting user preferences for notification delivery times.
- **Analytics**: Tracking notification delivery rates and user engagement.

## Future Enhancements
- **Notification Preferences UI**: Allow users to granularly control which types of notifications they receive.
- **In-App Notification Center**: A dedicated section within the mobile app to view a history of received notifications.
- **Rich Notifications**: Support for images, action buttons, and other rich media in notifications.
- **Localization**: Deliver notifications in the user's preferred language.
