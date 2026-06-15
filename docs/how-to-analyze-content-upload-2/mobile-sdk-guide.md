# RemoteDesk Mobile SDK Guide

This document serves as a guide for integrating the RemoteDesk Mobile SDK into native iOS and Android applications, enabling them to interact with the RemoteDesk platform for device management, session requests, and push notifications.

## Overview
The RemoteDesk Mobile SDK simplifies the development of mobile client applications that can leverage RemoteDesk's core functionalities. It provides a structured way to communicate with the RemoteDesk API, handle device registration, initiate remote sessions, and manage push notification subscriptions.

## Features
- **Device Registration & Management**: Programmatically register and update mobile device information with the RemoteDesk backend.
- **Remote Session Initiation**: Request a remote desktop session from a mobile device to a registered host.
- **Push Notification Handling**: Subscribe to and manage push notification tokens for receiving real-time alerts and updates.
- **API Abstraction**: Provides a convenient wrapper around the RemoteDesk mobile API endpoints.

## Implementation Details

### SDK Client
- **`RemoteDeskMobileSDK.ts`**: The core TypeScript class for the Mobile SDK. It encapsulates the logic for making API requests to the RemoteDesk backend.
  - **Constructor**: Initializes the SDK with the API URL and an API key (or OAuth token) for authentication.
  - **`registerDevice(deviceInfo: MobileDeviceInfo)`**: Registers or updates a mobile device's information.
  - **`getDevices(userId: string)`**: Retrieves a list of mobile devices associated with a user.
  - **`requestSession(sessionRequest: MobileSessionRequest)`**: Initiates a request for a remote session.
  - **`subscribePushNotifications(subscription: PushNotificationSubscription)`**: Subscribes the device to push notifications.
  - **`unsubscribePushNotifications(userId: string, deviceId: string)`**: Unsubscribes the device from push notifications.
  - **`simulatePushNotification(payload: PushNotificationPayload)`**: A utility method for testing or mocking push notification reception.
- **Location**: `remotedesk/packages/shared/src/mobile/mobile-sdk.ts`

### Data Transfer Objects (DTOs)
- **`MobileDeviceInfo`**: Defines the structure for mobile device information (e.g., `deviceId`, `platform`, `osVersion`).
- **`MobileSessionRequest`**: Defines the structure for requesting a remote session from a mobile device.
- **`PushNotificationSubscription`**: Defines the structure for push notification subscription details.
- **`PushNotificationPayload`**: Defines the structure for the content of a push notification.
- **Location**: `remotedesk/packages/shared/src/mobile/mobile-device.dto.ts` and `remotedesk/packages/shared/src/mobile/push-notification.dto.ts`

## Usage

### Initialization
```typescript
import { RemoteDeskMobileSDK } from '@remotedesk/shared/src/mobile/mobile-sdk';

const apiUrl = 'https://api.remotedesk.com'; // Your RemoteDesk API endpoint
const apiKey = 'YOUR_API_KEY'; // Your API key or user's OAuth token

const remoteDeskSDK = new RemoteDeskMobileSDK(apiUrl, apiKey);
```

### Registering a Device
```typescript
import { MobilePlatform } from '@remotedesk/shared/src/mobile/mobile-device.dto';

const deviceInfo = {
  deviceId: 'unique-device-id-123',
  userId: 'user-123',
  platform: MobilePlatform.IOS,
  osVersion: '17.0',
  model: 'iPhone 15 Pro',
  appVersion: '1.0.0',
  lastSeen: new Date().toISOString(),
  pushToken: 'apns-push-token-xyz',
};

remoteDeskSDK.registerDevice(deviceInfo)
  .then(response => console.log('Device registered:', response))
  .catch(error => console.error('Device registration failed:', error));
```

### Requesting a Session
```typescript
const sessionRequest = {
  deviceId: 'unique-device-id-123',
  accessCode: '123456789',
};

remoteDeskSDK.requestSession(sessionRequest)
  .then(response => console.log('Session request initiated:', response))
  .catch(error => console.error('Session request failed:', error));
```

### Subscribing to Push Notifications
```typescript
import { MobilePlatform } from '@remotedesk/shared/src/mobile/mobile-device.dto';

const pushSubscription = {
  userId: 'user-123',
  deviceId: 'unique-device-id-123',
  platform: MobilePlatform.IOS,
  token: 'apns-push-token-xyz',
  subscribedAt: new Date().toISOString(),
};

remoteDeskSDK.subscribePushNotifications(pushSubscription)
  .then(response => console.log('Push subscription:', response))
  .catch(error => console.error('Push subscription failed:', error));
```

## Technical Considerations
- **Authentication**: The SDK relies on an `apiKey` (or OAuth token) for authenticating requests. Ensure this token is securely managed within the mobile application.
- **Error Handling**: Implement robust error handling in the mobile application to gracefully manage API failures and network issues.
- **Background Tasks**: For features like push notification handling, ensure the mobile app correctly manages background tasks and permissions.
- **Platform Differences**: While the SDK provides a unified interface, developers should be aware of platform-specific nuances for UI/UX and native features.

## Future Enhancements
- **Native Wrappers**: Provide native wrappers (e.g., Swift/Kotlin) for the TypeScript SDK for easier integration into native projects.
- **Offline Capabilities**: Implement caching and offline synchronization for improved user experience in low-connectivity environments.
- **Biometric Authentication**: Integrate with native biometric authentication (Face ID, Touch ID) for enhanced security.
- **Deep Linking**: Standardize deep linking mechanisms for navigating directly to specific sessions or features from notifications.
