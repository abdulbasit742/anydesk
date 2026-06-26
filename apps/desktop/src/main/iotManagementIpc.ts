/**
 * IoT & Smart Device Remote Management — Desktop IPC Handler
 * Handles: mDNS/SSDP/UPnP discovery, network scan, WoL, secure tunnel,
 *          server monitor, NAS browser, camera stream, topology mapping
 */

import { ipcMain } from "electron";
import * as os from "os";
import * as net from "net";
import * as dgram from "dgram";
import { exec, spawn } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// ─── Network helpers ──────────────────────────────────────────────────────────

function getLocalSubnet(): string {
  const ifaces = os.networkInterfaces();
  for (const name of Object.keys(ifaces)) {
    for (const iface of ifaces[name] || []) {
      if (iface.family === "IPv4" && !iface.internal) {
        const parts = iface.address.split(".");
        return parts.slice(0, 3).join(".");
      }
    }
  }
  return "192.168.1";
}

function pingPort(host: string, port: number, timeoutMs = 1500): Promise<number> {
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

// ─── Device type detection from open ports ───────────────────────────────────
function detectDeviceType(openPorts: number[]): string {
  if (openPorts.includes(554)) return "camera";
  if (openPorts.includes(5000) || openPorts.includes(5001)) return "nas"; // Synology
  if (openPorts.includes(8080) && openPorts.includes(80)) return "router";
  if (openPorts.includes(22) && openPorts.includes(80)) return "server";
  if (openPorts.includes(9100)) return "printer";
  if (openPorts.includes(1883) || openPorts.includes(8883)) return "hub"; // MQTT
  if (openPorts.includes(8123)) return "hub"; // Home Assistant
  if (openPorts.includes(445) || openPorts.includes(139)) return "nas"; // SMB/NAS
  if (openPorts.includes(80) || openPorts.includes(443)) return "other";
  return "other";
}

// ─── ARP scan ────────────────────────────────────────────────────────────────
async function arpScan(subnet: string): Promise<Array<{ ip: string; mac?: string }>> {
  const results: Array<{ ip: string; mac?: string }> = [];
  try {
    // Try arp-scan or nmap if available
    const platform = os.platform();
    let cmd = "";
    if (platform === "linux") cmd = `arp-scan --localnet 2>/dev/null || arp -n 2>/dev/null`;
    else if (platform === "darwin") cmd = `arp -a 2>/dev/null`;
    else if (platform === "win32") cmd = `arp -a 2>nul`;

    const { stdout } = await execAsync(cmd).catch(() => ({ stdout: "" }));
    const lines = stdout.split("\n");
    for (const line of lines) {
      const ipMatch = line.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/);
      const macMatch = line.match(/([0-9a-fA-F]{2}[:\-]){5}[0-9a-fA-F]{2}/);
      if (ipMatch && ipMatch[1].startsWith(subnet)) {
        results.push({ ip: ipMatch[1], mac: macMatch ? macMatch[0] : undefined });
      }
    }
  } catch {}
  return results;
}

// ─── mDNS discovery ──────────────────────────────────────────────────────────
async function discoverMdns(): Promise<Array<{ name: string; type: string; ip: string; port: number }>> {
  const results: Array<{ name: string; type: string; ip: string; port: number }> = [];
  // Send mDNS query for common service types
  const serviceTypes = ["_http._tcp.local", "_rtsp._tcp.local", "_smb._tcp.local", "_ssh._tcp.local", "_hap._tcp.local"];
  const socket = dgram.createSocket({ type: "udp4", reuseAddr: true });

  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      socket.close();
      resolve(results);
    }, 3000);

    socket.on("message", (msg) => {
      // Parse mDNS response (simplified)
      const str = msg.toString("ascii");
      const ipMatch = str.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/);
      if (ipMatch) {
        results.push({
          name: "mDNS Device",
          type: "other",
          ip: ipMatch[1],
          port: 80,
        });
      }
    });

    socket.bind(5353, () => {
      socket.addMembership("224.0.0.251");
      // Send query for each service type
      for (const svc of serviceTypes) {
        const query = Buffer.alloc(12 + svc.length + 6);
        query.writeUInt16BE(0, 0); // ID
        query.writeUInt16BE(0, 2); // Flags (query)
        query.writeUInt16BE(1, 4); // Questions
        // Simplified — real mDNS needs proper DNS packet encoding
        socket.send(query, 5353, "224.0.0.251");
      }
    });
  });
}

