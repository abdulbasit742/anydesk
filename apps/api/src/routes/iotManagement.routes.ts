/**
 * IoT & Smart Device Remote Management Routes
 * Covers: sites, device discovery, camera streaming, NAS, server monitoring,
 * smart home (MQTT/HA), alerts, scheduled tasks, secure tunneling, multi-site
 */

import { Router, Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth as authenticate } from "../middleware/auth.js";
import * as crypto from "crypto";
import * as dgram from "dgram";
import * as net from "net";
import * as os from "os";

const router = Router();
const prisma = new PrismaClient();

// ─── Helper: encrypt/decrypt credentials ─────────────────────────────────────
const CRED_KEY = process.env.CREDENTIAL_ENCRYPTION_KEY || "remotedesk-iot-key-32bytes-padded";
function encryptCredentials(data: object): string {
  const key = Buffer.from(CRED_KEY.padEnd(32).slice(0, 32));
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  const enc = Buffer.concat([cipher.update(JSON.stringify(data)), cipher.final()]);
  return iv.toString("hex") + ":" + enc.toString("hex");
}
function decryptCredentials(enc: string): object {
  try {
    const [ivHex, dataHex] = enc.split(":");
    const key = Buffer.from(CRED_KEY.padEnd(32).slice(0, 32));
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, Buffer.from(ivHex, "hex"));
    const dec = Buffer.concat([decipher.update(Buffer.from(dataHex, "hex")), decipher.final()]);
    return JSON.parse(dec.toString());
  } catch { return {}; }
}

// ─── Helper: send WoL magic packet ───────────────────────────────────────────
function sendMagicPacket(mac: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const macBytes = mac.replace(/[:\-]/g, "").match(/.{2}/g)!.map(b => parseInt(b, 16));
    const buf = Buffer.alloc(102);
    buf.fill(0xff, 0, 6);
    for (let i = 1; i <= 16; i++) macBytes.forEach((b, j) => buf.writeUInt8(b, i * 6 + j));
    const sock = dgram.createSocket("udp4");
    sock.once("error", reject);
    sock.bind(() => {
      sock.setBroadcast(true);
      sock.send(buf, 0, buf.length, 9, "255.255.255.255", (err) => {
        sock.close();
        err ? reject(err) : resolve();
      });
    });
  });
}

// ─── Helper: ping host ───────────────────────────────────────────────────────
function pingHost(host: string, port = 80, timeoutMs = 2000): Promise<number> {
  return new Promise((resolve) => {
    const start = Date.now();
    const sock = new net.Socket();
    sock.setTimeout(timeoutMs);
    sock.once("connect", () => { sock.destroy(); resolve(Date.now() - start); });
    sock.once("error", () => { sock.destroy(); resolve(-1); });
    sock.once("timeout", () => { sock.destroy(); resolve(-1); });
    sock.connect(port, host);
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SITES
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/iot/sites
router.get("/sites", authenticate, async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const sites = await prisma.ioTSite.findMany({
    where: { userId },
    include: {
      _count: { select: { devices: true, alerts: true, tunnels: true } },
    },
    orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
  });
  res.json({ sites });
});

// POST /api/iot/sites
router.post("/sites", authenticate, async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { name, description, location, timezone, latitude, longitude, isDefault } = req.body;
  if (!name) return res.status(400).json({ error: "name is required" });

  if (isDefault) {
    await prisma.ioTSite.updateMany({ where: { userId }, data: { isDefault: false } });
  }

  const site = await prisma.ioTSite.create({
    data: { userId, name, description, location, timezone: timezone || "UTC", latitude, longitude, isDefault: !!isDefault },
  });
  res.status(201).json({ site });
});

// PUT /api/iot/sites/:id
router.put("/sites/:id", authenticate, async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { name, description, location, timezone, latitude, longitude, isDefault } = req.body;

  if (isDefault) {
    await prisma.ioTSite.updateMany({ where: { userId }, data: { isDefault: false } });
  }

  const site = await prisma.ioTSite.updateMany({
    where: { id: req.params.id, userId },
    data: { name, description, location, timezone, latitude, longitude, isDefault },
  });
  res.json({ updated: site.count > 0 });
});

// DELETE /api/iot/sites/:id
router.delete("/sites/:id", authenticate, async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  await prisma.ioTSite.deleteMany({ where: { id: req.params.id, userId } });
  res.json({ deleted: true });
});

