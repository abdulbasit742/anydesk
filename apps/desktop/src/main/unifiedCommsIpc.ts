/**
 * IPC handlers for Unified Communications in the desktop main process.
 * Handles system tray notifications, badge counts, and quick-connect deep links.
 */

import { ipcMain, Notification, BrowserWindow, app } from 'electron';

export interface UCNotificationPayload {
  title: string;
  body: string;
  urgency?: 'low' | 'normal' | 'critical';
  actions?: { type: string; text: string }[];
}

export function registerUnifiedCommsIpc(mainWindow: BrowserWindow) {
  // Show native OS notification
  ipcMain.handle('uc:show-notification', async (_event, payload: UCNotificationPayload) => {
    if (!Notification.isSupported()) return { success: false, reason: 'not-supported' };

    const notification = new Notification({
      title: payload.title,
      body: payload.body,
      urgency: payload.urgency || 'normal',
      silent: payload.urgency === 'low',
    });

    notification.on('click', () => {
      mainWindow.show();
      mainWindow.focus();
      mainWindow.webContents.send('uc:notification-clicked', payload);
    });

    notification.show();
    return { success: true };
  });

  // Update dock/taskbar badge count
  ipcMain.handle('uc:set-badge-count', async (_event, count: number) => {
    if (process.platform === 'darwin') {
      app.dock?.setBadge(count > 0 ? String(count) : '');
    }
    // On Windows, flash the taskbar
    if (process.platform === 'win32' && count > 0) {
      mainWindow.flashFrame(true);
    }
    return { success: true };
  });

  // Set agent status (updates tray icon)
  ipcMain.handle('uc:set-agent-status', async (_event, status: string) => {
    // In production, this would update the tray icon color
    mainWindow.webContents.send('uc:agent-status-changed', status);
    return { success: true };
  });

  // Quick connect - initiate remote support from ticket
  ipcMain.handle('uc:quick-connect', async (_event, data: { ticketId?: string; customerId?: string; sessionCode?: string }) => {
    mainWindow.webContents.send('uc:start-remote-session', data);
    return { success: true };
  });

  // Handle incoming call
  ipcMain.handle('uc:incoming-call', async (_event, data: { callerId: string; callerName: string; channel: string }) => {
    // Show always-on-top call notification
    mainWindow.webContents.send('uc:incoming-call', data);
    if (!mainWindow.isFocused()) {
      mainWindow.flashFrame(true);
    }
    return { success: true };
  });
}
