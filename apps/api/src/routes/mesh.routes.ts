/**
 * RemoteDesk Mesh VPN — Coordination API routes
 * Mounted at /api/mesh
 *
 * Implements the control plane for the built-in WireGuard mesh:
 * device registration & key exchange, peer discovery, NAT-traversal endpoint
 * exchange, ACL distribution, Magic DNS, exit-node & subnet route management,
 * port forwarding, and speed-test recording.
 */
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  allocateVirtualIpV4,
  deriveVirtualIpV6,
  allocateMagicDnsName,
  compilePeersForNode
} from "../lib/mesh.js";

const router = Router();
router.use(requireAuth);

/** Ensure the user has a default mesh network, creating one on first use. */
async function ensureNetwork(userId: string) {
  let network = await prisma.meshNetwork.findFirst({ where: { userId } });
  if (!network) {
    network = await prisma.meshNetwork.create({ data: { userId } });
  }
  return network;
}

/** Resolve the mesh node owned by the current user for a given device. */
async function getOwnedNode(userId: string, nodeId: string) {
  const node = await prisma.meshNode.findUnique({ where: { id: nodeId } });
  if (!node) return null;
  const network = await prisma.meshNetwork.findFirst({ where: { id: node.networkId, userId } });
  return network ? node : null;
}

// ------------------------------------------------------------------
// Network overview
// ------------------------------------------------------------------

/** GET /api/mesh/network — overview of the user's mesh (nodes, settings). */
router.get(
  "/network",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const userId = req.user!.id;
    const network = await ensureNetwork(userId);
    const nodes = await prisma.meshNode.findMany({
      where: { networkId: network.id },
      orderBy: { name: "asc" }
    });
    res.json({ success: true, data: { network, nodes } });
  })
);

// ------------------------------------------------------------------
// Registration & key exchange
// ------------------------------------------------------------------

const registerInput = z.object({
  deviceId: z.string().uuid(),
  name: z.string().min(1).max(100),
  publicKey: z.string().min(40).max(60), // base64 WireGuard key
  os: z.string().max(40).optional(),
  clientVersion: z.string().max(40).optional()
});

/**
 * POST /api/mesh/register
 * Register (or re-register) a device as a mesh node and exchange WireGuard keys.
 * The device generates its own keypair; only the public key is uploaded.
 */
router.post(
  "/register",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const userId = req.user!.id;
    const input = registerInput.safeParse(req.body);
    if (!input.success) {
      return res.status(400).json({ success: false, message: "Invalid payload", issues: input.error.issues });
    }

    const device = await prisma.device.findFirst({ where: { id: input.data.deviceId, userId } });
    if (!device) return res.status(404).json({ success: false, message: "Device not found" });

    const network = await ensureNetwork(userId);

    // Re-registration: update the public key and reactivate
    const existing = await prisma.meshNode.findUnique({ where: { deviceId: input.data.deviceId } });
    if (existing) {
      const updated = await prisma.meshNode.update({
        where: { id: existing.id },
        data: {
          publicKey: input.data.publicKey,
          name: input.data.name,
          os: input.data.os ?? existing.os,
          clientVersion: input.data.clientVersion ?? existing.clientVersion,
          online: true,
          lastSeenAt: new Date()
        }
      });
      return res.json({
        success: true,
        data: {
          node: updated,
          network: { ipv4Cidr: network.ipv4Cidr, ipv6Cidr: network.ipv6Cidr, magicDnsDomain: network.magicDnsDomain }
        }
      });
    }

    // Fresh registration: allocate overlay addresses and Magic DNS name
    const virtualIpV4 = await allocateVirtualIpV4(network.id);
    const virtualIpV6 = deriveVirtualIpV6(virtualIpV4);
    const magicDnsName = await allocateMagicDnsName(network.id, input.data.name, network.magicDnsDomain);

    const node = await prisma.meshNode.create({
      data: {
        networkId: network.id,
        deviceId: input.data.deviceId,
        name: input.data.name,
        publicKey: input.data.publicKey,
        virtualIpV4,
        virtualIpV6,
        magicDnsName,
        os: input.data.os ?? "unknown",
        clientVersion: input.data.clientVersion,
        online: true
      }
    });

    // Auto-create a Magic DNS A record
    await prisma.meshDnsRecord.create({
      data: {
        networkId: network.id,
        name: magicDnsName.split(".")[0],
        type: "A",
        value: virtualIpV4,
        auto: true
      }
    }).catch(() => undefined);

    res.status(201).json({
      success: true,
      data: {
        node,
        network: { ipv4Cidr: network.ipv4Cidr, ipv6Cidr: network.ipv6Cidr, magicDnsDomain: network.magicDnsDomain }
      }
    });
  })
);

// ------------------------------------------------------------------
// Peer discovery & NAT traversal
// ------------------------------------------------------------------

/**
 * GET /api/mesh/peers/:nodeId
 * Return the ACL-filtered peer list (public keys, endpoints, allowed IPs)
 * for the given node so it can build its WireGuard configuration.
 */
