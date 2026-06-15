/**
 * SDK Example: Session Management
 */

import { RemoteDeskClient } from "@remotedesk/sdk";

const client = new RemoteDeskClient({
  apiUrl: "https://api.remotedesk.io/v1",
  socketUrl: "wss://api.remotedesk.io/signaling",
});

// Start a session
async function startSession(hostDeskId: string) {
  const socket = client.connect();
  
  return new Promise((resolve, reject) => {
    socket.emit("session:request", {
      hostDeskId,
      viewerDeskId: client.getDeskId(),
    });
    
    socket.on("session:accept", () => resolve("accepted"));
    socket.on("session:reject", () => reject(new Error("Session rejected")));
    
    setTimeout(() => reject(new Error("Session timeout")), 30000);
  });
}

// End a session
function endSession(deskId: string) {
  const socket = client.connect();
  socket.emit("session:end", { deskId });
}

// Listen for session requests
function onSessionRequest(callback: (viewerDeskId: string) => void) {
  const socket = client.connect();
  socket.on("session:request", ({ viewerDeskId }) => {
    callback(viewerDeskId);
  });
}
