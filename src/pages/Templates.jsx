import { useState, useMemo } from 'react';

const CATEGORIES = ['All', 'Web', 'Mobile', 'API', 'UI', 'Debug', 'General'];

const CAT_COLORS = {
  Web: '#3b82f6', Mobile: '#10b981', API: '#f59e0b',
  UI: '#ec4899', Debug: '#f43f5e', General: '#8b5cf6',
};

const INIT_TEMPLATES = [
  { id: 1, title: 'REST API Scaffolding', category: 'API', uses: 312, stars: true, prompt: 'Create a production-ready REST API in Node.js with Express. Include authentication middleware, rate limiting, request validation with Zod, error handling, and OpenAPI documentation. Use TypeScript throughout.' },
  { id: 2, title: 'React Dashboard Component', category: 'Web', uses: 289, stars: false, prompt: 'Build a responsive analytics dashboard React component. Include a KPI stats row, a line chart using Recharts, a data table with sorting and pagination, and a date range filter. Use dark theme CSS variables.' },
  { id: 3, title: 'React Native Auth Flow', category: 'Mobile', uses: 178, stars: true, prompt: 'Scaffold a complete React Native authentication flow with Login, Register, and Forgot Password screens. Use AsyncStorage for token persistence, Zod for form validation, and NativeWind for styling.' },
  { id: 4, title: 'Debug: Memory Leak Finder', category: 'Debug', uses: 134, stars: false, prompt: 'Analyze the following JavaScript code for memory leaks. Identify uncleaned event listeners, unresolved promises, detached DOM nodes, and circular references. Suggest fixes for each issue found.' },
  { id: 5, title: 'Design System Tokens', category: 'UI', uses: 201, stars: true, prompt: 'Generate a complete CSS design token system for a dark-theme SaaS product. Include color scales, typography tokens (font families, sizes, weights), spacing scale, border radius, shadow levels, and animation durations.' },
  { id: 6, title: 'GraphQL Schema Generator', category: 'API', uses: 95, stars: false, prompt: 'Design a GraphQL schema for a multi-tenant SaaS application. Include User, Organization, Role, Permission, and AuditLog types. Add mutations for all CRUD operations and subscriptions for real-time updates.' },
  { id: 7, title: 'Mobile Bottom Sheet', category: 'Mobile', uses: 67, stars: false, prompt: 'Build a swipeable bottom sheet component for React Native using Reanimated 3 and Gesture Handler. Support snap points, backdrop blur, dismissal on swipe-down, and keyboard avoidance.' },
  { id: 8, title: 'Landing Page Hero', category: 'Web', uses: 445, stars: true, prompt: 'Create a stunning SaaS landing page hero section with animated gradient background, headline, sub-headline, CTA buttons, a product screenshot mockup, and social proof logos. Fully responsive with Tailwind.' },
  { id: 9, title: 'General Code Review', category: 'General', uses: 520, stars: true, prompt: 'Review the following code for correctness, performance, security vulnerabilities, readability, and adherence to SOLID principles. Provide specific, actionable suggestions with code examples for each issue.' },
  { id: 10, title: 'Debug: API Error Trace', category: 'Debug', uses: 88, stars: false, prompt: 'I am receiving the following API error. Diagnose the root cause, explain what each part of the error means, and provide a step-by-step fix. Also suggest defensive coding patterns to prevent this class of error.' },
  { id: 11, title: 'UI Component Audit', category: 'UI', uses: 113, stars: false, prompt: 'Audit the following UI component for accessibility (WCAG 2.1 AA), keyboard navigation, screen reader compatibility, color contrast ratios, and focus management. Provide a remediation checklist.' },
  { id: 12, title: 'Commit Message Generator', category: 'General', uses: 670, stars: true, prompt: 'Generate a conventional commit message for the following git diff. Follow the Conventional Commits specification. Include a type, optional scope, concise description, and detailed body if the change is complex.' },
];

