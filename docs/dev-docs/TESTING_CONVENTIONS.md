# Testing Conventions

## Test Structure
```
__tests__/
├── unit/           # Unit tests
├── integration/    # Integration tests
└── e2e/            # End-to-end tests
```

## Naming
- Files: `*.test.ts` or `*.spec.ts`
- Describe blocks: Module or function name
- It blocks: Should describe behavior

## Unit Tests
```typescript
describe('ConnectionManager', () => {
  describe('connect', () => {
    it('should establish connection when host is online', async () => {
      // Arrange
      const manager = new ConnectionManager();

      // Act
      const result = await manager.connect('device-1');

      // Assert
      expect(result.status).toBe('connected');
    });

    it('should fail when host is busy', async () => {
      const manager = new ConnectionManager();
      await expect(manager.connect('busy-device'))
        .rejects.toThrow('Host is busy');
    });
  });
});
```

## Test Patterns
### Arrange-Act-Assert
Always structure tests with clear AAA pattern.

### Given-When-Then
Alternative for behavior-driven tests.

## Mocking
```typescript
// Mock external dependencies
vi.mock('./api', () => ({
  fetchData: vi.fn(),
}));

// Mock with return value
(api.fetchData as Mock).mockResolvedValue({ data: [] });
```

## Coverage Requirements
- Minimum: 70% overall
- Core modules: 80%
- Utils: 90%
- UI components: 60%

## E2E Tests
- Use Playwright
- Test critical user flows
- Run against staging

## Test Utilities
```typescript
// helpers.ts
export function createMockUser(overrides?: Partial<User>): User {
  return {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    ...overrides,
  };
}
```

## Running Tests
```bash
# All tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage

# Specific file
npm run test ConnectionManager.test.ts
```
