# Test Data Factory

```typescript
export function createTestUser(overrides?: Partial<User>) {
  return {
    id: `usr_${faker.string.uuid()}`,
    email: faker.internet.email(),
    name: faker.person.fullName(),
    role: 'user',
    ...overrides,
  };
}

export function createTestSession(overrides?: Partial<Session>) {
  return {
    id: `sess_${faker.string.uuid()}`,
    hostDeskId: generateDeskId(),
    status: 'active',
    ...overrides,
  };
}
```
