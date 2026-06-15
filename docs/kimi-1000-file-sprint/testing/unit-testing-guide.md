# Unit Testing Guide

## Test Organization

```
packages/shared/tests/  - Shared contract tests
apps/api/tests/         - Backend service tests
apps/desktop/tests/     - Desktop renderer tests
apps/web/tests/         - Web component tests
```

## Running Tests

```bash
# All tests
pnpm test

# Specific package
cd packages/shared && pnpm test
cd apps/api && pnpm test
cd apps/desktop && pnpm test
cd apps/web && pnpm test
```

## Writing Tests

```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from './my-module';

describe('myModule', () => {
  it('should do something', () => {
    expect(myFunction()).toBe(expected);
  });
});
```

## Coverage Targets

- Shared contracts: 90%
- API services: 80%
- Desktop features: 70%
- Web components: 60%
