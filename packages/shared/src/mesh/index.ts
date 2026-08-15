/**
 * RemoteDesk Mesh VPN core primitives.
 *
 * This module is deliberately runtime-neutral: it can be consumed by the
 * Electron desktop client, the React Native client, and server-side workers.
 * OS-specific tunnel operations are supplied by platform adapters.
 */

export type MeshTransport = "direct" | "relay" | "multihop";
export type MeshRouteKind = "subnet" | "exit" | "peer";
export type TunnelState = "stopped" | "starting" | "connected" | "degraded" | "reconnecting" | "error";

export interface WireGuardKeyPair {
  publicKey: string;
  /** Private keys must remain on the originating device and never enter API payloads. */
  privateKey: string;
}

export interface MeshPeer {
  nodeId: string;
  name: string;
  publicKey: string;
  virtualIpV4: string;
  virtualIpV6: string;
  magicDnsName: string;
  endpoints: string[];
  relayRegion?: string | null;
  allowedIps: string[];
  online: boolean;
  isExitNode: boolean;
  keepaliveSeconds: number;
}

export interface MeshRouteAdvertisement {
  id?: string;
  nodeId: string;
  cidr: string;
  kind: MeshRouteKind;
  approved: boolean;
}

export interface MeshSplitTunnelRule {
  id?: string;
  kind: "cidr" | "domain" | "app";
  value: string;
  action: "include" | "exclude";
  /** Native application identifier (bundle id, package name, or executable). */
  appId?: string;
  enabled: boolean;
}

export interface MeshAclRule {
  action: "accept" | "drop";
  src: string;
  dst: string;
  ports: string;
  priority: number;
  enabled: boolean;
  schedule?: string | null;
}

export interface MeshDnsRecord {
  name: string;
  type: "A" | "AAAA" | "CNAME";
  value: string;
}

export interface MeshDnsZone {
  domain: string;
  records: MeshDnsRecord[];
}

export interface NatCandidate {
  address: string;
  port: number;
  protocol: "udp4" | "udp6";
  source: "host" | "stun" | "mapped";
  priority: number;
}

export interface RelayDescriptor {
  id: string;
  region: string;
  url: string;
  /** TURN credentials are short-lived and must not be persisted by clients. */
  username?: string;
  credential?: string;
  expiresAt?: string;
}

export interface NatTraversalPlan {
  directCandidates: NatCandidate[];
  relay?: RelayDescriptor;
  keepaliveSeconds: number;
  transport: MeshTransport;
}

export interface WireGuardPeerConfig {
  publicKey: string;
  allowedIps: string[];
  endpoints: string[];
  persistentKeepalive: number;
}

export interface WireGuardInterfaceConfig {
  privateKey: string;
  address: string[];
  listenPort: number;
  dns?: string[];
  mtu?: number;
}

export interface WireGuardConfig {
  interface: WireGuardInterfaceConfig;
  peers: WireGuardPeerConfig[];
}

export interface MeshNodeConfig {
  nodeId: string;
  virtualIpV4: string;
  virtualIpV6: string;
  privateKey: string;
  listenPort: number;
  peers: MeshPeer[];
  routes: MeshRouteAdvertisement[];
  splitTunnelRules: MeshSplitTunnelRule[];
  dns: MeshDnsZone;
  exitNodeId?: string | null;
  mtu?: number;
}

export interface MeshStatus {
  state: TunnelState;
  nodeId?: string;
  virtualIpV4?: string;
  bytesSent: number;
  bytesReceived: number;
  lastHandshakeAt?: string;
  transport?: MeshTransport;
  error?: string;
}

export interface MeshSpeedTestResult {
  downMbps: number;
  upMbps: number;
  latencyMs: number;
  jitterMs: number;
  packetLoss: number;
  via: MeshTransport;
  measuredAt: string;
}

export interface MeshRuntimeAdapter {
  start(config: WireGuardConfig): Promise<void>;
  stop(): Promise<void>;
  apply(config: WireGuardConfig): Promise<void>;
  status(): Promise<MeshStatus>;
  setRoutes(routes: string[], splitTunnelRules: MeshSplitTunnelRule[]): Promise<void>;
  setDns(zone: MeshDnsZone): Promise<void>;
  setForwarding(enabled: boolean): Promise<void>;
}

export interface MeshControlPlane {
  register(input: { deviceId: string; name: string; publicKey: string; os?: string; clientVersion?: string }): Promise<unknown>;
  peers(nodeId: string): Promise<{ self: { virtualIpV4: string; virtualIpV6: string }; peers: MeshPeer[] }>;
  heartbeat(nodeId: string): Promise<void>;
  endpoints(nodeId: string, endpoints: string[], relayRegion?: string): Promise<void>;
}

/**
 * Normalize and validate a CIDR string. This is intentionally conservative;
 * the platform adapters perform the final OS-specific route validation.
 */
