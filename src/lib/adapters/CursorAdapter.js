// CursorAdapter.js — Simulates terminal compiles and syntax checks in Cursor workspaces
import { withSimulatedLatency } from '../emulator/NetworkLatencies.js';

export class CursorAdapter {
  constructor(credentials = {}) {
    this.apiKey = credentials.apiKey || '';
    this.platform = 'cursor';
    this.workspace = null;
  }

  async openWorkspace(path = '/workspace') {
    return withSimulatedLatency(this.platform, async () => {
      this.workspace = { path, id: `ws_${Math.random().toString(36).slice(2, 8)}`, openedAt: Date.now() };
      return { success: true, ...this.workspace };
    });
  }

  async sendPrompt(prompt) {
    return withSimulatedLatency(this.platform, async () => ({
      success: true,
      platform: 'cursor',
      workspace: this.workspace,
      promptLength: prompt?.length || 0,
      edits: Math.floor(Math.random() * 8) + 1,
      filesModified: [`src/App.tsx`, `src/components/Main.tsx`].slice(0, Math.floor(Math.random() * 2) + 1),
      compileResult: await this._simulateCompile(),
      ts: Date.now(),
    }));
  }

  async _simulateCompile() {
    await new Promise(r => setTimeout(r, 300 + Math.random() * 400));
    const hasError = Math.random() < 0.05;
    return {
      success: !hasError,
      errors: hasError ? [{ file: 'src/App.tsx', line: 42, message: 'Type error: Property does not exist' }] : [],
      warnings: Math.random() < 0.3 ? [{ message: 'Unused variable' }] : [],
      duration: Math.round(300 + Math.random() * 500),
    };
  }

  async runTypeCheck() {
    return withSimulatedLatency(this.platform, async () => ({
      success: true, errors: 0, warnings: Math.floor(Math.random() * 3), duration: Math.round(500 + Math.random() * 300),
    }));
  }

  validateCredentials() {
    return { valid: this.apiKey.length >= 20, errors: this.apiKey.length < 20 ? ['API key too short'] : [] };
  }
}
