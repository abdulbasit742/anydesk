import { spawn, execFile, type ChildProcess } from "node:child_process";
import { chmod, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { networkInterfaces } from "node:os";
import { join } from "node:path";
import { randomBytes } from "node:crypto";
import { createSocket } from "node:dgram";
import type {
  MeshDnsZone,
  MeshPeer,
  MeshRouteAdvertisement,
  MeshRuntimeAdapter,
  MeshSpeedTestResult,
  MeshStatus,
  MeshTransport,
  MeshNodeConfig,
  MeshSplitTunnelRule,
  WireGuardConfig
} from "@shared/index";
import {
  activeSplitTunnelRules,
  classifyPeerHealth,
  compileWireGuardConfig,
  normalizeCidr,
  renderWgQuickConfig
} from "@shared/index";

export interface MeshConnectInput {
  apiBaseUrl: string;
  accessToken: string;
  deviceId: string;
  deviceName: string;
  platform: string;
  clientVersion?: string;
  interfaceName?: string;
  listenPort?: number;
  alwaysOn?: boolean;
  exitNodeId?: string | null;
  splitTunnelRules?: MeshSplitTunnelRule[];
}

export interface MeshServiceOptions {
  dataDir: string;
  wireguardGoBinary?: string;
  wgBinary?: string;
  routeBinary?: string;
  dnsBinary?: string;
}

type ApiResponse<T> = { success: boolean; data?: T; message?: string };

type RegisteredNode = {
  node: { id: string; virtualIpV4: string; virtualIpV6: string; publicKey: string; magicDnsName: string };
  network: { ipv4Cidr: string; ipv6Cidr: string; magicDnsDomain: string };
};

type PeerResponse = {
  self: { virtualIpV4: string; virtualIpV6: string };
  peers: MeshPeer[];
};

function execFileAsync(file: string, args: string[], options: { timeout?: number } = {}): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    execFile(file, args, { timeout: options.timeout ?? 15_000, windowsHide: true }, (error, stdout, stderr) => {
      if (error) {
        const detail = String(stderr || stdout || error.message).trim();
        reject(new Error(`${file} ${args.join(" ")}: ${detail}`));
        return;
      }
      resolve({ stdout: String(stdout), stderr: String(stderr) });
    });
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function unique<T>(items: T[]): T[] {
  return [...new Set(items)];
}

/** Minimal STUN binding exchange for public UDP endpoint discovery. */
async function discoverStunCandidates(stunHost = "stun.l.google.com", stunPort = 19302): Promise<Array<{ address: string; port: number; protocol: "udp4"; source: "stun"; priority: number }>> {
  const socket = createSocket("udp4");
  const transaction = randomBytes(12);
  const request = Buffer.alloc(20);
  request.writeUInt16BE(0x0001, 0);
  request.writeUInt16BE(0, 2);
  request.writeUInt32BE(0x2112a442, 4);
  transaction.copy(request, 8);

  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      socket.close();
      resolve([]);
    }, 2500);
    socket.on("message", (message) => {
      clearTimeout(timeout);
      const candidates: Array<{ address: string; port: number; protocol: "udp4"; source: "stun"; priority: number }> = [];
      // Parse the XOR-MAPPED-ADDRESS attribute (0x0020) from a STUN response.
      for (let offset = 20; offset + 4 <= message.length;) {
        const type = message.readUInt16BE(offset);
        const length = message.readUInt16BE(offset + 2);
        const start = offset + 4;
        if (start + length > message.length) break;
        if (type === 0x0020 && length >= 8) {
          const family = message.readUInt8(start + 1);
          if (family === 0x01) {
            const xorPort = message.readUInt16BE(start + 2) ^ (0x2112a442 >>> 16);
            const addressBytes = [0, 1, 2, 3].map((index) => message.readUInt8(start + 4 + index) ^ ((0x2112a442 >>> (24 - index * 8)) & 0xff));
            candidates.push({ address: addressBytes.join("."), port: xorPort, protocol: "udp4", source: "stun", priority: 100 });
          }
        }
        offset = start + length + ((4 - (length % 4)) % 4);
      }
      socket.close();
      resolve(candidates);
    });
    socket.on("error", () => {
      clearTimeout(timeout);
      try { socket.close(); } catch { /* already closed */ }
      resolve([]);
    });
    socket.send(request, 0, request.length, stunPort, stunHost);
  });
}

function localCandidates(): Array<{ address: string; port: number; protocol: "udp4"; source: "host"; priority: number }> {
  const candidates: Array<{ address: string; port: number; protocol: "udp4"; source: "host"; priority: number }> = [];
  for (const addresses of Object.values(networkInterfaces())) {
    for (const address of addresses ?? []) {
      if (address.family === "IPv4" && !address.internal) {
        candidates.push({ address: address.address, port: 0, protocol: "udp4", source: "host", priority: 50 });
      }
    }
  }
  return candidates;
}

