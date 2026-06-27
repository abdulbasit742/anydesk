export interface CreateSubscriptionDto { plan: "free" | "pro" | "business" | "enterprise"; billingCycle: "monthly" | "annual"; couponCode?: string; paymentMethodId?: string; }
export interface UpdateSubscriptionDto { plan?: string; billingCycle?: string; cancelAtPeriodEnd?: boolean; }
