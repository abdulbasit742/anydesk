# RemoteDesk Backend — Agent Instructions

## This repo
**github.com/abdulbasit742/anydesk** — branch `manus/final-ready`

Part of the RemoteDesk platform. See root `AGENTS.md` for full project context.

## What this repo contains
- `apps/api/` — Node.js + Express REST API + Socket.IO WebRTC signaling server
- `apps/desktop/` — Electron desktop client (host + viewer)
- `packages/shared/` — Shared TypeScript types and event constants

## Key files
| File | Purpose |
|------|---------|
| `apps/api/src/server.ts` | Express app + all routes + Socket.IO init |
| `apps/api/src/config/env.ts` | Env var validation — read this before adding new vars |
| `apps/api/src/socket/index.ts` | WebRTC signaling logic |
| `apps/api/src/middleware/betaFeatureGate.ts` | Feature flags — `BETA_WEBRTC_SIGNALING_ENABLED` must be `true` |
| `apps/api/prisma/schema.prisma` | Database schema |
| `docker-compose.yml` | Runs postgres, redis, api, coturn |
| `packages/shared/src/index.ts` | `ClientEvents` / `ServerEvents` constants |

## Start
```bash
# ─── No Docker, no PostgreSQL (recommended for dev) ───
# From this repo root:
npm install --legacy-peer-deps   # installs all workspaces
npx prisma generate              # must run once after npm install
# apps/api/.env already has DEV_IN_MEMORY_FALLBACK=true
node node_modules/.bin/tsx apps/api/src/server.ts
# → API on http://localhost:5000

# ─── With Docker (production-like) ───
cp .env.production.template .env   # edit JWT_SECRET, JWT_REFRESH_SECRET, CORS_ORIGIN
docker compose up -d
```

## Health check
```
GET http://localhost:5000/health
```

## Rules
- Do not create a separate signaling server process — signaling runs inside `server.ts` via `initSocketServer()`.
- Always add new env vars to `apps/api/.env.example` and `apps/api/src/config/env.ts`.
- Feature gates live in `betaFeatureGate.ts` — use them for new beta features.
