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

CREATE UNIQUE INDEX "DeviceTrust_deviceId_key" ON "DeviceTrust"("deviceId");
CREATE INDEX "DeviceTrust_status_updatedAt_idx" ON "DeviceTrust"("status", "updatedAt");
CREATE INDEX "DeviceTrust_updatedByUserId_updatedAt_idx" ON "DeviceTrust"("updatedByUserId", "updatedAt");
CREATE UNIQUE INDEX "DeviceAccessPolicy_deviceId_key" ON "DeviceAccessPolicy"("deviceId");
CREATE INDEX "DeviceAccessPolicy_unattendedAccessEnabled_updatedAt_idx" ON "DeviceAccessPolicy"("unattendedAccessEnabled", "updatedAt");
CREATE INDEX "DeviceAccessPolicy_remoteInputEnabled_updatedAt_idx" ON "DeviceAccessPolicy"("remoteInputEnabled", "updatedAt");
CREATE INDEX "DeviceAccessPolicy_updatedByUserId_updatedAt_idx" ON "DeviceAccessPolicy"("updatedByUserId", "updatedAt");

ALTER TABLE "DeviceTrust"
  ADD CONSTRAINT "DeviceTrust_deviceId_fkey"
  FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "DeviceAccessPolicy"
  ADD CONSTRAINT "DeviceAccessPolicy_deviceId_fkey"
  FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;
