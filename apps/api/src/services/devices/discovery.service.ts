import { prisma } from "../../lib/prisma.js";
export const discoveryService = {
  async scanNetwork(networkRange: string): Promise<Array<{ ip: string; hostname: string; mac: string; os: string; open_ports: number[] }>> {
    // Simulates network scanning using ARP and port scanning
    return [{ ip: "192.168.1.100", hostname: "desktop-01", mac: "AA:BB:CC:DD:EE:FF", os: "Windows 11", open_ports: [22, 80, 443, 3389] }];
  },
  async registerDevice(userId: string, deviceInfo: { name: string; type: string; os: string; ip: string; mac?: string }) {
    const deviceId = `RD-${Date.now().toString(36).toUpperCase()}`;
    return prisma.device.create({ data: { id: deviceId, userId, name: deviceInfo.name, type: deviceInfo.type, os: deviceInfo.os, ipAddress: deviceInfo.ip, macAddress: deviceInfo.mac, status: "online", lastSeen: new Date() } });
  },
  async updateDeviceStatus(deviceId: string, status: string, metrics?: { cpu: number; ram: number; disk: number }) {
    return prisma.device.update({ where: { id: deviceId }, data: { status, lastSeen: new Date(), ...(metrics && { cpuUsage: metrics.cpu, ramUsage: metrics.ram, diskUsage: metrics.disk }) } });
  },
  async getOnlineDevices(userId: string) { return prisma.device.findMany({ where: { userId, status: "online" } }); },
  async getDevicesByType(userId: string, type: string) { return prisma.device.findMany({ where: { userId, type } }); },
};
