// src/lib/broadcastQueue.js
// BroadcastQueue — job queue with concurrency, rate limiting, EventEmitter callbacks

class BroadcastQueue {
  /**
   * @param {object} options
   * @param {number} options.concurrency   max parallel jobs (default 1)
   * @param {number} options.delayMs       rate-limit delay between job starts (default 500)
   */
  constructor({ concurrency = 1, delayMs = 500 } = {}) {
    this._concurrency = concurrency;
    this._delayMs = delayMs;
    this._paused = false;
    this._running = 0;

    // job queues
    this._pending = [];
    this._processing = [];
    this._done = [];
    this._failed = [];

    // callbacks: { event: [fn, ...] }
    this._listeners = {};

    this._lastStartTime = 0;
    this._drainResolvers = [];
  }

  // ─── EventEmitter ────────────────────────────────────────────────────────────

  on(event, fn) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(fn);
    return this;
  }

  off(event, fn) {
    if (!this._listeners[event]) return this;
    this._listeners[event] = this._listeners[event].filter((f) => f !== fn);
    return this;
  }

  _emit(event, ...args) {
    (this._listeners[event] || []).forEach((fn) => {
      try { fn(...args); } catch { /* swallow listener errors */ }
    });
  }

  // ─── Public API ──────────────────────────────────────────────────────────────

  /**
   * enqueue(job) — add a job to the queue.
   * job: { id: string, payload: any, fn: async(payload) => result }
   * Returns the job object (with id auto-generated if missing).
   */
  enqueue(job) {
    if (!job || typeof job.fn !== 'function') {
      throw new TypeError('BroadcastQueue.enqueue: job must have a .fn async function');
    }
    const enriched = {
      id: job.id || `job_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      payload: job.payload ?? null,
      fn: job.fn,
      enqueuedAt: Date.now(),
      status: 'pending',
    };
    this._pending.push(enriched);
    this._emit('enqueue', enriched);
    this._tryNext();
    return enriched;
  }

  /**
   * processNext() — manually trigger next job processing attempt.
   */
  processNext() {
    this._tryNext();
  }

  pause() {
    this._paused = true;
    this._emit('pause');
  }

  resume() {
    this._paused = false;
    this._emit('resume');
    this._tryNext();
  }

  /**
   * drain() — returns a Promise that resolves when all pending + processing jobs finish.
   */
  drain() {
    if (this._pending.length === 0 && this._running === 0) return Promise.resolve();
    return new Promise((resolve) => {
      this._drainResolvers.push(resolve);
    });
  }

  getStatus() {
    return {
      pending: this._pending.length,
      processing: this._processing.length,
      done: this._done.length,
      failed: this._failed.length,
      paused: this._paused,
      concurrency: this._concurrency,
      delayMs: this._delayMs,
    };
  }

  /** Clear done & failed history */
  clearHistory() {
    this._done = [];
    this._failed = [];
    this._emit('clear');
  }

  /** Remove a pending job by id before it starts */
  cancel(id) {
    const idx = this._pending.findIndex((j) => j.id === id);
    if (idx === -1) return false;
    const [job] = this._pending.splice(idx, 1);
    job.status = 'cancelled';
    this._failed.push({ ...job, error: 'Cancelled', cancelledAt: Date.now() });
    this._emit('cancel', job);
    return true;
  }

  // ─── Internal ─────────────────────────────────────────────────────────────

  async _tryNext() {
    if (this._paused) return;
    if (this._running >= this._concurrency) return;
    if (this._pending.length === 0) {
      if (this._running === 0) this._resolveDrain();
      return;
    }

    // Rate limiting: enforce minimum delay between job starts
    const now = Date.now();
    const sinceLastStart = now - this._lastStartTime;
    if (sinceLastStart < this._delayMs && this._lastStartTime !== 0) {
      const wait = this._delayMs - sinceLastStart;
      setTimeout(() => this._tryNext(), wait);
      return;
    }

    const job = this._pending.shift();
    job.status = 'processing';
    job.startedAt = Date.now();
    this._processing.push(job);
    this._running++;
    this._lastStartTime = Date.now();
    this._emit('start', job);

    try {
      const result = await job.fn(job.payload);
      job.status = 'done';
      job.result = result;
      job.finishedAt = Date.now();
      this._processing = this._processing.filter((j) => j.id !== job.id);
      this._done.push(job);
      this._emit('done', job);
    } catch (err) {
      job.status = 'failed';
      job.error = err?.message || String(err);
      job.finishedAt = Date.now();
      this._processing = this._processing.filter((j) => j.id !== job.id);
      this._failed.push(job);
      this._emit('error', job, err);
    } finally {
      this._running--;
      this._tryNext();
    }
  }

  _resolveDrain() {
    const resolvers = this._drainResolvers.splice(0);
    resolvers.forEach((fn) => fn());
    if (resolvers.length > 0) this._emit('drain');
  }
}

export default BroadcastQueue;
