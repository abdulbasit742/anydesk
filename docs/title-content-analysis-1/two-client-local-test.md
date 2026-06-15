# RemoteDesk Two-Client Local Test Harness Guide

This guide provides detailed instructions for setting up and running two RemoteDesk desktop clients locally to simulate a host-viewer remote session. This setup is crucial for end-to-end testing of connection flows, WebRTC signaling, screen streaming, and data channel functionalities.

## 1. Prerequisites

Before proceeding, ensure you have:

*   A fully built RemoteDesk monorepo (refer to the [Build Fix Guide](docs/development/build-fix-guide.md)).
*   All environment variables configured (refer to the [Environment Variables Guide](docs/development/env-vars.md)).
*   The API service (including Socket.IO signaling) and database running (refer to the [Windows PowerShell Run Guide](docs/development/windows-powershell-run-guide.md) or your equivalent setup guide).
*   Two separate instances of the Electron desktop client application. This can be achieved by running two development instances or two separate builds.

## 2. Running Two Desktop Clients

To simulate a host and a viewer, you need to run two instances of the `apps/desktop` application. Each instance will represent a different peer in the remote session.

### Option A: Two Development Instances (Recommended for Testing)

This method allows for easier debugging as each instance will have its own DevTools.

1.  **Open two separate terminal windows.**
2.  **In the first terminal (for Host):**
    ```bash
    cd apps/desktop
    npm run dev # or yarn dev
    ```
    This will launch the first Electron client, which you will configure as the **Host**.
3.  **In the second terminal (for Viewer):**
    ```bash
    cd apps/desktop
    npm run dev # or yarn dev
    ```
    This will launch the second Electron client, which you will configure as the **Viewer**.

### Option B: One Development, One Built Instance (Less Common for Local Testing)

If you prefer, you can run one development instance and one production-built instance. This is more complex for local testing but might be useful for specific scenarios.

1.  **Build the desktop client (if not already built):**
    ```bash
    cd apps/desktop
    npm run build # or yarn build
    ```
2.  **Run the built application:** The executable will be in `apps/desktop/dist/` (e.g., `apps/desktop/dist/win-unpacked/RemoteDesk.exe` on Windows).
3.  **Run the second instance in development mode** as described in Option A.

## 3. Host/Client Account Setup

For a successful connection, both desktop client instances need to be logged in with valid user accounts. You can use existing accounts or create new ones.

1.  **Host Client**: Log in with User A (e.g., `host@example.com`). This user will have a unique RemoteDesk ID and device password.
2.  **Viewer Client**: Log in with User B (e.g., `viewer@example.com`). This user will initiate the connection to User A.

**Note**: Ensure that the API and database are running and accessible for both clients to authenticate.

## 4. Connect Request Flow

This section details the steps to initiate and respond to a connection request.

1.  **Host Client**: Ensure the host client is logged in and displaying its RemoteDesk ID.
2.  **Viewer Client**: In the viewer client, enter the Host Client's RemoteDesk ID into the 
appropriate input field and initiate a connection request.

## 5. Accept/Reject Flow

1.  **Host Client**: Upon receiving the connection request, a modal or notification should appear on the Host Client, asking to accept or reject the incoming connection from the Viewer Client.
2.  **Host Action (Accept)**: Click `Accept` on the Host Client.
    *   **Expected Result**: The connection process should proceed. The Host Client should start preparing the screen stream, and the Viewer Client should indicate that the connection is being established.
3.  **Host Action (Reject)**: Alternatively, click `Reject` on the Host Client.
    *   **Expected Result**: The connection attempt should be terminated. The Viewer Client should receive a notification that the connection was rejected.

## 6. Screen Stream Flow

Assuming the connection request was accepted:

1.  **Host Client**: After accepting the connection, the Host Client should display a screen source picker. Select a screen or window to share.
2.  **Viewer Client**: The Viewer Client should display the remote screen stream from the Host Client.
    *   **Expected Result**: The Viewer Client accurately displays the Host Client's selected screen/window. The stream should be fluid, with minimal latency and good visual quality. Changes on the Host's screen should be reflected on the Viewer's screen in near real-time.

## 7. WebRTC ICE Debugging

If the screen stream does not establish or is unstable, WebRTC ICE (Interactive Connectivity Establishment) debugging is crucial.

1.  **Open Developer Tools**: For both Electron clients, open the Developer Tools (usually `Ctrl+Shift+I` or `Cmd+Option+I`).
2.  **Navigate to `chrome://webrtc-internals`**: In the DevTools console, you can type `window.open('chrome://webrtc-internals')` to open a new window with WebRTC internal statistics.
3.  **Analyze Peer Connection Statistics**: Look for the `RTCPeerConnection` entries. Key metrics to observe:
    *   **ICE Candidate Pairs**: Check the state of candidate pairs (e.g., `succeeded`, `failed`).
    *   **Candidate Types**: Identify if `host`, `srflx` (server reflexive), `prflx` (peer reflexive), or `relay` (TURN) candidates are being used. The presence of `relay` candidates indicates TURN server usage.
    *   **Bytes Sent/Received**: Verify data is flowing through the connection.
    *   **Packet Loss**: High packet loss can indicate network issues.
4.  **Console Logs**: Pay attention to any WebRTC-related errors or warnings in the console.

## 8. Local TURN Fallback Guide

If direct peer-to-peer (P2P) connections fail (e.g., due to strict NATs or firewalls), a TURN server is essential for relaying media. For local testing, you can set up a local TURN server.

1.  **Install Coturn**: Coturn is a popular open-source TURN server. On Linux, you can install it via `sudo apt-get install coturn`. For Windows, you might need to compile from source or find a pre-built binary.
2.  **Configure Coturn**: Create a `turnserver.conf` file. A minimal configuration might look like this:
    ```
    listening-port=3478
    min-port=49152
    max-port=65535
    fingerprint
    lt-cred-mech
    user=turnuser:turnpassword
    realm=remotedesk.com
    no-udp-relay
    no-tcp-relay
    no-tls
    no-dtls
    ```
    **Note**: For local testing, `no-tls` and `no-dtls` can simplify setup, but **never use this in production**.
3.  **Start Coturn**: Run `turnserver -c turnserver.conf -L 127.0.0.1`.
4.  **Update Environment Variables**: Ensure your `apps/api/.env` and `apps/desktop/.env` files have the `TURN_SERVER_URL`, `TURN_SERVER_USERNAME`, and `TURN_SERVER_PASSWORD` configured to point to your local Coturn instance (e.g., `turn:127.0.0.1:3478`).
5.  **Test Connection**: Re-attempt the two-client connection. Observe `chrome://webrtc-internals` for `relay` candidates to confirm TURN server usage.

## 9. Logs to Collect

When troubleshooting, collecting comprehensive logs is vital.

*   **Electron Main Process Logs**: These logs contain information about IPC, native module interactions, and overall application lifecycle. Often found in a temporary directory or accessible via `console.log` in the main process code.
*   **Electron Renderer Process (DevTools Console) Logs**: These logs contain UI-related errors, JavaScript execution issues, and WebRTC events.
*   **API Service Logs**: Logs from your Express/Socket.IO server, including connection events, authentication attempts, and signaling messages.
*   **Browser `chrome://webrtc-internals` Dump**: Save the full dump from `chrome://webrtc-internals` for detailed WebRTC statistics.
*   **Network Traffic (Wireshark/tcpdump)**: For deep network debugging, capture traffic to analyze ICE negotiation and media flow.

---

**Author**: Manus AI
**Date**: June 12, 2026