function TemplateCard({ t, onPreview, onToggleStar, onUse, onCopy }) {
  const s = {
    card: { background: 'var(--surface,#131720)', border: '1px solid #1e293b', borderRadius: 14, padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', cursor: 'pointer', transition: 'border-color 0.2s, transform 0.15s', ':hover': {} },
    head: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
    cat: { fontSize: '0.68rem', padding: '2px 8px', borderRadius: 4, background: `${CAT_COLORS[t.category] || '#8b5cf6'}22`, color: CAT_COLORS[t.category] || '#8b5cf6', border: `1px solid ${CAT_COLORS[t.category] || '#8b5cf6'}44` },
    star: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, lineHeight: 1 },
    title: { fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: '#e2e8f0' },
    preview: { fontSize: '0.75rem', color: '#64748b', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
    footer: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginTop: 'auto' },
    uses: { fontSize: '0.7rem', color: '#475569' },
    actions: { display: 'flex', gap: '0.4rem' },
    btn: { padding: '4px 10px', borderRadius: 6, border: '1px solid #334155', background: 'transparent', color: '#64748b', cursor: 'pointer', fontSize: '0.72rem', fontFamily: 'DM Mono, monospace', transition: 'all 0.2s' },
    useBtn: { padding: '4px 12px', borderRadius: 6, border: 'none', background: 'var(--teal,#2dd4bf)', color: '#0d0f14', cursor: 'pointer', fontSize: '0.72rem', fontFamily: 'DM Mono, monospace', fontWeight: 700 },
  };
  return (
    <div style={s.card} onMouseEnter={e => e.currentTarget.style.borderColor = '#334155'} onMouseLeave={e => e.currentTarget.style.borderColor = '#1e293b'}>
      <div style={s.head}>
        <span style={s.cat}>{t.category}</span>
        <button style={s.star} onClick={() => onToggleStar(t.id)}>{t.stars ? '⭐' : '☆'}</button>
      </div>
      <div style={s.title}>{t.title}</div>
      <div style={s.preview}>{t.prompt}</div>
      <div style={s.footer}>
        <span style={s.uses}>↗ {t.uses} uses</span>
        <div style={s.actions}>
          <button style={s.btn} onClick={() => onPreview(t)}>Preview</button>
          <button style={s.btn} onClick={() => onCopy(t.prompt)}>Copy</button>
          <button style={s.useBtn} onClick={() => onUse(t)}>Use</button>
        </div>
      </div>
    </div>
  );
}

function PreviewModal({ t, onClose, onCopy, onUse }) {
  if (!t) return null;
  const overlay = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem' };
  const box = { background: '#131720', border: '1px solid #334155', borderRadius: 18, padding: '2rem', maxWidth: 640, width: '100%', fontFamily: 'DM Mono, monospace' };
  const btn = { padding: '0.55rem 1.2rem', borderRadius: 8, border: '1px solid #334155', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontFamily: 'DM Mono, monospace', fontSize: '0.82rem' };
  return (
    <div style={overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={box}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#e2e8f0' }}>{t.title}</span>
          <button style={{ ...btn, border: 'none', fontSize: '1.1rem' }} onClick={onClose}>✕</button>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: 4, background: `${CAT_COLORS[t.category]}22`, color: CAT_COLORS[t.category], border: `1px solid ${CAT_COLORS[t.category]}44` }}>{t.category}</span>
          <span style={{ marginLeft: '0.75rem', fontSize: '0.72rem', color: '#475569' }}>↗ {t.uses} uses</span>
        </div>
        <div style={{ background: '#0d0f14', border: '1px solid #1e293b', borderRadius: 10, padding: '1rem', fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.7, whiteSpace: 'pre-wrap', marginBottom: '1.5rem' }}>{t.prompt}</div>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button style={btn} onClick={() => onCopy(t.prompt)}>Copy Prompt</button>
          <button style={{ ...btn, background: 'var(--teal,#2dd4bf)', color: '#0d0f14', border: 'none', fontWeight: 700 }} onClick={() => { onUse(t); onClose(); }}>Use in Builder</button>
        </div>
      </div>
    </div>
  );
}

