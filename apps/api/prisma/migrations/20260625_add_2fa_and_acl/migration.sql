-- Add 2FA fields to User
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "twoFactorSecret" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "twoFactorBackupCodes" TEXT;

-- Create Access Control List table
CREATE TABLE IF NOT EXISTS "AccessControlEntry" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "userId" TEXT NOT NULL,
    "remoteDeskId" TEXT NOT NULL,
    "action" TEXT NOT NULL DEFAULT 'block',
    "label" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccessControlEntry_pkey" PRIMARY KEY ("id")
);

-- Unique constraint: one rule per user+device pair
CREATE UNIQUE INDEX IF NOT EXISTS "AccessControlEntry_userId_remoteDeskId_key" ON "AccessControlEntry"("userId", "remoteDeskId");

-- Foreign key
ALTER TABLE "AccessControlEntry" ADD CONSTRAINT "AccessControlEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS "AccessControlEntry_userId_action_idx" ON "AccessControlEntry"("userId", "action");
