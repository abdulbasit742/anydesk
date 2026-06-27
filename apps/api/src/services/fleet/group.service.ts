import { prisma } from "../../lib/prisma.js";
export const groupService = {
  async createGroup(orgId: string, data: { name: string; description?: string; tags?: string[]; parentGroupId?: string }) {
    return prisma.deviceGroup.create({ data: { orgId, name: data.name, description: data.description, tags: data.tags || [], parentGroupId: data.parentGroupId } });
  },
  async addDeviceToGroup(groupId: string, deviceId: string) { return prisma.deviceGroupMembership.create({ data: { groupId, deviceId } }); },
  async removeDeviceFromGroup(groupId: string, deviceId: string) { return prisma.deviceGroupMembership.delete({ where: { groupId_deviceId: { groupId, deviceId } } }); },
  async getGroupDevices(groupId: string) { return prisma.deviceGroupMembership.findMany({ where: { groupId }, include: { device: true } }); },
  async getDeviceGroups(deviceId: string) { return prisma.deviceGroupMembership.findMany({ where: { deviceId }, include: { group: true } }); },
  async updateGroup(groupId: string, data: Partial<{ name: string; description: string; tags: string[] }>) { return prisma.deviceGroup.update({ where: { id: groupId }, data }); },
  async deleteGroup(groupId: string) { return prisma.deviceGroup.delete({ where: { id: groupId } }); },
  async getGroupTree(orgId: string) { return prisma.deviceGroup.findMany({ where: { orgId }, include: { children: true, _count: { select: { members: true } } } }); },
};
