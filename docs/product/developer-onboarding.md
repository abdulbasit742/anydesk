# Developer Onboarding

## Prerequisites
- Node.js 20+
- Docker and Docker Compose
- Git
- VS Code (recommended)

## Repository Setup
```bash
git clone git@github.com:remotedesk/remotedesk.git
cd remotedesk
npm install
```

## Development Environment
```bash
# Start services
docker compose -f infra/docker/docker-compose.dev.yml up -d

# Run migrations
npx prisma migrate dev

# Start all apps in watch mode
npm run dev
```

## Project Structure
```
apps/
  api/       - Express + Socket.IO backend
  web/       - Next.js frontend
  desktop/   - Electron application
packages/
  shared/    - Shared types and utilities
infra/       - Docker, Nginx, Coturn configs
docs/        - Documentation
e2e/         - Playwright tests
```

## Key Technologies
- **Backend**: Node.js, Express, Prisma, PostgreSQL, Redis, Socket.IO
- **Frontend**: React, Next.js, TailwindCSS, React Query
- **Desktop**: Electron, WebRTC, TypeScript
- **Shared**: TypeScript, Zod validation
- **Testing**: Vitest, Playwright, Supertest
- **Infra**: Docker, Nginx, Coturn, Prometheus

## Development Workflow
1. Create feature branch: `git checkout -b feature/name`
2. Make changes
3. Run tests: `npm run test`
4. Run lint: `npm run lint`
5. Run type check: `npm run typecheck`
6. Commit with conventional commits: `feat: description`
7. Push and create PR

## Code Standards
- TypeScript strict mode
- ESLint + Prettier
- Conventional commits
- Feature branch workflow
- PR requires 1 review
- CI must pass

## Testing
- Unit tests alongside source files (`*.test.ts`)
- Integration tests in `test/integration/`
- E2E tests in `e2e/`
- Run all: `npm run test`

## Environment Variables
Copy `infra/.env.template` to `.env` and fill in:
- Database URL
- JWT secret
- Stripe test keys
- Optional: SMTP, Sentry

## Common Commands
```bash
npm run dev              # Start all apps
npm run build            # Build all apps
npm run test             # Run all tests
npm run test:api         # API tests only
npm run test:web         # Web tests only
npm run lint             # Run linter
npm run typecheck        # TypeScript check
npm run db:migrate       # Run migrations
npm run db:studio        # Open Prisma Studio
```

## Architecture Decisions
See [Architecture Docs](architecture.md)

## Getting Help
- Slack: #dev-help
- Docs: `/docs` directory
- API docs: `apps/api/src/docs/`
