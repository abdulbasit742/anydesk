import { prisma } from "../lib/prisma.js";

export type OrganizationRole = "OWNER" | "ADMIN" | "MEMBER";

export class OrganizationService {
  /**
   * Create organization
   */
  async createOrganization(
    userId: string,
    name: string,
    slug?: string
  ): Promise<any> {
    const finalSlug = slug || this.generateSlug(name);

    const organization = await prisma.organization.create({
      data: {
        name,
        slug: finalSlug,
        ownerId: userId,
        members: {
          create: {
            userId,
            role: "OWNER",
          },
        },
      },
      include: { members: true },
    });

    return organization;
  }

  /**
   * Get organization by ID
   */
  async getOrganization(organizationId: string): Promise<any> {
    return prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        members: {
          include: { user: { select: { id: true, email: true, name: true } } },
        },
      },
    });
  }

  /**
   * Get user's organizations
   */
  async getUserOrganizations(userId: string): Promise<any[]> {
    return prisma.organization.findMany({
      where: {
        members: {
          some: { userId },
        },
      },
      include: {
        members: true,
      },
    });
  }

  /**
   * Update organization
   */
  async updateOrganization(
    organizationId: string,
    data: { name?: string; slug?: string }
  ): Promise<any> {
    return prisma.organization.update({
      where: { id: organizationId },
      data,
      include: { members: true },
    });
  }

  /**
   * Invite member to organization
   */
  async inviteMember(
    organizationId: string,
    email: string,
    role: OrganizationRole = "MEMBER"
  ): Promise<any> {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Create invitation record for later
      return prisma.organizationInvitation.create({
        data: {
          organizationId,
          email,
          role,
        },
      });
    }

    // Add user to organization
    return this.addMember(organizationId, user.id, role);
  }

  /**
   * Add member to organization
   */
  async addMember(
    organizationId: string,
    userId: string,
    role: OrganizationRole = "MEMBER"
  ): Promise<any> {
    // Check if already a member
    const existing = await prisma.organizationMember.findUnique({
      where: { organizationId_userId: { organizationId, userId } },
    });

    if (existing) {
      return existing;
    }

    return prisma.organizationMember.create({
      data: {
        organizationId,
        userId,
        role,
      },
    });
  }

  /**
   * Update member role
   */
  async updateMemberRole(
    organizationId: string,
    userId: string,
    role: OrganizationRole
  ): Promise<any> {
    return prisma.organizationMember.update({
      where: { organizationId_userId: { organizationId, userId } },
      data: { role },
    });
  }

  /**
   * Remove member from organization
   */
  async removeMember(organizationId: string, userId: string): Promise<void> {
    await prisma.organizationMember.delete({
      where: { organizationId_userId: { organizationId, userId } },
    });
  }

  /**
   * Get member role
   */
  async getMemberRole(organizationId: string, userId: string): Promise<OrganizationRole | null> {
    const member = await prisma.organizationMember.findUnique({
      where: { organizationId_userId: { organizationId, userId } },
    });

    return member?.role || null;
  }

  /**
   * Check if user is organization owner
   */
  async isOwner(organizationId: string, userId: string): Promise<boolean> {
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
    });

    return organization?.ownerId === userId;
  }

  /**
   * Check if user is organization admin
   */
  async isAdmin(organizationId: string, userId: string): Promise<boolean> {
    const role = await this.getMemberRole(organizationId, userId);
    return role === "OWNER" || role === "ADMIN";
  }

  /**
   * Get organization member count
   */
  async getMemberCount(organizationId: string): Promise<number> {
    return prisma.organizationMember.count({
      where: { organizationId },
    });
  }

  /**
   * Generate slug from name
   */
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
}

export const organizationService = new OrganizationService();
