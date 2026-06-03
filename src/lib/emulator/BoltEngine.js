// BoltEngine.js — Mock server mimicking Bolt.new's WebContainer environment
export class BoltEngine {
  constructor(options = {}) {
    this.sessionId = Math.random().toString(36).slice(2);
    this.status = 'idle';
    this.logs = [];
    this.port = options.port || 3000;
    this.onLog = options.onLog || (() => {});
  }

  async initialize(prompt) {
    this.status = 'booting';
    this._log('system', `[Bolt] Session ${this.sessionId} starting...`);
    await this._delay(300);
    this._log('info', '[Bolt] WebContainer runtime v2.1.0 loaded');
    await this._delay(200);
    this._log('info', '[Bolt] Parsing prompt and generating project scaffold...');
    await this._delay(500);

    const scaffold = this._generateScaffold(prompt);
    this._log('success', `[Bolt] Generated ${scaffold.files.length} files`);

    await this._delay(400);
    this._log('info', '[Bolt] Installing dependencies...');
    await this._delay(800);
    this._log('success', '[Bolt] Dependencies installed in 1.8s');

    await this._delay(300);
    this._log('success', `[Bolt] Dev server live at http://localhost:${this.port}`);
    this.status = 'running';

    return { ...scaffold, sessionId: this.sessionId, previewUrl: `http://localhost:${this.port}` };
  }

  _generateScaffold(prompt) {
    const isReact = /react|component|jsx/i.test(prompt);
    const isApi = /api|server|backend|express/i.test(prompt);
    const files = [
      { name: 'package.json', type: 'config' },
      { name: isReact ? 'src/App.jsx' : 'index.js', type: 'main' },
      { name: isReact ? 'src/index.jsx' : 'src/index.js', type: 'entry' },
      { name: isApi ? 'server.js' : 'vite.config.js', type: 'config' },
    ];
    return { files, framework: isReact ? 'React + Vite' : isApi ? 'Express' : 'Vanilla JS' };
  }

  async sendMessage(message) {
    this._log('info', `[Bolt] Processing: "${message.slice(0, 60)}..."`);
    await this._delay(600 + Math.random() * 800);
    this._log('success', '[Bolt] Changes applied and hot-reloaded');
    return { success: true, diffCount: Math.floor(Math.random() * 5) + 1 };
  }

  async terminate() {
    this._log('system', '[Bolt] Session terminated');
    this.status = 'idle';
  }

  _log(level, message) {
    const entry = { level, message, ts: Date.now() };
    this.logs.push(entry);
    this.onLog(entry);
  }

  _delay(ms) { return new Promise(r => setTimeout(r, ms)); }
  getLogs() { return [...this.logs]; }
  getStatus() { return this.status; }
}