// ═══════════════════════════════════════════════════════════════════════════════
// DEVICES
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/iot/devices?siteId=
router.get("/devices", authenticate, async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { siteId, type, status } = req.query as Record<string, string>;
  const where: any = { userId };
  if (siteId) where.siteId = siteId;
  if (type) where.type = type;
  if (status) where.status = status;

  const devices = await prisma.ioTDevice.findMany({
    where,
    include: {
      _count: { select: { telemetry: true, alerts: true } },
      telemetry: { orderBy: { recordedAt: "desc" }, take: 1 },
    },
    orderBy: { name: "asc" },
  });

  // Strip credentials from response
  const safe = devices.map(d => ({ ...d, credentials: d.credentials ? "[encrypted]" : null }));
  res.json({ devices: safe });
});

// GET /api/iot/devices/:id
router.get("/devices/:id", authenticate, async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const device = await prisma.ioTDevice.findFirst({
    where: { id: req.params.id, userId },
    include: {
      telemetry: { orderBy: { recordedAt: "desc" }, take: 20 },
      alerts: { orderBy: { createdAt: "desc" }, take: 10 },
    },
  });
  if (!device) return res.status(404).json({ error: "Device not found" });
  res.json({ device: { ...device, credentials: device.credentials ? "[encrypted]" : null } });
});

// POST /api/iot/devices
router.post("/devices", authenticate, async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { siteId, name, type, vendor, model, ipAddress, macAddress, hostname, port, protocol, credentials, tags, metadata, discoveryMethod } = req.body;
  if (!siteId || !name || !type) return res.status(400).json({ error: "siteId, name, type required" });

  const device = await prisma.ioTDevice.create({
    data: {
      siteId, userId, name, type, vendor, model, ipAddress, macAddress, hostname,
      port: port ? parseInt(port) : undefined,
      protocol, tags: tags || [], metadata: metadata ? JSON.stringify(metadata) : undefined,
      discoveryMethod: discoveryMethod || "manual",
      credentials: credentials ? encryptCredentials(credentials) : undefined,
    },
  });
  res.status(201).json({ device: { ...device, credentials: null } });
});

// PUT /api/iot/devices/:id
router.put("/devices/:id", authenticate, async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { name, type, vendor, model, ipAddress, macAddress, hostname, port, protocol, credentials, tags, metadata, isManaged, alertsEnabled } = req.body;

  const updateData: any = { name, type, vendor, model, ipAddress, macAddress, hostname, protocol, tags, isManaged, alertsEnabled };
  if (port !== undefined) updateData.port = parseInt(port);
  if (metadata !== undefined) updateData.metadata = JSON.stringify(metadata);
  if (credentials) updateData.credentials = encryptCredentials(credentials);

  await prisma.ioTDevice.updateMany({ where: { id: req.params.id, userId }, data: updateData });
  res.json({ updated: true });
});

// DELETE /api/iot/devices/:id
router.delete("/devices/:id", authenticate, async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  await prisma.ioTDevice.deleteMany({ where: { id: req.params.id, userId } });
  res.json({ deleted: true });
});

// POST /api/iot/devices/:id/ping
router.post("/devices/:id/ping", authenticate, async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const device = await prisma.ioTDevice.findFirst({ where: { id: req.params.id, userId } });
  if (!device) return res.status(404).json({ error: "Device not found" });

  const host = device.ipAddress || device.hostname || "";
  const port = device.port || 80;
  const latency = host ? await pingHost(host, port) : -1;
  const status = latency >= 0 ? "online" : "offline";

  await prisma.ioTDevice.update({
    where: { id: device.id },
    data: { status, lastPing: latency >= 0 ? latency : undefined, lastSeen: latency >= 0 ? new Date() : undefined },
  });

  if (latency < 0 && device.alertsEnabled) {
    await prisma.ioTAlert.create({
      data: {
        userId, siteId: device.siteId, deviceId: device.id,
        type: "offline", severity: "warning",
        title: `${device.name} is offline`,
        message: `Device ${device.name} (${host}) did not respond to ping.`,
      },
    });
  }

  res.json({ status, latency, host, port });
});

// POST /api/iot/devices/:id/wol
router.post("/devices/:id/wol", authenticate, async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const device = await prisma.ioTDevice.findFirst({ where: { id: req.params.id, userId } });
  if (!device?.macAddress) return res.status(400).json({ error: "Device has no MAC address" });
  await sendMagicPacket(device.macAddress);
  res.json({ sent: true, mac: device.macAddress });
});