router.get(
  "/peers/:nodeId",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const userId = req.user!.id;
    const node = await getOwnedNode(userId, req.params.nodeId);
    if (!node) return res.status(404).json({ success: false, message: "Node not found" });

    const peers = await compilePeersForNode(node.networkId, node.id);
    res.json({ success: true, data: { self: { virtualIpV4: node.virtualIpV4, virtualIpV6: node.virtualIpV6 }, peers } });
  })
);

const endpointsInput = z.object({
  endpoints: z.array(z.string().max(60)).max(16),
  relayRegion: z.string().max(40).optional()
});

/**
 * POST /api/mesh/endpoints/:nodeId
 * Update the node's STUN-discovered candidate endpoints for hole punching,
 * and its preferred relay (TURN/DERP) region for fallback.
 */
router.post(
  "/endpoints/:nodeId",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const userId = req.user!.id;
    const node = await getOwnedNode(userId, req.params.nodeId);
    if (!node) return res.status(404).json({ success: false, message: "Node not found" });

    const input = endpointsInput.safeParse(req.body);
    if (!input.success) return res.status(400).json({ success: false, message: "Invalid payload" });

    const updated = await prisma.meshNode.update({
      where: { id: node.id },
      data: {
        endpoints: input.data.endpoints,
        relayRegion: input.data.relayRegion ?? node.relayRegion,
        online: true,
        lastSeenAt: new Date(),
        lastHandshakeAt: new Date()
      }
    });
    res.json({ success: true, data: { node: updated } });
  })
);

/**
 * POST /api/mesh/heartbeat/:nodeId
 * Lightweight keepalive used by the always-on background service.
 */
router.post(
  "/heartbeat/:nodeId",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const userId = req.user!.id;
    const node = await getOwnedNode(userId, req.params.nodeId);
    if (!node) return res.status(404).json({ success: false, message: "Node not found" });
    await prisma.meshNode.update({
      where: { id: node.id },
      data: { online: true, lastSeenAt: new Date() }
    });
    res.json({ success: true });
  })
);

// ------------------------------------------------------------------
// Exit nodes & subnet routing
// ------------------------------------------------------------------

const routeInput = z.object({
  cidr: z.string().min(7).max(43),
  kind: z.enum(["subnet", "exit"])
});

/**
 * POST /api/mesh/routes/:nodeId
 * Advertise a subnet route or exit-node default route. Requires admin approval
 * before peers will route through it (approve via PATCH below).
 */
router.post(
  "/routes/:nodeId",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const userId = req.user!.id;
    const node = await getOwnedNode(userId, req.params.nodeId);
    if (!node) return res.status(404).json({ success: false, message: "Node not found" });

    const input = routeInput.safeParse(req.body);
    if (!input.success) return res.status(400).json({ success: false, message: "Invalid payload" });

    const cidr = input.data.kind === "exit" ? "0.0.0.0/0" : input.data.cidr;
    const route = await prisma.meshRoute.upsert({
      where: { advertiserId_cidr: { advertiserId: node.id, cidr } },
      update: { kind: input.data.kind },
      create: { networkId: node.networkId, advertiserId: node.id, cidr, kind: input.data.kind }
    });

    if (input.data.kind === "exit") {
      await prisma.meshNode.update({ where: { id: node.id }, data: { isExitNode: true } });
    }
    res.status(201).json({ success: true, data: { route } });
  })
);

/**
 * PATCH /api/mesh/routes/:routeId/approve
 * Approve (or revoke) an advertised route so peers begin/stop using it.
 */
router.patch(
  "/routes/:routeId/approve",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const userId = req.user!.id;
    const approved = Boolean(req.body?.approved ?? true);
    const route = await prisma.meshRoute.findUnique({ where: { id: req.params.routeId } });
    if (!route) return res.status(404).json({ success: false, message: "Route not found" });
    const owns = await prisma.meshNetwork.findFirst({ where: { id: route.networkId, userId } });
    if (!owns) return res.status(404).json({ success: false, message: "Route not found" });

    const updated = await prisma.meshRoute.update({
      where: { id: route.id },
      data: { approved, approvedAt: approved ? new Date() : null }
    });

    if (route.kind === "exit") {
      await prisma.meshNode.update({
        where: { id: route.advertiserId },
        data: { exitNodeEnabled: approved }
      });
    }
    res.json({ success: true, data: { route: updated } });
  })
);

// ------------------------------------------------------------------
// ACL policies
// ------------------------------------------------------------------

const aclInput = z.object({
  action: z.enum(["accept", "drop"]).default("accept"),
  src: z.string().min(1),
  dst: z.string().min(1),
  ports: z.string().default("*"),
  schedule: z.string().optional(),
  priority: z.number().int().min(1).max(1000).default(100),
  description: z.string().max(200).optional()
});

/** GET /api/mesh/acls — list ACL policies for the user's network. */
router.get(
  "/acls",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const network = await ensureNetwork(req.user!.id);
    const acls = await prisma.meshAcl.findMany({
      where: { networkId: network.id },
      orderBy: { priority: "asc" }
    });
    res.json({ success: true, data: acls });
  })
);

