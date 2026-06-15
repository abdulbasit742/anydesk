import type { DesktopAuditEvent, DesktopAuditTransport } from '../types/audit.js';

export interface AuditQueueOptions {
  maxBufferedEvents?: number;
  transport: DesktopAuditTransport;
  onDrop?: (event: DesktopAuditEvent) => void;
}

export class AuditQueue {
  private readonly maxBufferedEvents: number;
  private readonly transport: DesktopAuditTransport;
  private readonly onDrop?: (event: DesktopAuditEvent) => void;
  private queue: DesktopAuditEvent[] = [];
  private flushing = false;

  constructor(options: AuditQueueOptions) {
    this.maxBufferedEvents = options.maxBufferedEvents ?? 250;
    this.transport = options.transport;
    this.onDrop = options.onDrop;
  }

  size(): number {
    return this.queue.length;
  }

  snapshot(): DesktopAuditEvent[] {
    return [...this.queue];
  }

  async enqueue(event: DesktopAuditEvent): Promise<void> {
    if (this.queue.length >= this.maxBufferedEvents) {
      const dropped = this.queue.shift();
      if (dropped) this.onDrop?.(dropped);
    }
    this.queue.push(event);
    await this.flush().catch(() => undefined);
  }

  async flush(): Promise<void> {
    if (this.flushing) return;
    this.flushing = true;
    try {
      while (this.queue.length > 0) {
        const event = this.queue[0];
        await this.transport.emitAudit(event);
        this.queue.shift();
      }
    } finally {
      this.flushing = false;
    }
  }

  clear(): void {
    this.queue = [];
  }
}
