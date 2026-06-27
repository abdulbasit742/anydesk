# Contributing to RemoteDesk

## Development Setup
1. Clone the repository
2. Install dependencies: `pnpm install`
3. Copy `.env.example` to `.env` and configure
4. Start services: `docker-compose up -d`
5. Run migrations: `npx prisma migrate dev`
6. Start dev server: `pnpm dev`

## Code Style
- TypeScript strict mode
- ESLint + Prettier
- Conventional commits

## Pull Requests
- Create feature branch from `main`
- Write tests for new features
- Update documentation
- Request review from maintainers
