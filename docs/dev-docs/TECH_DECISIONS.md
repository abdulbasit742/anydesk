# Technology Decisions

## Frontend
### React + TypeScript
- Industry standard
- Strong type safety
- Large ecosystem

### Vite (not Next.js)
- Faster dev experience
- SPA is sufficient
- No SSR needed

### Tailwind CSS
- Utility-first speed
- Consistent design
- Small bundle

### shadcn/ui
- Accessible components
- Customizable
- No lock-in

## Backend
### Hono (not Express)
- Faster
- Edge-ready
- Type-safe

### tRPC
- End-to-end types
- No API client needed
- Zod integration

### Drizzle ORM (not Prisma)
- SQL-like API
- No generate step
- Better performance

### MySQL (not PostgreSQL)
- Familiar to team
- Good performance
- Easy hosting

## Real-time
### Socket.IO + WebRTC
- Socket.IO for signaling
- WebRTC for media (P2P)
- No media server needed

## Desktop
### Electron
- Web tech stack
- Cross-platform
- Mature ecosystem

## Alternatives Considered
| Decision | Chosen | Rejected | Reason |
|----------|--------|----------|--------|
| Bundler | Vite | Webpack | Speed |
| ORM | Drizzle | Prisma | Performance |
| Server | Hono | Express | Modern |
| DB | MySQL | Postgres | Familiarity |
| Desktop | Electron | Tauri | Ecosystem |
