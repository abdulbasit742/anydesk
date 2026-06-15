# CI/CD Configuration

## Workflows

### typecheck.yml
- Runs on push/PR to main and develop
- Type-checks frontend and server code
- Uses Node.js 20

### test.yml
- Matrix: Node.js 20 and 22
- Runs unit tests with coverage
- Uploads coverage to Codecov

### build.yml
- Builds production bundle
- Uploads artifacts

### lint.yml
- ESLint check
- Prettier format check

### desktop.yml
- Builds Electron app
- Matrix: Ubuntu, Windows, macOS
- Triggered on desktop-v* tags

### release.yml
- Creates GitHub release
- Uploads build artifacts
- Triggered on v* tags

### security.yml
- npm audit
- CodeQL analysis
- Runs weekly on Mondays

### e2e.yml
- End-to-end browser tests
- Starts dev server, runs tests

## Required Secrets
- GITHUB_TOKEN (auto)
- CODECOV_TOKEN (optional)
