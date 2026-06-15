# RemoteDesk

RemoteDesk is a full-stack SaaS remote desktop starter inspired by apps like AnyDesk.

## Apps

- `apps/api` - Express API, Prisma models, JWT auth, Socket.IO signaling.
- `apps/web` - Next.js landing page and dashboard.
- `apps/desktop` - Electron desktop client with secure IPC, screen capture hooks, and WebRTC client services.
- `packages/shared` - Shared TypeScript types and event names.

## Quick Start

```bash
npm install
cp apps/api/.env.example apps/api/.env
npm run docker:up
npm run dev:api
npm run dev:web
npm run dev:desktop
```

Remote desktop control is security-sensitive. This starter only enables remote input after an accepted session and keeps signaling separate from screen/video transport.
