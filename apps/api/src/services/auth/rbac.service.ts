import { prisma } from "../../lib/prisma.js";
export type Permission = "devices:read" | "devices:write" | "devices:delete" | "users:read" | "users:write" | "users:delete" | "billing:read" | "billing:write" | "settings:read" | "settings:write" | "fleet:read" | "fleet:write" | "security:read" | "security:write" | "admin:all";
export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  admin: ["admin:all", "devices:read", "devices:write", "devices:delete", "users:read", "users:write", "users:delete", "billing:read", "billing:write", "settings:read", "settings:write", "fleet:read", "fleet:write", "security:read", "security:write"],
  manager: ["devices:read", "devices:write", "users:read", "billing:read", "settings:read", "fleet:read", "fleet:write", "security:read"],
  technician: ["devices:read", "devices:write", "fleet:read", "security:read"],
  viewer: ["devices:read", "fleet:read"],
};
export const rbacService = {
  hasPermission(role: string, permission: Permission): boolean {
    const perms = ROLE_PERMISSIONS[role] || [];
    return perms.includes("admin:all") || perms.includes(permission);
  },
  async assignRole(userId: string, orgId: string, role: string) {
    return prisma.orgMember.upsert({ where: { userId_orgId: { userId, orgId } }, create: { userId, orgId, role }, update: { role } });
  },
  async getUserRole(userId: string, orgId: string): Promise<string | null> {
    const member = await prisma.orgMember.findUnique({ where: { userId_orgId: { userId, orgId } } });
    return member?.role || null;
  },
  async getOrgMembers(orgId: string) { return prisma.orgMember.findMany({ where: { orgId }, include: { user: true } }); },
};