export function normalizeCidr(value: string): string {
  const trimmed = value.trim();
  const [ip, prefix] = trimmed.split("/");
  const prefixNumber = Number(prefix);
  const ipv4 = ip.split(".");
  if (ipv4.length === 4 && ipv4.every((part) => /^\d+$/.test(part))) {
    const octets = ipv4.map(Number);
    if (octets.every((octet) => octet >= 0 && octet <= 255) && prefixNumber >= 0 && prefixNumber <= 32) {
      return `${octets.join(".")}/${prefixNumber}`;
    }
  }
  if (ip.includes(":") && prefixNumber >= 0 && prefixNumber <= 128) {
    return `${ip.toLowerCase()}/${prefixNumber}`;
  }
  throw new Error(`Invalid CIDR: ${value}`);
}

/**
 * Build WireGuard's allowed-IPs list from approved peer and route data.
 * Split tunnel excludes are handled by the OS routing adapter, not by peers.
 */
export function buildAllowedIps(
  peer: MeshPeer,
  routes: MeshRouteAdvertisement[],
  exitNodeId?: string | null
): string[] {
  const allowed = new Set<string>([
    `${peer.virtualIpV4}/32`,
    `${peer.virtualIpV6}/128`
  ]);
  for (const route of routes) {
    if (!route.approved || route.nodeId !== peer.nodeId) continue;
    if (route.kind === "exit" && peer.nodeId !== exitNodeId) continue;
    allowed.add(normalizeCidr(route.cidr));
  }
  return [...allowed];
}

/**
 * Compile the control-plane response into a WireGuard userspace config.
 * The private key is provided only by the local secure key store.
 */
export function compileWireGuardConfig(input: MeshNodeConfig): WireGuardConfig {
  if (!input.privateKey) throw new Error("Mesh node private key is required");
  const routes = input.routes.map((route) => ({ ...route, cidr: normalizeCidr(route.cidr) }));
  const peers: WireGuardPeerConfig[] = input.peers.map((peer) => ({
    publicKey: peer.publicKey,
    allowedIps: buildAllowedIps(peer, routes, input.exitNodeId),
    endpoints: peer.endpoints,
    persistentKeepalive: Math.max(0, Math.min(180, peer.keepaliveSeconds || 25))
  }));
  return {
    interface: {
      privateKey: input.privateKey,
      address: [`${input.virtualIpV4}/32`, `${input.virtualIpV6}/128`],
      listenPort: input.listenPort,
      dns: input.dns.records.filter((record) => record.type === "A").map((record) => record.value),
      mtu: input.mtu ?? 1280
    },
    peers
  };
}

/** Render a config for wireguard-go's wgctrl-compatible userspace adapter. */
export function renderWgQuickConfig(config: WireGuardConfig): string {
  const lines: string[] = ["[Interface]", `PrivateKey = ${config.interface.privateKey}`, `ListenPort = ${config.interface.listenPort}`, `Address = ${config.interface.address.join(", ")}`];
  if (config.interface.dns?.length) lines.push(`DNS = ${config.interface.dns.join(", ")}`);
  if (config.interface.mtu) lines.push(`MTU = ${config.interface.mtu}`);
  for (const peer of config.peers) {
    lines.push("", "[Peer]", `PublicKey = ${peer.publicKey}`, `AllowedIPs = ${peer.allowedIps.join(", ")}`);
    if (peer.endpoints.length) lines.push(`Endpoint = ${peer.endpoints[0]}`);
    if (peer.persistentKeepalive > 0) lines.push(`PersistentKeepalive = ${peer.persistentKeepalive}`);
  }
  return `${lines.join("\n")}\n`;
}

/** Resolve a Magic DNS name locally without making a public DNS query. */
export function resolveMagicDns(name: string, zone: MeshDnsZone): string[] {
  const normalized = name.toLowerCase().replace(/\.$/, "");
  return zone.records
    .filter((record) => `${record.name}.${zone.domain}`.toLowerCase() === normalized || record.name.toLowerCase() === normalized)
    .map((record) => record.value);
}

/** Build a deterministic multi-hop peer path, rejecting loops. */
export function buildMultiHopPath(sourceNodeId: string, targetNodeId: string, hops: string[]): string[] {
  const path = [sourceNodeId, ...hops, targetNodeId];
  if (new Set(path).size !== path.length) throw new Error("Multi-hop route contains a loop");
  if (path.length > 6) throw new Error("Multi-hop route cannot exceed four intermediate hops");
  return path;
}

/** Select the best transport based on direct candidates and relay availability. */
export function chooseTransport(plan: Omit<NatTraversalPlan, "transport">): MeshTransport {
  if (plan.directCandidates.length > 0) return "direct";
  if (plan.relay) return "relay";
  return "multihop";
}

/** Return only enabled rules for platform routing adapters. */
export function activeSplitTunnelRules(rules: MeshSplitTunnelRule[]): MeshSplitTunnelRule[] {
  return rules.filter((rule) => rule.enabled && rule.value.trim().length > 0);
}

/** Parse a peer's handshake timestamp into a simple health classification. */
export function classifyPeerHealth(lastHandshakeAt?: string | null): "healthy" | "stale" | "offline" {
  if (!lastHandshakeAt) return "offline";
  const age = Date.now() - Date.parse(lastHandshakeAt);
  if (!Number.isFinite(age) || age > 120_000) return "offline";
  if (age > 30_000) return "stale";
  return "healthy";
}

export * from "./native.js";
