-- CreateTable
CREATE TABLE "DeviceFingerprint" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "hardwareId" TEXT NOT NULL,
    "tpmHash" TEXT,
    "secureBootEnabled" BOOLEAN NOT NULL DEFAULT false,
    "osVersion" TEXT NOT NULL,
    "macAddress" TEXT,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "approvedByUserId" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeviceFingerprint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeoFencePolicy" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "action" TEXT NOT NULL DEFAULT 'block',
    "countries" JSONB NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GeoFencePolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZeroTrustPolicy" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "requireMfa" BOOLEAN NOT NULL DEFAULT true,
    "requireApprovedDevice" BOOLEAN NOT NULL DEFAULT true,
    "maxRiskScore" INTEGER NOT NULL DEFAULT 50,
    "allowedHoursStart" TEXT,
    "allowedHoursEnd" TEXT,
    "dlpEnabled" BOOLEAN NOT NULL DEFAULT true,
    "watermarkEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ZeroTrustPolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SecurityAuditLog" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "action" TEXT NOT NULL,
    "userId" TEXT,
    "deviceId" TEXT,
    "ipAddress" TEXT,
    "location" TEXT,
    "riskScore" INTEGER NOT NULL DEFAULT 0,
    "details" JSONB,
    "previousHash" TEXT,
    "hash" TEXT NOT NULL,

    CONSTRAINT "SecurityAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThreatAlert" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "userId" TEXT,
    "deviceId" TEXT,
    "ipAddress" TEXT,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "ThreatAlert_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DeviceFingerprint_deviceId_key" ON "DeviceFingerprint"("deviceId");
CREATE UNIQUE INDEX "DeviceFingerprint_hardwareId_key" ON "DeviceFingerprint"("hardwareId");
CREATE INDEX "SecurityAuditLog_timestamp_idx" ON "SecurityAuditLog"("timestamp");
CREATE INDEX "ThreatAlert_createdAt_idx" ON "ThreatAlert"("createdAt");
CREATE INDEX "ThreatAlert_resolved_idx" ON "ThreatAlert"("resolved");

-- AddForeignKey
ALTER TABLE "DeviceFingerprint" ADD CONSTRAINT "DeviceFingerprint_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DeviceFingerprint" ADD CONSTRAINT "DeviceFingerprint_approvedByUserId_fkey" FOREIGN KEY ("approvedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SecurityAuditLog" ADD CONSTRAINT "SecurityAuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SecurityAuditLog" ADD CONSTRAINT "SecurityAuditLog_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ThreatAlert" ADD CONSTRAINT "ThreatAlert_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ThreatAlert" ADD CONSTRAINT "ThreatAlert_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE SET NULL ON UPDATE CASCADE;
