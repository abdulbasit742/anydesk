import crypto from "crypto";
import { prisma } from "../../lib/prisma.js";
export const webhookService = {
  async registerWebhook(userId: string, data: { url: string; events: string[]; secret?: string }) {
    const secret = data.secret || crypto.randomBytes(32).toString("hex");
    return prisma.webhook.create({ data: { userId, url: data.url, events: data.events, secret, status: "active" } });
  },
  async triggerWebhook(event: string, payload: Record<string, any>) {
    const webhooks = await prisma.webhook.findMany({ where: { events: { has: event }, status: "active" } });
    for (const webhook of webhooks) {
      const signature = crypto.createHmac("sha256", webhook.secret).update(JSON.stringify(payload)).digest("hex");
      try {
        await fetch(webhook.url, { method: "POST", headers: { "Content-Type": "application/json", "X-Webhook-Signature": signature, "X-Webhook-Event": event }, body: JSON.stringify(payload) });
        await prisma.webhookDelivery.create({ data: { webhookId: webhook.id, event, payload, status: "delivered" } });
      } catch (error) {
        await prisma.webhookDelivery.create({ data: { webhookId: webhook.id, event, payload, status: "failed", error: String(error) } });
      }
    }
  },
  async getWebhooks(userId: string) { return prisma.webhook.findMany({ where: { userId } }); },
  async deleteWebhook(webhookId: string) { return prisma.webhook.delete({ where: { id: webhookId } }); },
  async getDeliveryHistory(webhookId: string) { return prisma.webhookDelivery.findMany({ where: { webhookId }, orderBy: { createdAt: "desc" }, take: 50 }); },
};
