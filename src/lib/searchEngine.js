// src/lib/searchEngine.js
// SearchEngine — fuzzy indexing, relevance ranking, highlight, filter, AND/OR ops

/**
 * Normalize a string for comparison: lowercase, strip accents, trim.
 */
function normalize(str) {
  return String(str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Simple trigram-based similarity: returns 0-1.
 */
function trigramSimilarity(a, b) {
  if (!a || !b) return 0;
  const trigramsOf = (s) => {
    const padded = `  ${s}  `;
    const set = new Set();
    for (let i = 0; i < padded.length - 2; i++) set.add(padded.slice(i, i + 3));
    return set;
  };
  const ta = trigramsOf(a);
  const tb = trigramsOf(b);
  const intersection = [...ta].filter((t) => tb.has(t)).length;
  return (2 * intersection) / (ta.size + tb.size);
}

/**
 * Wrap matching substrings with <mark> for HTML display.
 */
function highlight(text, query) {
  if (!query || !text) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  try {
    const rx = new RegExp(`(${escaped})`, 'gi');
    return String(text).replace(rx, '<mark>$1</mark>');
  } catch {
    return text;
  }
}

// ─── SearchEngine ─────────────────────────────────────────────────────────────

class SearchEngine {
  constructor() {
    this._index = [];
    this._fields = [];
  }

  /**
   * index(items, fields) — build a search index from an array of objects.
   * items: any[], fields: string[] (object keys to index)
   */
  index(items, fields = []) {
    if (!Array.isArray(items)) throw new TypeError('SearchEngine.index: items must be an array');
    this._fields = fields;
    this._index = items.map((item, i) => ({
      item,
      _id: item.id || item._id || i,
      _normalized: fields.reduce((acc, f) => {
        acc[f] = normalize(item[f]);
        return acc;
      }, {}),
      _tags: Array.isArray(item.tags) ? item.tags.map(normalize) : [],
      _category: normalize(item.category || item.type || ''),
    }));
  }

  /**
   * search(query, options) — fuzzy search across indexed fields.
   * options: {
   *   threshold?: number (0-1, default 0.2),
   *   operator?: 'AND' | 'OR' (default 'OR'),
   *   tags?: string[],
   *   category?: string,
   *   limit?: number (default 50),
   *   highlight?: boolean (default false),
   * }
   * Returns array of { item, score, highlights }
   */
  search(query, options = {}) {
    const {
      threshold = 0.2,
      operator = 'OR',
      tags = [],
      category,
      limit = 50,
      highlight: doHighlight = false,
    } = options;

    const normQuery = normalize(query || '');
    const terms = normQuery.split(/\s+/).filter(Boolean);

    let results = this._index
      .map((entry) => {
        // Tag filter
        if (tags && tags.length > 0) {
          const normTags = tags.map(normalize);
          if (!normTags.some((t) => entry._tags.includes(t))) return null;
        }

        // Category filter
        if (category && normalize(category) !== entry._category) return null;

        // Score calculation
        let score = 0;
        const fieldScores = {};

        for (const field of this._fields) {
          const fieldVal = entry._normalized[field] || '';
          if (!fieldVal) continue;

          let fieldScore;

          // Exact match bonus
          if (normQuery && fieldVal === normQuery) fieldScore = 1;
          // Contains bonus
          else if (normQuery && fieldVal.includes(normQuery)) fieldScore = 0.85;
          else {
            // Per-term scoring
            const termScores = terms.map((term) => {
              if (fieldVal.includes(term)) return 0.75;
              return trigramSimilarity(fieldVal, term) * 0.9;
            });

            if (operator === 'AND') {
              fieldScore = termScores.every((s) => s >= threshold)
                ? termScores.reduce((a, b) => a + b, 0) / termScores.length
                : 0;
            } else {
              // OR
              fieldScore = Math.max(...termScores);
            }
          }

          fieldScores[field] = fieldScore;
          score = Math.max(score, fieldScore);
        }

        if (score < threshold) return null;

        // Highlights
        const highlights = doHighlight
          ? this._fields.reduce((acc, f) => {
              acc[f] = highlight(String(entry.item[f] || ''), normQuery);
              return acc;
            }, {})
          : {};

        return { item: entry.item, score: +score.toFixed(4), fieldScores, highlights };
      })
      .filter(Boolean);

    // Sort by score descending
    results.sort((a, b) => b.score - a.score);

    // Apply limit
    return results.slice(0, limit);
  }

  /**
   * getAll() — return all indexed items.
   */
  getAll() {
    return this._index.map((e) => e.item);
  }

  /** Clear the index */
  clear() {
    this._index = [];
    this._fields = [];
  }
}

export default SearchEngine;
