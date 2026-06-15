# Test Automation Guide

## Test Structure

```
packages/shared/tests/     # Contract tests
apps/api/tests/            # Backend tests
apps/desktop/tests/        # Desktop tests
apps/web/tests/            # Web tests
```

## Running Tests

```bash
# All tests
pnpm test

# Shared only
cd packages/shared && pnpm test

# API only
cd apps/api && pnpm test

# Desktop only
cd apps/desktop && pnpm test

# Web only
cd apps/web && pnpm test
```

## Coverage Targets

| Module | Target |
|--------|--------|
| Shared contracts | 90% |
| API routes | 80% |
| Desktop services | 70% |
| Web components | 60% |

## CI/CD

Tests run on every push to `main` and `develop` branches.

## Writing Tests

```typescript
import { describe, it, expect } from 'vitest';

describe('Feature', () => {
  it('should work correctly', () => {
    expect(true).toBe(true);
  });
});
```
