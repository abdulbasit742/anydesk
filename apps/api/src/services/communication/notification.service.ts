import { prisma } from "../../lib/prisma.js";
export type NotificationChannel = "in_app" | "email" | "push" | "sms" | "slack" | "webhook";
export const notificationService = {
  async send(userId: string, notification: { title: string; body: string; type: string; channels: NotificationChannel[]; data?: Record<string, any> }) {
    const record = await prisma.notification.create({ data: { userId, title: notification.title, body: notification.body, type: notification.type, channels: notification.channels, data: notification.data || {}, status: "sent" } });
    // Dispatch to each channel
    for (const channel of notification.channels) {
      switch (channel) {
        case "push": await this.sendPush(userId, notification.title, notification.body); break;
        case "email": /* handled by email service */ break;
        case "slack": await this.sendSlack(userId, notification.title, notification.body); break;
      }
    }
    return record;
  },
  async sendPush(userId: string, title: string, body: string) { console.log(`[Push] ${userId}: ${title}`); },
  async sendSlack(userId: string, title: string, body: string) { console.log(`[Slack] ${userId}: ${title}`); },
  async getNotifications(userId: string, unreadOnly: boolean = false) {
    const where: any = { userId };
    if (unreadOnly) where.readAt = null;
    return prisma.notification.findMany({ where, orderBy: { createdAt: "desc" }, take: 50 });
  },
  async markAsRead(notificationId: string) { return prisma.notification.update({ where: { id: notificationId }, data: { readAt: new Date() } }); },
  async markAllAsRead(userId: string) { return prisma.notification.updateMany({ where: { userId, readAt: null }, data: { readAt: new Date() } }); },
  async getUnreadCount(userId: string): Promise<number> { return prisma.notification.count({ where: { userId, readAt: null } }); },
};