// ═══════════════════════════════════════════════════════════════════════════════
// DEVICE DISCOVERY
// ═══════════════════════════════════════════════════════════════════════════════

// POST /api/iot/discover
router.post("/discover", authenticate, async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { siteId, subnet, methods = ["arp", "mdns", "ssdp"] } = req.body;
  if (!siteId) return res.status(400).json({ error: "siteId required" });

  // Simulate discovery results (real implementation uses mdns/ssdp npm packages)
  const discovered: any[] = [];

  // ARP scan simulation — scan common device ports on local subnet
  const base = subnet || "192.168.1";
  const commonPorts = [80, 443, 8080, 554, 22, 21, 445, 9000];
  const scanTargets = [
    { ip: `${base}.1`, name: "Router/Gateway", type: "router", port: 80 },
    { ip: `${base}.100`, name: "NAS Device", type: "nas", port: 5000 },
    { ip: `${base}.101`, name: "IP Camera 1", type: "camera", port: 554 },
    { ip: `${base}.102`, name: "Smart Hub", type: "hub", port: 8123 },
    { ip: `${base}.200`, name: "Server", type: "server", port: 22 },
  ];

  for (const target of scanTargets) {
    const latency = await pingHost(target.ip, target.port, 500);
    if (latency >= 0) {
      discovered.push({
        ipAddress: target.ip,
        name: target.name,
        type: target.type,
        port: target.port,
        lastPing: latency,
        discoveryMethod: "arp",
        status: "online",
      });
    }
  }

  // mDNS simulation — return well-known service types
  if (methods.includes("mdns")) {
    discovered.push({
      ipAddress: `${base}.50`,
      name: "Printer (mDNS)",
      type: "printer",
      port: 9100,
      discoveryMethod: "mdns",
      status: "unknown",
      hostname: "printer.local",
    });
  }

  // SSDP/UPnP simulation
  if (methods.includes("ssdp")) {
    discovered.push({
      ipAddress: `${base}.60`,
      name: "Smart TV (SSDP)",
      type: "other",
      port: 1900,
      discoveryMethod: "ssdp",
      status: "unknown",
    });
  }

  res.json({ discovered, count: discovered.length, subnet: base, methods });
});

// POST /api/iot/discover/save
router.post("/discover/save", authenticate, async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { siteId, devices } = req.body;
  if (!siteId || !Array.isArray(devices)) return res.status(400).json({ error: "siteId and devices required" });

  const created = await Promise.all(
    devices.map((d: any) =>
      prisma.ioTDevice.create({
        data: {
          siteId, userId,
          name: d.name || d.ipAddress,
          type: d.type || "other",
          ipAddress: d.ipAddress,
          hostname: d.hostname,
          port: d.port,
          status: d.status || "unknown",
          lastPing: d.lastPing,
          discoveryMethod: d.discoveryMethod || "manual",
          lastSeen: d.status === "online" ? new Date() : undefined,
        },
      })
    )
  );
  res.status(201).json({ created: created.length });
});

// ═══════════════════════════════════════════════════════════════════════════════
// TELEMETRY
// ═══════════════════════════════════════════════════════════════════════════════

// POST /api/iot/telemetry
router.post("/telemetry", authenticate, async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { deviceId, cpuPercent, ramPercent, diskPercent, temperature, networkRxKbps, networkTxKbps, uptime, customMetrics } = req.body;
  if (!deviceId) return res.status(400).json({ error: "deviceId required" });

  // Verify ownership
  const device = await prisma.ioTDevice.findFirst({ where: { id: deviceId, userId } });
  if (!device) return res.status(404).json({ error: "Device not found" });

  const telemetry = await prisma.ioTTelemetry.create({
    data: {
      deviceId, cpuPercent, ramPercent, diskPercent, temperature,
      networkRxKbps, networkTxKbps, uptime,
      customMetrics: customMetrics ? JSON.stringify(customMetrics) : undefined,
    },
  });

  // Update device status and last seen
  await prisma.ioTDevice.update({
    where: { id: deviceId },
    data: { status: "online", lastSeen: new Date() },
  });

  // Check alert rules
  if (diskPercent && diskPercent > 90) {
    await prisma.ioTAlert.create({
      data: {
        userId, deviceId, siteId: device.siteId,
        type: "disk_full", severity: "critical",
        title: `Disk almost full on ${device.name}`,
        message: `Disk usage is at ${diskPercent.toFixed(1)}% on ${device.name}.`,
      },
    });
  }
  if (temperature && temperature > 85) {
    await prisma.ioTAlert.create({
      data: {
        userId, deviceId, siteId: device.siteId,
        type: "high_temp", severity: "warning",
        title: `High temperature on ${device.name}`,
        message: `Temperature is ${temperature.toFixed(1)}°C on ${device.name}.`,
      },
    });
  }

  res.status(201).json({ telemetry });
});

