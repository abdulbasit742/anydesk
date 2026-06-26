import crypto from "crypto";
import { prisma } from "../lib/prisma.js";

export class AffiliateService {
  /**
   * Create affiliate profile for user
   */
  async createAffiliateProfile(userId: string): Promise<any> {
    // Check if already exists
    let profile = await prisma.affiliateProfile.findUnique({
      where: { userId },
    });

    if (profile) {
      return profile;
    }

    // Generate unique referral code
    const referralCode = this.generateReferralCode();

    profile = await prisma.affiliateProfile.create({
      data: {
        userId,
        referralCode,
        commissionRate: 0.2, // 20% default
      },
    });

    return profile;
  }

  /**
   * Get affiliate profile
   */
  async getAffiliateProfile(userId: string): Promise<any> {
    return prisma.affiliateProfile.findUnique({
      where: { userId },
      include: {
        referrals: {
          include: {
            referredUser: {
              select: { id: true, email: true, plan: true },
            },
          },
        },
      },
    });
  }

  /**
   * Get affiliate profile by referral code
   */
  async getAffiliateByCode(referralCode: string): Promise<any> {
    return prisma.affiliateProfile.findUnique({
      where: { referralCode },
    });
  }

  /**
   * Track referral
   */
  async trackReferral(affiliateId: string, referredUserId: string): Promise<any> {
    // Check if referral already exists
    const existing = await prisma.affiliateReferral.findUnique({
      where: { referredUserId },
    });

    if (existing) {
      return existing;
    }

    return prisma.affiliateReferral.create({
      data: {
        affiliateId,
        referredUserId,
        status: "trialing",
      },
    });
  }

  /**
   * Update referral status
   */
  async updateReferralStatus(referredUserId: string, status: string): Promise<any> {
    return prisma.affiliateReferral.update({
      where: { referredUserId },
      data: { status },
    });
  }

  /**
   * Calculate commissions for affiliate
   */
  async calculateCommissions(affiliateId: string): Promise<{ pending: number; total: number }> {
    const profile = await prisma.affiliateProfile.findUnique({
      where: { id: affiliateId },
      include: {
        referrals: {
          include: {
            referredUser: {
              include: {
                subscription: true,
              },
            },
          },
        },
      },
    });

    if (!profile) {
      return { pending: 0, total: 0 };
    }

    let totalCommission = 0;

    for (const referral of profile.referrals) {
      if (referral.status === "active" && referral.referredUser.subscription) {
        const subscription = referral.referredUser.subscription;

        // Calculate monthly commission
        // Assuming Pro = $9.99, Business = $29.99
        let monthlyRevenue = 0;
        if (subscription.plan === "PRO") {
          monthlyRevenue = 999; // in cents
        } else if (subscription.plan === "BUSINESS") {
          monthlyRevenue = 2999; // in cents
        }

        const commission = Math.floor(monthlyRevenue * profile.commissionRate);
        totalCommission += commission;
      }
    }

    return {
      pending: profile.pendingPayout,
      total: profile.totalEarned + profile.pendingPayout,
    };
  }

  /**
   * Process affiliate payouts
   */
  async processPayouts(): Promise<void> {
    const profiles = await prisma.affiliateProfile.findMany({
      where: {
        pendingPayout: {
          gt: 0,
        },
      },
    });

    for (const profile of profiles) {
      // TODO: Integrate with payment processor (Stripe, PayPal, etc.)
      // For now, just mark as paid

      await prisma.affiliateProfile.update({
        where: { id: profile.id },
        data: {
          totalEarned: profile.totalEarned + profile.pendingPayout,
          pendingPayout: 0,
        },
      });
    }
  }

  /**
   * Get referral link
   */
  getReferralLink(referralCode: string): string {
    const baseUrl = process.env.APP_URL || "https://remotedesk.io";
    return `${baseUrl}?ref=${referralCode}`;
  }

  /**
   * Generate unique referral code
   */
  private generateReferralCode(): string {
    return crypto.randomBytes(6).toString("hex").toUpperCase();
  }
}

export const affiliateService = new AffiliateService();
