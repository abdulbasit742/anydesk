/**
 * Lightning-fast fuzzy search for Bolt Studio Pro prompt library.
 * Scores matches by: exact match > word start > contains > fuzzy
 */
export function fuzzyScore(text, query) {
  if (!query || !text) return 0;
  const t = text.toLowerCase();
  const q = query.toLowerCase();
  if (t === q) return 100;
  if (t.startsWith(q)) return 90;
  if (t.includes(q)) return 70;
  // Fuzzy: check if all chars of query appear in order in text
  let ti = 0, qi = 0, score = 0;
  while (ti < t.length && qi < q.length) {
    if (t[ti] === q[qi]) { score++; qi++; }
    ti++;
  }
  if (qi === q.length) return Math.round((score / t.length) * 50);
  return 0;
}

export function fuzzySearch(items, query, keys = ['title', 'prompt', 'category']) {
  if (!query || query.trim().length < 1) return items;
  const q = query.trim();
  return items
    .map(item => {
      const score = Math.max(...keys.map(k => fuzzyScore(item[k] || '', q)));
      return { item, score };
    })
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(x => x.item);
}

export function highlightMatch(text, query) {
  if (!query || !text) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    text.slice(0, idx) +
    '{{HL_START}}' + text.slice(idx, idx + query.length) + '{{HL_END}}' +
    text.slice(idx + query.length)
  );
}
