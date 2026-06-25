-- IoT & Smart Device Remote Management Migration

-- Sites (locations: home, office, client site)
CREATE TABLE "IoTSite" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "location" TEXT,
  "timezone" TEXT NOT NULL DEFAULT 'UTC',
  "latitude" DOUBLE PRECISION,
  "longitude" DOUBLE PRECISION,
  "isDefault" BOOLEAN NOT NULL DEFAULT false,
  "agentDeviceId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- IoT Devices
CREATE TABLE "IoTDevice" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "siteId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "type" TEXT NOT NULL, -- camera, nas, router, server, smart_light, thermostat, lock, printer, switch, hub, sensor, other
  "vendor" TEXT,
  "model" TEXT,
  "ipAddress" TEXT,
  "macAddress" TEXT,
  "hostname" TEXT,
  "port" INTEGER,
  "protocol" TEXT, -- http, https, rtsp, mqtt, snmp, ssh, smb
  "credentials" TEXT, -- encrypted JSON
  "status" TEXT NOT NULL DEFAULT 'unknown', -- online, offline, warning, error, unknown
  "lastSeen" TIMESTAMP(3),
  "lastPing" DOUBLE PRECISION, -- ms
  "firmwareVersion" TEXT,
  "tags" TEXT[] DEFAULT '{}',
  "metadata" TEXT, -- JSON blob for device-specific data
  "discoveryMethod" TEXT, -- mdns, ssdp, upnp, manual, arp
  "isManaged" BOOLEAN NOT NULL DEFAULT true,
  "alertsEnabled" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("siteId") REFERENCES "IoTSite"("id") ON DELETE CASCADE,
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Device Telemetry (time-series metrics)
CREATE TABLE "IoTTelemetry" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "deviceId" TEXT NOT NULL,
  "cpuPercent" DOUBLE PRECISION,
  "ramPercent" DOUBLE PRECISION,
  "diskPercent" DOUBLE PRECISION,
  "temperature" DOUBLE PRECISION,
  "networkRxKbps" DOUBLE PRECISION,
  "networkTxKbps" DOUBLE PRECISION,
  "uptime" INTEGER, -- seconds
  "customMetrics" TEXT, -- JSON
  "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("deviceId") REFERENCES "IoTDevice"("id") ON DELETE CASCADE
);

-- IoT Alerts
CREATE TABLE "IoTAlert" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "siteId" TEXT,
  "deviceId" TEXT,
  "userId" TEXT NOT NULL,
  "type" TEXT NOT NULL, -- offline, motion, disk_full, high_temp, intrusion, service_down, custom
  "severity" TEXT NOT NULL DEFAULT 'info', -- info, warning, critical
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "metadata" TEXT, -- JSON
  "acknowledged" BOOLEAN NOT NULL DEFAULT false,
  "acknowledgedAt" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Alert Rules
CREATE TABLE "IoTAlertRule" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "siteId" TEXT,
  "deviceId" TEXT,
  "name" TEXT NOT NULL,
  "condition" TEXT NOT NULL, -- JSON: {metric, operator, threshold}
  "severity" TEXT NOT NULL DEFAULT 'warning',
  "notifyEmail" BOOLEAN NOT NULL DEFAULT true,
  "notifyPush" BOOLEAN NOT NULL DEFAULT true,
  "cooldownMinutes" INTEGER NOT NULL DEFAULT 15,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Scheduled Tasks
CREATE TABLE "IoTScheduledTask" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "siteId" TEXT,
  "deviceId" TEXT,
  "name" TEXT NOT NULL,
  "type" TEXT NOT NULL, -- reboot, backup, update, script, wol, command
  "schedule" TEXT NOT NULL, -- cron expression
  "payload" TEXT, -- JSON
  "lastRunAt" TIMESTAMP(3),
  "lastRunStatus" TEXT, -- success, failed, running
  "nextRunAt" TIMESTAMP(3),
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Secure Tunnels
CREATE TABLE "IoTTunnel" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "siteId" TEXT NOT NULL,
  "deviceId" TEXT,
  "name" TEXT NOT NULL,
  "localPort" INTEGER NOT NULL,
  "remoteHost" TEXT NOT NULL,
  "remotePort" INTEGER NOT NULL,
  "protocol" TEXT NOT NULL DEFAULT 'tcp', -- tcp, udp
  "status" TEXT NOT NULL DEFAULT 'stopped', -- running, stopped, error
  "bytesIn" BIGINT NOT NULL DEFAULT 0,
  "bytesOut" BIGINT NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
  FOREIGN KEY ("siteId") REFERENCES "IoTSite"("id") ON DELETE CASCADE
);

-- Smart Home Entities (Home Assistant / MQTT)
CREATE TABLE "SmartHomeEntity" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "siteId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "entityId" TEXT NOT NULL, -- HA entity_id or MQTT topic
  "name" TEXT NOT NULL,
  "domain" TEXT NOT NULL, -- light, switch, climate, lock, cover, sensor, binary_sensor, camera
  "platform" TEXT NOT NULL DEFAULT 'home_assistant', -- home_assistant, mqtt, zigbee2mqtt
  "state" TEXT,
  "attributes" TEXT, -- JSON
  "lastUpdated" TIMESTAMP(3),
  "isControllable" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("siteId") REFERENCES "IoTSite"("id") ON DELETE CASCADE,
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- NAS File Entries (cached directory listings)
CREATE TABLE "NasFileEntry" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "deviceId" TEXT NOT NULL,
  "path" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "isDirectory" BOOLEAN NOT NULL DEFAULT false,
  "size" BIGINT,
  "mimeType" TEXT,
  "modifiedAt" TIMESTAMP(3),
  "cachedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("deviceId") REFERENCES "IoTDevice"("id") ON DELETE CASCADE
);

-- Indexes
CREATE INDEX "IoTDevice_siteId_idx" ON "IoTDevice"("siteId");
CREATE INDEX "IoTDevice_userId_idx" ON "IoTDevice"("userId");
CREATE INDEX "IoTDevice_status_idx" ON "IoTDevice"("status");
CREATE INDEX "IoTTelemetry_deviceId_idx" ON "IoTTelemetry"("deviceId");
CREATE INDEX "IoTTelemetry_recordedAt_idx" ON "IoTTelemetry"("recordedAt");
CREATE INDEX "IoTAlert_userId_idx" ON "IoTAlert"("userId");
CREATE INDEX "IoTAlert_acknowledged_idx" ON "IoTAlert"("acknowledged");
CREATE INDEX "SmartHomeEntity_siteId_idx" ON "SmartHomeEntity"("siteId");
