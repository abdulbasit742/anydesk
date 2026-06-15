# API Examples

This document provides practical examples for interacting with the RemoteDesk API. These examples cover common use cases such as authentication, session management, and remote control actions, demonstrating how to integrate RemoteDesk functionalities into other applications or scripts.

## 1. Authentication

All API requests require authentication. RemoteDesk uses OAuth2 for secure access. The first step is to obtain an access token.

### 1.1. Obtain Access Token (Client Credentials Grant)

This example demonstrates how to obtain an access token using the client credentials grant type, suitable for server-to-server communication.

**Request:**

```http
POST /oauth/token HTTP/1.1
Host: api.remotedesk.com
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET
```

**Response (Success):**

```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

**Response (Error):**

```json
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "error": "invalid_client",
  "error_description": "Client authentication failed"
}
```

### 1.2. Obtain Access Token (Password Grant)

This example demonstrates how to obtain an access token using the password grant type, suitable for trusted first-party applications.

**Request:**

```http
POST /oauth/token HTTP/1.1
Host: api.remotedesk.com
Content-Type: application/x-www-form-urlencoded

grant_type=password&username=YOUR_EMAIL&password=YOUR_PASSWORD&client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET
```

**Response (Success):**

```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "def50200a0b0c0d0e0f0..."
}
```

## 2. User Management

### 2.1. Get User Profile

Retrieve the profile information for the authenticated user.

**Request:**

```http
GET /api/v1/users/me HTTP/1.1
Host: api.remotedesk.com
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response:**

```json
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": "usr_abc123",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "standard",
  "mfaEnabled": true,
  "createdAt": "2023-01-15T10:00:00Z"
}
```

## 3. Device Management

### 3.1. List User Devices

Retrieve a list of devices associated with the authenticated user.

**Request:**

```http
GET /api/v1/devices HTTP/1.1
Host: api.remotedesk.com
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response:**

```json
HTTP/1.1 200 OK
Content-Type: application/json

[
  {
    "id": "dev_pqr456",
    "name": "My Work PC",
    "os": "Windows",
    "status": "online",
    "lastSeen": "2023-10-27T10:25:00Z"
  },
  {
    "id": "dev_xyz789",
    "name": "Home Laptop",
    "os": "macOS",
    "status": "offline",
    "lastSeen": "2023-10-26T18:00:00Z"
  }
]
```

## 4. Session Management

### 4.1. Initiate a Remote Session

Start a new remote desktop session with a target device.

**Request:**

```http
POST /api/v1/sessions HTTP/1.1
Host: api.remotedesk.com
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "targetDeviceId": "dev_pqr456",
  "controlMode": "fullControl",
  "clientDeviceId": "dev_client123" // Optional: ID of the client device initiating the session
}
```

**Response:**

```json
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": "sess_abc123",
  "status": "pending",
  "targetDeviceId": "dev_pqr456",
  "clientDeviceId": "dev_client123",
  "connectionUrl": "wss://signaling.remotedesk.com/session/sess_abc123?token=...",
  "createdAt": "2023-10-27T10:35:00Z"
}
```

### 4.2. End a Remote Session

Terminate an active remote desktop session.

**Request:**

```http
DELETE /api/v1/sessions/sess_abc123 HTTP/1.1
Host: api.remotedesk.com
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response:**

```json
HTTP/1.1 204 No Content
```

## 5. Remote Control Actions (via WebSockets)

Once a session is initiated, remote control actions (keyboard, mouse, file transfer, clipboard) are typically performed over a WebRTC Data Channel, with signaling facilitated by a WebSocket connection.

### 5.1. WebSocket Connection

Connect to the `connectionUrl` obtained from the session initiation API.

```javascript
// Example using JavaScript WebSocket API
const sessionData = await initiateSessionApiCall(); // Get connectionUrl
const ws = new WebSocket(sessionData.connectionUrl);

ws.onopen = () => {
  console.log("WebSocket connected for session:", sessionData.id);
  // Signaling for WebRTC SDP and ICE candidates will happen here
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log("Received signaling message:", message);
  // Handle SDP offers/answers, ICE candidates
};

ws.onclose = () => {
  console.log("WebSocket disconnected.");
};

ws.onerror = (error) => {
  console.error("WebSocket error:", error);
};

// To send signaling messages (e.g., SDP offer)
// ws.send(JSON.stringify({ type: 'sdp-offer', sdp: '...' }));
```

### 5.2. WebRTC Data Channel for Input

After WebRTC peer connection is established, a data channel can be used to send input events.

```javascript
// Assuming peerConnection and dataChannel are already set up

// Send a keyboard key press event
function sendKeyPress(key: string) {
  const message = {
    type: "keyboard",
    action: "keyDown",
    key: key,
    timestamp: Date.now()
  };
  dataChannel.send(JSON.stringify(message));
}

// Send a mouse click event
function sendMouseClick(x: number, y: number, button: 'left' | 'right') {
  const message = {
    type: "mouse",
    action: "click",
    x: x,
    y: y,
    button: button,
    timestamp: Date.now()
  };
  dataChannel.send(JSON.stringify(message));
}

// Example usage:
sendKeyPress("a");
sendMouseClick(100, 200, "left");
```

## 6. Error Handling

Always implement robust error handling for API calls and WebSocket connections, including:

*   **HTTP Status Codes:** Check HTTP status codes for API responses.
*   **Error Messages:** Parse error messages from the API response body.
*   **Retry Mechanisms:** Implement exponential backoff for transient network errors.
*   **Logging:** Log API request/response and WebSocket events for debugging (refer to `audit-log-structure.md`).

## 7. SDKs and Libraries

RemoteDesk provides official SDKs for various platforms (e.g., JavaScript, Python, C#) that abstract away the complexities of direct API and WebRTC interactions. These SDKs are the recommended way to integrate with RemoteDesk.

*   **JavaScript SDK:** `npm install @remotedesk/sdk`
*   **Python SDK:** `pip install remotedesk-sdk`

Refer to the respective SDK documentation for detailed usage examples.