// ─── SSDP/UPnP discovery ─────────────────────────────────────────────────────
async function discoverSsdp(): Promise<Array<{ name: string; type: string; ip: string; port: number; location?: string }>> {
  const results: Array<{ name: string; type: string; ip: string; port: number; location?: string }> = [];
  const SSDP_ADDR = "239.255.255.250";
  const SSDP_PORT = 1900;
  const MSEARCH = [
    "M-SEARCH * HTTP/1.1",
    `HOST: ${SSDP_ADDR}:${SSDP_PORT}`,
    'MAN: "ssdp:discover"',
    "MX: 3",
    "ST: ssdp:all",
    "",
    "",
  ].join("\r\n");

  return new Promise((resolve) => {
    const sock = dgram.createSocket("udp4");
    const timeout = setTimeout(() => { sock.close(); resolve(results); }, 4000);

    sock.on("message", (msg, rinfo) => {
      const str = msg.toString();
      const locationMatch = str.match(/LOCATION:\s*(.+)/i);
      const serverMatch = str.match(/SERVER:\s*(.+)/i);
      const ip = rinfo.address;

      if (!results.find(r => r.ip === ip)) {
        let type = "other";
        const server = serverMatch ? serverMatch[1].toLowerCase() : "";
        if (server.includes("router") || server.includes("gateway")) type = "router";
        else if (server.includes("tv") || server.includes("dlna")) type = "other";
        else if (server.includes("nas") || server.includes("synology") || server.includes("qnap")) type = "nas";

        results.push({
          name: serverMatch ? serverMatch[1].trim() : `UPnP Device (${ip})`,
          type,
          ip,
          port: rinfo.port,
          location: locationMatch ? locationMatch[1].trim() : undefined,
        });
      }
    });

    sock.bind(() => {
      const buf = Buffer.from(MSEARCH);
      sock.send(buf, 0, buf.length, SSDP_PORT, SSDP_ADDR);
    });
  });
}

// ─── Full network scan ───────────────────────────────────────────────────────
async function fullNetworkScan(subnet: string): Promise<any[]> {
  const commonPorts = [22, 80, 443, 554, 8080, 8443, 5000, 5001, 9100, 445, 1883, 8123, 9000, 3000, 4200];
  const discovered: any[] = [];

  // Scan a range of IPs
  const scanPromises: Promise<void>[] = [];
  for (let i = 1; i <= 254; i++) {
    const ip = `${subnet}.${i}`;
    scanPromises.push(
      (async () => {
        const openPorts: number[] = [];
        // Check a few key ports quickly
        for (const port of commonPorts.slice(0, 5)) {
          const latency = await pingPort(ip, port, 300);
          if (latency >= 0) openPorts.push(port);
        }
        if (openPorts.length > 0) {
          discovered.push({
            ipAddress: ip,
            type: detectDeviceType(openPorts),
            openPorts,
            status: "online",
            lastPing: Math.min(...openPorts.map(() => 0)),
            discoveryMethod: "arp",
          });
        }
      })()
    );
  }

  // Run in batches of 20
  for (let i = 0; i < scanPromises.length; i += 20) {
    await Promise.all(scanPromises.slice(i, i + 20));
  }

  return discovered;
}

