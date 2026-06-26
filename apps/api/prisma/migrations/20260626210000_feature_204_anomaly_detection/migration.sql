CREATE TABLE IF NOT EXISTS "AnomalyEvent" (
  "id" TEXT NOT NULL,
  "deviceId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "severity" TEXT NOT NULL,
  "score" DOUBLE PRECISION NOT NULL,
  "metric" TEXT NOT NULL,
  "observedValue" DOUBLE PRECISION NOT NULL,
  "expectedValue" DOUBLE PRECISION NOT NULL,
  "rootCauseHint" TEXT,
  "dismissed" BOOLEAN NOT NULL DEFAULT false,
  "falsePositive" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AnomalyEvent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "AnomalyBaseline" (
  "id" TEXT NOT NULL,
  "deviceId" TEXT NOT NULL,
  "metric" TEXT NOT NULL,
  "mean" DOUBLE PRECISION NOT NULL,
  "stdDev" DOUBLE PRECISION NOT NULL,
  "sampleCount" INTEGER NOT NULL DEFAULT 0,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AnomalyBaseline_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "AnomalyEvent_deviceId_createdAt_idx" ON "AnomalyEvent"("deviceId", "createdAt");
CREATE UNIQUE INDEX IF NOT EXISTS "AnomalyBaseline_deviceId_metric_key" ON "AnomalyBaseline"("deviceId", "metric");
