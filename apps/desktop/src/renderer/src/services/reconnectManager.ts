import { calculateBackoffDelayMs } from '@remotedesk/shared/retry/index.js';

export type ReconnectStatus = 'idle' | 'scheduled' | 'restarting-ice' | 'reconnected' | 'failed';

export interface ReconnectState {
  status: ReconnectStatus;
  attempts: number;
  nextAttemptAt?: number;
  lastError?: string;
}

export interface ReconnectManagerOptions {
  peer: RTCPeerConnection;
  sendIceRestartOffer: (offer: RTCSessionDescriptionInit) => Promise<void>;
  maxAttempts?: number;
  onState?: (state: ReconnectState) => void;
}

export class ReconnectManager {
  private readonly options: ReconnectManagerOptions;
  private state: ReconnectState = { status: 'idle', attempts: 0 };
  private timer?: number;

  constructor(options: ReconnectManagerOptions) {
    this.options = { ...options, maxAttempts: options.maxAttempts ?? 5 };
  }

  snapshot(): ReconnectState {
    return { ...this.state };
  }

  schedule(reason = 'connection degraded'): void {
    if (this.state.status === 'scheduled' || this.state.status === 'restarting-ice') return;
    if (this.state.attempts >= (this.options.maxAttempts ?? 5)) {
      this.setState({ status: 'failed', attempts: this.state.attempts, lastError: reason });
      return;
    }
    const delay = calculateBackoffDelayMs(this.state.attempts + 1, { baseDelayMs: 1000, maxDelayMs: 15000, multiplier: 2, jitterRatio: 0.2 });
    this.setState({ status: 'scheduled', attempts: this.state.attempts, nextAttemptAt: Date.now() + delay, lastError: reason });
    this.timer = window.setTimeout(() => void this.restartIce(), delay);
  }

  async restartIce(): Promise<void> {
    this.setState({ status: 'restarting-ice', attempts: this.state.attempts + 1, lastError: this.state.lastError });
    try {
      const offer = await this.options.peer.createOffer({ iceRestart: true });
      await this.options.peer.setLocalDescription(offer);
      await this.options.sendIceRestartOffer(offer);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'ICE restart failed';
      this.setState({ status: 'idle', attempts: this.state.attempts, lastError: message });
      this.schedule(message);
    }
  }

  markReconnected(): void {
    if (this.timer !== undefined) window.clearTimeout(this.timer);
    this.setState({ status: 'reconnected', attempts: this.state.attempts });
  }

  reset(): void {
    if (this.timer !== undefined) window.clearTimeout(this.timer);
    this.setState({ status: 'idle', attempts: 0 });
  }

  private setState(next: ReconnectState): void {
    this.state = next;
    this.options.onState?.(this.snapshot());
  }
}
