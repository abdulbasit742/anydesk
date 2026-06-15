/**
 * SDK Example: Authentication
 */

import { RemoteDeskClient } from "@remotedesk/sdk";

const client = new RemoteDeskClient({
  apiUrl: "https://api.remotedesk.io/v1",
  socketUrl: "wss://api.remotedesk.io/signaling",
});

// Login
async function authenticate() {
  try {
    const { token, deskId } = await client.login(
      "user@example.com",
      "securePassword123!"
    );
    console.log("Logged in! Desk ID:", deskId);
    return token;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}

// Check auth status
function checkAuth() {
  if (client.isConnected()) {
    console.log("Connected as desk:", client.getDeskId());
  } else {
    console.log("Not connected");
  }
}

// Logout
function logout() {
  client.disconnect();
  console.log("Logged out");
}
