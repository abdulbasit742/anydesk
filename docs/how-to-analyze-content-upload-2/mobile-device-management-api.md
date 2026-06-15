# RemoteDesk Mobile Device Management API

This document outlines the API endpoints and functionalities for managing mobile devices within the RemoteDesk ecosystem, enabling registration, tracking, and session initiation from mobile clients.

## Overview
The Mobile Device Management API provides the necessary interfaces for mobile applications (iOS and Android) to register themselves with the RemoteDesk backend, update their status, and initiate remote sessions. This is a crucial component for extending RemoteDesk's capabilities to mobile platforms.

## Features
- **Device Registration**: Allows mobile clients to register themselves with the RemoteDesk service.
- **Device Updates**: Enables mobile clients to update their information, including push notification tokens.
- **Device Listing**: Provides an endpoint to retrieve a user's registered mobile devices.
- **Session Request Initiation**: Facilitates the initiation of remote sessions from a mobile device.

## Implementation Details

### Data Transfer Objects (DTOs)
- **`MobilePlatform`**: An enum defining the supported mobile operating systems (iOS, Android).
- **`MobileDeviceInfo`**: Describes a registered mobile device, including `deviceId`, `userId`, `platform`, `osVersion`, `model`, `appVersion`, `lastSeen`, and optional `pushToken`.
- **`MobileSessionRequest`**: Defines the payload for requesting a remote session from a mobile device, including `deviceId` and `accessCode`.
- **Location**: `remotedesk/packages/shared/src/mobile/mobile-device.dto.ts`

### API Routes
- **`mobile-device.routes.ts`**: Contains the Express.js routes for mobile device management.
  - `POST /api/mobile/register-device`: Registers a new mobile device or updates an existing one. Requires `deviceId`, `userId`, `platform`, `osVersion`, `model`, `appVersion`.
  - `GET /api/mobile/devices/:userId`: Retrieves all registered mobile devices for a given user. Requires authentication.
  - `POST /api/mobile/request-session`: Initiates a remote session request from a mobile device. Requires `deviceId` and `accessCode`.
- **Location**: `remotedesk/apps/api/src/mobile/mobile-device.routes.ts`

## Usage

### Mobile Client (iOS/Android)
1. **On App Launch/Login**: Call `POST /api/mobile/register-device` to register the device and provide its details, including the push notification token.
2. **To View Registered Devices**: A web dashboard or another mobile client can call `GET /api/mobile/devices/:userId` to see a list of devices associated with a user.
3. **To Initiate a Session**: The mobile client can call `POST /api/mobile/request-session` with a `deviceId` and `accessCode` to start a remote session on a desktop host.

## Technical Considerations
- **Authentication**: All API endpoints should be protected by appropriate authentication mechanisms (e.g., OAuth tokens).
- **Security**: Ensure sensitive device information and session requests are transmitted securely (HTTPS).
- **Error Handling**: Provide clear and informative error responses for invalid requests or failures.
- **Scalability**: The API should be designed to handle a large number of mobile device registrations and session requests.

## Future Enhancements
- **Device Renaming**: Allow users to assign custom names to their registered devices.
- **Remote Wipe**: Implement functionality to remotely wipe data from a lost or stolen device.
- **Device Grouping**: Organize devices into logical groups for easier management.
- **Mobile SDK**: Provide a dedicated Mobile SDK to simplify integration for mobile app developers.
