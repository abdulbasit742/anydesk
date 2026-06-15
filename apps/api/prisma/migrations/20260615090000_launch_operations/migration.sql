CREATE TABLE "LaunchCheck" (
  "id" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "area" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'fail',
  "required" BOOLEAN NOT NULL DEFAULT true,
  "notes" TEXT,
  "createdByUserId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "LaunchCheck_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ReleaseCandidate" (
  "id" TEXT NOT NULL,
  "version" TEXT NOT NULL,
  "gitSha" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'draft',
  "signedDesktopBuild" BOOLEAN NOT NULL DEFAULT false,
  "migrationsReviewed" BOOLEAN NOT NULL DEFAULT false,
  "smokeTestsPassed" BOOLEAN NOT NULL DEFAULT false,
  "notes" TEXT,
  "createdByUserId" TEXT,
  "promotedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ReleaseCandidate_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RolloutApproval" (
  "id" TEXT NOT NULL,
  "releaseCandidateId" TEXT,
  "requestedByUserId" TEXT,
  "area" TEXT NOT NULL,
  "decision" TEXT NOT NULL DEFAULT 'pending',
  "reason" TEXT,
  "decidedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "RolloutApproval_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MigrationCheck" (
  "id" TEXT NOT NULL,
  "releaseCandidateId" TEXT,
  "name" TEXT NOT NULL,
  "risk" TEXT NOT NULL,
  "touchesAuth" BOOLEAN NOT NULL DEFAULT false,
  "touchesBilling" BOOLEAN NOT NULL DEFAULT false,
  "reviewed" BOOLEAN NOT NULL DEFAULT false,
  "destructive" BOOLEAN NOT NULL DEFAULT false,
  "backfillRows" INTEGER NOT NULL DEFAULT 0,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "notes" TEXT,
  "createdByUserId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "MigrationCheck_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SupportEscalation" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "priority" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "target" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'open',
  "description" TEXT,
  "createdByUserId" TEXT,
  "assignedToUserId" TEXT,
  "resolvedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "SupportEscalation_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "LaunchCheck_key_key" ON "LaunchCheck"("key");
CREATE INDEX "LaunchCheck_area_status_idx" ON "LaunchCheck"("area", "status");
CREATE INDEX "LaunchCheck_createdByUserId_createdAt_idx" ON "LaunchCheck"("createdByUserId", "createdAt");
CREATE UNIQUE INDEX "ReleaseCandidate_version_gitSha_key" ON "ReleaseCandidate"("version", "gitSha");
CREATE INDEX "ReleaseCandidate_status_createdAt_idx" ON "ReleaseCandidate"("status", "createdAt");
CREATE INDEX "ReleaseCandidate_createdByUserId_createdAt_idx" ON "ReleaseCandidate"("createdByUserId", "createdAt");
CREATE INDEX "RolloutApproval_releaseCandidateId_decision_idx" ON "RolloutApproval"("releaseCandidateId", "decision");
CREATE INDEX "RolloutApproval_requestedByUserId_createdAt_idx" ON "RolloutApproval"("requestedByUserId", "createdAt");
CREATE INDEX "MigrationCheck_releaseCandidateId_status_idx" ON "MigrationCheck"("releaseCandidateId", "status");
CREATE INDEX "MigrationCheck_risk_reviewed_idx" ON "MigrationCheck"("risk", "reviewed");
CREATE INDEX "MigrationCheck_createdByUserId_createdAt_idx" ON "MigrationCheck"("createdByUserId", "createdAt");
CREATE INDEX "SupportEscalation_status_priority_createdAt_idx" ON "SupportEscalation"("status", "priority", "createdAt");
CREATE INDEX "SupportEscalation_createdByUserId_createdAt_idx" ON "SupportEscalation"("createdByUserId", "createdAt");
CREATE INDEX "SupportEscalation_assignedToUserId_createdAt_idx" ON "SupportEscalation"("assignedToUserId", "createdAt");

ALTER TABLE "LaunchCheck"
  ADD CONSTRAINT "LaunchCheck_createdByUserId_fkey"
  FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ReleaseCandidate"
  ADD CONSTRAINT "ReleaseCandidate_createdByUserId_fkey"
  FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "RolloutApproval"
  ADD CONSTRAINT "RolloutApproval_releaseCandidateId_fkey"
  FOREIGN KEY ("releaseCandidateId") REFERENCES "ReleaseCandidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "RolloutApproval"
  ADD CONSTRAINT "RolloutApproval_requestedByUserId_fkey"
  FOREIGN KEY ("requestedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "MigrationCheck"
  ADD CONSTRAINT "MigrationCheck_releaseCandidateId_fkey"
  FOREIGN KEY ("releaseCandidateId") REFERENCES "ReleaseCandidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "MigrationCheck"
  ADD CONSTRAINT "MigrationCheck_createdByUserId_fkey"
  FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "SupportEscalation"
  ADD CONSTRAINT "SupportEscalation_createdByUserId_fkey"
  FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "SupportEscalation"
  ADD CONSTRAINT "SupportEscalation_assignedToUserId_fkey"
  FOREIGN KEY ("assignedToUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
