# RemoteDesk

Self-hosted, open-source remote desktop platform. Connect to any device from a browser, desktop app, or mobile — no third-party servers required.

## What's included

| Package | Path | Purpose |
|---------|------|---------|
| `@remotedesk/api` | `apps/api` | Express REST API + Socket.IO signaling + Prisma ORM |
| `@remotedesk/desktop` | `apps/desktop` | Electron 31 desktop client (Windows / macOS / Linux) |
| `@remotedesk/shared` | `packages/shared` | Shared types, validators, audit event builders |

**Separate repos:**
- Browser dashboard PWA: [anydesklovable](https://github.com/abdulbasit742/anydesklovable)
- Mobile app (React Native / Expo): [remotedesk-mobile](https://github.com/abdulbasit742/remotedesk-mobile)

## Quick start

### Requirements

- Node.js 20+
- npm 10+
- PostgreSQL — **optional**, app runs fully in-memory without it

### 1. Install

```bash
npm install
```

### 2. Configure

```bash
cp apps/api/.env.example apps/api/.env
```

Minimum `.env` for local dev (no database needed):

```env
NODE_ENV=development
DEV_IN_MEMORY_FALLBACK=true
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

With `DEV_IN_MEMORY_FALLBACK=true` all data lives in memory and resets on restart. No PostgreSQL required.

### 3. Start the API

```bash
npm run dev --workspace=apps/api
```

API + signaling server starts on `http://localhost:5000`.

### 4. Run the desktop app

```bash
npm run dev --workspace=apps/desktop
```

### 5. Package the Windows installer

```bash
npm run build --workspace=apps/desktop
cd apps/desktop
npx electron-builder@24.13.3 --win --x64
# Output: apps/desktop/dist-installer/RemoteDesk Setup 0.1.0.exe
```

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                apps/api  (port 5000)                     │
│   Express REST  +  Socket.IO signaling  +  Prisma        │
└──────────────┬───────────────────────────────────────────┘
               │  Socket.IO  (websocket / polling)
       ┌───────┴──────────────────────────────────┐
       │                                          │
apps/desktop                           anydesklovable (PWA)
(Electron 31)                          (TanStack Start + Vite)
       │                                          │
       └────────────── WebRTC P2P ───────────────┘
                    (direct after signaling)
```

## Socket.IO event reference

Connect with:
```js
io(SERVER_URL, { auth: { remoteDeskId: "123456789", token: "jwt..." } })
```

| Client → Server | Payload |
|-----------------|---------|
| `connect:request` | `{ targetRemoteDeskId, devicePassword? }` |
| `connect:response` | `{ sessionId, accepted }` |
| `webrtc:offer` | `{ targetSocketId, offer, sessionId }` |
| `webrtc:answer` | `{ targetSocketId, answer, sessionId }` |
| `webrtc:ice` | `{ targetSocketId, candidate, sessionId }` |
| `session:end` | `{ sessionId }` |

| Server → Client | Payload |
|-----------------|---------|
| `incoming:request` | `{ sessionId, requesterId, requesterSocketId }` |
| `request:accepted` | `{ sessionId, hostSocketId }` |
| `request:rejected` | `{ sessionId }` |
| `webrtc:offer` | `{ offer, from, sessionId }` |
| `webrtc:answer` | `{ answer, from, sessionId }` |
| `webrtc:ice` | `{ candidate, from, sessionId }` |
| `peer:disconnected` | `{ sessionId }` |
| `error` | `{ message }` |

## Environment variables (apps/api)

| Variable | Required in prod | Description |
|----------|-----------------|-------------|
| `NODE_ENV` | Yes | `development` or `production` |
| `DEV_IN_MEMORY_FALLBACK` | No | `true` = run without PostgreSQL (dev only) |
| `PORT` | No | Server port (default: 5000) |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | Access token key — min 32 chars |
| `JWT_REFRESH_SECRET` | Yes | Refresh token key — min 32 chars |
| `CORS_ORIGIN` | Yes | Comma-separated allowed origins |
| `STUN_URL` | No | Custom STUN server |
| `TURN_URL` | No | TURN server URL — required for cross-network WebRTC |
| `TURN_USERNAME` | No | TURN credential username |
| `TURN_PASSWORD` | No | TURN credential password |

## npm scripts

```bash
# Install all workspaces
npm install

# API
npm run dev --workspace=apps/api        # watch mode
npm run build --workspace=apps/api      # compile
npm run typecheck --workspace=apps/api  # type check (zero errors)

# Desktop
npm run dev --workspace=apps/desktop    # Electron dev mode
npm run build --workspace=apps/desktop  # build bundles
npm run typecheck --workspace=apps/desktop
```

## Production checklist

- [ ] `NODE_ENV=production`
- [ ] PostgreSQL provisioned, `DATABASE_URL` set
- [ ] `npx prisma migrate deploy` run inside `apps/api`
- [ ] `JWT_SECRET` and `JWT_REFRESH_SECRET` are random strings ≥ 32 chars
- [ ] TURN server deployed (Coturn or Twilio) — required for WebRTC across networks
- [ ] `CORS_ORIGIN` set to your dashboard domain
- [ ] Desktop installer code-signed (removes Windows SmartScreen warning)

## License

MIT
