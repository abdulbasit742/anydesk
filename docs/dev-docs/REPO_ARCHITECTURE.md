# Repository Architecture

## Monorepo Structure
```
remotedesk/
├── apps/
│   ├── web/           # Next.js web app + API
│   └── desktop/       # Electron desktop app
├── packages/
│   └── shared/        # Shared types and utilities
├── contracts/         # Zod DTO schemas
├── docs/              # Documentation
├── scripts/           # Deployment scripts
└── .github/           # CI/CD workflows
```

## Apps

### apps/web
- React + TypeScript + Vite + Tailwind
- tRPC + Drizzle ORM + Hono backend
- Socket.IO for real-time
- shadcn/ui components

### apps/desktop
- Electron + React
- Screen capture APIs
- Native OS integration
- Auto-updater

## Packages

### packages/shared
- Shared TypeScript types
- Utility functions
- Business logic modules
- Constants and enums

## Contracts
- Zod schemas for all DTOs
- IPC channel definitions
- Type-safe API contracts

## Key Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| React | 19 | UI framework |
| TypeScript | 5.6 | Type safety |
| Vite | 7 | Build tool |
| Tailwind CSS | 3.4 | Styling |
| tRPC | 11.x | API layer |
| Drizzle ORM | latest | Database |
| Hono | latest | HTTP server |
| Socket.IO | 4.x | Real-time |
| Zod | 3.x | Validation |
| Electron | 33.x | Desktop |

## Data Flow
```
Browser -> React -> tRPC -> Hono -> Drizzle -> MySQL
                     |
                     -> Socket.IO -> WebRTC (P2P)
```

## Module Boundaries
- `apps/web/src/` - Frontend only
- `apps/web/api/` - Backend only
- `packages/shared/` - Shared code
- `contracts/` - Cross-boundary types
