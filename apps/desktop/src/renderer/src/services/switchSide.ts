/**
 * Switch Side Service
 * Allows host and viewer to swap roles during an active session.
 * The viewer becomes the host (shares their screen) and vice versa.
 * 
 * Protocol:
 * 1. One side sends a "switch.request" via data channel
 * 2. Other side responds with "switch.accept" or "switch.reject"
 * 3. On accept, both sides renegotiate WebRTC (new offer/answer with swapped streams)
 */

export interface SwitchSideRequest {
  kind: "switch.request";
  requestedBy: string; // userId
  timestamp: number;
}

export interface SwitchSideAccept {
  kind: "switch.accept";
  acceptedBy: string;
  timestamp: number;
}

export interface SwitchSideReject {
  kind: "switch.reject";
  rejectedBy: string;
  reason?: string;
  timestamp: number;
}

export type SwitchSideMessage = SwitchSideRequest | SwitchSideAccept | SwitchSideReject;

export function isSwitchSideMessage(value: unknown): value is SwitchSideMessage {
  if (typeof value !== "object" || value === null || !("kind" in value)) return false;
  const kind = String((value as { kind: unknown }).kind);
  return kind.startsWith("switch.");
}

export type SwitchSideState = "idle" | "requesting" | "pending_approval" | "switching";

export interface SwitchSideController {
  state: SwitchSideState;
  currentRole: "host" | "viewer";
}

export class SwitchSideManager {
  private state: SwitchSideState = "idle";
  private currentRole: "host" | "viewer";
  private userId: string;
  private sendMessage: (msg: SwitchSideMessage) => void;
  private onRoleSwap?: (newRole: "host" | "viewer") => void;
  private onStateChange?: (state: SwitchSideState) => void;
  private onRequestReceived?: (request: SwitchSideRequest) => void;

  constructor(options: {
    initialRole: "host" | "viewer";
    userId: string;
    sendMessage: (msg: SwitchSideMessage) => void;
    onRoleSwap?: (newRole: "host" | "viewer") => void;
    onStateChange?: (state: SwitchSideState) => void;
    onRequestReceived?: (request: SwitchSideRequest) => void;
  }) {
    this.currentRole = options.initialRole;
    this.userId = options.userId;
    this.sendMessage = options.sendMessage;
    this.onRoleSwap = options.onRoleSwap;
    this.onStateChange = options.onStateChange;
    this.onRequestReceived = options.onRequestReceived;
  }

  getState(): SwitchSideController {
    return { state: this.state, currentRole: this.currentRole };
  }

  /** Request to switch sides */
  requestSwitch(): void {
    if (this.state !== "idle") return;
    this.setState("requesting");
    this.sendMessage({
      kind: "switch.request",
      requestedBy: this.userId,
      timestamp: Date.now(),
    });
  }

  /** Accept a switch request from the other side */
  acceptSwitch(): void {
    if (this.state !== "pending_approval") return;
    this.setState("switching");
    this.sendMessage({
      kind: "switch.accept",
      acceptedBy: this.userId,
      timestamp: Date.now(),
    });
    this.performSwitch();
  }

  /** Reject a switch request from the other side */
  rejectSwitch(reason?: string): void {
    if (this.state !== "pending_approval") return;
    this.setState("idle");
    this.sendMessage({
      kind: "switch.reject",
      rejectedBy: this.userId,
      reason,
      timestamp: Date.now(),
    });
  }

  /** Handle incoming switch messages from data channel */
  handleMessage(msg: SwitchSideMessage): void {
    switch (msg.kind) {
      case "switch.request":
        this.setState("pending_approval");
        this.onRequestReceived?.(msg);
        break;
      case "switch.accept":
        this.setState("switching");
        this.performSwitch();
        break;
      case "switch.reject":
        this.setState("idle");
        break;
    }
  }

  private performSwitch(): void {
    const newRole = this.currentRole === "host" ? "viewer" : "host";
    this.currentRole = newRole;
    this.onRoleSwap?.(newRole);
    // After role swap, state returns to idle
    setTimeout(() => this.setState("idle"), 500);
  }

  private setState(state: SwitchSideState): void {
    this.state = state;
    this.onStateChange?.(state);
  }
}
