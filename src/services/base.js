// src/services/base.js
// BaseService — foundation for all platform API services
// Bolt Studio Pro — premium dark-theme AI coding platform dashboard

import { withRetry, exponentialBackoff } from './retry.js';
import { Logger } from './logger.js';
import { AsyncQueue } from './queue.js';

const logger = new Logger('BaseService');

export class BaseService {
  constructor(platform, credential) {
    if (!platform || typeof platform !== 'string') {
      throw new Error('BaseService: platform name is required');
    }

    this.platform   = platform;
    this.credential = credential || {};
    this.baseUrl    = credential?.baseUrl || `https://api.${platform.toLowerCase()}.example`;
    this.timeout    = credential?.timeout || 15000;
    this.maxRetries = 3;

    // Rate limiting: max N calls per window
    this._rateLimit = {
      maxCalls:   credential?.rateLimitMax    || 30,
      windowMs:   credential?.rateLimitWindow || 60_000,
      calls:      [],
    };

    // Per-instance request queue (concurrency = 3 by default)
    this._queue = new AsyncQueue({ concurrency: credential?.concurrency || 3 });
    this._queue.process();

    // Per-instance call log
    this._callLog = [];

    logger.info(`[${this.platform}] BaseService initialised`, {
      baseUrl: this.baseUrl,
      timeout: this.timeout,
    });
  }

  // ─── Headers ────────────────────────────────────────────────────────────────

  getHeaders(extra = {}) {
    const headers = {
      'Content-Type': 'application/json',
      Accept:         'application/json',
      'X-Platform':   this.platform,
      'X-Timestamp':  new Date().toISOString(),
    };

    if (this.credential?.apiKey) {
      headers['Authorization'] = `Bearer ${this.credential.apiKey}`;
    }
    if (this.credential?.token) {
      headers['X-Auth-Token'] = this.credential.token;
    }

    return { ...headers, ...extra };
  }

  // ─── Rate Limiting ───────────────────────────────────────────────────────────

  _checkRateLimit() {
    const now  = Date.now();
    const win  = this._rateLimit.windowMs;
    // Evict stale timestamps
    this._rateLimit.calls = this._rateLimit.calls.filter(t => now - t < win);

    if (this._rateLimit.calls.length >= this._rateLimit.maxCalls) {
      const oldest  = this._rateLimit.calls[0];
      const waitMs  = win - (now - oldest);
      throw Object.assign(new Error(`[${this.platform}] Rate limit exceeded. Retry in ${waitMs}ms`), {
        code:   'RATE_LIMITED',
        waitMs,
      });
    }

    this._rateLimit.calls.push(now);
  }

  // ─── Core Request ────────────────────────────────────────────────────────────

  async request(endpoint, options = {}) {
    const url       = `${this.baseUrl}${endpoint}`;
    const method    = (options.method || 'GET').toUpperCase();
    const startTime = Date.now();
    const callId    = `${this.platform}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    logger.debug(`[${this.platform}] → ${method} ${endpoint}`, { callId });

    // Rate limit guard
    this._checkRateLimit();

    // Wrap actual fetch in retry logic
    const execute = () =>
      new Promise((resolve, reject) => {
        // Simulate realistic network latency (50–350 ms)
        const latency = 50 + Math.random() * 300;
        const timer   = setTimeout(() => {
          // Simulate occasional failures (5% chance) for realistic retry testing
          if (Math.random() < 0.05 && !options._noFail) {
            reject(Object.assign(new Error('Simulated transient network error'), { code: 'NETWORK_ERROR' }));
            return;
          }

          const status = 200;
          resolve({
            ok:      true,
            status,
            url,
            latencyMs: Math.round(Date.now() - startTime),
            data:    options._mockData || { success: true },
          });
        }, latency);

        // Respect timeout
        setTimeout(() => {
          clearTimeout(timer);
          reject(Object.assign(new Error(`[${this.platform}] Request timed out after ${this.timeout}ms`), {
            code: 'TIMEOUT',
          }));
        }, this.timeout);
      });

    let result;
    try {
      result = await withRetry(execute, {
        maxAttempts: this.maxRetries,
        backoff:     exponentialBackoff,
        onRetry:     (attempt, err) => {
          logger.warn(`[${this.platform}] Retry ${attempt}/${this.maxRetries} for ${endpoint}`, {
            error: err.message,
          });
        },
        retryIf: (err) => ['NETWORK_ERROR', 'TIMEOUT', 'SERVER_ERROR'].includes(err.code),
      });
    } catch (err) {
      this._logCall({ callId, method, endpoint, url, durationMs: Date.now() - startTime, error: err });
      this.handleError(err);
    }

    const durationMs = Date.now() - startTime;
    this._logCall({ callId, method, endpoint, url, durationMs, status: result.status });

    logger.info(`[${this.platform}] ← ${method} ${endpoint} ${result.status} (${durationMs}ms)`, { callId });

    return result;
  }

  // ─── Enqueue (rate-limited slot via AsyncQueue) ───────────────────────────

  async requestQueued(endpoint, options = {}) {
    return new Promise((resolve, reject) => {
      this._queue.enqueue(async () => {
        try {
          const res = await this.request(endpoint, options);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  // ─── Ping ────────────────────────────────────────────────────────────────────

  async ping() {
    const start = Date.now();
    try {
      await this.request('/ping', { _noFail: true, _mockData: { pong: true } });
      return { platform: this.platform, status: 'online', latencyMs: Date.now() - start };
    } catch (err) {
      return { platform: this.platform, status: 'offline', latencyMs: Date.now() - start, error: err.message };
    }
  }

  // ─── Error Handler ───────────────────────────────────────────────────────────

  handleError(err) {
    logger.error(`[${this.platform}] Request failed`, {
      code:    err.code    || 'UNKNOWN',
      message: err.message,
    });

    // Normalise error codes
    const normalized = Object.assign(new Error(err.message), {
      platform: this.platform,
      code:     err.code || 'UNKNOWN',
      original: err,
    });

    throw normalized;
  }

  // ─── Internal Call Log ───────────────────────────────────────────────────────

  _logCall(entry) {
    this._callLog.unshift({ ts: new Date().toISOString(), ...entry });
    if (this._callLog.length > 200) this._callLog.length = 200; // cap at 200
  }

  getCallLog() {
    return [...this._callLog];
  }

  clearCallLog() {
    this._callLog = [];
  }
}
