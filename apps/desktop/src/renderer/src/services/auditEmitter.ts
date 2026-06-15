import type { DesktopSessionContext, RemoteDeskSocketLike } from '../types/desktopPart2.js';
import { AuditQueue } from './auditQueue.js';
import { buildDesktopAuditEvent, type DesktopAuditBuilderInput, type DesktopAuditEvent } from '../types/audit.js';

export interface DesktopAuditEmitterOptions {
  socket?: RemoteDeskSocketLike;
  context?: DesktopSessionContext;
  eventName?: string;
  maxBufferedEvents?: number;
  onEvent?: (event: DesktopAuditEvent) => void;
}

export class DesktopAuditEmitter {
  private context?: DesktopSessionContext;
  private readonly socket?: RemoteDeskSocketLike;
  private readonly eventName: string;
  private readonly onEvent?: (event: DesktopAuditEvent) => void;
  private readonly queue: AuditQueue;

  constructor(options: DesktopAuditEmitterOptions = {}) {
    this.socket = options.socket;
    this.context = options.context;
    this.eventName = options.eventName ?? 'desktop:audit:event';
    this.onEvent = options.onEvent;
    this.queue = new AuditQueue({
      maxBufferedEvents: options.maxBufferedEvents,
      transport: { emitAudit: (event) => this.send(event) },
    });
  }

  setContext(context?: DesktopSessionContext): void {
    this.context = context;
  }

  queuedCount(): number {
    return this.queue.size();
  }

  async emit(input: Omit<DesktopAuditBuilderInput, 'context'> & { context?: DesktopSessionContext }): Promise<void> {
    const event = buildDesktopAuditEvent({ ...input, context: input.context ?? this.context });
    this.onEvent?.(event);
    await this.queue.enqueue(event);
  }

  async flush(): Promise<void> {
    await this.queue.flush();
  }

  private async send(event: DesktopAuditEvent): Promise<void> {
    if (!this.socket?.connected) {
      throw new Error('audit socket unavailable');
    }
    await new Promise<void>((resolve, reject) => {
      let settled = false;
      const timeout = window.setTimeout(() => {
        if (!settled) {
          settled = true;
          reject(new Error('audit acknowledgement timeout'));
        }
      }, 2500);

      this.socket?.emit(this.eventName, event, (response: unknown) => {
        window.clearTimeout(timeout);
        if (settled) return;
        settled = true;
        if (typeof response === 'object' && response !== null && 'ok' in response && response.ok === false) {
          reject(new Error('audit rejected'));
          return;
        }
        resolve();
      });
    });
  }
}

export function createNoopAuditEmitter(): DesktopAuditEmitter {
  return new DesktopAuditEmitter({
    socket: undefined,
    onEvent: () => undefined,
    maxBufferedEvents: 50,
  });
}
