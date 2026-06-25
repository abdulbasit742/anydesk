// WebhookTrigger.js — Simulated webhook emitter validating push notifications
export class WebhookTrigger {
  constructor(options = {}) {
    this.endpoints = options.endpoints || [];
    this.onLog = options.onLog || (() => {});
    this.deliveries = [];
  }

  async trigger(event, payload) {
    this._log('info', `[Webhook] Triggering event: ${event}${payload ? ` with payload of size ${JSON.stringify(payload).length}` : ''}`);
    const results = await Promise.allSettled(
      this.endpoints.map(ep => this._deliver(ep, event))
    );
    const succeeded = results.filter(r => r.status === 'fulfilled').length;
    this._log(succeeded === results.length ? 'success' : 'warn',
      `[Webhook] ${succeeded}/${results.length} deliveries succeeded`
    );
    return { event, delivered: succeeded, total: results.length };
  }

  async _deliver(endpoint, event) {
    await this._delay(100 + Math.random() * 400);
    const success = Math.random() > 0.05;

    const delivery = {
      id: Math.random().toString(36).slice(2),
      endpoint: endpoint.url,
      event,
      status: success ? 200 : 500,
      ts: Date.now(),
    };
    this.deliveries.push(delivery);

    if (!success) {
      this._log('error', `[Webhook] Delivery failed to ${endpoint.url} — HTTP 500`);
      throw new Error(`Delivery failed: HTTP 500`);
    }

    this._log('success', `[Webhook] Delivered to ${endpoint.url} — HTTP 200`);
    return delivery;
  }

  addEndpoint(url, secret) {
    this.endpoints.push({ url, secret, addedAt: Date.now() });
  }

  getDeliveries(event) {
    return event ? this.deliveries.filter(d => d.event === event) : [...this.deliveries];
  }

  _log(level, message) { this.onLog({ level, message, ts: Date.now() }); }
  _delay(ms) { return new Promise(r => setTimeout(r, ms)); }
}
