// logger.js — in-memory application logger with levels and export

const MAX_HISTORY = 500;

class Logger {
  constructor(name = 'app') {
    this.name    = name;
    this.history = [];
    this.level   = 'debug'; // debug | info | warn | error
  }

  _levels = ['debug','info','warn','error'];

  _shouldLog(level) {
    return this._levels.indexOf(level) >= this._levels.indexOf(this.level);
  }

  _record(level, message, meta = {}) {
    if (!this._shouldLog(level)) return;
    const entry = { id: Math.random().toString(36).slice(2), level, message, meta, ts: new Date().toISOString(), name: this.name };
    this.history = [...this.history.slice(-(MAX_HISTORY - 1)), entry];
    const style = { debug:'color:#888', info:'color:#4f8ef7', warn:'color:#f5b731', error:'color:#ff5f5f' };
    console.log(`%c[${this.name.toUpperCase()}] ${level.toUpperCase()} — ${message}`, style[level] || '');
    return entry;
  }

  debug(msg, meta)  { return this._record('debug', msg, meta); }
  info(msg, meta)   { return this._record('info',  msg, meta); }
  warn(msg, meta)   { return this._record('warn',  msg, meta); }
  error(msg, meta)  { return this._record('error', msg, meta); }

  getHistory(level) {
    return level ? this.history.filter(e => e.level === level) : [...this.history];
  }

  clearHistory() { this.history = []; }

  setLevel(level) { if (this._levels.includes(level)) this.level = level; }

  export(format = 'text') {
    if (format === 'json') return JSON.stringify(this.history, null, 2);
    return this.history.map(e => `[${e.ts}] [${e.level.toUpperCase()}] ${e.message}`).join('\n');
  }
}

export const logger = new Logger('bolt-studio');
export default logger;
