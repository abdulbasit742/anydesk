// ShellConsole.js — Mock bash/zsh shell wrapper for simulated container boot cycles
const BOOT_SEQUENCE = [
  { delay: 100, level: 'system', message: 'Initializing WebContainer runtime...' },
  { delay: 300, level: 'info', message: 'Loading Node.js v20.11.0 runtime...' },
  { delay: 500, level: 'info', message: 'Mounting virtual filesystem at /workspace' },
  { delay: 700, level: 'success', message: 'Container boot complete. Shell ready.' },
];

export class ShellConsole {
  constructor(onLog) {
    this.onLog = onLog || console.log;
    this.history = [];
    this.env = { NODE_ENV: 'development', PATH: '/usr/local/bin:/usr/bin', HOME: '/root' };
    this.cwd = '/workspace';
    this.booted = false;
  }

  async boot() {
    for (const step of BOOT_SEQUENCE) {
      await this._delay(step.delay);
      this._log(step.level, step.message);
    }
    this.booted = true;
  }

  async exec(command) {
    if (!this.booted) await this.boot();
    const trimmed = command.trim();
    this._log('system', `$ ${trimmed}`);
    this.history.push({ command: trimmed, ts: Date.now() });

    const [cmd, ...args] = trimmed.split(/\s+/);
    return this._dispatch(cmd, args);
  }

  async _dispatch(cmd, args) {
    await this._delay(80 + Math.random() * 200);
    const handlers = {
      pwd: () => this._log('info', this.cwd),
      ls: () => this._log('info', 'node_modules  package.json  src  .env  dist'),
      echo: () => this._log('info', args.join(' ')),
      node: () => this._log('success', 'Node.js v20.11.0'),
      npm: () => this._simulateNpm(args),
      clear: () => {},
    };

    const handler = handlers[cmd];
    if (handler) { await handler(); return { exitCode: 0 }; }

    this._log('error', `Command not found: ${cmd}`);
    return { exitCode: 127 };
  }

  async _simulateNpm(args) {
    if (args[0] === 'install') {
      this._log('info', 'Resolving packages...');
      await this._delay(600);
      this._log('success', 'added 142 packages in 2.4s');
    } else if (args[0] === 'run') {
      this._log('info', `> ${args[1] || 'start'}`);
      await this._delay(400);
      this._log('success', 'Server running on http://localhost:3000');
    }
  }

  _log(level, message) {
    const entry = { level, message, ts: Date.now() };
    this.onLog(entry);
  }

  _delay(ms) { return new Promise(r => setTimeout(r, ms)); }
  getHistory() { return [...this.history]; }
  clearHistory() { this.history = []; }
}
