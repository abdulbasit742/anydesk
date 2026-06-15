# Contribution Guide

## Getting Started
1. Fork the repository
2. Clone: `git clone https://github.com/your-org/remotedesk.git`
3. Install: `npm install`
4. Setup environment: `cp .env.example .env`
5. Start dev: `npm run dev`

## Development Workflow
1. Create branch: `git checkout -b feature/description`
2. Make changes
3. Run tests: `npm run test`
4. Run lint: `npm run lint`
5. Commit: Follow conventional commits
6. Push and create PR

## Conventional Commits
```
feat: add new feature
fix: fix bug
docs: update documentation
style: formatting changes
refactor: code restructuring
test: add tests
chore: build/tooling changes
security: security fix
```

## Code Standards
- TypeScript strict mode
- ESLint + Prettier
- Tests required for new features
- 80% coverage minimum

## PR Requirements
- [ ] Tests pass
- [ ] Lint passes
- [ ] Type check passes
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] No secrets in code

## Review Process
- All PRs require 2 approvals
- Security changes require security team review
- Breaking changes require architectural review

## Questions?
- Open an issue for bugs
- Start a discussion for questions
- Join our Discord for chat
