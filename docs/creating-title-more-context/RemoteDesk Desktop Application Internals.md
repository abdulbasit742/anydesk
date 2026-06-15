# RemoteDesk Desktop Application Internals

This document delves into the internal architecture and key components of the RemoteDesk desktop application, built with Electron.

## 1. Electron Architecture

The Electron application consists of two main process types:

-   **Main Process:** Runs a Node.js environment and is responsible for application lifecycle, native APIs (e.g., creating windows, menus), and managing renderer processes. It does not have direct access to the DOM.
-   **Renderer Process:** Runs a Chromium browser environment and is responsible for rendering the user interface (UI) using web technologies (HTML, CSS, JavaScript/React). Each window in Electron runs in its own renderer process.

Communication between the main and renderer processes occurs via Inter-Process Communication (IPC) channels.

## 2. Key Modules and Components

### Main Process

-   **`main.ts`:** Entry point for the main process. Handles app lifecycle events, window creation, and IPC setup.
-   **`electron-updater`:** Manages automatic updates for the desktop application.
-   **`electron-builder`:** Used for packaging and distributing the application.
-   **IPC Handlers:** Modules responsible for handling requests from renderer processes (e.g., `ipc/settingsHandler.ts`, `ipc/sessionHandler.ts`).

### Renderer Process

-   **`index.tsx`:** Entry point for the renderer process, where the React application is mounted.
-   **React Components:** UI components for dashboard, session view, settings, etc.
-   **WebRTC Integration:**
    -   **`src/lib/webrtc/webrtcClient.ts`:** Manages WebRTC peer connections, SDP exchange, and ICE candidate handling.
    -   **`src/lib/webrtc/screenCapture.ts`:** Utilizes `navigator.mediaDevices.getDisplayMedia()` to capture screen content.
    -   **`src/lib/webrtc/inputHandler.ts`:** Captures local keyboard/mouse input and sends it over WebRTC data channels.
-   **Socket.IO Client:** Used for signaling with the backend API to establish WebRTC connections.
-   **`src/lib/settings/settingsService.ts`:** Manages application settings persistence (e.g., using `localStorage` or Electron's `store` module).

## 3. WebRTC Data Flow (Desktop to Desktop)

1.  **Signaling (Socket.IO):**
    -   Host and Viewer desktop apps connect to the backend Socket.IO server.
    -   When a session is initiated, the backend coordinates the exchange of WebRTC SDP offers and answers, and ICE candidates between the Host and Viewer.
2.  **Peer Connection Setup:**
    -   The Host creates an `RTCPeerConnection` and adds local media streams (screen capture, audio).
    -   The Host creates an SDP offer and sends it to the Viewer via the signaling server.
    -   The Viewer receives the offer, creates an `RTCPeerConnection`, sets the remote description, creates an SDP answer, and sends it back to the Host.
    -   Both peers exchange ICE candidates to discover network paths.
3.  **Media Streaming:**
    -   Once the WebRTC connection is established, the Host streams its screen and audio to the Viewer directly, bypassing the backend server.
4.  **Data Channels:**
    -   Separate WebRTC data channels are established for control signals (e.g., remote keyboard/mouse input, clipboard sync, file transfer metadata).
    -   Input events captured by the Viewer are sent over a data channel to the Host, which then simulates these inputs on its system.

## 4. Security Considerations

-   **Code Signing:** Ensures the integrity and authenticity of the application.
-   **Input Permissions:** Remote input (keyboard/mouse) and file transfer require explicit user permission on the host side.
-   **WebRTC Security:** WebRTC connections are encrypted by default (DTLS and SRTP).
-   **Content Security Policy (CSP):** Strict CSP is applied to renderer processes to mitigate XSS attacks.

## 5. Performance Optimization

-   **Hardware Acceleration:** Electron leverages Chromium's hardware acceleration for rendering and video processing.
-   **Codec Selection:** WebRTC automatically negotiates optimal video/audio codecs.
-   **Selective Screen Sharing:** Allowing users to select specific windows or regions to share can reduce bandwidth usage.
-   **Frame Rate Limiting:** Dynamically adjusting the screen sharing frame rate based on network conditions.

This document provides a starting point. For more detailed implementation specifics, refer to the source code within `apps/desktop`.
