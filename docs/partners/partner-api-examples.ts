/**
 * RemoteDesk Partner API Examples
 * Base URL: https://partner-api.remotedesk.io/v1
 */

// --- Authentication ---
// All requests require X-Partner-Key header
const PARTNER_KEY = process.env.REMOTEDESK_PARTNER_KEY!;
const BASE = "https://partner-api.remotedesk.io/v1";

async function partnerFetch(path: string, opts: RequestInit = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: {
      "X-Partner-Key": PARTNER_KEY,
      "Content-Type": "application/json",
      ...opts.headers,
    },
  });
  if (!res.ok) throw new Error(`Partner API ${res.status}: ${await res.text()}`);
  return res.json();
}

// --- List referred customers ---
export async function listReferredCustomers(page = 1) {
  return partnerFetch(`/customers/referred?page=${page}`);
}

// --- Get customer usage ---
export async function getCustomerUsage(customerId: string, month: string) {
  return partnerFetch(`/customers/${customerId}/usage?month=${month}`);
}

// --- Create subscription for customer ---
export async function createCustomerSubscription(customerId: string, plan: string, seats: number) {
  return partnerFetch(`/customers/${customerId}/subscriptions`, {
    method: "POST",
    body: JSON.stringify({ plan, seats }),
  });
}

// --- Get commission report ---
export async function getCommissionReport(month: string) {
  return partnerFetch(`/commissions?month=${month}`);
}

// --- Register deal ---
export async function registerDeal(customerName: string, estimatedValue: number, expectedClose: string) {
  return partnerFetch(`/deals`, {
    method: "POST",
    body: JSON.stringify({ customerName, estimatedValue, expectedClose }),
  });
}

// --- Get deal status ---
export async function getDealStatus(dealId: string) {
  return partnerFetch(`/deals/${dealId}`);
}

// --- Webhook payload types ---
export interface PartnerWebhookPayload {
  event: "customer.subscribed" | "customer.cancelled" | "commission.earned";
  timestamp: string;
  data: Record<string, unknown>;
  signature: string;
}

export function verifyWebhookPayload(payload: PartnerWebhookPayload, secret: string): boolean {
  const crypto = require("crypto");
  const sig = crypto.createHmac("sha256", secret)
    .update(JSON.stringify(payload.data))
    .digest("hex");
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(payload.signature));
}
