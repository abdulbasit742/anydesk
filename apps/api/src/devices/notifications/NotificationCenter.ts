import { EventEmitter } from "events";
import { prisma } from "../../lib/prisma.js";

export enum NotificationPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

export interface UnifiedNotification {
  id: string;
  userId: string;
  deviceId: string;
  deviceType: string;
  deviceName: string;
  title: string;
  message: string;
  priority: NotificationPriority;
  category?: string;
  actionable?: boolean;
  actions?: Array<{ id: string; label: string }>;
  read: boolean;
  timestamp: Date;
}

export class NotificationCenter extends EventEmitter {
  private notifications: Map<string, UnifiedNotification> = new Map();
  private subscriptions: Map<string, Set<Function>> = new Map();

  /**
   * Publish a notification
   */
  async publishNotification(notification: Omit<UnifiedNotification, "id" | "timestamp">): Promise<UnifiedNotification> {
    const fullNotification: UnifiedNotification = {
      ...notification,
      id: `notif_${Date.now()}`,
      timestamp: new Date(),
    };

    // Store in memory
    this.notifications.set(fullNotification.id, fullNotification);

    // Store in database
    await prisma.unifiedNotification.create({
      data: {
        userId: notification.userId,
        deviceId: notification.deviceId,
        deviceType: notification.deviceType,
        deviceName: notification.deviceName,
        title: notification.title,
        message: notification.message,
        priority: notification.priority,
        category: notification.category,
        actionable: notification.actionable || false,
        read: false,
      },
    });

    // Emit event
    this.emit("notification", fullNotification);

    // Notify subscribers
    this.notifySubscribers(notification.userId, fullNotification);

    return fullNotification;
  }

  /**
   * Get notifications for user
   */
  async getNotifications(
    userId: string,
    filter?: {
      deviceId?: string;
      priority?: NotificationPriority;
      category?: string;
      unreadOnly?: boolean;
      limit?: number;
    }
  ): Promise<UnifiedNotification[]> {
    const where: any = { userId };

    if (filter?.deviceId) {
      where.deviceId = filter.deviceId;
    }

    if (filter?.priority) {
      where.priority = filter.priority;
    }

    if (filter?.category) {
      where.category = filter.category;
    }

    if (filter?.unreadOnly) {
      where.read = false;
    }

    const notifications = await prisma.unifiedNotification.findMany({
      where,
      orderBy: { timestamp: "desc" },
      take: filter?.limit || 100,
    });

    return notifications as any as UnifiedNotification[];
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    const notification = this.notifications.get(notificationId);

    if (notification) {
      notification.read = true;
    }

    await prisma.unifiedNotification.update({
      where: { id: notificationId },
      data: { read: true },
    });
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string): Promise<void> {
    await prisma.unifiedNotification.updateMany({
      where: { userId },
      data: { read: true },
    });
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    this.notifications.delete(notificationId);

    await prisma.unifiedNotification.delete({
      where: { id: notificationId },
    });
  }

  /**
   * Subscribe to notifications
   */
  subscribe(userId: string, callback: (notification: UnifiedNotification) => void): void {
    if (!this.subscriptions.has(userId)) {
      this.subscriptions.set(userId, new Set());
    }

    this.subscriptions.get(userId)!.add(callback);
  }

  /**
   * Unsubscribe from notifications
   */
  unsubscribe(userId: string, callback: Function): void {
    const callbacks = this.subscriptions.get(userId);

    if (callbacks) {
      callbacks.delete(callback);
    }
  }

  /**
   * Notify subscribers
   */
  private notifySubscribers(userId: string, notification: UnifiedNotification): void {
    const callbacks = this.subscriptions.get(userId);

    if (callbacks) {
      for (const callback of callbacks) {
        try {
          callback(notification);
        } catch (error) {
          console.error("[NotificationCenter] Error notifying subscriber:", error);
        }
      }
    }
  }

  /**
   * Get notification statistics
   */
  async getStatistics(userId: string): Promise<any> {
    const notifications = await prisma.unifiedNotification.findMany({
      where: { userId },
    });

    const stats = {
      total: notifications.length,
      unread: notifications.filter((n) => !n.read).length,
      byPriority: {} as Record<NotificationPriority, number>,
      byCategory: {} as Record<string, number>,
      byDevice: {} as Record<string, number>,
    };

    for (const notification of notifications) {
      stats.byPriority[notification.priority as NotificationPriority] =
        (stats.byPriority[notification.priority as NotificationPriority] || 0) + 1;

      if (notification.category) {
        stats.byCategory[notification.category] = (stats.byCategory[notification.category] || 0) + 1;
      }

      stats.byDevice[notification.deviceName || "unknown"] = (stats.byDevice[notification.deviceName || "unknown"] || 0) + 1;
    }

    return stats;
  }
}

