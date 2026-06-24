-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'PRO', 'BUSINESS', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('PENDING', 'ACTIVE', 'ENDED', 'REJECTED', 'FAILED');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'PAST_DUE', 'CANCELED', 'TRIALING', 'INCOMPLETE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "remoteDeskId" TEXT NOT NULL,
    "devicePassword" TEXT,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "socketId" TEXT,
    "lastSeenAt" TIMESTAMP(3),
    "plan" "Plan" NOT NULL DEFAULT 'FREE',
    "stripeCustomerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Device" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "remoteDeskId" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "lastSeenAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceTrust" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'untrusted',
    "reason" TEXT,
    "trustedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "updatedByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeviceTrust_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceAccessPolicy" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "unattendedAccessEnabled" BOOLEAN NOT NULL DEFAULT false,
    "remoteInputEnabled" BOOLEAN NOT NULL DEFAULT false,
    "clipboardSyncEnabled" BOOLEAN NOT NULL DEFAULT false,
    "fileTransferEnabled" BOOLEAN NOT NULL DEFAULT false,
    "requiresSessionApproval" BOOLEAN NOT NULL DEFAULT true,
    "maxSessionMinutes" INTEGER NOT NULL DEFAULT 60,
    "updatedByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeviceAccessPolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceCommand" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "issuedByUserId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "payload" JSONB,
    "result" JSONB,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "deliveredAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeviceCommand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceAuditEvent" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "actorUserId" TEXT,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeviceAuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
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

-- CreateTable
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

-- CreateTable
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

-- CreateTable
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

-- CreateTable
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

