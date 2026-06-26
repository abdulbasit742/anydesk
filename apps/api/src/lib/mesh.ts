/**
 * RemoteDesk Mesh VPN — Coordination helpers
 * Handles overlay IP allocation, Magic DNS naming, and ACL compilation.
 */
import { prisma } from "./prisma.js";

/**
 * Convert a 32-bit integer to a dotted IPv4 string.
 */
function intToIpv4(n: number): string {
  return [(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff].join(".");
}

/**
 * Allocate the next free overlay IPv4 from the network's CGNAT range.
 * Uses the Tailscale-style 100.64.0.0/10 space by default.
 */
export async function allocateVirtualIpV4(networkId: string): Promise<string> {
  // Base of 100.64.0.0/10 == 100.64.0.1 onwards
  const base = (100 << 24) | (64 << 16);
  const used = new Set(
    (await prisma.meshNode.findMany({
      where: { networkId },
      select: { virtualIpV4: true }
    })).map((n) => n.virtualIpV4)
  );

  // Skip .0 (network) and .1 (reserved for MagicDNS resolver 100.100.100.100 convention)
  for (let offset = 2; offset < 0x3fffff; offset++) {
    const candidate = intToIpv4(base + offset);
    if (!used.has(candidate)) return candidate;
  }
  throw new Error("Overlay IPv4 space exhausted");
}

/**
 * Derive a deterministic ULA IPv6 from the IPv4 for dual-stack overlay.
 */
export function deriveVirtualIpV6(ipv4: string): string {
  const parts = ipv4.split(".").map((p) => parseInt(p, 10));
  const hex = parts.map((p) => p.toString(16).padStart(2, "0"));
  return `fd7a:115c:a1e0::${hex[0]}${hex[1]}:${hex[2]}${hex[3]}`;
}

/**
 * Sanitize a device name into a DNS-safe label.
 */
export function toDnsLabel(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 63) || "device";
}

/**
 * Generate a unique Magic DNS name within the network.
 */
export async function allocateMagicDnsName(
  networkId: string,
  deviceName: string,
  domain: string
): Promise<string> {
  const base = toDnsLabel(deviceName);
  let candidate = `${base}.${domain}`;
  let i = 1;
  // Ensure uniqueness across the network
  // eslint-disable-next-line no-await-in-loop
  while (await prisma.meshNode.findFirst({ where: { magicDnsName: candidate } })) {
    candidate = `${base}-${i}.${domain}`;
    i++;
  }
  return candidate;
}

export interface CompiledPeer {
  nodeId: string;
  name: string;
  publicKey: string;
  virtualIpV4: string;
  virtualIpV6: string;
  magicDnsName: string;
  endpoints: string[];
  relayRegion: string | null;
  online: boolean;
  allowedIps: string[];
  isExitNode: boolean;
  keepaliveSeconds: number;
}

/**
 * Build the peer configuration for a requesting node, honoring ACL policy.
 * Returns the list of peers the node is permitted to reach, along with the
 * allowed IPs (including approved subnet/exit routes).
 */
export async function compilePeersForNode(networkId: string, requestingNodeId: string): Promise<CompiledPeer[]> {
  const [nodes, acls, routes] = await Promise.all([
    prisma.meshNode.findMany({ where: { networkId } }),
    prisma.meshAcl.findMany({ where: { networkId, enabled: true }, orderBy: { priority: "asc" } }),
    prisma.meshRoute.findMany({ where: { networkId, approved: true } })
  ]);

  const self = nodes.find((n) => n.id === requestingNodeId);
  if (!self) return [];

  const peers: CompiledPeer[] = [];
  for (const node of nodes) {
    if (node.id === requestingNodeId) continue;
    if (!isAllowedByAcl(self, node, acls)) continue;

    const allowedIps = [`${node.virtualIpV4}/32`, `${node.virtualIpV6}/128`];

    // Add approved subnet routes / exit-node default routes advertised by this peer
    for (const route of routes) {
      if (route.advertiserId !== node.id) continue;
      allowedIps.push(route.cidr);
    }

    peers.push({
      nodeId: node.id,
      name: node.name,
      publicKey: node.publicKey,
      virtualIpV4: node.virtualIpV4,
      virtualIpV6: node.virtualIpV6,
      magicDnsName: node.magicDnsName,
      endpoints: node.endpoints,
      relayRegion: node.relayRegion,
      online: node.online,
      allowedIps,
      isExitNode: node.isExitNode && node.exitNodeEnabled,
      keepaliveSeconds: node.keepaliveSeconds
    });
  }
  return peers;
}

type AclLike = { action: string; src: string; dst: string; ports: string };
type NodeLike = { id: string; tags: string[]; virtualIpV4: string };

/**
 * Evaluate whether `src` may reach `dst` given ACL rules (first match wins).
 * Default-allow within a personal mesh if no rules are defined.
 */
export function isAllowedByAcl(src: NodeLike, dst: NodeLike, acls: AclLike[]): boolean {
  if (acls.length === 0) return true; // default-allow for personal networks

  const matches = (selector: string, node: NodeLike): boolean => {
    if (selector === "*") return true;
    if (selector === node.id) return true;
    if (selector === node.virtualIpV4) return true;
    if (selector.startsWith("tag:")) return node.tags.includes(selector);
    return false;
  };

  for (const acl of acls) {
    if (matches(acl.src, src) && matches(acl.dst, dst)) {
      return acl.action === "accept";
    }
  }
  return false; // default-drop once explicit rules exist
}
