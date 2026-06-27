import { prisma } from "../../lib/prisma.js";
export const vpnService = {
  async createNetwork(orgId: string, name: string, subnet: string) {
    return prisma.vpnNetwork.create({ data: { orgId, name, subnet, status: "active" } });
  },
  async addPeer(networkId: string, deviceId: string): Promise<{ publicKey: string; allowedIps: string; endpoint: string }> {
    const config = { publicKey: `peer_${deviceId}_pubkey`, allowedIps: "10.0.0.0/24", endpoint: "vpn.remotedesk.io:51820" };
    await prisma.vpnPeer.create({ data: { networkId, deviceId, publicKey: config.publicKey, allowedIps: config.allowedIps, status: "active" } });
    return config;
  },
  async removePeer(networkId: string, deviceId: string) { return prisma.vpnPeer.update({ where: { networkId_deviceId: { networkId, deviceId } }, data: { status: "removed" } }); },
  async getNetworkPeers(networkId: string) { return prisma.vpnPeer.findMany({ where: { networkId, status: "active" } }); },
  async getNetworks(orgId: string) { return prisma.vpnNetwork.findMany({ where: { orgId } }); },
};
