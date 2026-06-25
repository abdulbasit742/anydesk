// Stripe integration module
// In production, this would use the real Stripe SDK with your secret key.

export const PRICES = {
  free:    { monthly: 0,    annual: 0    },
  starter: { monthly: 29,   annual: 23   },
  pro:     { monthly: 79,   annual: 63   },
  agency:  { monthly: 199,  annual: 159  },
};

export const FEATURES = {
  free: {
    accounts: 2,
    broadcasts: 50,
    templates: 10,
    storage: '500MB',
    support: 'Community',
    ai_optimize: false,
    relay: false,
    vault: false,
    analytics: 'Basic',
    api: false,
  },
  starter: {
    accounts: 10,
    broadcasts: 500,
    templates: 100,
    storage: '5GB',
    support: 'Email',
    ai_optimize: true,
    relay: false,
    vault: false,
    analytics: 'Standard',
    api: false,
  },
  pro: {
    accounts: 50,
    broadcasts: 5000,
    templates: 'Unlimited',
    storage: '50GB',
    support: 'Priority',
    ai_optimize: true,
    relay: true,
    vault: true,
    analytics: 'Advanced',
    api: true,
  },
  agency: {
    accounts: 'Unlimited',
    broadcasts: 'Unlimited',
    templates: 'Unlimited',
    storage: '500GB',
    support: 'Dedicated',
    ai_optimize: true,
    relay: true,
    vault: true,
    analytics: 'Enterprise',
    api: true,
  },
};

/**
 * Get a Stripe Checkout URL for the given plan and billing period.
 * In production, this calls your backend /api/stripe/checkout endpoint.
 */
export async function getCheckoutUrl(plan, period = 'monthly') {
  // Mock implementation — replace with real API call in production
  console.log(`[Stripe] Creating checkout session for plan=${plan}, period=${period}`);
  return `https://checkout.stripe.com/pay/mock_${plan}_${period}_${Date.now()}`;
}

/**
 * Open Stripe Customer Portal so users can manage their subscription.
 */
export async function openCustomerPortal() {
  console.log('[Stripe] Opening customer portal...');
  return `https://billing.stripe.com/p/session/mock_${Date.now()}`;
}

/**
 * Verify subscription status via Stripe API.
 */
export async function getSubscriptionStatus() {
  // Mock — returns a demo subscription
  return {
    plan: 'pro',
    status: 'active',
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    cancelAtPeriodEnd: false,
  };
}
