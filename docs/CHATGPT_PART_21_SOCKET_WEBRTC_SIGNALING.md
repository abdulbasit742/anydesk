# ChatGPT Part 21 — Socket.IO + WebRTC Signaling Foundation

Branch: `chatgpt/21-socket-webrtc-signaling-foundation-v2`

## Purpose

This part adds the signaling foundation needed for the PC-to-PC view-only screen sharing MVP.

It does not enable remote input, clipboard sync, file transfer, unattended access, screen recording, or silent access.

## Files changed

- `packages/shared/src/webrtc/signalingTypes.ts`
- `packages/shared/src/webrtc/index.ts`
- `packages/shared/src/socket/socketEventTypes.ts`
- `apps/api/src/socket/webrtcSignaling.ts`
- `apps/api/src/socket/index.ts`

This branch is based on Part 20: `chatgpt/20-backend-auth-device-session-routes`.

## Socket rooms

- `user:{userId}`
- `remoteDesk:{remoteDeskId}`
- `device:{deviceId}`
- `session:{sessionId}`

## New MVP events

Device:

- `device:join`
- `device:joined`
- `device:online`
- `device:offline`

Session:

- `session:request`
- `session:requested`
- `session:join`
- `session:joined`
- `session:leave`
- `session:peer_joined`
- `session:peer_left`
- `session:accepted`
- `session:denied`
- `session:ended`
- `session:emergency_stop`

WebRTC:

- `webrtc:offer`
- `webrtc:answer`
- `webrtc:ice_candidate`
- `webrtc:connection_state`
- `webrtc:error`

## MVP behavior

1. A desktop host connects with JWT token.
2. Host emits `device:join` with its `deviceId`.
3. API verifies the device belongs to the authenticated user.
4. API puts the socket in `device:{deviceId}` and `user:{userId}` rooms.
5. Viewer can emit `session:request` with the target `deviceId`.
6. API creates a pending session and emits `session:requested` to the host user/device rooms.
7. Host joins `session:{sessionId}` and emits `session:accepted`.
8. Viewer joins `session:{sessionId}`.
9. API relays WebRTC offer/answer/ICE only after the session is active.
10. `session:ended` or `session:emergency_stop` notifies both sides.

## Safety gates

- WebRTC offer/answer/ICE is blocked until the host accepts and the session is active.
- Device room join requires ownership.
- Session room join requires host/client participation.
- Remote input is not enabled.
- Clipboard/file transfer are not enabled.
- Unattended access is not enabled.
- No screen capture or media content is stored by the server.

## Next required part

Part 22 should implement desktop-side signaling client + host screen capture connection:

- desktop joins device room
- desktop receives `session:requested`
- desktop host accept/deny UI uses socket events
- desktop starts view-only screen capture only after accept
- desktop sends `webrtc:offer`
- viewer responds with `webrtc:answer`
- both sides exchange `webrtc:ice_candidate`

Do not implement remote input until view-only screen sharing passes.
