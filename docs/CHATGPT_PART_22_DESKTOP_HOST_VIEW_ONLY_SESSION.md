# ChatGPT Part 22 — Desktop Host View-Only Session Helper

Branch: `chatgpt/21-socket-webrtc-signaling-foundation-v2`

## Purpose

Adds a desktop-side MVP helper for the consent-based PC-to-PC view-only session flow.

This builds on Part 21 signaling and prepares the desktop client to:

1. connect to Socket.IO with the API token
2. join a device room
3. receive `session:requested`
4. accept or deny a session
5. start view-only screen capture after host approval
6. send a WebRTC offer
7. relay ICE candidates
8. stop or emergency-stop the session

## Files added

- `apps/desktop/src/renderer/src/services/mvpHostSignaling.ts`

## Safety scope

This helper only supports view-only screen sharing.

It does not enable:

- remote input
- clipboard sync
- file transfer
- unattended access
- silent access
- screen recording

## Integration notes for Manus/Max

The existing desktop UI already has login, device registration, screen source selection, session consent, and old WebRTC helper code. Manus/Max should integrate this helper into the existing UI carefully instead of replacing the UI.

Recommended integration:

1. After desktop device registration, call `createMvpHostSignalingClient(token, callbacks)`.
2. Call `connect()`.
3. Call `joinDevice(device.id)`.
4. When `onSessionRequested` fires, show the existing consent modal.
5. On accept:
   - call `acceptSession(sessionId)`
   - call `startViewOnlyHostSession({ sessionId, sourceId, signaling })`
6. On `onAnswer`, call `hostSession.acceptAnswer(answer)`.
7. On `onIceCandidate`, call `hostSession.addIceCandidate(candidate)`.
8. On stop, call `hostSession.stop()`.
9. On emergency stop, call `hostSession.emergencyStop()`.

## Next part

Part 23 should wire these helpers into the real desktop UI flow and run a two-browser/two-PC test.