-- CreateTable
CREATE TABLE "ConnectorDefinition" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "availability" TEXT NOT NULL DEFAULT 'available',
    "description" TEXT NOT NULL,
    "capabilities" JSONB NOT NULL,
    "docsUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConnectorDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConnectorInstallation" (
    "id" TEXT NOT NULL,
    "connectorKey" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'installed',
    "installedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uninstalledAt" TIMESTAMP(3),
    "config" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConnectorInstallation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConnectorAuditEvent" (
    "id" TEXT NOT NULL,
    "connectorKey" TEXT NOT NULL,
    "userId" TEXT,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConnectorAuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "hostId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "status" "SessionStatus" NOT NULL DEFAULT 'PENDING',
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "duration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "plan" "Plan" NOT NULL DEFAULT 'FREE',
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "stripeSubscriptionId" TEXT,
    "stripePriceId" TEXT,
    "currentPeriodEnd" TIMESTAMP(3),
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_remoteDeskId_key" ON "User"("remoteDeskId");

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "Device_remoteDeskId_key" ON "Device"("remoteDeskId");

-- CreateIndex
CREATE UNIQUE INDEX "DeviceTrust_deviceId_key" ON "DeviceTrust"("deviceId");

-- CreateIndex
CREATE INDEX "DeviceTrust_status_updatedAt_idx" ON "DeviceTrust"("status", "updatedAt");

-- CreateIndex
CREATE INDEX "DeviceTrust_updatedByUserId_updatedAt_idx" ON "DeviceTrust"("updatedByUserId", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "DeviceAccessPolicy_deviceId_key" ON "DeviceAccessPolicy"("deviceId");

-- CreateIndex
CREATE INDEX "DeviceAccessPolicy_unattendedAccessEnabled_updatedAt_idx" ON "DeviceAccessPolicy"("unattendedAccessEnabled", "updatedAt");

-- CreateIndex
CREATE INDEX "DeviceAccessPolicy_remoteInputEnabled_updatedAt_idx" ON "DeviceAccessPolicy"("remoteInputEnabled", "updatedAt");

-- CreateIndex
CREATE INDEX "DeviceAccessPolicy_updatedByUserId_updatedAt_idx" ON "DeviceAccessPolicy"("updatedByUserId", "updatedAt");

-- CreateIndex
CREATE INDEX "DeviceCommand_deviceId_status_expiresAt_idx" ON "DeviceCommand"("deviceId", "status", "expiresAt");

-- CreateIndex
CREATE INDEX "DeviceCommand_issuedByUserId_createdAt_idx" ON "DeviceCommand"("issuedByUserId", "createdAt");

-- CreateIndex
CREATE INDEX "DeviceAuditEvent_deviceId_createdAt_idx" ON "DeviceAuditEvent"("deviceId", "createdAt");

-- CreateIndex
CREATE INDEX "DeviceAuditEvent_actorUserId_createdAt_idx" ON "DeviceAuditEvent"("actorUserId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "LaunchCheck_key_key" ON "LaunchCheck"("key");

-- CreateIndex
CREATE INDEX "LaunchCheck_area_status_idx" ON "LaunchCheck"("area", "status");

-- CreateIndex
CREATE INDEX "LaunchCheck_createdByUserId_createdAt_idx" ON "LaunchCheck"("createdByUserId", "createdAt");

-- CreateIndex
CREATE INDEX "ReleaseCandidate_status_createdAt_idx" ON "ReleaseCandidate"("status", "createdAt");

-- CreateIndex
CREATE INDEX "ReleaseCandidate_createdByUserId_createdAt_idx" ON "ReleaseCandidate"("createdByUserId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ReleaseCandidate_version_gitSha_key" ON "ReleaseCandidate"("version", "gitSha");

-- CreateIndex
CREATE INDEX "RolloutApproval_releaseCandidateId_decision_idx" ON "RolloutApproval"("releaseCandidateId", "decision");

-- CreateIndex
CREATE INDEX "RolloutApproval_requestedByUserId_createdAt_idx" ON "RolloutApproval"("requestedByUserId", "createdAt");

-- CreateIndex
CREATE INDEX "MigrationCheck_releaseCandidateId_status_idx" ON "MigrationCheck"("releaseCandidateId", "status");

-- CreateIndex
CREATE INDEX "MigrationCheck_risk_reviewed_idx" ON "MigrationCheck"("risk", "reviewed");

-- CreateIndex
CREATE INDEX "MigrationCheck_createdByUserId_createdAt_idx" ON "MigrationCheck"("createdByUserId", "createdAt");

-- CreateIndex
CREATE INDEX "SupportEscalation_status_priority_createdAt_idx" ON "SupportEscalation"("status", "priority", "createdAt");

-- CreateIndex
CREATE INDEX "SupportEscalation_createdByUserId_createdAt_idx" ON "SupportEscalation"("createdByUserId", "createdAt");

-- CreateIndex
CREATE INDEX "SupportEscalation_assignedToUserId_createdAt_idx" ON "SupportEscalation"("assignedToUserId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ConnectorDefinition_key_key" ON "ConnectorDefinition"("key");

-- CreateIndex
CREATE INDEX "ConnectorDefinition_category_availability_idx" ON "ConnectorDefinition"("category", "availability");

-- CreateIndex
CREATE INDEX "ConnectorInstallation_userId_status_idx" ON "ConnectorInstallation"("userId", "status");

-- CreateIndex
CREATE INDEX "ConnectorInstallation_connectorKey_status_idx" ON "ConnectorInstallation"("connectorKey", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ConnectorInstallation_connectorKey_userId_key" ON "ConnectorInstallation"("connectorKey", "userId");

-- CreateIndex
CREATE INDEX "ConnectorAuditEvent_connectorKey_createdAt_idx" ON "ConnectorAuditEvent"("connectorKey", "createdAt");

-- CreateIndex
CREATE INDEX "ConnectorAuditEvent_userId_createdAt_idx" ON "ConnectorAuditEvent"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ConnectorAuditEvent_type_createdAt_idx" ON "ConnectorAuditEvent"("type", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripeSubscriptionId_key" ON "Subscription"("stripeSubscriptionId");

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceTrust" ADD CONSTRAINT "DeviceTrust_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceAccessPolicy" ADD CONSTRAINT "DeviceAccessPolicy_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceCommand" ADD CONSTRAINT "DeviceCommand_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceCommand" ADD CONSTRAINT "DeviceCommand_issuedByUserId_fkey" FOREIGN KEY ("issuedByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceAuditEvent" ADD CONSTRAINT "DeviceAuditEvent_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceAuditEvent" ADD CONSTRAINT "DeviceAuditEvent_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaunchCheck" ADD CONSTRAINT "LaunchCheck_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReleaseCandidate" ADD CONSTRAINT "ReleaseCandidate_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolloutApproval" ADD CONSTRAINT "RolloutApproval_releaseCandidateId_fkey" FOREIGN KEY ("releaseCandidateId") REFERENCES "ReleaseCandidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolloutApproval" ADD CONSTRAINT "RolloutApproval_requestedByUserId_fkey" FOREIGN KEY ("requestedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MigrationCheck" ADD CONSTRAINT "MigrationCheck_releaseCandidateId_fkey" FOREIGN KEY ("releaseCandidateId") REFERENCES "ReleaseCandidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MigrationCheck" ADD CONSTRAINT "MigrationCheck_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportEscalation" ADD CONSTRAINT "SupportEscalation_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportEscalation" ADD CONSTRAINT "SupportEscalation_assignedToUserId_fkey" FOREIGN KEY ("assignedToUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConnectorInstallation" ADD CONSTRAINT "ConnectorInstallation_connectorKey_fkey" FOREIGN KEY ("connectorKey") REFERENCES "ConnectorDefinition"("key") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConnectorInstallation" ADD CONSTRAINT "ConnectorInstallation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConnectorAuditEvent" ADD CONSTRAINT "ConnectorAuditEvent_connectorKey_fkey" FOREIGN KEY ("connectorKey") REFERENCES "ConnectorDefinition"("key") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConnectorAuditEvent" ADD CONSTRAINT "ConnectorAuditEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