export default function Templates() {
  const [templates, setTemplates] = useState(INIT_TEMPLATES);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [preview, setPreview] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newTpl, setNewTpl] = useState({ title: '', category: 'General', prompt: '' });

  const filtered = useMemo(() => {
    return templates.filter(t => {
      const matchCat = activeCategory === 'All' || t.category === activeCategory;
      const q = search.toLowerCase();
      const matchSearch = !q || t.title.toLowerCase().includes(q) || t.prompt.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [templates, activeCategory, search]);

  const starred = filtered.filter(t => t.stars);
  const unstarred = filtered.filter(t => !t.stars);

  const toggleStar = (id) => setTemplates(prev => prev.map(t => t.id === id ? { ...t, stars: !t.stars } : t));

  const copy = (prompt) => {
    navigator.clipboard.writeText(prompt).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const useTemplate = (t) => {
    console.log('Navigate to prompt builder with:', t.prompt);
  };

  const createTemplate = () => {
    if (!newTpl.title.trim() || !newTpl.prompt.trim()) return;
    setTemplates(prev => [...prev, { id: Date.now(), ...newTpl, uses: 0, stars: false }]);
    setNewTpl({ title: '', category: 'General', prompt: '' });
    setShowCreate(false);
  };

  const s = {
    page: { padding: '2rem', fontFamily: 'DM Mono, monospace', color: 'var(--fg,#e2e8f0)', background: 'var(--bg,#0d0f14)', minHeight: '100vh' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' },
    titleRow: { display: 'flex', alignItems: 'center', gap: '1rem' },
    iconBox: { width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg,#1c1433,#2d1b69)', border: '1px solid #7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 },
    title: { margin: 0, fontSize: '1.6rem', fontFamily: 'Syne, sans-serif', fontWeight: 700 },
    sub: { margin: '4px 0 0', fontSize: '0.82rem', color: '#64748b' },
    bar: { display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' },
    search: { padding: '0.55rem 1rem', borderRadius: 8, border: '1px solid #334155', background: '#1e293b', color: '#e2e8f0', fontFamily: 'DM Mono, monospace', fontSize: '0.82rem', outline: 'none', width: 220 },
    catBtn: (a) => ({ padding: '0.38rem 0.9rem', borderRadius: 20, border: `1px solid ${a ? 'var(--teal,#2dd4bf)' : '#334155'}`, background: a ? 'rgba(45,212,191,0.12)' : 'transparent', color: a ? 'var(--teal,#2dd4bf)' : '#64748b', cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'DM Mono, monospace' }),
    addBtn: { marginLeft: 'auto', padding: '0.5rem 1.2rem', borderRadius: 8, background: 'var(--teal,#2dd4bf)', color: '#0d0f14', border: 'none', cursor: 'pointer', fontFamily: 'DM Mono, monospace', fontWeight: 700, fontSize: '0.82rem' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' },
    sectionLabel: { fontSize: '0.72rem', color: '#475569', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem', marginTop: '1.5rem', paddingBottom: '0.4rem', borderBottom: '1px solid #1e293b' },
    toast: { position: 'fixed', bottom: '2rem', right: '2rem', background: '#1e293b', border: '1px solid var(--teal,#2dd4bf)', borderRadius: 10, padding: '0.75rem 1.5rem', color: 'var(--teal,#2dd4bf)', fontSize: '0.82rem', zIndex: 2000, transition: 'all 0.3s' },
    createBox: { background: '#131720', border: '1px solid #334155', borderRadius: 14, padding: '1.5rem', marginBottom: '2rem' },
    input: { width: '100%', padding: '0.6rem 0.8rem', borderRadius: 8, border: '1px solid #334155', background: '#0d0f14', color: '#e2e8f0', fontFamily: 'DM Mono, monospace', fontSize: '0.82rem', outline: 'none', boxSizing: 'border-box' },
    ta: { width: '100%', padding: '0.6rem 0.8rem', borderRadius: 8, border: '1px solid #334155', background: '#0d0f14', color: '#e2e8f0', fontFamily: 'DM Mono, monospace', fontSize: '0.82rem', outline: 'none', resize: 'vertical', minHeight: 100, boxSizing: 'border-box' },
    label: { fontSize: '0.72rem', color: '#64748b', marginBottom: '0.3rem', display: 'block', textTransform: 'uppercase', letterSpacing: '0.08em' },
    formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' },
    sel: { width: '100%', padding: '0.6rem 0.8rem', borderRadius: 8, border: '1px solid #334155', background: '#0d0f14', color: '#e2e8f0', fontFamily: 'DM Mono, monospace', fontSize: '0.82rem', outline: 'none' },
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div style={s.titleRow}>
          <div style={s.iconBox}>📋</div>
          <div>
            <h1 style={s.title}>Templates</h1>
            <p style={s.sub}>Ready-to-use prompt templates — browse, copy, and deploy</p>
          </div>
        </div>
      </div>

      <div style={s.bar}>
        <input style={s.search} placeholder="🔍 Search templates…" value={search} onChange={e => setSearch(e.target.value)} />
        {CATEGORIES.map(c => <button key={c} style={s.catBtn(activeCategory === c)} onClick={() => setActiveCategory(c)}>{c}</button>)}
        <button style={s.addBtn} onClick={() => setShowCreate(v => !v)}>{showCreate ? '✕ Cancel' : '+ New Template'}</button>
      </div>

      {showCreate && (
        <div style={s.createBox}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: '1rem', color: '#e2e8f0' }}>Create Template</div>
          <div style={s.formRow}>
            <div>
              <label style={s.label}>Title</label>
              <input style={s.input} value={newTpl.title} onChange={e => setNewTpl(p => ({ ...p, title: e.target.value }))} placeholder="Template name" />
            </div>
            <div>
              <label style={s.label}>Category</label>
              <select style={s.sel} value={newTpl.category} onChange={e => setNewTpl(p => ({ ...p, category: e.target.value }))}>
                {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={s.label}>Prompt</label>
            <textarea style={s.ta} value={newTpl.prompt} onChange={e => setNewTpl(p => ({ ...p, prompt: e.target.value }))} placeholder="Write your prompt template here…" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button style={{ ...s.addBtn }} onClick={createTemplate}>Save Template</button>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#475569' }}>
          <div style={{ fontSize: 56, marginBottom: '1rem' }}>📭</div>
          <div style={{ fontFamily: 'Syne, sans-serif', color: '#64748b', fontSize: '1.1rem' }}>No templates found</div>
          <div style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Try a different search or category</div>
        </div>
      ) : (
        <>
          {starred.length > 0 && (
            <>
              <div style={s.sectionLabel}>⭐ Starred</div>
              <div style={s.grid}>
                {starred.map(t => <TemplateCard key={t.id} t={t} onPreview={setPreview} onToggleStar={toggleStar} onUse={useTemplate} onCopy={copy} />)}
              </div>
            </>
          )}
          {unstarred.length > 0 && (
            <>
              <div style={s.sectionLabel}>All Templates</div>
              <div style={s.grid}>
                {unstarred.map(t => <TemplateCard key={t.id} t={t} onPreview={setPreview} onToggleStar={toggleStar} onUse={useTemplate} onCopy={copy} />)}
              </div>
            </>
          )}
        </>
      )}

      <PreviewModal t={preview} onClose={() => setPreview(null)} onCopy={copy} onUse={useTemplate} />
      {copied && <div style={s.toast}>✓ Copied to clipboard</div>}
    </div>
  );
}
