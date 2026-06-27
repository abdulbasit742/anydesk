/**
 * Stripe Payment & Subscription Service for RemoteDesk.
 * Adapted from researchcollab2 stripeService.
 * Handles: subscriptions, one-time payments, webhooks, customer portal.
 */

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20' as any,
});

// Plan definitions
export const PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    priceMonthly: 0,
    priceYearly: 0,
    stripePriceIdMonthly: null,
    stripePriceIdYearly: null,
    features: {
      maxDevices: 1,
      maxSessionMinutes: 30,
      fileTransfer: false,
      unattendedAccess: false,
      multiMonitor: false,
      sessionRecording: false,
      customBranding: false,
      prioritySupport: false,
      teamMembers: 1,
      apiAccess: false,
    },
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    priceMonthly: 999, // $9.99 in cents
    priceYearly: 9990, // $99.90 in cents (save 2 months)
    stripePriceIdMonthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || '',
    stripePriceIdYearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID || '',
    features: {
      maxDevices: 10,
      maxSessionMinutes: -1, // unlimited
      fileTransfer: true,
      unattendedAccess: true,
      multiMonitor: true,
      sessionRecording: true,
      customBranding: false,
      prioritySupport: false,
      teamMembers: 1,
      apiAccess: false,
    },
  },
  business: {
    id: 'business',
    name: 'Business',
    priceMonthly: 2999, // $29.99 in cents
    priceYearly: 29990,
    stripePriceIdMonthly: process.env.STRIPE_BUSINESS_MONTHLY_PRICE_ID || '',
    stripePriceIdYearly: process.env.STRIPE_BUSINESS_YEARLY_PRICE_ID || '',
    features: {
      maxDevices: -1, // unlimited
      maxSessionMinutes: -1,
      fileTransfer: true,
      unattendedAccess: true,
      multiMonitor: true,
      sessionRecording: true,
      customBranding: true,
      prioritySupport: true,
      teamMembers: 25,
      apiAccess: true,
    },
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    priceMonthly: 9999, // $99.99 in cents
    priceYearly: 99990,
    stripePriceIdMonthly: process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID || '',
    stripePriceIdYearly: process.env.STRIPE_ENTERPRISE_YEARLY_PRICE_ID || '',
    features: {
      maxDevices: -1,
      maxSessionMinutes: -1,
      fileTransfer: true,
      unattendedAccess: true,
      multiMonitor: true,
      sessionRecording: true,
      customBranding: true,
      prioritySupport: true,
      teamMembers: -1, // unlimited
      apiAccess: true,
    },
  },
};

export type PlanId = keyof typeof PLANS;

/**
 * Create or retrieve a Stripe customer for a user.
 */
export async function getOrCreateCustomer(
  userId: string,
  email: string,
  name?: string
): Promise<Stripe.Customer> {
  // Search for existing customer
  const existing = await stripe.customers.list({ email, limit: 1 });
  if (existing.data.length > 0) {
    return existing.data[0];
  }

  // Create new customer
  return stripe.customers.create({
    email,
    name: name || undefined,
    metadata: { userId, platform: 'remotedesk' },
  });
}

/**
 * Create a checkout session for subscription.
 */
export async function createCheckoutSession(params: {
  customerId: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  trialDays?: number;
}): Promise<string> {
  const session = await stripe.checkout.sessions.create({
    customer: params.customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: params.priceId, quantity: 1 }],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    subscription_data: params.trialDays
      ? { trial_period_days: params.trialDays }
      : undefined,
    allow_promotion_codes: true,
  });

  return session.url || '';
}

/**
 * Create a customer portal session for managing subscription.
 */
export async function createPortalSession(
  customerId: string,
  returnUrl: string
): Promise<string> {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
  return session.url;
}

/**
 * Cancel a subscription.
 */
export async function cancelSubscription(
  subscriptionId: string,
  immediately: boolean = false
): Promise<Stripe.Subscription> {
  if (immediately) {
    return stripe.subscriptions.cancel(subscriptionId);
  }
  return stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });
}

/**
 * Resume a cancelled subscription (before period end).
 */
export async function resumeSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  return stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  });
}

/**
 * Get subscription details.
 */
export async function getSubscription(subscriptionId: string): Promise<Stripe.Subscription | null> {
  try {
    return await stripe.subscriptions.retrieve(subscriptionId);
  } catch {
    return null;
  }
}

/**
 * Create a one-time payment (for add-ons, extra devices, etc.)
 */
export async function createOneTimePayment(params: {
  customerId: string;
  amount: number;
  description: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<string> {
  const session = await stripe.checkout.sessions.create({
    customer: params.customerId,
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: { name: params.description },
          unit_amount: params.amount,
        },
        quantity: 1,
      },
    ],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
  });

  return session.url || '';
}

/**
 * Generate an invoice for a customer.
 */
export async function createInvoice(
  customerId: string,
  items: Array<{ description: string; amount: number }>
): Promise<Stripe.Invoice> {
  for (const item of items) {
    await stripe.invoiceItems.create({
      customer: customerId,
      amount: item.amount,
      currency: 'usd',
      description: item.description,
    });
  }

  const invoice = await stripe.invoices.create({
    customer: customerId,
    auto_advance: true,
  });

  return stripe.invoices.finalizeInvoice(invoice.id);
}

/**
 * Handle Stripe webhook events.
 */
export async function handleWebhook(
  body: Buffer,
  signature: string
): Promise<{ event: string; data: Record<string, unknown> }> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
  const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      return {
        event: 'subscription_created',
        data: {
          customerId: session.customer as string,
          subscriptionId: session.subscription as string,
          email: session.customer_email,
        },
      };
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription;
      return {
        event: 'subscription_updated',
        data: {
          subscriptionId: sub.id,
          status: sub.status,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore — current_period_end exists at runtime but Stripe v22 types differ
          currentPeriodEnd: new Date((sub.current_period_end as number) * 1000).toISOString(),
          cancelAtPeriodEnd: sub.cancel_at_period_end,
        },
      };
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      return {
        event: 'subscription_cancelled',
        data: {
          subscriptionId: sub.id,
          customerId: sub.customer as string,
        },
      };
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      return {
        event: 'payment_failed',
        data: {
          customerId: invoice.customer as string,
          invoiceId: invoice.id,
          amount: invoice.amount_due,
          attemptCount: invoice.attempt_count,
        },
      };
    }

    case 'invoice.paid': {
      const invoice = event.data.object as Stripe.Invoice;
      return {
        event: 'payment_succeeded',
        data: {
          customerId: invoice.customer as string,
          invoiceId: invoice.id,
          amount: invoice.amount_paid,
        },
      };
    }

    default:
      return { event: event.type, data: {} };
  }
}

/**
 * Get usage metrics for a customer (for metered billing).
 */
export async function reportUsage(
  subscriptionItemId: string,
  quantity: number,
  timestamp?: number
): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore — createUsageRecord exists at runtime but Stripe v22 types differ
  await stripe.subscriptionItems.createUsageRecord(subscriptionItemId, {
    quantity,
    timestamp: timestamp || Math.floor(Date.now() / 1000),
    action: 'increment',
  });
}

export default {
  PLANS,
  getOrCreateCustomer,
  createCheckoutSession,
  createPortalSession,
  cancelSubscription,
  resumeSubscription,
  getSubscription,
  createOneTimePayment,
  createInvoice,
  handleWebhook,
  reportUsage,
};
