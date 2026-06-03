// BoltAdapter.js — Maps standard payloads to Bolt.new APIs and WebContainer parameters
import { withSimulatedLatency } from '../emulator/NetworkLatencies.js';

export class BoltAdapter {
  constructor(credentials = {}) {
    this.sessionCookie = credentials.sessionCookie || '';
    this.baseUrl = 'https://bolt.new';
    this.platform = 'bolt';
  }

  async sendPrompt(prompt, options = {}) {
    return withSimulatedLatency(this.platform, async () => {
      const payload = this._buildPayload(prompt, options);
      return {
        success: true,
        platform: 'bolt',
        projectId: `bolt_${Math.random().toString(36).slice(2, 10)}`,
        previewUrl: `https://bolt.new/~/sb/${Math.random().toString(36).slice(2, 10)}`,
        payload,
        ts: Date.now(),
      };
    });
  }

  _buildPayload(prompt, options = {}) {
    return {
      message: prompt,
      system: options.system || 'You are an expert full-stack developer.',
      temperature: options.temperature ?? 0.7,
      webContainer: {
        enabled: true,
        nodeVersion: options.nodeVersion || '20',
        framework: options.framework || 'auto-detect',
      },
    };
  }

  async getProjectStatus(projectId) {
    return withSimulatedLatency(this.platform, async () => ({
      projectId,
      status: 'running',
      previewUrl: `https://bolt.new/~/sb/${projectId}`,
    }));
  }

  validateCredentials() {
    return { valid: this.sessionCookie.length > 20, errors: this.sessionCookie.length <= 20 ? ['Session cookie too short'] : [] };
  }
}