class WireGuardGoAdapter implements MeshRuntimeAdapter {
  private process?: ChildProcess;
  private config?: WireGuardConfig;
  private interfaceName: string;
  private readonly options: MeshServiceOptions;

  constructor(interfaceName: string, options: MeshServiceOptions) {
    this.interfaceName = interfaceName;
    this.options = options;
  }

  async start(config: WireGuardConfig): Promise<void> {
    if (this.process && !this.process.killed) await this.apply(config);
    const binary = this.options.wireguardGoBinary ?? "wireguard-go";
    this.process = spawn(binary, [this.interfaceName], { stdio: "ignore", windowsHide: true });
    this.process.once("error", (error) => {
      this.process = undefined;
      console.error("wireguard-go failed", error);
    });
    await sleep(400);
    await this.apply(config);
  }

  async apply(config: WireGuardConfig): Promise<void> {
    this.config = config;
    const wg = this.options.wgBinary ?? "wg";
    const nativeConfig = renderWgQuickConfig(config)
      .replace(/^Address = .*$/m, "")
      .replace(/^DNS = .*$/m, "")
      .replace(/^MTU = .*$/m, "");
    const configPath = join(process.cwd(), `.remotedesk-${this.interfaceName}.conf`);
    await writeFile(configPath, nativeConfig, { mode: 0o600 });
    try {
      await execFileAsync(wg, ["setconf", this.interfaceName, configPath], { timeout: 10_000 });
    } finally {
      await rm(configPath, { force: true });
    }
  }

  async stop(): Promise<void> {
    const process = this.process;
    this.process = undefined;
    this.config = undefined;
    if (process && !process.killed) process.kill("SIGTERM");
  }

  async status(): Promise<MeshStatus> {
    if (!this.process || this.process.killed) return { state: "stopped", bytesSent: 0, bytesReceived: 0 };
    try {
      const result = await execFileAsync(this.options.wgBinary ?? "wg", ["show", this.interfaceName, "dump"]);
      const lines = result.stdout.trim().split("\n").filter(Boolean);
      const latestHandshake = lines.slice(1).map((line) => line.split("\t")[4]).filter(Boolean).map(Number).sort((a, b) => b - a)[0];
      const status = latestHandshake ? classifyPeerHealth(new Date(latestHandshake * 1000).toISOString()) : "stale";
      return {
        state: status === "healthy" ? "connected" : status === "stale" ? "degraded" : "reconnecting",
        bytesSent: 0,
        bytesReceived: 0,
        lastHandshakeAt: latestHandshake ? new Date(latestHandshake * 1000).toISOString() : undefined
      };
    } catch (error) {
      return { state: "error", bytesSent: 0, bytesReceived: 0, error: error instanceof Error ? error.message : "Unable to read WireGuard status" };
    }
  }

  async setRoutes(routes: string[], rules: MeshSplitTunnelRule[]): Promise<void> {
    const active = activeSplitTunnelRules(rules);
    if (process.platform === "linux") {
      const route = this.options.routeBinary ?? "ip";
      for (const cidr of unique(routes.map(normalizeCidr))) {
        await execFileAsync(route, ["route", "replace", cidr, "dev", this.interfaceName]).catch(() => undefined);
      }
      for (const rule of active.filter((candidate) => candidate.kind === "cidr" && candidate.action === "exclude")) {
        await execFileAsync(route, ["route", "del", normalizeCidr(rule.value), "dev", this.interfaceName]).catch(() => undefined);
      }
    } else if (process.platform === "win32") {
      for (const cidr of unique(routes.map(normalizeCidr))) {
        const [network, prefix] = cidr.split("/");
        await execFileAsync("route", ["ADD", network, "MASK", prefix === "32" ? "255.255.255.255" : "0.0.0.0", this.interfaceName]).catch(() => undefined);
      }
    } else if (process.platform === "darwin") {
      for (const cidr of unique(routes.map(normalizeCidr))) {
        const [network] = cidr.split("/");
        await execFileAsync("route", ["-n", "add", "-net", network, "-interface", this.interfaceName]).catch(() => undefined);
      }
    }
  }

  async setDns(zone: MeshDnsZone): Promise<void> {
    const addresses = zone.records.filter((record) => record.type === "A" || record.type === "AAAA").map((record) => record.value);
    if (!addresses.length) return;
    if (process.platform === "linux") {
      await execFileAsync(this.options.dnsBinary ?? "resolvectl", ["dns", this.interfaceName, ...addresses]).catch(() => undefined);
      await execFileAsync(this.options.dnsBinary ?? "resolvectl", ["domain", this.interfaceName, `~${zone.domain}`]).catch(() => undefined);
    }
  }

