// strings.js — string manipulation utilities

export const capitalize   = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
export const titleCase    = s => (s || '').replace(/\w\S*/g, w => capitalize(w.toLowerCase()));
export const camelToTitle = s => (s || '').replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase()).trim();
export const slugify      = s => (s || '').toLowerCase().trim().replace(/[^\w\s-]/g,'').replace(/[\s_]+/g,'-').replace(/^-+|-+$/g,'');
export const stripHtml    = s => (s || '').replace(/<[^>]*>/g, '');
export const escapeHtml   = s => (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
export const countWords   = s => (s || '').trim().split(/\s+/).filter(Boolean).length;
export const randomId     = (len = 8) => Math.random().toString(36).slice(2, 2 + len);
export const truncateMiddle = (s, max = 20) => {
  if (!s || s.length <= max) return s || '';
  const h = Math.floor(max / 2);
  return s.slice(0, h) + '…' + s.slice(-h);
};
export const extractVariables = text => [...new Set((text || '').match(/\{\{([^}]+)\}\}/g)?.map(m => m.slice(2,-2).trim()) || [])];
export const interpolate = (template, vars) => template.replace(/\{\{([^}]+)\}\}/g, (_, k) => vars[k.trim()] ?? `{{${k}}}`);
export const padStart    = (str, len, ch = ' ') => String(str).padStart(len, ch);
export const padEnd      = (str, len, ch = ' ') => String(str).padEnd(len, ch);
export const repeat      = (str, n) => str.repeat(n);
export const reverseStr  = s => (s || '').split('').reverse().join('');
export const countOccurrences = (str, sub) => str.split(sub).length - 1;
