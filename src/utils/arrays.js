// arrays.js — array manipulation utilities

export const unique     = (arr, key) => key ? [...new Map(arr.map(i => [i[key], i])).values()] : [...new Set(arr)];
export const groupBy    = (arr, key) => arr.reduce((g, i) => { const k = typeof key === 'function' ? key(i) : i[key]; (g[k] = g[k] || []).push(i); return g; }, {});
export const sortBy     = (arr, key, dir = 'asc') => [...arr].sort((a, b) => { const va = a[key], vb = b[key]; return dir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1); });
export const chunk      = (arr, size) => arr.reduce((res, _, i) => i % size ? res : [...res, arr.slice(i, i + size)], []);
export const flatten    = (arr, depth = 1) => arr.flat(depth);
export const compact    = arr => arr.filter(Boolean);
export const difference = (a, b) => a.filter(i => !b.includes(i));
export const intersection = (a, b) => a.filter(i => b.includes(i));
export const union      = (a, b) => unique([...a, ...b]);
export const shuffle    = arr => [...arr].sort(() => Math.random() - 0.5);
export const sample     = (arr, n = 1) => shuffle(arr).slice(0, n);
export const zip        = (...arrs) => Array.from({ length: Math.min(...arrs.map(a => a.length)) }, (_, i) => arrs.map(a => a[i]));
export const sum        = (arr, key) => arr.reduce((s, i) => s + (key ? (i[key] || 0) : i), 0);
export const avg        = (arr, key) => arr.length ? sum(arr, key) / arr.length : 0;
export const min        = (arr, key) => key ? Math.min(...arr.map(i => i[key])) : Math.min(...arr);
export const max        = (arr, key) => key ? Math.max(...arr.map(i => i[key])) : Math.max(...arr);
export const last       = arr => arr[arr.length - 1];
export const first      = arr => arr[0];
export const range      = (start, end, step = 1) => Array.from({ length: Math.ceil((end - start) / step) }, (_, i) => start + i * step);
export const count      = (arr, pred) => arr.filter(pred).length;
export const partition  = (arr, pred) => [arr.filter(pred), arr.filter(i => !pred(i))];
export const move       = (arr, from, to) => { const a = [...arr]; a.splice(to, 0, a.splice(from, 1)[0]); return a; };
