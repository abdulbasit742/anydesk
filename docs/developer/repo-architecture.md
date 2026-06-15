# Repository Architecture

## Monorepo Structure
```
remotedesk/
├── apps/
│   ├── api/           # Backend API (Express + tRPC)
│   ├── web/           # Next.js web dashboard
│   └── desktop/       # Electron desktop client
├── packages/
│   └── shared/        # Shared types, validators, constants
├── config/            # Docker, nginx, prometheus configs
├── scripts/           # Deployment, backup scripts
└── docs/              # Documentation
```

## Technology Stack
| Layer | Technology |
|-------|-----------|
| API | Express, tRPC, Prisma, PostgreSQL |
| Web | Next.js 14, React, Tailwind CSS, Zustand |
| Desktop | Electron, React, Vite |
| Real-time | Socket.IO, WebRTC |
| Shared | TypeScript, Zod |

## Package Relationships
```
shared <-- api
shared <-- web
shared <-- desktop
api <-- web (HTTP + WebSocket)
api <-- desktop (WebSocket)
```

## Key Decisions
- **Monorepo**: Easier cross-package changes
- **tRPC**: End-to-end type safety
- **Prisma**: Type-safe database access
- **Socket.IO**: Fallback support for WebSocket
- **WebRTC**: P2P for low latency

## Development Workflow
1. Make changes in relevant package
2. Run typecheck: `npm run typecheck`
3. Run tests: `npm run test`
4. Build: `npm run build`
