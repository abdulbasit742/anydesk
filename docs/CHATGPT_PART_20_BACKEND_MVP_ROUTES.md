# ChatGPT Part 20 — Backend MVP Routes

Branch: `chatgpt/20-backend-auth-device-session-routes`

## Purpose

This part adds the minimum backend route compatibility needed by the Part 19 dashboard API service layer.

Prompt #27 reported that the API, desktop build, dashboard build, and PWA readiness passed, but device connection flow failed because `/api/auth/register` and `/api/sessions` were missing or incomplete. This branch focuses on those blockers.

## Files changed

- `apps/api/src/routes/auth.routes.ts`
- `apps/api/src/routes/device.compat.routes.ts`
- `apps/api/src/routes/session.routes.ts`
- `apps/api/src/server.ts`

## Added or improved endpoints

Auth:

- `POST /api/auth/register` as a compatibility alias for signup
- `POST /api/auth/login` response also returns top-level `accessToken` for dashboard compatibility
- `GET /api/auth/me` response also returns top-level `user`
- `POST /api/auth/logout` clears client-side state only; JWT remains stateless

Devices:

- `POST /api/devices/enroll`
- `POST /api/devices/:deviceId/heartbeat`
- `POST /api/devices/:deviceId/revoke`

Sessions:

- `GET /api/sessions`
- `GET /api/sessions/history`
- `POST /api/sessions`
- `GET /api/sessions/:sessionId`
- `POST /api/sessions/:sessionId/accept`
- `POST /api/sessions/:sessionId/deny`
- `POST /api/sessions/:sessionId/end`
- `POST /api/sessions/:sessionId/emergency-stop`

## Safety scope

This branch does NOT enable:

- silent access
- unattended access
- real remote input
- clipboard sync
- file transfer
- screen recording

The session routes are only for the minimum view-only session lifecycle needed before WebRTC signaling is connected.

## Important limitation

The current Prisma `Session` model does not directly store `deviceId`, so `POST /api/sessions` uses the target device owner as host and stores the viewer as client. A later migration should add explicit `deviceId`, `requestedPermissions`, `reason`, `acceptedAt`, and structured audit fields.

## Next required part

Part 21 should implement Socket.IO/WebRTC signaling:

- session rooms
- device rooms
- user rooms
- `session:request`
- `session:accepted`
- `session:denied`
- `session:ended`
- `session:emergency_stop`
- `webrtc:offer`
- `webrtc:answer`
- `webrtc:ice_candidate`

Do not start remote input until view-only WebRTC screen share passes.
