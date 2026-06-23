# Desktop Client Audit

**Date:** June 23, 2026
**Project:** RemoteDesk (anydesk/apps/desktop)
**Auditor:** Manus AI

## 1. Overview

This document summarizes the audit findings for the Electron-based desktop client (`apps/desktop`) within the `anydesk` repository. The client is responsible for capturing the screen, handling WebRTC connections, injecting remote input, and enforcing local security policies.

## 2. Electron Security Configuration

*   **`contextIsolation`:** Expected to be `true`. The main process and renderer process must be strictly isolated to prevent XSS vulnerabilities in the renderer from compromising the host OS.
*   **`nodeIntegration`:** Expected to be `false` in the renderer process. The renderer must not have direct access to Node.js APIs.
*   **Preload IPC Boundaries:** Communication between the renderer and main process must occur strictly through defined IPC channels in a `preload.ts` script. The preload script must expose only specific, safe functions (e.g., `requestSessionAccept`, `triggerEmergencyStop`) rather than generic IPC messaging.

## 3. Remote Control Implementation

*   **Screen Capture:** The client must securely handle OS-level screen capture permissions (especially on macOS). It should only initiate capture after a session has been formally accepted.
*   **Remote Input Lock:** The core mechanism for injecting keyboard and mouse events (likely using a native node module like `robotjs` or similar) must be gated behind a strict state machine. It must refuse to process input events unless the session state is explicitly marked as `input_enabled` AND the backend policy allows it.
*   **Accepted Session Requirement:** The WebRTC service must reject incoming `signal:offer` events unless they correspond to a session ID that has been locally approved by the user via the UI.

## 4. Safety and Privacy

*   **Emergency Stop Behavior:** The client must implement a robust emergency disconnect feature. This should instantly close the `RTCPeerConnection` and the signaling socket.
*   **Device Registration:** The initial pairing process must securely store the generated authentication token. This token should be stored in the system's secure credential vault (e.g., Keychain on macOS, Credential Manager on Windows) rather than plain text.
*   **Logging Privacy:** The client must aggressively redact sensitive information from local logs. This includes session tokens, TURN/STUN credentials, and any clipboard or file transfer contents.

## 5. Identified Gaps and Next Steps

Based on the initial repository inspection, the desktop client requires significant development to meet the security model requirements:

1.  **Input Injection Gating:** The native input injection logic needs to be tightly coupled to the consent state machine.
2.  **WebRTC Signaling:** The WebRTC implementation needs to be synchronized with the Socket.IO events defined in the shared contracts.
3.  **UI Implementation:** The renderer needs a robust UI for displaying incoming session requests, showing viewer identity, and providing the persistent emergency stop button.
