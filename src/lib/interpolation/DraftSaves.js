// DraftSaves.js — Caches unfinished variable matrices in JSON format
const DRAFT_KEY = 'bsp_drafts_v1';

export function saveDraft(id, data) {
  const drafts = loadAllDrafts();
  drafts[id] = { ...data, savedAt: new Date().toISOString() };
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(drafts));
    return true;
  } catch (e) {
    console.warn('[DraftSaves] Storage full or unavailable:', e.message);
    return false;
  }
}

export function loadDraft(id) {
  const drafts = loadAllDrafts();
  return drafts[id] || null;
}

export function loadAllDrafts() {
  try {
    return JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}');
  } catch { return {}; }
}

export function deleteDraft(id) {
  const drafts = loadAllDrafts();
  delete drafts[id];
  localStorage.setItem(DRAFT_KEY, JSON.stringify(drafts));
}

export function listDrafts() {
  const drafts = loadAllDrafts();
  return Object.entries(drafts).map(([id, data]) => ({
    id,
    name: data.name || id,
    savedAt: data.savedAt,
    varCount: Object.keys(data.variables || {}).length,
  }));
}

export function autoSaveDraft(id, data, debounceMs = 1000) {
  if (!autoSaveDraft._timers) autoSaveDraft._timers = {};
  clearTimeout(autoSaveDraft._timers[id]);
  autoSaveDraft._timers[id] = setTimeout(() => saveDraft(id, data), debounceMs);
}
