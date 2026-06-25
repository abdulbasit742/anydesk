/**
 * Remote Control IPC Handlers
 * Handles system-level commands: restart, lock screen, log off
 * These are executed on the HOST machine when requested by an authorized viewer.
 */

import { ipcMain, BrowserWindow } from "electron";
import { exec } from "child_process";
import { platform } from "os";

export function registerRemoteControlIpc(): void {
  /**
   * Lock the workstation
   */
  ipcMain.handle("remote-control:lock-screen", async () => {
    const os = platform();
    let command: string;
    switch (os) {
      case "win32":
        command = "rundll32.exe user32.dll,LockWorkStation";
        break;
      case "darwin":
        command = '/System/Library/CoreServices/Menu\\ Extras/User.menu/Contents/Resources/CGSession -suspend';
        break;
      case "linux":
        command = "loginctl lock-session";
        break;
      default:
        return { success: false, error: `Unsupported platform: ${os}` };
    }

    return new Promise((resolve) => {
      exec(command, (error) => {
        if (error) {
          resolve({ success: false, error: error.message });
        } else {
          resolve({ success: true });
        }
      });
    });
  });

  /**
   * Restart the machine
   * Requires elevated privileges on some platforms
   */
  ipcMain.handle("remote-control:restart", async (_event, { delaySeconds = 5 } = {}) => {
    const os = platform();
    let command: string;
    switch (os) {
      case "win32":
        command = `shutdown /r /t ${delaySeconds}`;
        break;
      case "darwin":
        command = `sudo shutdown -r +${Math.ceil(delaySeconds / 60)}`;
        break;
      case "linux":
        command = `sudo shutdown -r +${Math.ceil(delaySeconds / 60)}`;
        break;
      default:
        return { success: false, error: `Unsupported platform: ${os}` };
    }

    return new Promise((resolve) => {
      exec(command, (error) => {
        if (error) {
          resolve({ success: false, error: error.message });
        } else {
          resolve({ success: true, message: `Restarting in ${delaySeconds} seconds` });
        }
      });
    });
  });

  /**
   * Log off the current user
   */
  ipcMain.handle("remote-control:logoff", async () => {
    const os = platform();
    let command: string;
    switch (os) {
      case "win32":
        command = "shutdown /l";
        break;
      case "darwin":
        command = "osascript -e 'tell application \"System Events\" to log out'";
        break;
      case "linux":
        command = "loginctl terminate-session self";
        break;
      default:
        return { success: false, error: `Unsupported platform: ${os}` };
    }

    return new Promise((resolve) => {
      exec(command, (error) => {
        if (error) {
          resolve({ success: false, error: error.message });
        } else {
          resolve({ success: true });
        }
      });
    });
  });

  /**
   * Cancel a pending restart
   */
  ipcMain.handle("remote-control:cancel-restart", async () => {
    const os = platform();
    let command: string;
    switch (os) {
      case "win32":
        command = "shutdown /a";
        break;
      case "darwin":
        command = "sudo killall shutdown";
        break;
      case "linux":
        command = "sudo shutdown -c";
        break;
      default:
        return { success: false, error: `Unsupported platform: ${os}` };
    }

    return new Promise((resolve) => {
      exec(command, (error) => {
        if (error) {
          resolve({ success: false, error: error.message });
        } else {
          resolve({ success: true });
        }
      });
    });
  });

  /**
   * Open a URL on the host machine
   */
  ipcMain.handle("remote-control:open-url", async (_event, { url }: { url: string }) => {
    const { shell } = await import("electron");
    try {
      await shell.openExternal(url);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });
}
