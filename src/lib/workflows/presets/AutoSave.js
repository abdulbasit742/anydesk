// AutoSave.js — Integrates compiled payloads immediately with the local prompt library
import { saveDraft } from '../../interpolation/DraftSaves.js';

export const AutoSaveStep = {
  id: 'auto-save',
  name: 'Auto-Save to Library',
  type: 'persist',
  description: 'Saves compiled prompts and workflow results to the local prompt library',
  icon: '💾',
  configSchema: {
    overwrite: { type: 'boolean', default: true },
    addTimestamp: { type: 'boolean', default: true },
    category: { type: 'string', default: 'workflow' },
  },

  async execute(payload, config = {}) {
    const { prompt, name, variables, results } = payload;
    const { addTimestamp = true, category = 'workflow' } = config;

    const id = `${category}_${name?.replace(/\s+/g, '_').toLowerCase() || 'unnamed'}_${addTimestamp ? Date.now() : 'latest'}`;

    const entry = {
      id,
      name: name || 'Untitled',
      prompt,
      variables: variables || {},
      category,
      savedAt: new Date().toISOString(),
      results: results || null,
      tags: [category, 'auto-saved'],
    };

    const saved = saveDraft(id, entry);

    return {
      success: saved,
      id,
      message: saved ? `Saved to library as "${name || id}"` : 'Failed to save (storage full?)',
    };
  },
};
