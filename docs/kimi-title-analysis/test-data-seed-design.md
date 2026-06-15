# RemoteDesk API: Test Data Seed Script Design

This document outlines the design for a test data seeding script for the RemoteDesk API. The purpose of this script is to populate the development or test database with realistic, yet anonymized, data to facilitate testing and local development without relying on production data.

## 1. Objectives

*   **Populate Database**: Create a consistent set of users, devices, sessions, and other relevant entities.
*   **Facilitate Testing**: Provide a known state for integration and end-to-end tests.
*   **Local Development**: Enable developers to quickly set up a functional local environment.
*   **Anonymization**: Ensure no sensitive or real user data is used.
*   **Idempotency**: The script should be runnable multiple times without creating duplicate data or errors.

## 2. Technologies

*   **Prisma Client**: For interacting with the database.
*   **Faker.js (or similar library)**: For generating realistic fake data (names, emails, etc.).
*   **TypeScript/Node.js**: The script will be written in TypeScript and executed via Node.js.

## 3. Data Entities to Seed

Based on the existing application structure, the following entities should be seeded:

*   **Users**: A set of distinct users with unique emails and hashed passwords.
*   **Devices**: Devices associated with users.
*   **Sessions**: Historical or active sessions between devices.
*   **Clipboard Entries**: Example clipboard data for testing clipboard sync.
*   **File Transfer Records**: Example file transfer metadata for testing file transfer history.

## 4. Script Structure

The seed script will typically reside in `apps/api/prisma/seed.ts` (or a similar location) and will be executed via `prisma db seed`.

```typescript
// apps/api/prisma/seed.ts (Conceptual Outline)

import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker'; // Assuming faker.js is installed
import * as bcrypt from 'bcrypt'; // For hashing passwords

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // Clear existing data (optional, for idempotency)
  await prisma.session.deleteMany({});
  await prisma.device.deleteMany({});
  await prisma.user.deleteMany({});
  // Add other models to clear as needed

  // Seed Users
  const users = [];
  for (let i = 0; i < 5; i++) {
    const passwordHash = await bcrypt.hash("password123", 10);
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        password: passwordHash,
        name: faker.person.fullName(),
      },
    });
    users.push(user);
    console.log(`Created user with id: ${user.id}`);
  }

  // Seed Devices for each user
  const devices = [];
  for (const user of users) {
    for (let i = 0; i < faker.number.int({ min: 1, max: 3 }); i++) {
      const device = await prisma.device.create({
        data: {
          userId: user.id,
          name: faker.commerce.productName(),
          remoteDeskId: faker.string.uuid(),
          devicePasswordHash: await bcrypt.hash(faker.internet.password(), 10),
        },
      });
      devices.push(device);
      console.log(`Created device with id: ${device.id} for user ${user.id}`);
    }
  }

  // Seed Sessions (example: between two random devices)
  if (devices.length >= 2) {
    for (let i = 0; i < faker.number.int({ min: 2, max: 5 }); i++) {
      const senderDevice = faker.helpers.arrayElement(devices);
      let receiverDevice = faker.helpers.arrayElement(devices);
      while (receiverDevice.id === senderDevice.id) {
        receiverDevice = faker.helpers.arrayElement(devices);
      }

      const session = await prisma.session.create({
        data: {
          hostDeviceId: senderDevice.id,
          viewerDeviceId: receiverDevice.id,
          startedAt: faker.date.past(),
          endedAt: faker.date.recent(),
          status: faker.helpers.arrayElement(['COMPLETED', 'FAILED', 'ACTIVE']),
        },
      });
      console.log(`Created session with id: ${session.id}`);
    }
  }

  // Seed Clipboard Entries (if a model exists)
  // Example: await prisma.clipboardEntry.createMany(...)

  // Seed File Transfer Records (if a model exists)
  // Example: await prisma.fileTransferRecord.createMany(...)

  console.log(`Seeding finished.`);
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

## 5. Execution

To run the seed script, ensure your `package.json` has the `prisma.seed` script configured:

```json
// apps/api/package.json
{
  "scripts": {
    "prisma:seed": "ts-node prisma/seed.ts"
  },
  "prisma": {
    "seed": "npm run prisma:seed"
  }
}
```

Then, execute from the `apps/api` directory:

```bash
npm run prisma:seed
# Or if using the root prisma command
yarn workspace @remotedesk/api prisma db seed
```

## 6. Considerations

*   **Data Relationships**: Ensure the seeding order respects foreign key constraints (e.g., create users before devices).
*   **Scalability**: For very large datasets, consider batching `createMany` operations.
*   **Customization**: Allow for configuration (e.g., number of users, specific data patterns) via environment variables or script arguments.
*   **Rollback**: Provide a way to easily clear seeded data (e.g., `prisma migrate reset` or `prisma.deleteMany` as shown above).

---

**Author**: Manus AI
**Date**: June 12, 2026
