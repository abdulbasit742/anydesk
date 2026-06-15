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

CREATE UNIQUE INDEX "ConnectorDefinition_key_key" ON "ConnectorDefinition"("key");
CREATE INDEX "ConnectorDefinition_category_availability_idx" ON "ConnectorDefinition"("category", "availability");
CREATE UNIQUE INDEX "ConnectorInstallation_connectorKey_userId_key" ON "ConnectorInstallation"("connectorKey", "userId");
CREATE INDEX "ConnectorInstallation_userId_status_idx" ON "ConnectorInstallation"("userId", "status");
CREATE INDEX "ConnectorInstallation_connectorKey_status_idx" ON "ConnectorInstallation"("connectorKey", "status");
CREATE INDEX "ConnectorAuditEvent_connectorKey_createdAt_idx" ON "ConnectorAuditEvent"("connectorKey", "createdAt");
CREATE INDEX "ConnectorAuditEvent_userId_createdAt_idx" ON "ConnectorAuditEvent"("userId", "createdAt");
CREATE INDEX "ConnectorAuditEvent_type_createdAt_idx" ON "ConnectorAuditEvent"("type", "createdAt");

ALTER TABLE "ConnectorInstallation"
  ADD CONSTRAINT "ConnectorInstallation_connectorKey_fkey"
  FOREIGN KEY ("connectorKey") REFERENCES "ConnectorDefinition"("key") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ConnectorInstallation"
  ADD CONSTRAINT "ConnectorInstallation_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ConnectorAuditEvent"
  ADD CONSTRAINT "ConnectorAuditEvent_connectorKey_fkey"
  FOREIGN KEY ("connectorKey") REFERENCES "ConnectorDefinition"("key") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ConnectorAuditEvent"
  ADD CONSTRAINT "ConnectorAuditEvent_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
