-- Cloud Gaming & High-Performance Streaming Schema

-- Streaming profiles (encoder settings, bitrate, resolution, codec)
CREATE TABLE "StreamingProfile" (
  "id"              TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId"          TEXT NOT NULL,
  "name"            TEXT NOT NULL,
  "codec"           TEXT NOT NULL DEFAULT 'h264',
  "encoder"         TEXT NOT NULL DEFAULT 'software',
  "resolution"      TEXT NOT NULL DEFAULT '1920x1080',
  "framerate"       INTEGER NOT NULL DEFAULT 60,
  "bitrate"         INTEGER NOT NULL DEFAULT 20000,
  "minBitrate"      INTEGER NOT NULL DEFAULT 5000,
  "maxBitrate"      INTEGER NOT NULL DEFAULT 50000,
  "adaptiveBitrate" BOOLEAN NOT NULL DEFAULT true,
  "hdrEnabled"      BOOLEAN NOT NULL DEFAULT false,
  "hdrFormat"       TEXT,
  "audioChannels"   INTEGER NOT NULL DEFAULT 2,
  "audioCodec"      TEXT NOT NULL DEFAULT 'opus',
  "latencyMode"     TEXT NOT NULL DEFAULT 'balanced',
  "roiEnabled"      BOOLEAN NOT NULL DEFAULT false,
  "isDefault"       BOOLEAN NOT NULL DEFAULT false,
  "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Detected hardware encoders per device
CREATE TABLE "HardwareEncoder" (
  "id"          TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "deviceId"    TEXT NOT NULL,
  "type"        TEXT NOT NULL,
  "name"        TEXT NOT NULL,
  "vendor"      TEXT NOT NULL,
  "codecs"      TEXT NOT NULL DEFAULT '[]',
  "maxWidth"    INTEGER NOT NULL DEFAULT 3840,
  "maxHeight"   INTEGER NOT NULL DEFAULT 2160,
  "maxFps"      INTEGER NOT NULL DEFAULT 60,
  "available"   BOOLEAN NOT NULL DEFAULT true,
  "detectedAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Detected games per device
CREATE TABLE "DetectedGame" (
  "id"            TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "deviceId"      TEXT NOT NULL,
  "name"          TEXT NOT NULL,
  "processName"   TEXT NOT NULL,
  "platform"      TEXT NOT NULL DEFAULT 'unknown',
  "isRunning"     BOOLEAN NOT NULL DEFAULT false,
  "lastSeen"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "recommendedProfile" TEXT
);

-- Gaming sessions (extends base Session)
CREATE TABLE "GamingSession" (
  "id"              TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "sessionId"       TEXT NOT NULL UNIQUE,
  "profileId"       TEXT,
  "encoderUsed"     TEXT,
  "avgFps"          DOUBLE PRECISION,
  "avgLatency"      DOUBLE PRECISION,
  "avgBitrate"      INTEGER,
  "peakBitrate"     INTEGER,
  "totalFrames"     INTEGER NOT NULL DEFAULT 0,
  "droppedFrames"   INTEGER NOT NULL DEFAULT 0,
  "controllerConnected" BOOLEAN NOT NULL DEFAULT false,
  "hdrActive"       BOOLEAN NOT NULL DEFAULT false,
  "gameDetected"    TEXT,
  "startedAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "endedAt"         TIMESTAMP(3)
);

-- Wake-on-LAN targets
CREATE TABLE "WakeOnLanTarget" (
  "id"          TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId"      TEXT NOT NULL,
  "deviceId"    TEXT,
  "name"        TEXT NOT NULL,
  "macAddress"  TEXT NOT NULL,
  "broadcastIp" TEXT NOT NULL DEFAULT '255.255.255.255',
  "port"        INTEGER NOT NULL DEFAULT 9,
  "lastWoken"   TIMESTAMP(3),
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Performance snapshots for overlay
CREATE TABLE "PerformanceSnapshot" (
  "id"            TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "sessionId"     TEXT NOT NULL,
  "timestamp"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "fps"           DOUBLE PRECISION NOT NULL DEFAULT 0,
  "latencyMs"     DOUBLE PRECISION NOT NULL DEFAULT 0,
  "bitrateKbps"   INTEGER NOT NULL DEFAULT 0,
  "packetLoss"    DOUBLE PRECISION NOT NULL DEFAULT 0,
  "encodeTimeMs"  DOUBLE PRECISION NOT NULL DEFAULT 0,
  "decodeTimeMs"  DOUBLE PRECISION NOT NULL DEFAULT 0,
  "rttMs"         DOUBLE PRECISION NOT NULL DEFAULT 0,
  "jitterMs"      DOUBLE PRECISION NOT NULL DEFAULT 0
);

-- Foreign keys
ALTER TABLE "StreamingProfile" ADD CONSTRAINT "StreamingProfile_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;

ALTER TABLE "HardwareEncoder" ADD CONSTRAINT "HardwareEncoder_deviceId_fkey"
  FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE;

ALTER TABLE "DetectedGame" ADD CONSTRAINT "DetectedGame_deviceId_fkey"
  FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE;

ALTER TABLE "GamingSession" ADD CONSTRAINT "GamingSession_sessionId_fkey"
  FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE;

ALTER TABLE "WakeOnLanTarget" ADD CONSTRAINT "WakeOnLanTarget_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;

ALTER TABLE "PerformanceSnapshot" ADD CONSTRAINT "PerformanceSnapshot_sessionId_fkey"
  FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE;

-- Indexes
CREATE INDEX "StreamingProfile_userId_idx" ON "StreamingProfile"("userId");
CREATE INDEX "HardwareEncoder_deviceId_idx" ON "HardwareEncoder"("deviceId");
CREATE INDEX "DetectedGame_deviceId_idx" ON "DetectedGame"("deviceId");
CREATE INDEX "PerformanceSnapshot_sessionId_idx" ON "PerformanceSnapshot"("sessionId");
CREATE INDEX "WakeOnLanTarget_userId_idx" ON "WakeOnLanTarget"("userId");
