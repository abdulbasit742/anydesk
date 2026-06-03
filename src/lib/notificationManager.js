// src/lib/notificationManager.js
// NotificationManager — singleton with sound, quiet hours, subscribe/unsubscribe



let _idCounter = 1;

class NotificationManager {
  constructor() {
    this._notifications = [];
    this._subscribers = new Set();
    this._quietHours = null; // null = not enabled
    this._soundEnabled = true;
    this._audioCtx = null;
  }

  // ─── Sound ───────────────────────────────────────────────────────────────────

  _initAudio() {
    if (this._audioCtx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) this._audioCtx = new AudioContext();
    } catch { /* no audio */ }
  }

  _playChime(type = 'info') {
    if (!this._soundEnabled) return;
    if (this._isQuietHours()) return;
    this._initAudio();
    if (!this._audioCtx) return;

    const freqMap = { info: 880, success: 1047, warning: 660, error: 440 };
    const freq = freqMap[type] || 880;

    try {
      const oscillator = this._audioCtx.createOscillator();
      const gainNode = this._audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(this._audioCtx.destination);
      oscillator.frequency.setValueAtTime(freq, this._audioCtx.currentTime);
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.12, this._audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, this._audioCtx.currentTime + 0.4);
      oscillator.start(this._audioCtx.currentTime);
      oscillator.stop(this._audioCtx.currentTime + 0.4);
    } catch { /* audio error, swallow */ }
  }

  _isQuietHours() {
    if (!this._quietHours) return false;
    const now = new Date();
    const h = now.getHours();
    const { start, end } = this._quietHours;
    if (start > end) return h >= start || h < end; // wraps midnight
    return h >= start && h < end;
  }

  // ─── API ──────────────────────────────────────────────────────────────────────

  /**
   * add(notification) — create a new notification.
   * notification: { title, message, type?: 'info'|'success'|'warning'|'error', persistent?, data? }
   * Returns the created notification object.
   */
  add(notification) {
    const n = {
      id: `notif_${_idCounter++}_${Date.now().toString(36)}`,
      title: notification.title || '',
      message: notification.message || '',
      type: notification.type || 'info',
      persistent: notification.persistent || false,
      data: notification.data || null,
      read: false,
      createdAt: Date.now(),
    };
    this._notifications.unshift(n); // newest first
    this._playChime(n.type);
    this._notify();
    // Auto-dismiss non-persistent after 8s
    if (!n.persistent) {
      setTimeout(() => this.dismiss(n.id), 8000);
    }
    return n;
  }

  /** dismiss(id) — remove a notification by id. */
  dismiss(id) {
    const before = this._notifications.length;
    this._notifications = this._notifications.filter((n) => n.id !== id);
    if (this._notifications.length !== before) this._notify();
  }

  /** dismissAll() — remove all notifications. */
  dismissAll() {
    this._notifications = [];
    this._notify();
  }

  /** getAll() — return all notifications. */
  getAll() {
    return [...this._notifications];
  }

  /** getUnread() — return unread notifications only. */
  getUnread() {
    return this._notifications.filter((n) => !n.read);
  }

  /** markRead(id) — mark a notification as read. */
  markRead(id) {
    const n = this._notifications.find((n) => n.id === id);
    if (n) { n.read = true; this._notify(); }
  }

  /** markAllRead() */
  markAllRead() {
    this._notifications.forEach((n) => { n.read = true; });
    this._notify();
  }

  /**
   * subscribe(callback) — subscribe to notification changes.
   * callback receives the full notifications array.
   * Returns unsubscribe function.
   */
  subscribe(callback) {
    this._subscribers.add(callback);
    return () => this.unsubscribe(callback);
  }

  unsubscribe(callback) {
    this._subscribers.delete(callback);
  }

  /**
   * setQuietHours(start, end) — suppress sounds between hours (24h format).
   * Pass null to disable.
   */
  setQuietHours(start, end) {
    if (start === null) { this._quietHours = null; return; }
    this._quietHours = { start, end };
  }

  setSoundEnabled(enabled) {
    this._soundEnabled = Boolean(enabled);
  }

  // ─── Internal ─────────────────────────────────────────────────────────────────

  _notify() {
    const snapshot = [...this._notifications];
    this._subscribers.forEach((fn) => {
      try { fn(snapshot); } catch { /* ignore */ }
    });
  }
}

const notificationManager = new NotificationManager();
export default notificationManager;
export { NotificationManager };