// ─── Local system info ───────────────────────────────────────────────────────
async function getLocalSystemInfo() {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const uptime = os.uptime();
  const platform = os.platform();
  const hostname = os.hostname();
  const ifaces = os.networkInterfaces();

  // Get disk info
  let diskInfo: any = null;
  try {
    if (platform === "linux" || platform === "darwin") {
      const { stdout } = await execAsync("df -h / 2>/dev/null | tail -1");
      const parts = stdout.trim().split(/\s+/);
      diskInfo = { total: parts[1], used: parts[2], free: parts[3], percent: parts[4] };
    } else if (platform === "win32") {
      const { stdout } = await execAsync('wmic logicaldisk get size,freespace,caption 2>nul');
      diskInfo = { raw: stdout.trim() };
    }
  } catch {}

  // Get running services
  let services: string[] = [];
  try {
    if (platform === "linux") {
      const { stdout } = await execAsync("systemctl list-units --type=service --state=running --no-pager --no-legend 2>/dev/null | head -20");
      services = stdout.trim().split("\n").map(l => l.split(/\s+/)[0]).filter(Boolean);
    } else if (platform === "darwin") {
      const { stdout } = await execAsync("launchctl list 2>/dev/null | head -20");
      services = stdout.trim().split("\n").slice(1).map(l => l.split(/\s+/)[2]).filter(Boolean);
    }
  } catch {}

  // Get Docker containers if available
  let dockerContainers: any[] = [];
  try {
    const { stdout } = await execAsync('docker ps --format "{{.Names}}|{{.Status}}|{{.Image}}" 2>/dev/null');
    dockerContainers = stdout.trim().split("\n").filter(Boolean).map(l => {
      const [name, status, image] = l.split("|");
      return { name, status, image };
    });
  } catch {}

  return {
    hostname,
    platform,
    cpuCount: cpus.length,
    cpuModel: cpus[0]?.model || "Unknown",
    totalMemMB: Math.round(totalMem / 1024 / 1024),
    freeMemMB: Math.round(freeMem / 1024 / 1024),
    ramPercent: Math.round(((totalMem - freeMem) / totalMem) * 100),
    uptime,
    disk: diskInfo,
    services: services.slice(0, 20),
    dockerContainers,
    networkInterfaces: Object.entries(ifaces).map(([name, addrs]) => ({
      name,
      addresses: (addrs || []).filter(a => a.family === "IPv4").map(a => a.address),
    })),
  };
}

// ─── Wake-on-LAN ─────────────────────────────────────────────────────────────
function sendWoL(mac: string): Promise<void> {
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

// ─── Secure tunnel (SSH port forward) ────────────────────────────────────────
const activeTunnels = new Map<string, any>();

function startTunnel(tunnelId: string, localPort: number, remoteHost: string, remotePort: number, jumpHost?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Use SSH local port forwarding: ssh -L localPort:remoteHost:remotePort jumpHost
    const args = [
      "-N", "-o", "StrictHostKeyChecking=no",
      "-o", "ServerAliveInterval=30",
      "-L", `${localPort}:${remoteHost}:${remotePort}`,
    ];
    if (jumpHost) args.push(jumpHost);

    const proc = spawn("ssh", args);
    activeTunnels.set(tunnelId, proc);

    proc.on("error", (err) => {
      activeTunnels.delete(tunnelId);
      reject(err);
    });

    // Give it a moment to establish
    setTimeout(() => resolve(), 1000);
  });
}

function stopTunnel(tunnelId: string): void {
  const proc = activeTunnels.get(tunnelId);
  if (proc) {
    proc.kill("SIGTERM");
    activeTunnels.delete(tunnelId);
  }
}

// ─── IPC Registration ─────────────────────────────────────────────────────────

