# RemoteDesk Socket.IO Reference

This document provides a reference for the Socket.IO events and data structures used in RemoteDesk for real-time communication between the backend API, web application, and desktop applications.

## Base URL

`wss://api.remotedesk.com` (Production)
`ws://localhost:3001` (Development)

## Authentication

Clients must authenticate with the Socket.IO server upon connection. Typically, a JWT token obtained from the REST API login is used.

### Client-side Connection (Example)

```typescript
import { io } from "socket.io-client";

const token = localStorage.getItem("authToken"); // Get JWT token
const socket = io("ws://localhost:3001", {
  auth: {
    token: token,
  },
});

socket.on("connect", () => {
  console.log("Connected to Socket.IO server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from Socket.IO server");
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error.message);
});
```

## Events

### 1. Session Management Events

#### `session:initiate` (Client to Server)

-   **Description:** Initiates a new remote session.
-   **Payload:**
    ```typescript
    interface InitiateSessionPayload {
      targetDeviceId: string;
      // Other session parameters
    }
    ```

#### `session:offer` (Server to Client - Viewer/Host)

-   **Description:** Sends a WebRTC SDP offer to the peer.
-   **Payload:**
    ```typescript
    interface SessionOfferPayload {
      sessionId: string;
      sdp: RTCSessionDescriptionInit;
      fromUserId: string;
    }
    ```

#### `session:answer` (Client to Server - Viewer/Host)

-   **Description:** Sends a WebRTC SDP answer to the peer.
-   **Payload:**
    ```typescript
    interface SessionAnswerPayload {
      sessionId: string;
      sdp: RTCSessionDescriptionInit;
      toUserId: string;
    }
    ```

#### `session:ice-candidate` (Client to Server - Viewer/Host)

-   **Description:** Exchanges ICE candidates between peers.
-   **Payload:**
    ```typescript
    interface SessionIceCandidatePayload {
      sessionId: string;
      candidate: RTCIceCandidate;
      toUserId: string;
    }
    ```

#### `session:accepted` (Server to Client - Initiator)

-   **Description:** Notifies the session initiator that the host has accepted the connection.
-   **Payload:**
    ```typescript
    interface SessionAcceptedPayload {
      sessionId: string;
      hostDeviceId: string;
    }
    ```

#### `session:rejected` (Server to Client - Initiator)

-   **Description:** Notifies the session initiator that the host has rejected the connection.
-   **Payload:**
    ```typescript
    interface SessionRejectedPayload {
      sessionId: string;
      hostDeviceId: string;
      reason?: string;
    }
    ```

#### `session:end` (Client to Server / Server to Client)

-   **Description:** Signals the end of a session.
-   **Payload:**
    ```typescript
    interface SessionEndPayload {
      sessionId: string;
      reason: string;
    }
    ```

### 2. Device Status Events

#### `device:status` (Server to Client)

-   **Description:** Notifies clients about a device's online/offline status change.
-   **Payload:**
    ```typescript
    interface DeviceStatusPayload {
      deviceId: string;
      isOnline: boolean;
      lastSeen: string;
    }
    ```

### 3. Control Events (Data Channel)

These events are typically sent over WebRTC data channels once a peer-to-peer connection is established.

#### `input:keyboard`

-   **Description:** Remote keyboard input.
-   **Payload:** Key press/release events.

#### `input:mouse`

-   **Description:** Remote mouse input (move, click, scroll).
-   **Payload:** Mouse coordinates and event types.

#### `clipboard:sync`

-   **Description:** Synchronizes clipboard content.
-   **Payload:** Text content.

#### `file:transfer`

-   **Description:** Initiates or progresses a file transfer.
-   **Payload:** File metadata, chunks.

## Error Handling

Socket.IO errors are handled through `connect_error` and potentially custom error events emitted by the server. Refer to the [API Error Catalog](error-catalog.md) for common error codes.
