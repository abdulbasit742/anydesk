// dates.js — date utilities

export const toISO        = d => (d instanceof Date ? d : new Date(d)).toISOString();
export const fromISO      = s => new Date(s);
export const now          = () => new Date();
export const today        = () => startOfDay(new Date());

export const startOfDay   = d => { const n = new Date(d); n.setHours(0,0,0,0); return n; };
export const endOfDay     = d => { const n = new Date(d); n.setHours(23,59,59,999); return n; };
export const startOfMonth = d => { const n = new Date(d); n.setDate(1); n.setHours(0,0,0,0); return n; };
export const endOfMonth   = d => new Date(new Date(d).getFullYear(), new Date(d).getMonth()+1, 0, 23, 59, 59, 999);

export const addDays      = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };
export const addHours     = (d, n) => new Date(+new Date(d) + n * 3600000);
export const addMinutes   = (d, n) => new Date(+new Date(d) + n * 60000);
export const addSeconds   = (d, n) => new Date(+new Date(d) + n * 1000);

export const diffDays     = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000);
export const diffHours    = (a, b) => Math.round((new Date(b) - new Date(a)) / 3600000);
export const diffMs       = (a, b) => new Date(b) - new Date(a);

export const isToday      = d => startOfDay(d).getTime() === today().getTime();
export const isYesterday  = d => isToday(addDays(d, 1));
export const isPast       = d => new Date(d) < new Date();
export const isFuture     = d => new Date(d) > new Date();
export const isSameDay    = (a, b) => startOfDay(a).getTime() === startOfDay(b).getTime();

export const getDayName   = (d, short = false) => new Date(d).toLocaleDateString('en-US', { weekday: short ? 'short' : 'long' });
export const getMonthName = (d, short = false) => new Date(d).toLocaleDateString('en-US', { month: short ? 'short' : 'long' });
export const getWeekDays  = (short = false) => ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d,i) => short ? d : ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][i]);

export const formatForDisplay = (d, fmt = 'medium') => {
  const date = new Date(d);
  if (fmt === 'short')  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  if (fmt === 'medium') return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  if (fmt === 'long')   return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  if (fmt === 'time')   return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  return date.toISOString();
};

export const parseRelative = (str) => {
  const [n, unit] = str.trim().split(/\s+/);
  const num = parseInt(n);
  if (unit.startsWith('min')) return addMinutes(new Date(), -num);
  if (unit.startsWith('hour')) return addHours(new Date(), -num);
  if (unit.startsWith('day')) return addDays(new Date(), -num);
  return new Date();
};