export function registerIoTManagementIpc(): void {
  // Get local network info
  ipcMain.handle("iot:getLocalNetwork", async () => {
    const subnet = getLocalSubnet();
    const ifaces = os.networkInterfaces();
    const localIPs = Object.values(ifaces)
      .flat()
      .filter((i): i is os.NetworkInterfaceInfo => !!i && i.family === "IPv4" && !i.internal)
      .map(i => ({ address: i.address, netmask: i.netmask, mac: i.mac }));
    return { subnet, localIPs, hostname: os.hostname() };
  });

  // mDNS discovery
  ipcMain.handle("iot:discoverMdns", async () => {
    return await discoverMdns();
  });

  // SSDP/UPnP discovery
  ipcMain.handle("iot:discoverSsdp", async () => {
    return await discoverSsdp();
  });

  // ARP scan
  ipcMain.handle("iot:arpScan", async (_event, subnet?: string) => {
    const target = subnet || getLocalSubnet();
    return await arpScan(target);
  });

  // Full network scan
  ipcMain.handle("iot:fullNetworkScan", async (_event, subnet?: string) => {
    const target = subnet || getLocalSubnet();
    return await fullNetworkScan(target);
  });

  // Ping a specific host:port
  ipcMain.handle("iot:ping", async (_event, host: string, port = 80) => {
    const latency = await pingPort(host, port);
    return { latency, online: latency >= 0, host, port };
  });

  // Local system info (for server monitoring)
  ipcMain.handle("iot:getLocalSystemInfo", async () => {
    return await getLocalSystemInfo();
  });

  // Wake-on-LAN
  ipcMain.handle("iot:sendWoL", async (_event, mac: string) => {
    await sendWoL(mac);
    return { sent: true, mac };
  });

  // Start secure tunnel
  ipcMain.handle("iot:startTunnel", async (_event, tunnelId: string, localPort: number, remoteHost: string, remotePort: number, jumpHost?: string) => {
    try {
      await startTunnel(tunnelId, localPort, remoteHost, remotePort, jumpHost);
      return { started: true, tunnelId, localPort, remoteHost, remotePort };
    } catch (err: any) {
      return { started: false, error: err.message };
    }
  });

  // Stop secure tunnel
  ipcMain.handle("iot:stopTunnel", async (_event, tunnelId: string) => {
    stopTunnel(tunnelId);
    return { stopped: true, tunnelId };
  });

  // List active tunnels
  ipcMain.handle("iot:listActiveTunnels", async () => {
    return Array.from(activeTunnels.keys());
  });

  // Execute remote command via SSH
  ipcMain.handle("iot:sshCommand", async (_event, host: string, port: number, username: string, command: string) => {
    try {
      const { stdout, stderr } = await execAsync(
        `ssh -o StrictHostKeyChecking=no -o ConnectTimeout=5 -p ${port} ${username}@${host} "${command}" 2>&1`
      );
      return { output: stdout + stderr, success: true };
    } catch (err: any) {
      return { output: err.message, success: false };
    }
  });

  // Get camera RTSP stream URL
  ipcMain.handle("iot:getCameraStreamUrl", async (_event, ip: string, port: number, protocol: string, username?: string, password?: string) => {
    const auth = username && password ? `${username}:${password}@` : "";
    const rtspUrl = `rtsp://${auth}${ip}:${port || 554}/stream`;
    const mjpegUrl = `http://${auth}${ip}:${port || 80}/video.mjpeg`;
    return { rtspUrl, mjpegUrl, protocol };
  });

  // Browse NAS via SMB/HTTP
  ipcMain.handle("iot:browseNas", async (_event, host: string, port: number, path: string, protocol: string) => {
    // In production: use node-smb2 or HTTP API for Synology/QNAP
    return {
      path,
      files: [
        { name: "Documents", isDirectory: true, size: null },
        { name: "Photos", isDirectory: true, size: null },
        { name: "Videos", isDirectory: true, size: null },
        { name: "readme.txt", isDirectory: false, size: 1024 },
      ],
      host,
      port,
      protocol,
    };
  });

  // Restart remote service via SSH
  ipcMain.handle("iot:restartService", async (_event, host: string, username: string, service: string) => {
    try {
      const { stdout } = await execAsync(
        `ssh -o StrictHostKeyChecking=no -o ConnectTimeout=5 ${username}@${host} "sudo systemctl restart ${service} 2>&1"`
      );
      return { success: true, output: stdout };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  // Get network topology for a site
  ipcMain.handle("iot:buildTopology", async (_event, devices: any[]) => {
    const nodes = devices.map(d => ({
      id: d.id,
      name: d.name,
      type: d.type,
      ip: d.ipAddress,
      status: d.status,
      x: Math.random() * 600 + 50,
      y: Math.random() * 400 + 50,
    }));

    const router = nodes.find(n => n.type === "router");
    const edges = router
      ? nodes.filter(n => n.id !== router.id).map(n => ({
          id: `${router.id}-${n.id}`,
          source: router.id,
          target: n.id,
        }))
      : [];

    return { nodes, edges };
  });
}
