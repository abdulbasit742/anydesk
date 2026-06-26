import Stripe from "stripe";
import { prisma } from "../lib/prisma.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2024-04-10" });

export const PLAN_LIMITS = {
  FREE: { maxDevices: 1, maxSessionMinutes: 30, fileTransfer: false, price: 0 },
  PRO: { maxDevices: 10, maxSessionMinutes: null, fileTransfer: true, price: 999 },
  BUSINESS: { maxDevices: null, maxSessionMinutes: null, fileTransfer: true, price: 2999 },
  ENTERPRISE: { maxDevices: null, maxSessionMinutes: null, fileTransfer: true, price: null },
};

export const billingService = {
  // Create Stripe checkout session
  async createCheckoutSession(userId: string, plan: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    const priceId = {
      PRO: process.env.STRIPE_PRICE_PRO,
      BUSINESS: process.env.STRIPE_PRICE_BUSINESS,
      ENTERPRISE: process.env.STRIPE_PRICE_ENTERPRISE,
    }[plan];

    if (!priceId) throw new Error("Invalid plan");

    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${process.env.APP_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL}/billing/cancel`,
      metadata: { userId, plan },
    });

    return session;
  },

  // Handle Stripe webhook: subscription.created
  async handleSubscriptionCreated(subscription: Stripe.Subscription) {
    const userId = subscription.metadata?.userId;
    if (!userId) return;

    const plan = subscription.metadata?.plan || "PRO";

    await prisma.subscription.create({
      data: {
        userId,
        plan: plan as any,
        status: "TRIALING",
        stripeSubscriptionId: subscription.id,
        stripePriceId: subscription.items.data[0]?.price.id,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
    });

    // Update user plan
    await prisma.user.update({
      where: { id: userId },
      data: { plan: plan as any },
    });
  },

  // Handle Stripe webhook: invoice.paid
  async handleInvoicePaid(invoice: Stripe.Invoice) {
    const userId = invoice.metadata?.userId;
    if (!userId) return;

    await prisma.stripeInvoice.create({
      data: {
        userId,
        stripeInvoiceId: invoice.id,
        amount: invoice.amount_paid,
        currency: invoice.currency,
        status: "paid",
        pdfUrl: invoice.pdf,
      },
    });
  },

  // Handle Stripe webhook: invoice.payment_failed
  async handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
    const userId = invoice.metadata?.userId;
    if (!userId) return;

    const subscription = await prisma.subscription.findFirst({
      where: { userId, stripeSubscriptionId: invoice.subscription as string },
    });

    if (subscription) {
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: { status: "PAST_DUE" },
      });
    }

    // TODO: Send dunning email
  },

  // Handle Stripe webhook: customer.subscription.deleted
  async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const userId = subscription.metadata?.userId;
    if (!userId) return;

    await prisma.subscription.updateMany({
      where: { userId, stripeSubscriptionId: subscription.id },
      data: { status: "CANCELED" },
    });

    // Downgrade user to FREE plan
    await prisma.user.update({
      where: { id: userId },
      data: { plan: "FREE" },
    });
  },

  // Track usage
  async recordUsage(userId: string, type: string, quantity: number) {
    const now = new Date();
    const billingPeriodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const billingPeriodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    await prisma.usageRecord.create({
      data: {
        userId,
        type,
        quantity,
        billingPeriodStart,
        billingPeriodEnd,
      },
    });
  },

  // Get usage for current period
  async getUsageForPeriod(userId: string) {
    const now = new Date();
    const billingPeriodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const billingPeriodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const usage = await prisma.usageRecord.findMany({
      where: {
        userId,
        recordedAt: { gte: billingPeriodStart, lte: billingPeriodEnd },
      },
    });

    return usage.reduce(
      (acc, record) => {
        acc[record.type] = (acc[record.type] || 0) + record.quantity;
        return acc;
      },
      {} as Record<string, number>
    );
  },

  // Generate license key
  async generateLicenseKey(userId: string, deviceId?: string, expiresInDays: number = 365) {
    const key = `REMOTEDESK-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    const licenseKey = await prisma.licenseKey.create({
      data: {
        key,
        userId,
        deviceId,
        expiresAt,
      },
    });

    return licenseKey;
  },

  // Validate license key
  async validateLicenseKey(key: string) {
    const licenseKey = await prisma.licenseKey.findUnique({
      where: { key },
    });

    if (!licenseKey) return { valid: false, error: "License key not found" };
    if (!licenseKey.isActive) return { valid: false, error: "License key is inactive" };
    if (licenseKey.expiresAt && licenseKey.expiresAt < new Date()) {
      return { valid: false, error: "License key expired" };
    }

    return { valid: true, licenseKey };
  },

  // Activate license key
  async activateLicenseKey(key: string, deviceId: string) {
    const licenseKey = await prisma.licenseKey.findUnique({
      where: { key },
    });

    if (!licenseKey) throw new Error("License key not found");
    if (licenseKey.activatedAt) throw new Error("License key already activated");

    return prisma.licenseKey.update({
      where: { key },
      data: {
        deviceId,
        activatedAt: new Date(),
      },
    });
  },

  // Apply promo code
  async applyPromoCode(code: string) {
    const promoCode = await prisma.promoCode.findUnique({
      where: { code },
    });

    if (!promoCode) return { valid: false, error: "Promo code not found" };
    if (!promoCode.isActive) return { valid: false, error: "Promo code is inactive" };
    if (promoCode.expiresAt && promoCode.expiresAt < new Date()) {
      return { valid: false, error: "Promo code expired" };
    }
    if (promoCode.maxUses && promoCode.usedCount >= promoCode.maxUses) {
      return { valid: false, error: "Promo code usage limit reached" };
    }

    // Increment used count
    await prisma.promoCode.update({
      where: { code },
      data: { usedCount: { increment: 1 } },
    });

    return { valid: true, discountPercent: promoCode.discountPercent };
  },

  // Create referral
  async createReferral(referrerId: string, referredId: string) {
    return prisma.referral.create({
      data: {
        referrerId,
        referredId,
        commissionPercent: 20,
      },
    });
  },

  // Get referral earnings
  async getReferralEarnings(userId: string) {
    const referrals = await prisma.referral.findMany({
      where: { referrerId: userId },
    });

    const totalEarnings = referrals.reduce((sum, ref) => sum + ref.commissionAmount, 0);
    const pendingEarnings = referrals
      .filter((ref) => ref.status === "pending")
      .reduce((sum, ref) => sum + ref.commissionAmount, 0);

    return { totalEarnings, pendingEarnings, referrals };
  },

  // Get billing dashboard data
  async getBillingDashboard(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const subscription = await prisma.subscription.findFirst({
      where: { userId },
    });
    const invoices = await prisma.stripeInvoice.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    });
    const usage = await this.getUsageForPeriod(userId);

    return {
      currentPlan: user?.plan,
      subscription,
      invoices,
      usage,
      limits: PLAN_LIMITS[user?.plan || "FREE"],
    };
  },
};
