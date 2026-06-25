-- CreateTable
CREATE TABLE "SupportTicket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'open',
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "deviceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "aiSummary" TEXT,
    "aiResolution" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SupportTicket_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SupportTicket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DiagnosticReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "deviceId" TEXT NOT NULL,
    "ticketId" TEXT,
    "cpuStatus" TEXT NOT NULL,
    "memoryStatus" TEXT NOT NULL,
    "diskStatus" TEXT NOT NULL,
    "networkStatus" TEXT NOT NULL,
    "securityStatus" TEXT NOT NULL,
    "aiAnalysis" TEXT NOT NULL,
    "recommendedActions" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DiagnosticReport_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DiagnosticReport_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "SupportTicket" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SessionReplay" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "eventsJson" TEXT NOT NULL,
    "aiSummary" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SessionReplay_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PredictiveAlert" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "deviceId" TEXT NOT NULL,
    "component" TEXT NOT NULL,
    "predictedFailureDate" DATETIME,
    "confidenceScore" REAL NOT NULL,
    "reasoning" TEXT NOT NULL,
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PredictiveAlert_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "SupportTicket_deviceId_idx" ON "SupportTicket"("deviceId");
CREATE INDEX "SupportTicket_userId_idx" ON "SupportTicket"("userId");
CREATE INDEX "DiagnosticReport_deviceId_idx" ON "DiagnosticReport"("deviceId");
CREATE INDEX "DiagnosticReport_ticketId_idx" ON "DiagnosticReport"("ticketId");
CREATE UNIQUE INDEX "SessionReplay_sessionId_key" ON "SessionReplay"("sessionId");
CREATE INDEX "PredictiveAlert_deviceId_idx" ON "PredictiveAlert"("deviceId");
