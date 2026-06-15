# Test Fixture Generation

This document outlines the strategy and tools for generating and managing test fixtures within the RemoteDesk project. Test fixtures are essential for providing consistent, controlled, and isolated data environments for unit, integration, and end-to-end tests, ensuring test reliability and maintainability.

## 1. What are Test Fixtures?

Test fixtures are predefined states or data sets used to set up a testing environment. They ensure that tests run against a known baseline, making them repeatable and independent of external factors or previous test runs. In RemoteDesk, fixtures can represent:

*   **User data:** Different user roles, permissions, and profiles.
*   **Session data:** Active, disconnected, or failed remote sessions.
*   **Device data:** Various types of client and host devices.
*   **API responses:** Mocked responses for external API calls.
*   **Database states:** Pre-populated database tables for integration tests.

## 2. Principles of Test Fixture Management

*   **Isolation:** Each test should ideally use its own set of fixtures or a fresh copy of shared fixtures to prevent test interference.
*   **Readability:** Fixtures should be easy to understand and modify.
*   **Maintainability:** Fixtures should be structured in a way that makes them easy to update as the application evolves.
*   **Realism:** Fixtures should reflect realistic data scenarios without containing sensitive information.
*   **Automation:** The generation and loading of fixtures should be automated as much as possible.

## 3. Tools and Approaches for Fixture Generation

### 3.1. JSON/YAML Files for Static Data

For simple, static data structures, JSON or YAML files are excellent for defining fixtures. These can be easily loaded into tests.

**Use Case:** User profiles, device configurations, predefined error messages.

**Example (`user-fixtures.json`):**
```json
[
  {
    "id": "usr_admin1",
    "email": "admin@example.com",
    "role": "admin",
    "status": "active",
    "mfaEnabled": true
  },
  {
    "id": "usr_standard1",
    "email": "user@example.com",
    "role": "standard",
    "status": "active",
    "mfaEnabled": false
  }
]
```

### 3.2. Faker Libraries for Dynamic/Realistic Data

For generating large volumes of realistic but fake data (e.g., names, addresses, emails, random text), libraries like `Faker.js` (JavaScript/TypeScript) or `Faker` (Python) are invaluable.

**Use Case:** Populating databases for performance testing, generating diverse user data for UI tests.

**Example (TypeScript with `faker-js/faker`):**
```typescript
// packages/shared/tests/fixtures/generateUser.ts
import { faker } from '@faker-js/faker';

export const generateUser = (overrides?: Partial<User>): User => ({
  id: faker.string.uuid(),
  email: faker.internet.email(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  role: faker.helpers.arrayElement(["admin", "standard", "guest"]),
  status: faker.helpers.arrayElement(["active", "inactive", "suspended"]),
  mfaEnabled: faker.datatype.boolean(),
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
  ...overrides,
});

export const generateUsers = (count: number): User[] => {
  return Array.from({ length: count }, () => generateUser());
};
```

### 3.3. Factory Functions/Builders for Complex Objects

For complex objects with relationships or specific business logic, factory functions or builder patterns provide a flexible way to create fixtures programmatically.

**Use Case:** Creating `RTCPeerConnection` objects with specific states, generating nested data structures.

**Example (TypeScript for a Session object):**
```typescript
// packages/shared/tests/fixtures/sessionFactory.ts
import { generateUser } from './generateUser';

interface Session {
  id: string;
  hostId: string;
  clientId: string;
  status: 'connecting' | 'connected' | 'disconnected';
  startTime: string;
  endTime?: string;
  // ... other session properties
}

export const createSession = (overrides?: Partial<Session>): Session => ({
  id: `sess_${Math.random().toString(36).substring(2, 11)}`,
  hostId: generateUser().id,
  clientId: generateUser().id,
  status: 'connected',
  startTime: new Date().toISOString(),
  ...overrides,
});
```

### 3.4. Database Seeding Scripts

For integration tests involving a database, seeding scripts can populate the database with a known set of data before each test suite or test.

**Use Case:** Testing API endpoints that interact with the database.

**Example (Conceptual SQL/ORM script):**
```sql
-- tests/db/seed.sql
INSERT INTO users (id, email, role, status) VALUES ('usr_test1', 'test1@example.com', 'standard', 'active');
INSERT INTO users (id, email, role, status) VALUES ('usr_test2', 'test2@example.com', 'admin', 'active');
-- ... insert more data
```

## 4. Integration with Testing Frameworks

*   **Jest/Vitest (`beforeEach`, `beforeAll`):** Use setup/teardown hooks to load and clean up fixtures for each test or test suite.
*   **Playwright/Cypress:** Integrate fixture loading into E2E test setup, potentially using custom commands or page objects.

## 5. Best Practices

*   **Version Control:** Store fixture definitions (JSON, YAML, factory functions) under version control alongside the code.
*   **Redaction:** Ensure no sensitive production data is ever used in test fixtures. Anonymize or generate fake data.
*   **Minimalism:** Create fixtures that contain only the data relevant to the test case to avoid unnecessary complexity.
*   **Documentation:** Document the purpose and structure of complex fixtures.
*   **Avoid Duplication:** Reuse fixture generation logic where possible.

## 6. Related Documents

*   `module-boundary-tests.md`
*   `data-channel-protocol-tests.md`
*   `reliability-qa-docs.md`
