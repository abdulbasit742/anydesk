/**
 * Privacy Mode Service
 * When enabled on the host side, the physical screen is blanked (black)
 * so that local observers cannot see what the remote user is doing.
 * 
 * Implementation: Uses Electron's powerSaveBlocker + display manipulation.
 * On the data channel, a message is sent to notify both sides.
 */

export interface PrivacyModeMessage {
  kind: "privacy.enable" | "privacy.disable";
  requestedBy: "host" | "viewer";
  timestamp: number;
}

export function isPrivacyModeMessage(value: unknown): value is PrivacyModeMessage {
  if (typeof value !== "object" || value === null || !("kind" in value)) return false;
  const kind = String((value as { kind: unknown }).kind);
  return kind === "privacy.enable" || kind === "privacy.disable";
}

export interface PrivacyModeState {
  enabled: boolean;
  requestedBy: "host" | "viewer" | null;
  enabledAt: number | null;
}

export class PrivacyModeController {
  private state: PrivacyModeState = {
    enabled: false,
    requestedBy: null,
    enabledAt: null,
  };
  private onStateChange?: (state: PrivacyModeState) => void;
  private sendMessage?: (message: PrivacyModeMessage) => void;

  constructor(options?: {
    onStateChange?: (state: PrivacyModeState) => void;
    sendMessage?: (message: PrivacyModeMessage) => void;
  }) {
    this.onStateChange = options?.onStateChange;
    this.sendMessage = options?.sendMessage;
  }

  getState(): PrivacyModeState {
    return { ...this.state };
  }

  enable(requestedBy: "host" | "viewer"): void {
    if (this.state.enabled) return;
    this.state = { enabled: true, requestedBy, enabledAt: Date.now() };
    this.onStateChange?.(this.state);
    this.sendMessage?.({
      kind: "privacy.enable",
      requestedBy,
      timestamp: Date.now(),
    });
    // On host: blank the screen overlay
    this.applyScreenBlank(true);
  }

  disable(requestedBy: "host" | "viewer"): void {
    if (!this.state.enabled) return;
    this.state = { enabled: false, requestedBy: null, enabledAt: null };
    this.onStateChange?.(this.state);
    this.sendMessage?.({
      kind: "privacy.disable",
      requestedBy,
      timestamp: Date.now(),
    });
    this.applyScreenBlank(false);
  }

  handleRemoteMessage(message: PrivacyModeMessage): void {
    if (message.kind === "privacy.enable") {
      this.state = { enabled: true, requestedBy: message.requestedBy, enabledAt: message.timestamp };
      this.onStateChange?.(this.state);
      this.applyScreenBlank(true);
    } else if (message.kind === "privacy.disable") {
      this.state = { enabled: false, requestedBy: null, enabledAt: null };
      this.onStateChange?.(this.state);
      this.applyScreenBlank(false);
    }
  }

  dispose(): void {
    if (this.state.enabled) {
      this.applyScreenBlank(false);
    }
  }

  private applyScreenBlank(blank: boolean): void {
    // Create or remove a full-screen black overlay on the host machine
    const overlayId = "remotedesk-privacy-overlay";
    const existing = document.getElementById(overlayId);

    if (blank && !existing) {
      const overlay = document.createElement("div");
      overlay.id = overlayId;
      overlay.style.cssText = `
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: #000;
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #333;
        font-size: 14px;
        font-family: system-ui;
      `;
      overlay.textContent = "Privacy Mode Active — Screen is hidden from local view";
      document.body.appendChild(overlay);
    } else if (!blank && existing) {
      existing.remove();
    }
  }
}
