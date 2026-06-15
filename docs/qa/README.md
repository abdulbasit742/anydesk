# Quality Assurance

## Automated Tests
- **Playwright E2E**: Web app user flows
- **API Integration**: Backend endpoints
- **Socket.IO**: Real-time communication
- **Contract**: DTO validation with Zod
- **Unit**: Component and utility tests

## Manual Testing
See `manual-testing.md` for complete scripts.

## Test Environments
- Local: Docker Compose dev setup
- CI: GitHub Actions with services
- Staging: Deployed staging environment

## Coverage Targets
- API: 80% minimum
- Web: 70% minimum
- Desktop: 60% minimum (Electron limitations)

## Reporting
- Playwright HTML reports
- Vitest coverage reports
- CI artifacts on failure
