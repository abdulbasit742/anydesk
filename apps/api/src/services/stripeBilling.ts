import Stripe from "stripe";
import { prisma } from "../lib/prisma.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16" as any,
});

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: "month" | "year";
  features: string[];
}

export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  FREE: {
    id: "free",
    name: "Free",
    price: 0,
    currency: "usd",
    interval: "month",
    features: ["1 device", "30-minute sessions", "No file transfer"],
  },
  PRO: {
    id: "price_pro_monthly",
    name: "Pro",
    price: 999,
    currency: "usd",
    interval: "month",
    features: ["5 devices", "Unlimited sessions", "File transfer", "License keys"],
  },
  BUSINESS: {
    id: "price_business_monthly",
    name: "Business",
    price: 2999,
    currency: "usd",
    interval: "month",
    features: [
      "Unlimited devices",
      "Unlimited sessions",
      "File transfer",
      "Team management",
      "Session recording",
      "Priority support",
    ],
  },
  ENTERPRISE: {
    id: "custom",
    name: "Enterprise",
    price: 0,
    currency: "usd",
    interval: "month",
    features: ["Everything in Business", "Custom integrations", "Dedicated support"],
  },
};

export class StripeBillingService {
  /**
   * Create a checkout session for a subscription
   */
  async createCheckoutSession(
    userId: string,
    planId: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<string> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, stripeCustomerId: true },
    });

    if (!user) throw new Error("User not found");

    const plan = SUBSCRIPTION_PLANS[planId];
    if (!plan) throw new Error("Invalid plan");

    // Create or retrieve Stripe customer
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId },
      });
      customerId = customer.id;

      await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customerId },
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: plan.id,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { userId, planId },
    });

    return session.url || "";
  }

  /**
   * Handle subscription created webhook
   */
  async handleSubscriptionCreated(subscription: any): Promise<void> {
    const userId = subscription.metadata?.userId;
    if (!userId) return;

    const priceId = subscription.items.data[0]?.price.id;
    const plan = Object.entries(SUBSCRIPTION_PLANS).find(
      ([_, p]) => p.id === priceId
    )?.[0];

    if (!plan) return;

    await prisma.subscription.upsert({
      where: { userId },
      update: {
        stripeSubscriptionId: subscription.id,
        stripePriceId: priceId,
        status: "ACTIVE",
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        plan: plan as any,
      },
      create: {
        userId,
        stripeSubscriptionId: subscription.id,
        stripePriceId: priceId,
        status: "ACTIVE",
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        plan: plan as any,
      },
    });

    // Update user plan
    await prisma.user.update({
      where: { id: userId },
      data: { plan: plan as any },
    });
  }

  /**
   * Handle subscription updated webhook
   */
  async handleSubscriptionUpdated(subscription: any): Promise<void> {
    const userId = subscription.metadata?.userId;
    if (!userId) return;

    const priceId = subscription.items.data[0]?.price.id;
    const plan = Object.entries(SUBSCRIPTION_PLANS).find(
      ([_, p]) => p.id === priceId
    )?.[0];

    if (!plan) return;

    // Map Stripe status to our enum
    let status: "ACTIVE" | "PAST_DUE" | "CANCELED" | "TRIALING" | "INCOMPLETE" = "ACTIVE";
    if (subscription.status === "past_due") status = "PAST_DUE";
    else if (subscription.status === "canceled") status = "CANCELED";
    else if (subscription.status === "trialing") status = "TRIALING";
    else if (subscription.status === "incomplete") status = "INCOMPLETE";

    await prisma.subscription.update({
      where: { userId },
      data: {
        status,
        plan: plan as any,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { plan: plan as any },
    });
  }

  /**
   * Handle subscription deleted webhook
   */
  async handleSubscriptionDeleted(subscription: any): Promise<void> {
    const userId = subscription.metadata?.userId;
    if (!userId) return;

    await prisma.subscription.update({
      where: { userId },
      data: {
        status: "CANCELED",
        plan: "FREE",
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { plan: "FREE" },
    });
  }

  /**
   * Handle invoice payment succeeded
   */
  async handleInvoicePaid(invoice: any): Promise<void> {
    const userId = invoice.metadata?.userId;
    if (!userId) return;

    // Create invoice record
    await prisma.invoice.create({
      data: {
        userId,
        stripeInvoiceId: invoice.id,
        amount: invoice.amount_paid || 0,
        currency: invoice.currency || "usd",
        status: "paid",
        pdfUrl: invoice.invoice_pdf || undefined,
      },
    });
  }

  /**
   * Handle invoice payment failed
   */
  async handleInvoicePaymentFailed(invoice: any): Promise<void> {
    const userId = invoice.metadata?.userId;
    if (!userId) return;

    // Update subscription status to past due
    await prisma.subscription.update({
      where: { userId },
      data: { status: "PAST_DUE" },
    });

    // TODO: Send dunning email
  }

  /**
   * Get subscription for user
   */
  async getSubscription(userId: string): Promise<any> {
    return prisma.subscription.findUnique({
      where: { userId },
    });
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(userId: string): Promise<void> {
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
      select: { stripeSubscriptionId: true },
    });

    if (!subscription?.stripeSubscriptionId) return;

    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    await prisma.subscription.update({
      where: { userId },
      data: { cancelAtPeriodEnd: true },
    });
  }

  /**
   * Resume subscription
   */
  async resumeSubscription(userId: string): Promise<void> {
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
      select: { stripeSubscriptionId: true },
    });

    if (!subscription?.stripeSubscriptionId) return;

    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: false,
    });

    await prisma.subscription.update({
      where: { userId },
      data: { cancelAtPeriodEnd: false },
    });
  }

  /**
   * Update subscription plan
   */
  async updateSubscriptionPlan(userId: string, newPlanId: string): Promise<void> {
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
      select: { stripeSubscriptionId: true },
    });

    if (!subscription?.stripeSubscriptionId) return;

    const plan = SUBSCRIPTION_PLANS[newPlanId];
    if (!plan) throw new Error("Invalid plan");

    // Update Stripe subscription
    const stripeSubscription = await stripe.subscriptions.retrieve(
      subscription.stripeSubscriptionId
    );

    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      items: [
        {
          id: stripeSubscription.items.data[0].id,
          price: plan.id,
        },
      ],
    });

    // Update local subscription
    await prisma.subscription.update({
      where: { userId },
      data: {
        plan: newPlanId as any,
        stripePriceId: plan.id,
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { plan: newPlanId as any },
    });
  }

  /**
   * Report usage for metered billing
   */
  async reportUsage(
    subscriptionId: string,
    metricId: string,
    quantity: number
  ): Promise<void> {
    const subscription = await prisma.subscription.findFirst({
      where: { userId: subscriptionId },
      select: { stripeSubscriptionId: true },
    });

    if (!subscription?.stripeSubscriptionId) return;

    const stripeSubscription = await stripe.subscriptions.retrieve(
      subscription.stripeSubscriptionId
    );

    const subscriptionItem = stripeSubscription.items.data.find(
      (item: any) => item.billing_details?.usage_type === metricId
    );

    if (!subscriptionItem) return;

    await (stripe.subscriptionItems as any).createUsageRecord(subscriptionItem.id, {
      quantity,
      timestamp: Math.floor(Date.now() / 1000),
    });
  }

  /**
   * Get billing portal session
   */
  async getBillingPortalSession(userId: string, returnUrl: string): Promise<string> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true },
    });

    if (!user?.stripeCustomerId) throw new Error("No Stripe customer found");

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: returnUrl,
    });

    return session.url;
  }
}

export const stripeBillingService = new StripeBillingService();
