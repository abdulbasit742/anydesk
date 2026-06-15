# QA Automation

## Playwright E2E Tests
Located in `apps/web/e2e/`

### Running
```bash
npx playwright test
npx playwright test --ui        # Interactive mode
npx playwright test --headed    # Show browser
npx playwright show-report      # View report
```

## Backend Integration Tests
Located in `apps/api/test/integration/`

### Running
```bash
npm run test:api:integration
```

## Contract Tests
Located in `packages/shared/test/`

### Running
```bash
npm run test:shared
```

## CI Integration
All tests run in GitHub Actions on every PR.
Playwright tests run daily on schedule.