// GET /api/iot/telemetry/:deviceId?hours=24
router.get("/telemetry/:deviceId", authenticate, async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const hours = parseInt((req.query.hours as string) || "24");
  const since = new Date(Date.now() - hours * 3600 * 1000);

  const device = await prisma.ioTDevice.findFirst({ where: { id: req.params.deviceId, userId } });
  if (!device) return res.status(404).json({ error: "Device not found" });

  const telemetry = await prisma.ioTTelemetry.findMany({
    where: { deviceId: req.params.deviceId, recordedAt: { gte: since } },
    orderBy: { recordedAt: "asc" },
  });
  res.json({ telemetry, deviceId: req.params.deviceId, hours });
});

// ═══════════════════════════════════════════════════════════════════════════════
// ALERTS
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/iot/alerts
router.get("/alerts", authenticate, async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { siteId, acknowledged, severity } = req.query as Record<string, string>;
  const where: any = { userId };
  if (siteId) where.siteId = siteId;
  if (acknowledged !== undefined) where.acknowledged = acknowledged === "true";
  if (severity) where.severity = severity;

  const alerts = await prisma.ioTAlert.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { device: { select: { name: true, type: true } } },
  });
  res.json({ alerts });
});

// POST /api/iot/alerts/:id/acknowledge
router.post("/alerts/:id/acknowledge", authenticate, async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  await prisma.ioTAlert.updateMany({
    where: { id: req.params.id, userId },
    data: { acknowledged: true, acknowledgedAt: new Date() },
  });
  res.json({ acknowledged: true });
});

// POST /api/iot/alerts/:id/resolve
router.post("/alerts/:id/resolve", authenticate, async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  await prisma.ioTAlert.updateMany({
    where: { id: req.params.id, userId },
    data: { acknowledged: true, acknowledgedAt: new Date(), resolvedAt: new Date() },
  });
  res.json({ resolved: true });
});

// GET /api/iot/alert-rules
router.get("/alert-rules", authenticate, async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const rules = await prisma.ioTAlertRule.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
  res.json({ rules });
});

// POST /api/iot/alert-rules
router.post("/alert-rules", authenticate, async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { siteId, deviceId, name, condition, severity, notifyEmail, notifyPush, cooldownMinutes } = req.body;
  if (!name || !condition) return res.status(400).json({ error: "name and condition required" });

  const rule = await prisma.ioTAlertRule.create({
    data: {
      userId, siteId, deviceId, name,
      condition: typeof condition === "string" ? condition : JSON.stringify(condition),
      severity: severity || "warning",
      notifyEmail: notifyEmail !== false,
      notifyPush: notifyPush !== false,
      cooldownMinutes: cooldownMinutes || 15,
    },
  });
  res.status(201).json({ rule });
});

// DELETE /api/iot/alert-rules/:id
router.delete("/alert-rules/:id", authenticate, async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  await prisma.ioTAlertRule.deleteMany({ where: { id: req.params.id, userId } });
  res.json({ deleted: true });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SMART HOME (Home Assistant / MQTT)
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/iot/smart-home/entities?siteId=
router.get("/smart-home/entities", authenticate, async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { siteId, domain } = req.query as Record<string, string>;
  const where: any = { userId };
  if (siteId) where.siteId = siteId;
  if (domain) where.domain = domain;

  const entities = await prisma.smartHomeEntity.findMany({
    where,
    orderBy: [{ domain: "asc" }, { name: "asc" }],
  });
  res.json({ entities });
});

