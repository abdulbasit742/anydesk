# RemoteDesk Socket.IO Examples

## Connection
```javascript
import { io } from "socket.io-client";

const socket = io("wss://api.remotedesk.io/signaling", {
  auth: {
    token: "jwt_token_here"
  },
  transports: ["websocket"]
});

socket.on("connect", () => {
  console.log("Connected:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("Connection error:", err.message);
});
```

## Signaling Flow
```javascript
// Join room with your desk ID
socket.emit("signaling:join", { deskId: "123456789" });

// Send offer to another desk
socket.emit("signaling:offer", {
  targetDeskId: "987654321",
  offer: rtcOffer
});

// Receive answer
socket.on("signaling:answer", ({ answer, from }) => {
  console.log("Received answer from:", from);
  peerConnection.setRemoteDescription(answer);
});

// Exchange ICE candidates
socket.on("signaling:ice-candidate", ({ candidate, from }) => {
  peerConnection.addIceCandidate(candidate);
});

socket.emit("signaling:ice-candidate", {
  targetDeskId: "987654321",
  candidate: iceCandidate
});
```

## Session Events
```javascript
// Request session
socket.emit("session:request", {
  hostDeskId: "987654321",
  viewerDeskId: "123456789"
});

// Host receives request
socket.on("session:request", ({ viewerDeskId }) => {
  console.log("Connection request from:", viewerDeskId);
  // Show accept/reject UI
});

// Accept
socket.emit("session:accept", { viewerDeskId });

// Reject
socket.emit("session:reject", { viewerDeskId });

// End session
socket.emit("session:end", { deskId: "987654321" });
```

## Reconnection
```javascript
socket.on("disconnect", (reason) => {
  if (reason === "io server disconnect") {
    // Server forced disconnect, need to reconnect
    socket.connect();
  }
  // Auto-reconnect happens for other reasons
});

socket.on("reconnect", (attemptNumber) => {
  console.log("Reconnected after", attemptNumber, "attempts");
  // Re-join rooms
  socket.emit("signaling:join", { deskId: "123456789" });
});
```
