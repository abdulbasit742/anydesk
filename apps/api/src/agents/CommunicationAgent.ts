import { BaseAgent, AgentType, MessageType, Priority, AgentMessage } from "./core/BaseAgent.js";
import { prisma } from "../lib/prisma.js";

export class CommunicationAgent extends BaseAgent {
  private notificationChannels: Map<string, any> = new Map();

  constructor(messageBus: any) {
    super(AgentType.COMMUNICATION, messageBus);
    this.initializeChannels();
  }

  /**
   * Initialize notification channels
   */
  private initializeChannels(): void {
    // TODO: Initialize Slack, Teams, Email, PagerDuty, etc.
    console.log("[Communication] Notification channels initialized");
  }

  /**
   * Subscribe to relevant messages
   */
  protected subscribeToMessages(): void {
    this.messageBus.subscribe("broadcast", (msg: AgentMessage) => {
      this.handleMessage(msg);
    });

    this.messageBus.subscribe(AgentType.COMMUNICATION, (msg: AgentMessage) => {
      this.handleMessage(msg);
    });
  }

  /**
   * Handle incoming messages
   */
  protected async handleMessage(message: AgentMessage): Promise<void> {
    try {
      switch (message.type) {
        case MessageType.STATUS_UPDATE:
          await this.sendStatusUpdate(message);
          break;

        case MessageType.ESCALATION:
          await this.sendEscalation(message);
          break;

        case MessageType.ACTION_COMPLETED:
          await this.sendActionSummary(message);
          break;

        case MessageType.ACTION_FAILED:
          await this.sendErrorAlert(message);
          break;

        default:
          break;
      }
    } catch (error) {
      console.error(`[Communication] Error handling message:`, error);
    }
  }

  /**
   * Send status update
   */
  private async sendStatusUpdate(message: AgentMessage): Promise<void> {
    const { incidentId, status, actionResult } = message.context;

    const incident = await prisma.incident.findUnique({
      where: { id: incidentId },
      include: { device: true },
    });

    if (!incident) return;

    const notification = {
      type: "status_update",
      title: `Incident ${status}: ${incident.issueType}`,
      message: `Device: ${incident.device?.name || incident.deviceId}\nStatus: ${status}\nDetails: ${JSON.stringify(actionResult)}`,
      priority: message.priority,
      timestamp: new Date(),
    };

    await this.sendNotification(notification);
  }

  /**
   * Send escalation alert
   */
  private async sendEscalation(message: AgentMessage): Promise<void> {
    const { incidentId, reason } = message.context;

    const incident = await prisma.incident.findUnique({
      where: { id: incidentId },
      include: { device: true },
    });

    if (!incident) return;

    const notification = {
      type: "escalation",
      title: `🚨 ESCALATION: ${incident.issueType}`,
      message: `Device: ${incident.device?.name || incident.deviceId}\nReason: ${reason}\nPlease investigate immediately.`,
      priority: Priority.CRITICAL,
      timestamp: new Date(),
      requiresAction: true,
    };

    await this.sendNotification(notification);
  }

  /**
   * Send action summary
   */
  private async sendActionSummary(message: AgentMessage): Promise<void> {
    const { deviceId, actionResult } = message.context;

    const device = await prisma.device.findUnique({
      where: { id: deviceId },
    });

    if (!device) return;

    const summary = this.formatActionSummary(message.sender, actionResult);

    const notification = {
      type: "action_summary",
      title: `✅ Action Completed: ${message.sender}`,
      message: `Device: ${device.name}\n${summary}`,
      priority: Priority.LOW,
      timestamp: new Date(),
    };

    await this.sendNotification(notification);
  }

  /**
   * Send error alert
   */
  private async sendErrorAlert(message: AgentMessage): Promise<void> {
    const { deviceId, error } = message.context;

    const device = await prisma.device.findUnique({
      where: { id: deviceId },
    });

    if (!device) return;

    const notification = {
      type: "error_alert",
      title: `❌ Error: ${message.sender}`,
      message: `Device: ${device.name}\nError: ${error}\nManual intervention may be required.`,
      priority: Priority.HIGH,
      timestamp: new Date(),
      requiresAction: true,
    };

    await this.sendNotification(notification);
  }

  /**
   * Send notification
   */
  private async sendNotification(notification: any): Promise<void> {
    // Store notification in database
    await prisma.notification.create({
      data: {
        type: notification.type,
        title: notification.title,
        message: notification.message,
        priority: notification.priority,
        requiresAction: notification.requiresAction || false,
      },
    });

    // Send to configured channels
    // TODO: Send to Slack, Teams, Email, PagerDuty, etc.
    console.log(`[Communication] Notification: ${notification.title}`);

    if (notification.priority === Priority.CRITICAL) {
      // Send to PagerDuty for critical alerts
      await this.sendToPagerDuty(notification);
    }

    if (notification.requiresAction) {
      // Send to Slack for action-required alerts
      await this.sendToSlack(notification);
    }
  }

  /**
   * Send to Slack
   */
  private async sendToSlack(notification: any): Promise<void> {
    // TODO: Implement Slack integration
    console.log(`[Communication] Sending to Slack: ${notification.title}`);
  }

  /**
   * Send to PagerDuty
   */
  private async sendToPagerDuty(notification: any): Promise<void> {
    // TODO: Implement PagerDuty integration
    console.log(`[Communication] Sending to PagerDuty: ${notification.title}`);
  }

  /**
   * Format action summary
   */
  private formatActionSummary(agent: AgentType, result: any): string {
    switch (agent) {
      case AgentType.HEALER:
        return `Action: ${result.action}\nResult: ${JSON.stringify(result)}`;
      case AgentType.GUARDIAN:
        return `Security Action: ${result.action}\nStatus: ${result.status}`;
      case AgentType.OPTIMIZER:
        return `Optimization: ${result.action}\nBottleneck: ${result.bottleneck}`;
      case AgentType.UPDATER:
        return `Update: ${result.packageName} to ${result.newVersion}`;
      case AgentType.BACKUP:
        return `Backup: ${result.backupType}\nSize: ${result.backupSize}`;
      default:
        return JSON.stringify(result);
    }
  }

  /**
   * Get notification history
   */
  async getNotificationHistory(limit: number = 100): Promise<any[]> {
    return prisma.notification.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
  }
}
