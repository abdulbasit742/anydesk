# ChatGPT Part 19 — Backend Endpoints Required for Dashboard Wiring

Branch: `chatgpt/19-dashboard-api-service-wiring-2026`

This note supports the matching anydesklovable branch that adds direct dashboard API service files.

## Required MVP endpoints

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- optional `POST /api/auth/logout`

Devices:

- `GET /api/devices`
- `GET /api/devices/:id`
- `POST /api/devices/enroll`
- `POST /api/devices/:id/heartbeat`
- `POST /api/devices/:id/revoke`

Sessions:

- `GET /api/sessions`
- `GET /api/sessions/:id`
- `POST /api/sessions`
- `POST /api/sessions/:id/accept`
- `POST /api/sessions/:id/deny`
- `POST /api/sessions/:id/end`
- `POST /api/sessions/:id/emergency-stop`

Health:

- `GET /health`
- `GET /health/ready`

## Response shape recommendation

List responses may return either raw arrays or keyed objects:

- devices: `Device[]` or `{ "devices": Device[] }`
- sessions: `Session[]` or `{ "sessions": Session[] }`

Single-object responses may return either raw objects or keyed objects:

- device: `Device` or `{ "device": Device }`
- session: `Session` or `{ "session": Session }`

## Safety requirements

- Every session request must be auth-gated.
- Device enrollment must never create silent access.
- Session accept/deny must be host-consent based.
- Emergency stop must end media tracks and update state.
- Remote input, clipboard, and file transfer stay disabled until view-only PC-to-PC screen share works.
