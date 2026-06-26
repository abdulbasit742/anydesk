/**
 * Telegram Notification Service for RemoteDesk.
 * Adapted from ai-agent-backend-final-1 repo.
 * Sends alerts for: connections, security events, device status, session activity.
 */

export interface TelegramConfig {
  botToken: string;
  chatId: string;
  enabled: boolean;
}

export interface NotificationPayload {
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  category: 'connection' | 'security' | 'device' | 'session' | 'system' | 'billing';
  metadata?: Record<string, unknown>;
}

const SEVERITY_EMOJI: Record<string, string> = {
  info: 'ℹ️',
  warning: '⚠️',
  error: '🔴',
  critical: '🚨',
};

const CATEGORY_EMOJI: Record<string, string> = {
  connection: '🔗',
  security: '🛡️',
  device: '💻',
  session: '📺',
  system: '⚙️',
  billing: '💳',
};

function escapeMarkdown(text: string): string {
  const specialChars = ['_', '*', '[', ']', '(', ')', '~', '`', '>', '#', '+', '-', '=', '|', '{', '}', '.', '!'];
  let escaped = String(text || '');
  for (const char of specialChars) {
    escaped = escaped.replace(new RegExp(`\\${char}`, 'g'), `\\${char}`);
  }
  return escaped;
}

export class TelegramNotifier {
  private config: TelegramConfig;
  private rateLimitMap = new Map<string, number>();
  private readonly RATE_LIMIT_MS = 5000;

  constructor(config: TelegramConfig) {
    this.config = config;
  }

  get isConfigured(): boolean {
    return !!(this.config.botToken && this.config.chatId && this.config.enabled);
  }

  private isRateLimited(key: string): boolean {
    const lastSent = this.rateLimitMap.get(key) || 0;
    if (Date.now() - lastSent < this.RATE_LIMIT_MS) return true;
    this.rateLimitMap.set(key, Date.now());
    return false;
  }

  async send(payload: NotificationPayload): Promise<{ success: boolean; error?: string }> {
    if (!this.isConfigured) return { success: false, error: 'Not configured' };

    const rateKey = `${payload.category}_${payload.title}`;
    if (this.isRateLimited(rateKey)) return { success: false, error: 'Rate limited' };

    const severityEmoji = SEVERITY_EMOJI[payload.severity] || 'ℹ️';
    const categoryEmoji = CATEGORY_EMOJI[payload.category] || '📢';

    const title = escapeMarkdown(payload.title);
    const message = escapeMarkdown(payload.message);
    const timestamp = escapeMarkdown(new Date().toLocaleString());

    const text = `${severityEmoji} *${title}*\n\n${categoryEmoji} ${message}\n\n🕐 ${timestamp}\n\n🤖 *RemoteDesk Alert System*`;

    try {
      const url = `https://api.telegram.org/bot${this.config.botToken}/sendMessage`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: this.config.chatId,
          text,
          parse_mode: 'MarkdownV2',
          disable_web_page_preview: true,
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        return { success: false, error: `Telegram API error: ${response.status} - ${err}` };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: `Network error: ${(error as Error).message}` };
    }
  }

  // Pre-built notification templates
  async notifyNewConnection(viewerName: string, hostName: string, hostId: string): Promise<void> {
    await this.send({
      title: 'New Remote Connection',
      message: `${viewerName} connected to ${hostName} (ID: ${hostId})`,
      severity: 'info',
      category: 'connection',
    });
  }

  async notifyConnectionEnded(viewerName: string, hostName: string, duration: string): Promise<void> {
    await this.send({
      title: 'Connection Ended',
      message: `${viewerName} disconnected from ${hostName}. Duration: ${duration}`,
      severity: 'info',
      category: 'session',
    });
  }

  async notifyUnauthorizedAccess(ip: string, deviceId: string, attempts: number): Promise<void> {
    await this.send({
      title: 'Unauthorized Access Attempt',
      message: `Failed login from IP ${ip} on device ${deviceId}. Attempts: ${attempts}`,
      severity: 'critical',
      category: 'security',
    });
  }

  async notifyDeviceOffline(deviceName: string, lastSeen: string): Promise<void> {
    await this.send({
      title: 'Device Went Offline',
      message: `${deviceName} is unreachable. Last seen: ${lastSeen}`,
      severity: 'warning',
      category: 'device',
    });
  }

  async notifyDeviceOnline(deviceName: string): Promise<void> {
    await this.send({
      title: 'Device Back Online',
      message: `${deviceName} is now reachable again`,
      severity: 'info',
      category: 'device',
    });
  }

  async notifyHighCPU(deviceName: string, cpuPercent: number): Promise<void> {
    await this.send({
      title: 'High CPU Usage Alert',
      message: `${deviceName} CPU at ${cpuPercent}%`,
      severity: cpuPercent > 95 ? 'critical' : 'warning',
      category: 'device',
    });
  }

  async notifyDiskFull(deviceName: string, diskPercent: number): Promise<void> {
    await this.send({
      title: 'Disk Space Critical',
      message: `${deviceName} disk usage at ${diskPercent}%`,
      severity: 'error',
      category: 'device',
    });
  }

  async notifyFileTransfer(from: string, to: string, fileName: string, size: string): Promise<void> {
    await this.send({
      title: 'File Transfer Complete',
      message: `${fileName} (${size}) transferred from ${from} to ${to}`,
      severity: 'info',
      category: 'session',
    });
  }

  async notifySubscriptionExpiring(daysLeft: number, plan: string): Promise<void> {
    await this.send({
      title: 'Subscription Expiring Soon',
      message: `Your ${plan} plan expires in ${daysLeft} days. Renew to avoid service interruption.`,
      severity: daysLeft <= 3 ? 'error' : 'warning',
      category: 'billing',
    });
  }

  async notifySecurityEvent(event: string, details: string): Promise<void> {
    await this.send({
      title: 'Security Event Detected',
      message: `${event}: ${details}`,
      severity: 'error',
      category: 'security',
    });
  }

  async test(): Promise<{ success: boolean; error?: string }> {
    return this.send({
      title: 'Test Notification',
      message: 'RemoteDesk Telegram integration is working correctly!',
      severity: 'info',
      category: 'system',
    });
  }
}

export function createTelegramNotifier(): TelegramNotifier {
  return new TelegramNotifier({
    botToken: process.env.TELEGRAM_BOT_TOKEN || '',
    chatId: process.env.TELEGRAM_CHAT_ID || '',
    enabled: process.env.TELEGRAM_ENABLED === 'true',
  });
}

export default TelegramNotifier;
