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

CREATE INDEX "DeviceCommand_deviceId_status_expiresAt_idx" ON "DeviceCommand"("deviceId", "status", "expiresAt");
CREATE INDEX "DeviceCommand_issuedByUserId_createdAt_idx" ON "DeviceCommand"("issuedByUserId", "createdAt");
CREATE INDEX "DeviceAuditEvent_deviceId_createdAt_idx" ON "DeviceAuditEvent"("deviceId", "createdAt");
CREATE INDEX "DeviceAuditEvent_actorUserId_createdAt_idx" ON "DeviceAuditEvent"("actorUserId", "createdAt");

ALTER TABLE "DeviceCommand"
  ADD CONSTRAINT "DeviceCommand_deviceId_fkey"
  FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "DeviceCommand"
  ADD CONSTRAINT "DeviceCommand_issuedByUserId_fkey"
  FOREIGN KEY ("issuedByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "DeviceAuditEvent"
  ADD CONSTRAINT "DeviceAuditEvent_deviceId_fkey"
  FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "DeviceAuditEvent"
  ADD CONSTRAINT "DeviceAuditEvent_actorUserId_fkey"
  FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