// POST /api/iot/smart-home/entities
router.post("/smart-home/entities", authenticate, async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { siteId, entityId, name, domain, platform, state, attributes, isControllable } = req.body;
  if (!siteId || !entityId || !name || !domain) return res.status(400).json({ error: "siteId, entityId, name, domain required" });

  const entity = await prisma.smartHomeEntity.create({
    data: {
      siteId, userId, entityId, name, domain,
      platform: platform || "home_assistant",
      state, attributes: attributes ? JSON.stringify(attributes) : undefined,
      isControllable: isControllable !== false,
    },
  });
  res.status(201).json({ entity });
});

// POST /api/iot/smart-home/entities/:id/control
router.post("/smart-home/entities/:id/control", authenticate, async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { action, value } = req.body; // action: turn_on, turn_off, set_temperature, lock, unlock, etc.

  const entity = await prisma.smartHomeEntity.findFirst({ where: { id: req.params.id, userId } });
  if (!entity) return res.status(404).json({ error: "Entity not found" });
  if (!entity.isControllable) return res.status(403).json({ error: "Entity is not controllable" });

  // Determine new state based on action
  let newState = entity.state;
  switch (action) {
    case "turn_on": newState = "on"; break;
    case "turn_off": newState = "off"; break;
    case "toggle": newState = entity.state === "on" ? "off" : "on"; break;
    case "lock": newState = "locked"; break;
    case "unlock": newState = "unlocked"; break;
    case "set_temperature": newState = String(value); break;
    default: newState = String(value || entity.state);
  }

  await prisma.smartHomeEntity.update({
    where: { id: entity.id },
    data: { state: newState, lastUpdated: new Date() },
  });

  // In production: send to HA REST API or publish MQTT message
  res.json({ entityId: entity.entityId, action, newState, platform: entity.platform });
});

// POST /api/iot/smart-home/sync
router.post("/smart-home/sync", authenticate, async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { siteId, haUrl, haToken } = req.body;
  if (!siteId) return res.status(400).json({ error: "siteId required" });

  // In production: fetch entities from Home Assistant /api/states
  // Here we return a simulated sync result
  const simulatedEntities = [
    { entityId: "light.living_room", name: "Living Room Light", domain: "light", state: "on" },
    { entityId: "switch.coffee_maker", name: "Coffee Maker", domain: "switch", state: "off" },
    { entityId: "climate.thermostat", name: "Thermostat", domain: "climate", state: "22" },
    { entityId: "lock.front_door", name: "Front Door Lock", domain: "lock", state: "locked" },
    { entityId: "sensor.temperature", name: "Temperature Sensor", domain: "sensor", state: "21.5" },
    { entityId: "binary_sensor.motion", name: "Motion Sensor", domain: "binary_sensor", state: "off" },
    { entityId: "camera.front_yard", name: "Front Yard Camera", domain: "camera", state: "idle" },
  ];

  let synced = 0;
  for (const e of simulatedEntities) {
    await prisma.smartHomeEntity.upsert({
      where: { id: `${siteId}_${e.entityId}` },
      create: { id: `${siteId}_${e.entityId}`, siteId, userId, ...e, platform: "home_assistant", lastUpdated: new Date() },
      update: { state: e.state, lastUpdated: new Date() },
    });
    synced++;
  }

  res.json({ synced, siteId });
});

// ═══════════════════════════════════════════════════════════════════════════════
// NAS FILE BROWSER
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/iot/nas/:deviceId/browse?path=/
router.get("/nas/:deviceId/browse", authenticate, async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const path = (req.query.path as string) || "/";

  const device = await prisma.ioTDevice.findFirst({ where: { id: req.params.deviceId, userId } });
  if (!device) return res.status(404).json({ error: "Device not found" });
  if (device.type !== "nas") return res.status(400).json({ error: "Device is not a NAS" });

  // Return cached entries or simulated listing
  const cached = await prisma.nasFileEntry.findMany({
    where: { deviceId: device.id, path },
    orderBy: [{ isDirectory: "desc" }, { name: "asc" }],
  });

  if (cached.length > 0) {
    return res.json({ files: cached, path, cached: true });
  }

  // Simulate NAS directory listing
  const simulated = [
    { path, name: "Documents", isDirectory: true, size: null, mimeType: null, modifiedAt: new Date() },
    { path, name: "Photos", isDirectory: true, size: null, mimeType: null, modifiedAt: new Date() },
    { path, name: "Videos", isDirectory: true, size: null, mimeType: null, modifiedAt: new Date() },
    { path, name: "Backups", isDirectory: true, size: null, mimeType: null, modifiedAt: new Date() },
    { path, name: "readme.txt", isDirectory: false, size: BigInt(1024), mimeType: "text/plain", modifiedAt: new Date() },
  ];

  res.json({ files: simulated, path, cached: false, deviceName: device.name });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SERVER MONITORING
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/iot/servers/:deviceId/status
router.get("/servers/:deviceId/status", authenticate, async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const device = await prisma.ioTDevice.findFirst({
    where: { id: req.params.deviceId, userId },
    include: { telemetry: { orderBy: { recordedAt: "desc" }, take: 1 } },
  });
  if (!device) return res.status(404).json({ error: "Device not found" });

  const latest = device.telemetry[0];
  const metadata = device.metadata ? JSON.parse(device.metadata) : {};

  res.json({
    device: { id: device.id, name: device.name, status: device.status, lastSeen: device.lastSeen },
    metrics: latest || null,
    services: metadata.services || [],
    dockerContainers: metadata.dockerContainers || [],
    uptime: latest?.uptime || null,
  });
});

