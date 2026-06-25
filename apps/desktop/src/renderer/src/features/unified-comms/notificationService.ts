/**
 * Desktop Notification Service for Unified Communications
 * Handles system tray notifications for tickets, chats, calls, and meetings
 */

export type NotificationType = 'ticket' | 'chat' | 'call' | 'meeting' | 'escalation' | 'mention' | 'system';
export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface UCNotification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  body: string;
  icon?: string;
  actions?: { label: string; action: string }[];
  data?: Record<string, unknown>;
  timestamp: number;
  read: boolean;
  dismissed: boolean;
}

class DesktopNotificationService {
  private notifications: UCNotification[] = [];
  private listeners: Set<(notifications: UCNotification[]) => void> = new Set();
  private soundEnabled = true;
  private desktopNotificationsEnabled = true;

  constructor() {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }

  subscribe(listener: (notifications: UCNotification[]) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l([...this.notifications]));
  }

  push(notification: Omit<UCNotification, 'id' | 'timestamp' | 'read' | 'dismissed'>) {
    const n: UCNotification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      read: false,
      dismissed: false,
    };
    this.notifications.unshift(n);

    // Show desktop notification
    if (this.desktopNotificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
      const desktopNotif = new Notification(n.title, {
        body: n.body,
        icon: n.icon || '/favicon.ico',
        tag: n.id,
        silent: !this.soundEnabled,
      });

      if (n.actions?.length) {
        desktopNotif.onclick = () => {
          this.handleAction(n.id, n.actions![0].action);
        };
      }
    }

    // Play sound for high priority
    if (this.soundEnabled && (n.priority === 'high' || n.priority === 'urgent')) {
      this.playNotificationSound(n.type);
    }

    this.notify();
    return n;
  }

  markRead(id: string) {
    const n = this.notifications.find((n) => n.id === id);
    if (n) {
      n.read = true;
      this.notify();
    }
  }

  markAllRead() {
    this.notifications.forEach((n) => (n.read = true));
    this.notify();
  }

  dismiss(id: string) {
    const n = this.notifications.find((n) => n.id === id);
    if (n) {
      n.dismissed = true;
      this.notify();
    }
  }

  getUnreadCount(): number {
    return this.notifications.filter((n) => !n.read && !n.dismissed).length;
  }

  getNotifications(type?: NotificationType): UCNotification[] {
    if (type) return this.notifications.filter((n) => n.type === type && !n.dismissed);
    return this.notifications.filter((n) => !n.dismissed);
  }

  handleAction(notificationId: string, action: string) {
    this.markRead(notificationId);
    // Dispatch action event
    window.dispatchEvent(new CustomEvent('uc-notification-action', {
      detail: { notificationId, action },
    }));
  }

  setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  setDesktopNotificationsEnabled(enabled: boolean) {
    this.desktopNotificationsEnabled = enabled;
  }

  private playNotificationSound(type: NotificationType) {
    // In a real implementation, this would play different sounds per type
    try {
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = type === 'call' ? 440 : type === 'escalation' ? 880 : 660;
      gainNode.gain.value = 0.1;
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch {
      // Audio not available
    }
  }
}

export const notificationService = new DesktopNotificationService();

// Example notifications for demo
export function pushDemoNotifications() {
  notificationService.push({
    type: 'ticket',
    priority: 'high',
    title: 'New High Priority Ticket',
    body: 'Customer "John Smith" reported: Cannot connect to remote desktop',
    actions: [{ label: 'View Ticket', action: 'open_ticket:t1' }],
  });

  notificationService.push({
    type: 'chat',
    priority: 'normal',
    title: 'New Chat Message',
    body: 'Jane Doe: Hi, I need help with my subscription',
    actions: [{ label: 'Reply', action: 'open_chat:conv-1' }],
  });

  notificationService.push({
    type: 'call',
    priority: 'urgent',
    title: 'Incoming Call',
    body: 'VIP Customer: Bob Wilson (+1-555-0103)',
    actions: [{ label: 'Answer', action: 'answer_call:call-1' }, { label: 'Decline', action: 'decline_call:call-1' }],
  });

  notificationService.push({
    type: 'mention',
    priority: 'normal',
    title: 'Mentioned in #support-team',
    body: '@you Can you take a look at ticket #1003?',
    actions: [{ label: 'View', action: 'open_channel:ch-support' }],
  });
}
