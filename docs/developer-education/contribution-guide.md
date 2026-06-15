# RemoteDesk Contribution Guide

## Welcome Contributors!

## Getting Started
1. Fork the repository
2. Clone your fork
3. Install dependencies: `npm install`
4. Set up environment: `cp .env.example .env`
5. Start development: `npm run dev`

## Development Workflow
1. Create feature branch from `main`
   ```bash
   git checkout -b feature/my-feature
   ```
2. Make changes
3. Write tests
4. Run tests: `npm test`
5. Update documentation
6. Submit pull request

## Code Standards

### TypeScript
- Strict mode enabled
- Explicit return types on public APIs
- No `any` type (use `unknown` if needed)

### Linting
```bash
npm run lint       # Check
npm run lint:fix   # Fix
```

### Formatting
- Prettier for code formatting
- Run before commit: `npm run format`

### Naming
- Files: kebab-case.ts
- Components: PascalCase
- Functions: camelCase
- Constants: UPPER_SNAKE_CASE

## Testing Requirements
- Unit tests for all new code
- Integration tests for API changes
- E2E tests for user flows
- Minimum 80% coverage

## Commit Messages
```
type(scope): description

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Example:
```
feat(sessions): add session recording

- Add recording toggle to session UI
- Store recordings in S3
- Add recording consent dialog

Closes #123
```

## Pull Request Process
1. Fill out PR template
2. Link related issues
3. Request review from 2 team members
4. Address review comments
5. CI must pass
6. Squash and merge

## Code Review Guidelines
- Review within 24 hours
- Check: functionality, tests, documentation, security
- Be constructive and kind
- Approve if meets standards

## Community
- Discord: https://discord.gg/remotedesk
- Forum: https://community.remotedesk.io
- Issues: https://github.com/remotedesk/remotedesk/issues