/** POST /api/mesh/acls — create an ACL policy. */
router.post(
  "/acls",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const network = await ensureNetwork(req.user!.id);
    const input = aclInput.safeParse(req.body);
    if (!input.success) return res.status(400).json({ success: false, message: "Invalid payload" });
    const acl = await prisma.meshAcl.create({ data: { ...input.data, networkId: network.id } });
    res.status(201).json({ success: true, data: acl });
  })
);

/** DELETE /api/mesh/acls/:aclId — remove an ACL policy. */
router.delete(
  "/acls/:aclId",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const network = await ensureNetwork(req.user!.id);
    const acl = await prisma.meshAcl.findFirst({ where: { id: req.params.aclId, networkId: network.id } });
    if (!acl) return res.status(404).json({ success: false, message: "ACL not found" });
    await prisma.meshAcl.delete({ where: { id: acl.id } });
    res.json({ success: true });
  })
);

// ------------------------------------------------------------------
// Magic DNS
// ------------------------------------------------------------------

/** GET /api/mesh/dns — return the full Magic DNS zone for the network. */
router.get(
  "/dns",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const network = await ensureNetwork(req.user!.id);
    const records = await prisma.meshDnsRecord.findMany({ where: { networkId: network.id } });
    res.json({ success: true, data: { domain: network.magicDnsDomain, enabled: network.magicDnsEnabled, records } });
  })
);

const dnsInput = z.object({
  name: z.string().min(1).max(63),
  type: z.enum(["A", "AAAA", "CNAME"]).default("A"),
  value: z.string().min(1).max(255)
});

/** POST /api/mesh/dns — add a custom Magic DNS record. */
router.post(
  "/dns",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const network = await ensureNetwork(req.user!.id);
    const input = dnsInput.safeParse(req.body);
    if (!input.success) return res.status(400).json({ success: false, message: "Invalid payload" });
    const record = await prisma.meshDnsRecord.create({
      data: { ...input.data, networkId: network.id, auto: false }
    });
    res.status(201).json({ success: true, data: record });
  })
);

// ------------------------------------------------------------------
// Port forwarding (secure ingress)
// ------------------------------------------------------------------

const portForwardInput = z.object({
  targetNodeId: z.string().uuid(),
  targetPort: z.number().int().min(1).max(65535),
  protocol: z.enum(["tcp", "udp"]).default("tcp")
});

/**
 * POST /api/mesh/port-forwards
 * Create a secure port-forward that exposes a remote device port through the
 * coordination relay with an auto-assigned dynamic-DNS ingress hostname —
 * no router/firewall changes required.
 */
router.post(
  "/port-forwards",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const network = await ensureNetwork(req.user!.id);
    const input = portForwardInput.safeParse(req.body);
    if (!input.success) return res.status(400).json({ success: false, message: "Invalid payload" });

    const node = await prisma.meshNode.findFirst({
      where: { id: input.data.targetNodeId, networkId: network.id }
    });
    if (!node) return res.status(404).json({ success: false, message: "Target node not found" });

    const slug = Math.random().toString(36).slice(2, 10);
    const ingressHost = `${slug}.ingress.${network.magicDnsDomain}`;
    const ingressPort = 20000 + Math.floor(Math.random() * 20000);

    const pf = await prisma.meshPortForward.create({
      data: {
        networkId: network.id,
        targetNodeId: node.id,
        targetPort: input.data.targetPort,
        protocol: input.data.protocol,
        ingressHost,
        ingressPort
      }
    });
    res.status(201).json({ success: true, data: pf });
  })
);

/** GET /api/mesh/port-forwards — list active port forwards. */
router.get(
  "/port-forwards",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const network = await ensureNetwork(req.user!.id);
    const list = await prisma.meshPortForward.findMany({ where: { networkId: network.id } });
    res.json({ success: true, data: list });
  })
);

// ------------------------------------------------------------------
// Speed test
// ------------------------------------------------------------------

const speedTestInput = z.object({
  fromNodeId: z.string().uuid(),
  toNodeId: z.string().uuid(),
  downMbps: z.number().nonnegative(),
  upMbps: z.number().nonnegative(),
  latencyMs: z.number().nonnegative(),
  jitterMs: z.number().nonnegative().default(0),
  packetLoss: z.number().min(0).max(100).default(0),
  via: z.enum(["direct", "relay", "multihop"]).default("direct")
});

/** POST /api/mesh/speedtest — record a node-to-node speed-test result. */
router.post(
  "/speedtest",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const network = await ensureNetwork(req.user!.id);
    const input = speedTestInput.safeParse(req.body);
    if (!input.success) return res.status(400).json({ success: false, message: "Invalid payload" });
    const result = await prisma.meshSpeedTest.create({ data: { ...input.data, networkId: network.id } });
    res.status(201).json({ success: true, data: result });
  })
);

/** GET /api/mesh/speedtest — recent speed-test history. */
router.get(
  "/speedtest",
  asyncHandler<AuthedRequest>(async (req, res) => {
    const network = await ensureNetwork(req.user!.id);
    const results = await prisma.meshSpeedTest.findMany({
      where: { networkId: network.id },
      orderBy: { createdAt: "desc" },
      take: 50
    });
    res.json({ success: true, data: results });
  })
);

export default router;
