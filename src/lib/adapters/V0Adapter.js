// V0Adapter.js — Maps layout requirements to v0.dev modular component structures
import { withSimulatedLatency } from '../emulator/NetworkLatencies.js';

export class V0Adapter {
  constructor(credentials = {}) {
    this.apiKey = credentials.apiKey || '';
    this.platform = 'v0';
  }

  async generateComponent(prompt, options = {}) {
    return withSimulatedLatency(this.platform, async () => {
      const componentId = `v0_${Math.random().toString(36).slice(2, 10)}`;
      const component = this._generateMockComponent(prompt, options);
      return {
        success: true,
        platform: 'v0',
        componentId,
        shareUrl: `https://v0.dev/t/${componentId}`,
        component,
        ts: Date.now(),
      };
    });
  }

  _generateMockComponent(prompt, options = {}) {
    const framework = options.framework || 'react';
    const hasTable = /table|list|grid/i.test(prompt);
    const hasForm = /form|input|submit/i.test(prompt);
    const hasChart = /chart|graph|visualization/i.test(prompt);

    const componentName = prompt.split(' ').slice(0, 3).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('').replace(/[^a-zA-Z]/g, '');

    return {
      name: componentName || 'GeneratedComponent',
      framework,
      hasTable,
      hasForm,
      hasChart,
      estimatedLines: 30 + Math.floor(prompt.length * 0.5),
      dependencies: ['react', hasChart ? 'recharts' : null, hasForm ? 'react-hook-form' : null].filter(Boolean),
    };
  }

  async sendPrompt(prompt, options = {}) {
    return this.generateComponent(prompt, options);
  }

  validateCredentials() {
    return { valid: this.apiKey.length >= 16, errors: this.apiKey.length < 16 ? ['API key too short'] : [] };
  }
}
