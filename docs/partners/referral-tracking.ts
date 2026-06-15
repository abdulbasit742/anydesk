/**
 * RemoteDesk Referral Tracking Module
 * Tracks referral clicks, signups, and conversions
 */

export interface ReferralEvent {
  id: string;
  partnerId: string;
  referralCode: string;
  eventType: "click" | "signup" | "subscribe" | "cancel";
  customerId?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface ReferralMetrics {
  partnerId: string;
  period: string;
  clicks: number;
  signups: number;
  conversions: number;
  conversionRate: number;
  commissionEarned: number;
}

// In-memory store; replace with persistent storage in production
const events: ReferralEvent[] = [];

export async function trackReferralEvent(event: Omit<ReferralEvent, "id" | "createdAt">): Promise<ReferralEvent> {
  const entry: ReferralEvent = {
    ...event,
    id: generateEventId(),
    createdAt: new Date(),
  };
  events.push(entry);
  return entry;
}

export async function getReferralMetrics(partnerId: string, period: string): Promise<ReferralMetrics> {
  const partnerEvents = events.filter(e => e.partnerId === partnerId && e.createdAt.toISOString().startsWith(period));
  const clicks = partnerEvents.filter(e => e.eventType === "click").length;
  const signups = partnerEvents.filter(e => e.eventType === "signup").length;
  const conversions = partnerEvents.filter(e => e.eventType === "subscribe").length;
  const conversionRate = clicks > 0 ? conversions / clicks : 0;
  return {
    partnerId,
    period,
    clicks,
    signups,
    conversions,
    conversionRate,
    commissionEarned: conversions * 50, // $50 per conversion
  };
}

export async function getReferralLink(partnerId: string): Promise<string> {
  const code = await generateReferralCode(partnerId);
  return `https://remotedesk.io/signup?ref=${code}`;
}

async function generateReferralCode(partnerId: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(partnerId + Date.now()));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("").slice(0, 12);
}

function generateEventId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