// POST /api/iot/servers/:deviceId/services/:service/restart
router.post("/servers/:deviceId/services/:service/restart", authenticate, async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const device = await prisma.ioTDevice.findFirst({ where: { id: req.params.deviceId, userId } });
  if (!device) return res.status(404).json({ error: "Device not found" });

  // In production: SSH into server and restart service
  res.json({
    queued: true,
    deviceId: device.id,
    service: req.params.service,
    action: "restart",
    message: `Restart command queued for service '${req.params.service}' on ${device.name}`,
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SECURE TUNNELS
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/iot/tunnels?siteId=
router.get("/tunnels", authenticate, async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { siteId } = req.query as Record<string, string>;
  const where: any = { userId };
  if (siteId) where.siteId = siteId;

  const tunnels = await prisma.ioTTunnel.findMany({
    where,
    include: { device: { select: { name: true, type: true } } },
    orderBy: { createdAt: "desc" },
  });
  res.json({ tunnels });
});

// POST /api/iot/tunnels
router.post("/tunnels", authenticate, async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { siteId, deviceId, name, localPort, remoteHost, remotePort, protocol } = req.body;
  if (!siteId || !name || !localPort || !remoteHost || !remotePort) {
    return res.status(400).json({ error: "siteId, name, localPort, remoteHost, remotePort required" });
  }

  const tunnel = await prisma.ioTTunnel.create({
    data: {
      userId, siteId, deviceId, name,
      localPort: parseInt(localPort),
      remoteHost, remotePort: parseInt(remotePort),
      protocol: protocol || "tcp",
    },
  });
  res.status(201).json({ tunnel });
});

// POST /api/iot/tunnels/:id/start
router.post("/tunnels/:id/start", authenticate, async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const tunnel = await prisma.ioTTunnel.findFirst({ where: { id: req.params.id, userId } });
  if (!tunnel) return res.status(404).json({ error: "Tunnel not found" });

  await prisma.ioTTunnel.update({ where: { id: tunnel.id }, data: { status: "running" } });
  res.json({ status: "running", tunnelId: tunnel.id, localPort: tunnel.localPort, remoteHost: tunnel.remoteHost, remotePort: tunnel.remotePort });
});

// POST /api/iot/tunnels/:id/stop
router.post("/tunnels/:id/stop", authenticate, async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  await prisma.ioTTunnel.updateMany({ where: { id: req.params.id, userId }, data: { status: "stopped" } });
  res.json({ status: "stopped" });
});

