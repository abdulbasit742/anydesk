// SocketRelay.js — Emulates real-time WebSocket relays syncing logs across screen boards
export class SocketRelay {
  constructor(options = {}) {
    this.roomId = options.roomId || `room_${Math.random().toString(36).slice(2, 8)}`;
    this.channels = new Map();
    this.connected = false;
    this.messageLog = [];
    this.onConnect = options.onConnect || (() => {});
    this.onDisconnect = options.onDisconnect || (() => {});
  }

  async connect() {
    await new Promise(r => setTimeout(r, 100 + Math.random() * 100));
    this.connected = true;
    this.onConnect({ roomId: this.roomId });
    this._startHeartbeat();
    return this;
  }

  subscribe(channel, callback) {
    if (!this.channels.has(channel)) this.channels.set(channel, []);
    this.channels.get(channel).push(callback);
    return () => {
      const subs = this.channels.get(channel) || [];
      this.channels.set(channel, subs.filter(cb => cb !== callback));
    };
  }

  broadcast(channel, data) {
    if (!this.connected) return false;
    const message = { channel, data, ts: Date.now(), roomId: this.roomId };
    this.messageLog.push(message);
    if (this.messageLog.length > 500) this.messageLog.shift();

    const handlers = this.channels.get(channel) || [];
    handlers.forEach(h => {
      setTimeout(() => h(data), 5 + Math.random() * 20);
    });

    return true;
  }

  broadcastLog(entry) { return this.broadcast('logs', entry); }
  broadcastState(state) { return this.broadcast('state', state); }
  broadcastMetric(metric) { return this.broadcast('metrics', metric); }

  _startHeartbeat() {
    this._heartbeatTimer = setInterval(() => {
      if (!this.connected) return;
      this.broadcast('heartbeat', { ts: Date.now(), roomId: this.roomId });
    }, 30000);
  }

  disconnect() {
    this.connected = false;
    clearInterval(this._heartbeatTimer);
    this.onDisconnect({ roomId: this.roomId });
  }

  getStats() { return { connected: this.connected, channels: this.channels.size, messages: this.messageLog.length, roomId: this.roomId }; }
}