  async setForwarding(enabled: boolean): Promise<void> {
    if (process.platform === "linux") {
      await execFileAsync("sysctl", ["-w", `net.ipv4.ip_forward=${enabled ? 1 : 0}`]).catch(() => undefined);
      await execFileAsync("sysctl", ["-w", `net.ipv6.conf.all.forwarding=${enabled ? 1 : 0}`]).catch(() => undefined);
    }
  }
}

export class MeshService {
  private readonly options: MeshServiceOptions;
  private adapter?: WireGuardGoAdapter;
  private input?: MeshConnectInput;
  private registered?: RegisteredNode;
  private config?: MeshNodeConfig;
  private heartbeatTimer?: NodeJS.Timeout;
  private syncTimer?: NodeJS.Timeout;
  private state: MeshStatus = { state: "stopped", bytesSent: 0, bytesReceived: 0 };

  constructor(options: MeshServiceOptions) {
    this.options = options;
  }

  async generateKeyPair(): Promise<{ publicKey: string; privateKey: string }> {
    const wg = this.options.wgBinary ?? "wg";
    const { stdout: privateKey } = await execFileAsync(wg, ["genkey"]);
    const privateValue = privateKey.trim();
    const { stdout: publicKey } = await new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
      const child = execFile(wg, ["pubkey"], { windowsHide: true }, (error, stdout, stderr) => {
        if (error) reject(error); else resolve({ stdout: String(stdout), stderr: String(stderr) });
      });
      child.stdin?.end(privateValue);
    });
    return { privateKey: privateValue, publicKey: publicKey.trim() };
  }

  async connect(input: MeshConnectInput): Promise<MeshStatus> {
    this.input = input;
    this.state = { state: "starting", bytesSent: 0, bytesReceived: 0 };
    await mkdir(this.options.dataDir, { recursive: true });
    const keyPath = join(this.options.dataDir, "mesh-private.key");
    let privateKey: string;
    try {
      privateKey = (await readFile(keyPath, "utf8")).trim();
    } catch {
      const keyPair = await this.generateKeyPair();
      privateKey = keyPair.privateKey;
      await writeFile(keyPath, `${privateKey}\n`, { mode: 0o600 });
      await chmod(keyPath, 0o600);
    }
    // `wg pubkey` reads the private key from stdin; never invoke it without input.
    const generatedPublic = await new Promise<string>((resolve, reject) => {
      const child = execFile(this.options.wgBinary ?? "wg", ["pubkey"], { windowsHide: true }, (error, stdout) => {
        if (error) reject(error); else resolve(String(stdout).trim());
      });
      child.stdin?.end(privateKey);
    });

    const registered = await this.api<RegisteredNode>(input, "/api/mesh/register", {
      method: "POST",
      body: JSON.stringify({ deviceId: input.deviceId, name: input.deviceName, publicKey: generatedPublic, os: input.platform, clientVersion: input.clientVersion })
    });
    this.registered = registered;
    const peerResponse = await this.api<PeerResponse>(input, `/api/mesh/peers/${registered.node.id}`);
    const dnsResponse = await this.api<{ domain: string; enabled: boolean; records: Array<{ name: string; type: "A" | "AAAA" | "CNAME"; value: string }> }>(input, "/api/mesh/dns");
    const candidates = [...localCandidates(), ...(await discoverStunCandidates())];
    await this.api(input, `/api/mesh/endpoints/${registered.node.id}`, { method: "POST", body: JSON.stringify({ endpoints: candidates.filter((candidate) => candidate.port > 0).map((candidate) => `${candidate.address}:${candidate.port}`) }) }).catch(() => undefined);

    const routes: MeshRouteAdvertisement[] = peerResponse.peers.flatMap((peer) => peer.allowedIps.filter((cidr) => !cidr.endsWith("/32") && !cidr.endsWith("/128")).map((cidr) => ({ nodeId: peer.nodeId, cidr, kind: cidr === "0.0.0.0/0" ? "exit" as const : "subnet" as const, approved: true })));
    const meshConfig: MeshNodeConfig = {
      nodeId: registered.node.id,
      virtualIpV4: peerResponse.self.virtualIpV4,
      virtualIpV6: peerResponse.self.virtualIpV6,
      privateKey,
      listenPort: input.listenPort ?? 51820,
      peers: peerResponse.peers,
      routes,
      splitTunnelRules: input.splitTunnelRules ?? [],
      dns: { domain: dnsResponse.domain, records: dnsResponse.records },
      exitNodeId: input.exitNodeId
    };
    const wgConfig = compileWireGuardConfig(meshConfig);
    this.config = meshConfig;
    this.adapter = new WireGuardGoAdapter(input.interfaceName ?? "remotedesk0", this.options);
    await this.adapter.start(wgConfig);
    await this.adapter.setRoutes(wgConfig.peers.flatMap((peer) => peer.allowedIps), meshConfig.splitTunnelRules);
    await this.adapter.setDns(meshConfig.dns);
    await this.adapter.setForwarding(routes.some((route) => route.kind === "subnet"));
    this.state = { state: "connected", nodeId: meshConfig.nodeId, virtualIpV4: meshConfig.virtualIpV4, bytesSent: 0, bytesReceived: 0, transport: candidates.length ? "direct" : "relay" };
    this.startBackgroundSync();
    return this.state;
  }

  async disconnect(): Promise<void> {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    if (this.syncTimer) clearInterval(this.syncTimer);
    this.heartbeatTimer = undefined;
    this.syncTimer = undefined;
    await this.adapter?.stop();
    this.adapter = undefined;
    this.state = { state: "stopped", bytesSent: 0, bytesReceived: 0 };
  }

  async status(): Promise<MeshStatus> {
    if (!this.adapter) return this.state;
    const adapterStatus = await this.adapter.status();
    this.state = { ...this.state, ...adapterStatus };
    return this.state;
  }

  async setExitNode(exitNodeId: string | null): Promise<MeshStatus> {
    if (!this.input || !this.config || !this.adapter) throw new Error("Mesh is not connected");
    this.input.exitNodeId = exitNodeId;
    await this.refreshPeers();
    return this.status();
  }

  async setSplitTunnelRules(rules: MeshSplitTunnelRule[]): Promise<MeshStatus> {
    if (!this.config || !this.adapter) throw new Error("Mesh is not connected");
    this.config.splitTunnelRules = rules;
    const wgConfig = compileWireGuardConfig(this.config);
    await this.adapter.apply(wgConfig);
    await this.adapter.setRoutes(wgConfig.peers.flatMap((peer) => peer.allowedIps), rules);
    return this.status();
  }

  async setAlwaysOn(enabled: boolean): Promise<void> {
    if (this.input) this.input.alwaysOn = enabled;
    if (!enabled) {
      if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = undefined;
    } else if (this.input && this.config) {
      this.startBackgroundSync();
    }
  }

  async speedTest(targetNodeId: string): Promise<MeshSpeedTestResult> {
    if (!this.input || !this.config) throw new Error("Mesh is not connected");
    const started = Date.now();
    const peer = this.config.peers.find((candidate) => candidate.nodeId === targetNodeId);
    if (!peer) throw new Error("Target node is not part of this mesh");
    const latencyMs = Math.max(1, Date.now() - started);
    const result: MeshSpeedTestResult = {
      downMbps: 0,
      upMbps: 0,
      latencyMs,
      jitterMs: 0,
      packetLoss: 0,
      via: peer.endpoints.length ? "direct" : "relay",
      measuredAt: new Date().toISOString()
    };
    await this.api(this.input, "/api/mesh/speedtest", { method: "POST", body: JSON.stringify({ fromNodeId: this.config.nodeId, toNodeId: targetNodeId, ...result }) }).catch(() => undefined);
    return result;
  }

  private startBackgroundSync(): void {
    if (!this.input || !this.config) return;
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    if (this.syncTimer) clearInterval(this.syncTimer);
    const input = this.input;
    const nodeId = this.config.nodeId;
    this.heartbeatTimer = setInterval(() => {
      void this.api(input, `/api/mesh/heartbeat/${nodeId}`, { method: "POST", body: "{}" }).catch(() => undefined);
    }, 25_000);
    this.syncTimer = setInterval(() => {
      void this.refreshPeers().catch(() => {
        this.state = { ...this.state, state: input.alwaysOn ? "reconnecting" : "degraded" };
      });
    }, 10_000);
  }

  private async refreshPeers(): Promise<void> {
    if (!this.input || !this.config || !this.adapter) return;
    const peers = await this.api<PeerResponse>(this.input, `/api/mesh/peers/${this.config.nodeId}`);
    this.config.peers = peers.peers;
    const wgConfig = compileWireGuardConfig(this.config);
    await this.adapter.apply(wgConfig);
  }

  private async api<T>(input: MeshConnectInput, path: string, init: RequestInit = {}): Promise<T> {
    const response = await fetch(`${input.apiBaseUrl.replace(/\/$/, "")}${path}`, {
      ...init,
      headers: { Authorization: `Bearer ${input.accessToken}`, "Content-Type": "application/json", ...(init.headers ?? {}) }
    });
    const payload = await response.json() as ApiResponse<T>;
    if (!response.ok || !payload.success || payload.data === undefined) throw new Error(payload.message ?? `Mesh API request failed (${response.status})`);
    return payload.data;
  }
}

export { WireGuardGoAdapter };
