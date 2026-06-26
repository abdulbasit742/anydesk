import { prisma } from "../lib/prisma.js";

export class WhiteLabelService {
  /**
   * Get white-label config for organization
   */
  async getConfig(organizationId: string): Promise<any> {
    let config = await prisma.whiteLabelConfig.findUnique({
      where: { organizationId },
    });

    if (!config) {
      // Create default config
      config = await prisma.whiteLabelConfig.create({
        data: {
          organizationId,
          appName: "RemoteDesk",
          primaryColor: "#0066cc",
        },
      });
    }

    return config;
  }

  /**
   * Get config by custom domain
   */
  async getConfigByDomain(customDomain: string): Promise<any> {
    return prisma.whiteLabelConfig.findUnique({
      where: { customDomain },
      include: { organization: true },
    });
  }

  /**
   * Update white-label config
   */
  async updateConfig(
    organizationId: string,
    data: {
      appName?: string;
      customDomain?: string;
      logoUrl?: string;
      primaryColor?: string;
      supportEmail?: string;
    }
  ): Promise<any> {
    let config = await prisma.whiteLabelConfig.findUnique({
      where: { organizationId },
    });

    if (!config) {
      config = await prisma.whiteLabelConfig.create({
        data: {
          organizationId,
          ...data,
        },
      });
    } else {
      config = await prisma.whiteLabelConfig.update({
        where: { organizationId },
        data,
      });
    }

    return config;
  }

  /**
   * Validate custom domain
   */
  async validateCustomDomain(domain: string): Promise<{ valid: boolean; error?: string }> {
    // Check if domain is already in use
    const existing = await prisma.whiteLabelConfig.findUnique({
      where: { customDomain: domain },
    });

    if (existing) {
      return { valid: false, error: "Domain already in use" };
    }

    // Check domain format
    const domainRegex = /^([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i;
    if (!domainRegex.test(domain)) {
      return { valid: false, error: "Invalid domain format" };
    }

    return { valid: true };
  }

  /**
   * Get branding for domain
   */
  async getBrandingForDomain(domain: string): Promise<any> {
    const config = await this.getConfigByDomain(domain);

    if (!config) {
      return this.getDefaultBranding();
    }

    return {
      appName: config.appName,
      logoUrl: config.logoUrl,
      primaryColor: config.primaryColor,
      supportEmail: config.supportEmail,
    };
  }

  /**
   * Get default branding
   */
  private getDefaultBranding(): any {
    return {
      appName: "RemoteDesk",
      logoUrl: null,
      primaryColor: "#0066cc",
      supportEmail: "support@remotedesk.io",
    };
  }
}

export const whiteLabelService = new WhiteLabelService();
