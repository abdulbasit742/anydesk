// src/services/v0.js
// V0Service — Vercel v0 UI generation platform integration
// Bolt Studio Pro

import { BaseService } from './base.js';

const V0_FRAMEWORKS = ['react', 'next', 'vue', 'svelte', 'html'];

let _generationStore = [
  {
    id:        'v0_gen_001',
    prompt:    'A responsive pricing table with 3 tiers',
    framework: 'react',
    status:    'completed',
    createdAt: '2026-05-29T10:00:00Z',
    iterations: 2,
  },
  {
    id:        'v0_gen_002',
    prompt:    'Dark mode dashboard with sidebar nav',
    framework: 'next',
    status:    'completed',
    createdAt: '2026-05-30T14:30:00Z',
    iterations: 1,
  },
];

export class V0Service extends BaseService {
  constructor(credential) {
    super('V0', {
      baseUrl: 'https://v0.dev/api/v1',
      ...credential,
    });
  }

  // ─── Generate ─────────────────────────────────────────────────────────────────

  async generate(prompt, framework = 'react') {
    if (!prompt) {
      throw Object.assign(new Error('V0Service: prompt is required'), { code: 'INVALID_INPUT' });
    }
    if (!V0_FRAMEWORKS.includes(framework)) {
      throw Object.assign(
        new Error(`V0Service: unsupported framework "${framework}". Use: ${V0_FRAMEWORKS.join(', ')}`),
        { code: 'INVALID_FRAMEWORK' }
      );
    }

    const gen = {
      id:        `v0_gen_${Date.now()}`,
      prompt,
      framework,
      status:    'completed',
      createdAt: new Date().toISOString(),
      iterations: 0,
      output: {
        code:      generateMockComponent(prompt, framework),
        preview:   `https://v0.dev/preview/${Date.now()}`,
        shareUrl:  `https://v0.dev/t/${Math.random().toString(36).slice(2, 8)}`,
        files: [
          { name: 'component.tsx', language: 'typescript', size: Math.floor(800 + Math.random() * 1200) },
          { name: 'styles.css',    language: 'css',        size: Math.floor(200 + Math.random() * 400)  },
        ],
      },
      metadata: {
        tokensUsed:   Math.ceil(prompt.length * 3.5),
        generationMs: Math.floor(1200 + Math.random() * 2000),
        model:        'v0-preview',
      },
    };

    _generationStore.unshift(gen);

    const res = await this.request('/generate', {
      method: 'POST',
      body:   JSON.stringify({ prompt, framework }),
      _mockData: { generation: gen },
    });

    return res.data;
  }

  // ─── Iterate ─────────────────────────────────────────────────────────────────

  async iterate(componentId, feedback) {
    if (!componentId) throw Object.assign(new Error('V0Service: componentId required'), { code: 'INVALID_INPUT' });
    if (!feedback)    throw Object.assign(new Error('V0Service: feedback required'),    { code: 'INVALID_INPUT' });

    const existing = _generationStore.find(g => g.id === componentId);
    if (!existing) {
      throw Object.assign(new Error(`V0Service: generation ${componentId} not found`), { code: 'NOT_FOUND' });
    }

    existing.iterations++;

    const iteration = {
      id:           `v0_iter_${Date.now()}`,
      parentId:     componentId,
      feedback,
      iterationNum: existing.iterations,
      status:       'completed',
      createdAt:    new Date().toISOString(),
      output: {
        code:     generateMockComponent(`${feedback} (iteration ${existing.iterations})`, existing.framework),
        preview:  `https://v0.dev/preview/${Date.now()}`,
        shareUrl: `https://v0.dev/t/${Math.random().toString(36).slice(2, 8)}`,
        delta: {
          additions: Math.floor(Math.random() * 30) + 5,
          deletions: Math.floor(Math.random() * 15),
          changed:   feedback.slice(0, 80),
        },
      },
    };

    const res = await this.request(`/generate/${componentId}/iterate`, {
      method: 'POST',
      body:   JSON.stringify({ feedback }),
      _mockData: { iteration },
    });

    return res.data;
  }

  // ─── Get Generations ──────────────────────────────────────────────────────────

  async getGenerations(filters = {}) {
    let gens = [..._generationStore];

    if (filters.framework) gens = gens.filter(g => g.framework === filters.framework);
    if (filters.status)    gens = gens.filter(g => g.status    === filters.status);

    const res = await this.request('/generate', {
      _mockData: {
        generations: gens,
        total:       gens.length,
        stats: {
          totalIterations: gens.reduce((s, g) => s + g.iterations, 0),
          byFramework:     V0_FRAMEWORKS.reduce((acc, f) => {
            acc[f] = gens.filter(g => g.framework === f).length;
            return acc;
          }, {}),
        },
      },
    });

    return res.data;
  }

  // ─── Export Code ─────────────────────────────────────────────────────────────

  async exportCode(id) {
    if (!id) throw Object.assign(new Error('V0Service: generation id required'), { code: 'INVALID_INPUT' });

    const gen = _generationStore.find(g => g.id === id);
    if (!gen) throw Object.assign(new Error(`V0Service: generation ${id} not found`), { code: 'NOT_FOUND' });

    const exported = {
      id,
      exportedAt: new Date().toISOString(),
      format:     'zip',
      files: [
        { name: 'component.tsx', content: gen.output?.code || '// exported component' },
        { name: 'README.md',     content: `# Generated Component\n\nPrompt: ${gen.prompt}\nFramework: ${gen.framework}` },
        { name: 'package.json',  content: JSON.stringify({ name: 'v0-component', version: '1.0.0', dependencies: {} }, null, 2) },
      ],
      downloadUrl: `https://v0.dev/export/${id}.zip`,
      sizeBytes:   Math.floor(4096 + Math.random() * 20480),
    };

    const res = await this.request(`/generate/${id}/export`, {
      method: 'POST',
      _mockData: { export: exported },
    });

    return res.data;
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateMockComponent(prompt, framework) {
  const name = 'GeneratedComponent';
  if (framework === 'react' || framework === 'next') {
    return `import React from 'react';\n\n// v0 generated — ${prompt.slice(0, 50)}\nexport default function ${name}() {\n  return (\n    <div className="container">\n      <h1>${prompt.slice(0, 40)}</h1>\n    </div>\n  );\n}`;
  }
  if (framework === 'vue') {
    return `<template>\n  <div class="container">\n    <h1>${prompt.slice(0, 40)}</h1>\n  </div>\n</template>\n\n<script setup>\n// v0 generated\n</script>`;
  }
  return `<!-- v0 generated: ${prompt.slice(0, 40)} -->\n<div class="container"><h1>${prompt.slice(0, 40)}</h1></div>`;
}
