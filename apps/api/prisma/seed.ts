/**
 * Prisma seed — populates the database with demo data for local development.
 * Run: npx prisma db seed
 *
 * Creates:
 *  - 2 demo users (alice + bob)
 *  - 2 devices per user
 *  - 1 completed session between them
 */

import { PrismaClient } from "@prisma/client";
import { createHash, randomBytes } from "node:crypto";

const prisma = new PrismaClient();

function hashPassword(plain: string): string {
  // Simple SHA-256 for seed data only — real auth uses bcrypt via the API
  return createHash("sha256").update(plain).digest("hex");
}

function randomRemoteDeskId(): string {
  return String(Math.floor(100_000_000 + Math.random() * 900_000_000));
}

async function main() {
  console.log("Seeding database…");

  // ── Users ──────────────────────────────────────────────────────────────────
  const alice = await prisma.user.upsert({
    where: { email: "alice@remotedesk.local" },
    update: {},
    create: {
      email: "alice@remotedesk.local",
      passwordHash: hashPassword("password123"),
      fullName: "Alice Demo",
      remoteDeskId: "100000001",
      plan: "PRO",
      devicePassword: "demo-pass",
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: "bob@remotedesk.local" },
    update: {},
    create: {
      email: "bob@remotedesk.local",
      passwordHash: hashPassword("password123"),
      fullName: "Bob Demo",
      remoteDeskId: "200000002",
      plan: "FREE",
      devicePassword: "demo-pass",
    },
  });

  console.log(`✓ Users: ${alice.email}, ${bob.email}`);

  // ── Devices ────────────────────────────────────────────────────────────────
  const aliceWin = await prisma.device.upsert({
    where: { remoteDeskId: "100000001" },
    update: {},
    create: {
      userId: alice.id,
      name: "Alice-Win11",
      platform: "windows",
      remoteDeskId: "100000001",
      remoteDeskIdFormatted: "100 000 001",
      isOnline: true,
      lastSeenAt: new Date(),
    },
  });

  const aliceMac = await prisma.device.upsert({
    where: { remoteDeskId: "100000002" },
    update: {},
    create: {
      userId: alice.id,
      name: "Alice-MacBook",
      platform: "macos",
      remoteDeskId: "100000002",
      remoteDeskIdFormatted: "100 000 002",
      isOnline: false,
      lastSeenAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
  });

  const bobWin = await prisma.device.upsert({
    where: { remoteDeskId: "200000002" },
    update: {},
    create: {
      userId: bob.id,
      name: "Bob-Win10",
      platform: "windows",
      remoteDeskId: "200000002",
      remoteDeskIdFormatted: "200 000 002",
      isOnline: true,
      lastSeenAt: new Date(),
    },
  });

  console.log(`✓ Devices: ${aliceWin.name}, ${aliceMac.name}, ${bobWin.name}`);

  // ── Session ────────────────────────────────────────────────────────────────
  const existingSession = await prisma.session.findFirst({
    where: { hostId: alice.id, clientId: bob.id },
  });

  if (!existingSession) {
    const startedAt = new Date(Date.now() - 1000 * 60 * 30);
    const endedAt = new Date(Date.now() - 1000 * 60 * 5);

    await prisma.session.create({
      data: {
        hostId: alice.id,
        clientId: bob.id,
        status: "ENDED",
        startedAt,
        endedAt,
        durationSeconds: Math.floor((endedAt.getTime() - startedAt.getTime()) / 1000),
      },
    });

    console.log("✓ Demo session created (Alice hosted Bob, 25 min)");
  } else {
    console.log("✓ Demo session already exists — skipped");
  }

  console.log("\nSeed complete.");
  console.log("  alice@remotedesk.local  / password123  (PRO, ID: 100 000 001)");
  console.log("  bob@remotedesk.local    / password123  (FREE, ID: 200 000 002)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