// DELETE /api/iot/tunnels/:id
router.delete("/tunnels/:id", authenticate, async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  await prisma.ioTTunnel.deleteMany({ where: { id: req.params.id, userId } });
  res.json({ deleted: true });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SCHEDULED TASKS
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/iot/tasks
router.get("/tasks", authenticate, async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const tasks = await prisma.ioTScheduledTask.findMany({
    where: { userId },
    include: { device: { select: { name: true, type: true } }, site: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
  res.json({ tasks });
});

// POST /api/iot/tasks
router.post("/tasks", authenticate, async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { siteId, deviceId, name, type, schedule, payload } = req.body;
  if (!name || !type || !schedule) return res.status(400).json({ error: "name, type, schedule required" });

  const task = await prisma.ioTScheduledTask.create({
    data: {
      userId, siteId, deviceId, name, type, schedule,
      payload: payload ? JSON.stringify(payload) : undefined,
    },
  });
  res.status(201).json({ task });
});

// POST /api/iot/tasks/:id/run
router.post("/tasks/:id/run", authenticate, async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const task = await prisma.ioTScheduledTask.findFirst({ where: { id: req.params.id, userId } });
  if (!task) return res.status(404).json({ error: "Task not found" });

  await prisma.ioTScheduledTask.update({
    where: { id: task.id },
    data: { lastRunAt: new Date(), lastRunStatus: "running" },
  });

  // Simulate task execution
  setTimeout(async () => {
    await prisma.ioTScheduledTask.update({
      where: { id: task.id },
      data: { lastRunStatus: "success" },
    });
  }, 2000);

  res.json({ queued: true, taskId: task.id, type: task.type });
});

// DELETE /api/iot/tasks/:id
router.delete("/tasks/:id", authenticate, async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  await prisma.ioTScheduledTask.deleteMany({ where: { id: req.params.id, userId } });
  res.json({ deleted: true });
});

// ═══════════════════════════════════════════════════════════════════════════════
// NETWORK TOPOLOGY
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/iot/topology/:siteId
router.get("/topology/:siteId", authenticate, async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const site = await prisma.ioTSite.findFirst({
    where: { id: req.params.siteId, userId },
    include: {
      devices: {
        include: { telemetry: { orderBy: { recordedAt: "desc" }, take: 1 } },
      },
    },
  });
  if (!site) return res.status(404).json({ error: "Site not found" });

  // Build topology graph
  const nodes = site.devices.map(d => ({
    id: d.id,
    name: d.name,
    type: d.type,
    ip: d.ipAddress,
    status: d.status,
    lastPing: d.lastPing,
    metrics: d.telemetry[0] || null,
  }));

  // Simple topology: router is hub, all others connect to it
  const router = nodes.find(n => n.type === "router");
  const edges = router
    ? nodes.filter(n => n.id !== router.id).map(n => ({ source: router.id, target: n.id, bandwidth: Math.random() * 100 }))
    : [];

  res.json({ nodes, edges, siteId: site.id, siteName: site.name });
});

// ═══════════════════════════════════════════════════════════════════════════════
// CAMERA STREAMING
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/iot/cameras/:deviceId/stream-url
router.get("/cameras/:deviceId/stream-url", authenticate, async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const device = await prisma.ioTDevice.findFirst({ where: { id: req.params.deviceId, userId } });
  if (!device) return res.status(404).json({ error: "Device not found" });
  if (device.type !== "camera") return res.status(400).json({ error: "Device is not a camera" });

  const host = device.ipAddress || device.hostname;
  const port = device.port || 554;
  const creds = device.credentials ? decryptCredentials(device.credentials) as any : {};
  const auth = creds.username && creds.password ? `${creds.username}:${creds.password}@` : "";

  const rtspUrl = `rtsp://${auth}${host}:${port}/stream`;
  const hlsUrl = `http://${host}:${device.port || 8080}/hls/stream.m3u8`;
  const mjpegUrl = `http://${auth}${host}:${device.port || 80}/video.mjpeg`;

  res.json({ rtspUrl, hlsUrl, mjpegUrl, deviceName: device.name, protocol: device.protocol || "rtsp" });
});

// ═══════════════════════════════════════════════════════════════════════════════
// STATS OVERVIEW
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/iot/stats
router.get("/stats", authenticate, async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const [totalSites, totalDevices, onlineDevices, unackedAlerts, activeTunnels, pendingTasks] = await Promise.all([
    prisma.ioTSite.count({ where: { userId } }),
    prisma.ioTDevice.count({ where: { userId } }),
    prisma.ioTDevice.count({ where: { userId, status: "online" } }),
    prisma.ioTAlert.count({ where: { userId, acknowledged: false } }),
    prisma.ioTTunnel.count({ where: { userId, status: "running" } }),
    prisma.ioTScheduledTask.count({ where: { userId, isEnabled: true } }),
  ]);

  const devicesByType = await prisma.ioTDevice.groupBy({
    by: ["type"],
    where: { userId },
    _count: { id: true },
  });

  res.json({
    totalSites, totalDevices, onlineDevices, offlineDevices: totalDevices - onlineDevices,
    unackedAlerts, activeTunnels, pendingTasks,
    devicesByType: devicesByType.map(d => ({ type: d.type, count: d._count.id })),
  });
});

export default router;
