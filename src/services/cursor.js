// src/services/cursor.js
// CursorService — Cursor AI IDE integration
// Bolt Studio Pro

import { BaseService } from './base.js';

let _composerHistory = [
  {
    id:        'comp_001',
    type:      'chat',
    message:   'Help me refactor this component to use hooks',
    response:  'Here is the refactored version using useState and useEffect...',
    files:     ['src/components/OldClass.jsx'],
    ts:        '2026-05-28T09:30:00Z',
  },
  {
    id:        'comp_002',
    type:      'edit',
    message:   'Add TypeScript types to all props',
    response:  'Added PropTypes and TypeScript interface definitions.',
    files:     ['src/components/Dashboard.tsx'],
    ts:        '2026-05-29T14:00:00Z',
  },
];

let _cursorProjects = [
  { id: 'cur_proj_001', name: 'fervent-planck',       path: '/Users/me/projects/fervent-planck',       active: true,  lastOpened: '2026-05-31T08:00:00Z' },
  { id: 'cur_proj_002', name: 'api-gateway-service',  path: '/Users/me/projects/api-gateway-service',  active: false, lastOpened: '2026-05-27T12:30:00Z' },
  { id: 'cur_proj_003', name: 'ml-experiment-tracker', path: '/Users/me/projects/ml-experiment-tracker', active: false, lastOpened: '2026-05-20T16:45:00Z' },
];

export class CursorService extends BaseService {
  constructor(credential) {
    super('Cursor', {
      baseUrl: 'https://api.cursor.sh/v1',
      ...credential,
    });
  }

  // ─── Apply Edit ──────────────────────────────────────────────────────────────

  async applyEdit(file, instruction) {
    if (!file)        throw Object.assign(new Error('CursorService: file path required'),   { code: 'INVALID_INPUT' });
    if (!instruction) throw Object.assign(new Error('CursorService: instruction required'), { code: 'INVALID_INPUT' });

    const editResult = {
      id:          `edit_${Date.now()}`,
      file,
      instruction,
      status:      'applied',
      diff: {
        additions: Math.floor(Math.random() * 40) + 1,
        deletions: Math.floor(Math.random() * 20),
        hunks: [
          {
            start:   10,
            end:     25,
            before:  `// old code in ${file}`,
            after:   `// ${instruction} — applied by Cursor`,
          },
        ],
      },
      appliedAt:   new Date().toISOString(),
      backupPath:  `${file}.cursor.bak`,
    };

    const entry = {
      id:       editResult.id,
      type:     'edit',
      message:  instruction,
      response: `Edit applied to ${file}: ${editResult.diff.additions} additions, ${editResult.diff.deletions} deletions.`,
      files:    [file],
      ts:       editResult.appliedAt,
    };
    _composerHistory.unshift(entry);

    const res = await this.request('/edit', {
      method: 'POST',
      body:   JSON.stringify({ file, instruction }),
      _mockData: { edit: editResult },
    });

    return res.data;
  }

  // ─── Chat ────────────────────────────────────────────────────────────────────

  async chat(message) {
    if (!message) throw Object.assign(new Error('CursorService: message required'), { code: 'INVALID_INPUT' });

    const chatEntry = {
      id:       `comp_${Date.now()}`,
      type:     'chat',
      message,
      response: `[Cursor] Regarding "${message.slice(0, 60)}": Here is my analysis and suggestion for improving your codebase. I recommend breaking this into smaller, more focused modules with clear separation of concerns.`,
      files:    [],
      ts:       new Date().toISOString(),
    };

    _composerHistory.unshift(chatEntry);

    const res = await this.request('/chat', {
      method: 'POST',
      body:   JSON.stringify({ message }),
      _mockData: { entry: chatEntry },
    });

    return res.data;
  }

  // ─── Get Projects ─────────────────────────────────────────────────────────────

  async getProjects() {
    const res = await this.request('/projects', {
      _mockData: {
        projects: _cursorProjects,
        total:    _cursorProjects.length,
        active:   _cursorProjects.find(p => p.active) || null,
      },
    });

    return res.data;
  }

  // ─── Composer History ────────────────────────────────────────────────────────

  async getComposerHistory(limit = 50) {
    const history = _composerHistory.slice(0, limit);

    const res = await this.request('/composer/history', {
      _mockData: {
        history,
        total:    _composerHistory.length,
        limit,
        stats: {
          totalChats:  _composerHistory.filter(e => e.type === 'chat').length,
          totalEdits:  _composerHistory.filter(e => e.type === 'edit').length,
          filesEdited: [...new Set(_composerHistory.flatMap(e => e.files))].length,
        },
      },
    });

    return res.data;
  }
}
