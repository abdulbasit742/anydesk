// DiagnosticsCompiler.js — Scans automation pipelines and compiles glowing log outputs
export class DiagnosticsCompiler {
  constructor(pipeline, onLog) {
    this.pipeline = pipeline || [];
    this.onLog = onLog || (() => {});
    this.report = { passed: 0, failed: 0, warnings: 0, logs: [] };
  }

  async compile() {
    this._log('system', '═══ DIAGNOSTICS COMPILER v2.0 ═══');
    this._log('info', `Scanning ${this.pipeline.length} pipeline steps...`);
    await this._delay(200);

    for (const step of this.pipeline) {
      await this._analyzeStep(step);
    }

    this._log('system', '───────────────────────────────');
    this._log(this.report.failed > 0 ? 'warn' : 'success',
      `Compilation complete: ${this.report.passed} passed, ${this.report.failed} failed, ${this.report.warnings} warnings`
    );

    return this.report;
  }

  async _analyzeStep(step) {
    await this._delay(150 + Math.random() * 200);
    const issues = [];

    if (!step.name) issues.push({ level: 'warn', msg: 'Step missing name field' });
    if (!step.type) issues.push({ level: 'error', msg: 'Step missing type field' });
    if (step.delay && step.delay > 60000) issues.push({ level: 'warn', msg: `High delay detected: ${step.delay}ms` });
    if (step.retries && step.retries > 10) issues.push({ level: 'warn', msg: 'Excessive retry count' });

    if (issues.filter(i => i.level === 'error').length > 0) {
      this.report.failed++;
      this._log('error', `✗ Step "${step.name || '?'}" — ${issues.map(i => i.msg).join(', ')}`);
    } else if (issues.length > 0) {
      this.report.warnings += issues.length;
      this._log('warn', `△ Step "${step.name}" — ${issues.map(i => i.msg).join(', ')}`);
    } else {
      this.report.passed++;
      this._log('success', `✓ Step "${step.name}" — OK`);
    }
  }

  _log(level, message) {
    const e = { level, message, ts: Date.now() };
    this.report.logs.push(e);
    this.onLog(e);
  }

  _delay(ms) { return new Promise(r => setTimeout(r, ms)); }
}
