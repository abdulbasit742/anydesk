/**
 * Auto-Disconnect & Lock Desktop Service
 * 
 * - Auto-disconnect: Ends session after configurable idle timeout
 * - Lock desktop: Locks the remote machine after session ends
 */

export interface AutoDisconnectOptions {
  /** Idle timeout in milliseconds (default: 30 minutes) */
  idleTimeoutMs?: number;
  /** Whether to lock the remote desktop after disconnect */
  lockOnDisconnect?: boolean;
  /** Callback when auto-disconnect triggers */
  onAutoDisconnect?: (reason: string) => void;
  /** Callback when lock is requested */
  onLockDesktop?: () => void;
}

export class AutoDisconnectController {
  private idleTimeoutMs: number;
  private lockOnDisconnect: boolean;
  private idleTimer: ReturnType<typeof setTimeout> | null = null;
  private lastActivityAt: number = Date.now();
  private onAutoDisconnect?: (reason: string) => void;
  private onLockDesktop?: () => void;
  private disposed = false;

  constructor(options: AutoDisconnectOptions = {}) {
    this.idleTimeoutMs = options.idleTimeoutMs ?? 30 * 60 * 1000; // 30 min
    this.lockOnDisconnect = options.lockOnDisconnect ?? false;
    this.onAutoDisconnect = options.onAutoDisconnect;
    this.onLockDesktop = options.onLockDesktop;
    this.resetIdleTimer();
  }

  /** Call this on any user activity (mouse move, key press, etc.) */
  recordActivity(): void {
    this.lastActivityAt = Date.now();
    this.resetIdleTimer();
  }

  /** Update the idle timeout duration */
  setIdleTimeout(ms: number): void {
    this.idleTimeoutMs = ms;
    this.resetIdleTimer();
  }

  /** Update lock-on-disconnect setting */
  setLockOnDisconnect(enabled: boolean): void {
    this.lockOnDisconnect = enabled;
  }

  /** Get time remaining before auto-disconnect (ms) */
  getTimeRemainingMs(): number {
    const elapsed = Date.now() - this.lastActivityAt;
    return Math.max(0, this.idleTimeoutMs - elapsed);
  }

  /** Check if session is idle */
  isIdle(): boolean {
    return Date.now() - this.lastActivityAt >= this.idleTimeoutMs;
  }

  /** Trigger lock desktop (can be called manually or on disconnect) */
  lockDesktop(): void {
    this.onLockDesktop?.();
    // Send IPC to main process to lock the OS
    if (window.electronAPI?.lockScreen) {
      window.electronAPI.lockScreen();
    }
  }

  /** Called when session ends (manually or auto) */
  onSessionEnd(): void {
    if (this.lockOnDisconnect) {
      this.lockDesktop();
    }
    this.dispose();
  }

  dispose(): void {
    this.disposed = true;
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }
  }

  private resetIdleTimer(): void {
    if (this.disposed) return;
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
    }
    this.idleTimer = setTimeout(() => {
      if (this.disposed) return;
      this.onAutoDisconnect?.(`Idle timeout (${Math.round(this.idleTimeoutMs / 60000)} minutes)`);
    }, this.idleTimeoutMs);
  }
}

/**
 * Lock screen IPC handler registration (main process side)
 * Call this in the main process to handle lock requests.
 */
export function createLockScreenCommand(): string {
  // Platform-specific lock commands
  const platform = process.platform ?? "linux";
  switch (platform) {
    case "win32":
      return "rundll32.exe user32.dll,LockWorkStation";
    case "darwin":
      return "pmset displaysleepnow";
    case "linux":
      return "loginctl lock-session";
    default:
      return "";
  }
}
