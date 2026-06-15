# Socket QA Test Scripts

## Connection
```javascript
const socket = io("wss://api.remotedesk.io/signaling", {
  auth: { token: "valid-jwt-token" }
});

// Should connect within 5 seconds
socket.on("connect", () => {
  console.log("Connected:", socket.connected); // true
});

// Should authenticate
socket.on("connect_error", (err) => {
  if (err.message === "Unauthorized") {
    console.error("Auth failed");
  }
});
```

## Join Flow
```javascript
// Join with valid desk ID
socket.emit("signaling:join", { deskId: "123456789" });
// Expect: success, joined room

// Join with invalid desk ID
socket.emit("signaling:join", { deskId: "invalid" });
// Expect: error event
```

## Signaling Flow
```javascript
// Complete offer/answer exchange
socket.emit("signaling:offer", { targetDeskId: "987654321", offer: sdpOffer });
socket.on("signaling:answer", ({ answer }) => {
  console.log("Received answer:", answer.type); // "answer"
});

// ICE candidate exchange
socket.emit("signaling:ice-candidate", { targetDeskId: "987654321", candidate });
socket.on("signaling:ice-candidate", ({ candidate }) => {
  console.log("Received ICE candidate");
});
```

## Session Flow
```javascript
// Request session
socket.emit("session:request", { hostDeskId: "987654321", viewerDeskId: "123456789" });

// Host receives request
hostSocket.on("session:request", ({ viewerDeskId }) => {
  // Accept
  hostSocket.emit("session:accept", { viewerDeskId });
});
```

## Disconnection
```javascript
// Clean disconnect
socket.disconnect();
// Expect: socket leaves rooms, other party notified

// Network failure
// Expect: automatic reconnection (up to 5 attempts)
socket.on("reconnect", (attempt) => {
  console.log("Reconnected after", attempt, "attempts");
});
```
