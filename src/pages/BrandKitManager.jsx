import { useState, useEffect, useRef } from 'react';

// ─── CSS VARIABLES ────────────────────────────────────────────────────────────
const C = {
  gold: '#f5b731',
  teal: '#22d3ee',
  purple: '#a78bfa',
  surface: '#0e0e16',
  surface2: '#16161e',
  surface3: '#1d1d28',
  border: 'rgba(255,255,255,0.07)',
  muted: '#6e7191',
  red: '#ef4444',
  green: '#22c55e',
  text: '#e2e8f0',
  white: '#ffffff',
};

// ─── STATIC DATA ──────────────────────────────────────────────────────────────
const INITIAL_KITS = [
  {
    id: 1, name: 'Main Brand', updated: 'May 28, 2026',
    colors: ['#f5b731', '#22d3ee', '#a78bfa', '#0e0e16', '#e2e8f0'],
    headingFont: 'Syne', bodyFont: 'DM Mono',
  },
  {
    id: 2, name: 'Dark Mode Kit', updated: 'May 20, 2026',
    colors: ['#1e1e2e', '#cba6f7', '#89b4fa', '#11111b', '#cdd6f4'],
    headingFont: 'Outfit', bodyFont: 'Inter',
  },
  {
    id: 3, name: 'Minimalist Kit', updated: 'May 10, 2026',
    colors: ['#ffffff', '#000000', '#e5e5e5', '#fafafa', '#374151'],
    headingFont: 'Inter', bodyFont: 'Roboto',
  },
];

const DEFAULT_PALETTE = [
  { name: 'Primary', hex: '#f5b731' },
  { name: 'Secondary', hex: '#22d3ee' },
  { name: 'Accent', hex: '#a78bfa' },
  { name: 'Surface', hex: '#16161e' },
  { name: 'Text', hex: '#e2e8f0' },
  { name: 'Muted', hex: '#6e7191' },
  { name: 'Success', hex: '#22c55e' },
  { name: 'Error', hex: '#ef4444' },
];

const LOGO_VARIANTS = [
  { id: 1, name: 'Primary Logo', icon: '🔷', dims: '400×120px', format: 'SVG' },
  { id: 2, name: 'Dark BG', icon: '⬛', dims: '400×120px', format: 'SVG' },
  { id: 3, name: 'Light BG', icon: '⬜', dims: '400×120px', format: 'PNG' },
  { id: 4, name: 'Icon Only', icon: '🔵', dims: '128×128px', format: 'SVG' },
  { id: 5, name: 'Horizontal', icon: '↔️', dims: '560×80px', format: 'PNG' },
  { id: 6, name: 'Stacked', icon: '🗂️', dims: '200×200px', format: 'SVG' },
];

const VOICE_PILLARS = [
  {
    id: 1, icon: '💪', name: 'Bold', color: C.gold,
    description: 'We speak with confidence. Direct, assertive, and unapologetic about our vision.',
    dos: ['Use declarative statements', 'Lead with the point'],
    donts: ['Use wishy-washy qualifiers', 'Over-hedge every claim'],
  },
  {
    id: 2, icon: '🚀', name: 'Innovative', color: C.teal,
    description: 'We push boundaries. Our language reflects cutting-edge thinking and forward momentum.',
    dos: ['Reference emerging tech clearly', 'Frame features as breakthroughs'],
    donts: ['Use outdated jargon', 'Sound like a corporate brochure'],
  },
  {
    id: 3, icon: '🤝', name: 'Accessible', color: C.purple,
    description: 'Complex ideas in plain language. We never talk down, but we always explain.',
    dos: ['Use analogies for complex topics', 'Write for a smart generalist'],
    donts: ['Acronym-dump without context', 'Assume domain expertise'],
  },
  {
    id: 4, icon: '🛡️', name: 'Trustworthy', color: C.green,
    description: 'Every claim is earned. We show receipts, cite data, and own our mistakes.',
    dos: ['Back claims with metrics', 'Acknowledge limitations honestly'],
    donts: ['Make unverifiable claims', 'Use dark patterns or bait'],
  },
];

const FONT_OPTIONS = ['Inter', 'Syne', 'DM Mono', 'Outfit', 'Roboto', 'Poppins'];
const WEIGHT_OPTIONS = [300, 400, 500, 600, 700, 800];

const TYPE_SCALE = [
  { label: 'H1', size: 48, weight: 800 },
  { label: 'H2', size: 36, weight: 700 },
  { label: 'H3', size: 28, weight: 700 },
  { label: 'H4', size: 22, weight: 600 },
  { label: 'H5', size: 18, weight: 600 },
  { label: 'H6', size: 15, weight: 600 },
  { label: 'Body', size: 15, weight: 400 },
  { label: 'Caption', size: 12, weight: 400 },
];

const CSS_EXPORT = (palette) => `:root {
${palette.map((p) => `  --color-${p.name.toLowerCase()}: ${p.hex};`).join('\n')}
}`;

const JSON_EXPORT = (palette) => JSON.stringify(
  Object.fromEntries(palette.map((p) => [p.name.toLowerCase(), { value: p.hex, type: 'color' }])),
  null, 2
);

const TAILWIND_EXPORT = (palette) => `/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
${palette.map((p) => `        ${p.name.toLowerCase()}: '${p.hex}',`).join('\n')}
      },
    },
  },
};`;

// ─── SUB-COMPONENTS (module scope) ────────────────────────────────────────────

function HeroBadge({ value, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: C.surface3, border: `1px solid ${C.border}`, borderRadius: 20, padding: '6px 14px' }}>
      <span style={{ color: C.gold, fontWeight: 700, fontSize: 15 }}>{value}</span>
      <span style={{ color: C.muted, fontSize: 13 }}>{label}</span>
    </div>
  );
}

function KitCard({ kit, isActive, onClick, onDuplicate, onDelete }) {
  return (
    <div
      onClick={() => onClick(kit.id)}
      style={{ background: C.surface2, border: `1px solid ${isActive ? C.gold : C.border}`, borderRadius: 14, padding: 20, cursor: 'pointer', transition: 'all 0.2s', boxShadow: isActive ? `0 0 18px ${C.gold}33` : 'none', position: 'relative' }}
    >
      {isActive && (
        <span style={{ position: 'absolute', top: 12, right: 12, background: C.gold, color: '#000', borderRadius: 6, fontSize: 10, padding: '2px 8px', fontWeight: 800, letterSpacing: 1 }}>ACTIVE</span>
      )}
      <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, color: C.white, marginBottom: 4 }}>{kit.name}</div>
      <div style={{ color: C.muted, fontSize: 11, marginBottom: 12 }}>Updated {kit.updated}</div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        {kit.colors.map((col, i) => (
          <div key={i} title={col} style={{ width: 26, height: 26, borderRadius: 8, background: col, border: `1px solid ${C.border}` }} />
        ))}
      </div>
      <div style={{ color: C.muted, fontSize: 11, marginBottom: 14 }}>
        <span style={{ color: C.teal }}>{kit.headingFont}</span> / <span style={{ color: C.purple }}>{kit.bodyFont}</span>
      </div>
      <div style={{ display: 'flex', gap: 8 }} onClick={(e) => e.stopPropagation()}>
        <button onClick={() => onDuplicate(kit)} style={{ flex: 1, background: C.surface3, border: `1px solid ${C.border}`, color: C.muted, borderRadius: 8, padding: '6px 0', cursor: 'pointer', fontSize: 11 }}>Duplicate</button>
        <button onClick={() => onDelete(kit.id)} style={{ background: `${C.red}18`, border: `1px solid ${C.red}44`, color: C.red, borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 11 }}>Delete</button>
      </div>
    </div>
  );
}

function ColorEditor({ palette, onChange }) {
  const [activeIdx, setActiveIdx] = useState(null);
  const [showCSSModal, setShowCSSModal] = useState(false);
  const [copiedCSS, setCopiedCSS] = useState(false);

  const resetToDefault = () => onChange([
    { name: 'Primary', hex: '#f5b731' },
    { name: 'Secondary', hex: '#22d3ee' },
    { name: 'Accent', hex: '#a78bfa' },
    { name: 'Surface', hex: '#16161e' },
    { name: 'Text', hex: '#e2e8f0' },
    { name: 'Muted', hex: '#6e7191' },
    { name: 'Success', hex: '#22c55e' },
    { name: 'Error', hex: '#ef4444' },
  ]);

  const updateColor = (i, hex) => {
    const next = palette.map((p, idx) => idx === i ? { ...p, hex } : p);
    onChange(next);
  };

  const copyCSS = () => {
    navigator.clipboard.writeText(CSS_EXPORT(palette)).catch(() => {});
    setCopiedCSS(true);
    setTimeout(() => setCopiedCSS(false), 1500);
  };

  return (
    <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28, marginBottom: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ color: C.white, fontFamily: 'Syne, sans-serif', fontSize: 20, margin: 0 }}>🎨 Color Palette</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={resetToDefault} style={{ background: C.surface3, border: `1px solid ${C.border}`, color: C.muted, borderRadius: 10, padding: '7px 14px', cursor: 'pointer', fontSize: 12 }}>Reset</button>
          <button onClick={() => setShowCSSModal(true)} style={{ background: `${C.teal}22`, border: `1px solid ${C.teal}55`, color: C.teal, borderRadius: 10, padding: '7px 14px', cursor: 'pointer', fontSize: 12 }}>Export CSS</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 14, marginBottom: 20 }}>
        {palette.map((p, i) => (
          <div key={p.name} style={{ textAlign: 'center' }}>
            <div
              onClick={() => setActiveIdx(activeIdx === i ? null : i)}
              style={{ width: '100%', height: 56, borderRadius: 12, background: p.hex, cursor: 'pointer', border: `2px solid ${activeIdx === i ? C.white : 'transparent'}`, transition: 'all 0.2s', marginBottom: 6, boxShadow: activeIdx === i ? `0 0 14px ${p.hex}88` : 'none' }}
            />
            {activeIdx === i && (
              <input type="color" value={p.hex} onChange={(e) => updateColor(i, e.target.value)}
                style={{ width: '100%', height: 32, border: 'none', borderRadius: 8, cursor: 'pointer', background: 'none', padding: 0, marginBottom: 4 }} />
            )}
            <div style={{ color: C.white, fontSize: 11, fontWeight: 600 }}>{p.name}</div>
            <div style={{ color: C.muted, fontSize: 10, fontFamily: 'DM Mono, monospace' }}>{p.hex}</div>
          </div>
        ))}
      </div>

      {/* Live Preview */}
      <div style={{ background: palette[3]?.hex || C.surface3, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
        <div style={{ color: palette[0]?.hex, fontSize: 18, fontWeight: 800, fontFamily: 'Syne, sans-serif', marginBottom: 6 }}>Live Preview — Brand Colors</div>
        <div style={{ color: palette[4]?.hex, fontSize: 14, marginBottom: 10 }}>This is how your palette looks in context. Typography rendered with current colors.</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[0, 1, 2, 6, 7].map((idx) => (
            <span key={idx} style={{ background: palette[idx]?.hex, color: palette[3]?.hex, borderRadius: 8, padding: '4px 12px', fontSize: 12, fontWeight: 600 }}>{palette[idx]?.name}</span>
          ))}
        </div>
      </div>

      {showCSSModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }} onClick={() => setShowCSSModal(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28, maxWidth: 520, width: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ color: C.white, margin: 0, fontFamily: 'Syne, sans-serif' }}>CSS Variables Export</h3>
              <button onClick={() => setShowCSSModal(false)} style={{ background: C.surface3, border: `1px solid ${C.border}`, color: C.muted, borderRadius: 8, padding: '4px 10px', cursor: 'pointer' }}>✕</button>
            </div>
            <pre style={{ background: C.surface3, borderRadius: 10, padding: 16, color: C.teal, fontSize: 12, fontFamily: 'DM Mono, monospace', overflowX: 'auto', margin: '0 0 14px' }}>{CSS_EXPORT(palette)}</pre>
            <button onClick={copyCSS} style={{ background: copiedCSS ? `${C.green}22` : C.gold, color: copiedCSS ? C.green : '#000', border: copiedCSS ? `1px solid ${C.green}` : 'none', borderRadius: 10, padding: '9px 20px', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
              {copiedCSS ? '✓ Copied!' : '📋 Copy to Clipboard'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TypographyPanel() {
  const [headingFont, setHeadingFont] = useState('Syne');
  const [bodyFont, setBodyFont] = useState('DM Mono');
  const [headingWeight, setHeadingWeight] = useState(700);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [lineHeight, setLineHeight] = useState(1.5);

  return (
    <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28, marginBottom: 28 }}>
      <h2 style={{ color: C.white, fontFamily: 'Syne, sans-serif', fontSize: 20, margin: '0 0 20px' }}>✍️ Typography Panel</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[['Heading Font', headingFont, setHeadingFont, C.gold], ['Body Font', bodyFont, setBodyFont, C.teal]].map(([label, val, setter, col]) => (
          <div key={label}>
            <label style={{ color: col, fontSize: 12, display: 'block', marginBottom: 6 }}>{label}</label>
            <select value={val} onChange={(e) => setter(e.target.value)}
              style={{ width: '100%', background: C.surface3, border: `1px solid ${C.border}`, borderRadius: 10, padding: '9px 12px', color: C.text, fontSize: 13, outline: 'none', cursor: 'pointer' }}>
              {FONT_OPTIONS.map((f) => <option key={f}>{f}</option>)}
            </select>
          </div>
        ))}
        <div>
          <label style={{ color: C.purple, fontSize: 12, display: 'block', marginBottom: 6 }}>Heading Weight</label>
          <select value={headingWeight} onChange={(e) => setHeadingWeight(Number(e.target.value))}
            style={{ width: '100%', background: C.surface3, border: `1px solid ${C.border}`, borderRadius: 10, padding: '9px 12px', color: C.text, fontSize: 13, outline: 'none', cursor: 'pointer' }}>
            {WEIGHT_OPTIONS.map((w) => <option key={w}>{w}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <label style={{ color: C.muted, fontSize: 12 }}>Letter Spacing</label>
            <span style={{ color: C.gold, fontSize: 12, fontFamily: 'DM Mono, monospace' }}>{letterSpacing}em</span>
          </div>
          <input type="range" min={-0.05} max={0.3} step={0.01} value={letterSpacing} onChange={(e) => setLetterSpacing(Number(e.target.value))}
            style={{ width: '100%', accentColor: C.gold }} />
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <label style={{ color: C.muted, fontSize: 12 }}>Line Height</label>
            <span style={{ color: C.teal, fontSize: 12, fontFamily: 'DM Mono, monospace' }}>{lineHeight}</span>
          </div>
          <input type="range" min={1} max={2.5} step={0.05} value={lineHeight} onChange={(e) => setLineHeight(Number(e.target.value))}
            style={{ width: '100%', accentColor: C.teal }} />
        </div>
      </div>

      {/* Scale Preview */}
      <div style={{ background: C.surface3, borderRadius: 14, padding: 24 }}>
        <div style={{ color: C.muted, fontSize: 11, marginBottom: 16 }}>TYPOGRAPHIC SPECIMEN</div>
        {TYPE_SCALE.map((t) => (
          <div key={t.label} style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 12, borderBottom: `1px solid ${C.border}`, paddingBottom: 10 }}>
            <span style={{ color: C.muted, fontSize: 10, width: 42, flexShrink: 0, fontFamily: 'DM Mono, monospace' }}>{t.label}</span>
            <span style={{
              fontFamily: t.label.startsWith('H') ? headingFont + ', sans-serif' : bodyFont + ', monospace',
              fontSize: t.size,
              fontWeight: t.label.startsWith('H') ? headingWeight : 400,
              color: C.white,
              letterSpacing: `${letterSpacing}em`,
              lineHeight: lineHeight,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              flex: 1,
            }}>
              {t.label.startsWith('H') ? 'The Quick Brown Fox' : 'The quick brown fox jumps over the lazy dog. Building the future.'}
            </span>
            <span style={{ color: C.muted, fontSize: 10, fontFamily: 'DM Mono, monospace', flexShrink: 0 }}>{t.size}px / {t.weight || headingWeight}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LogoAssetManager() {
  const [hoveredId, setHoveredId] = useState(null);
  const fileInputRef = useRef(null);

  return (
    <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28, marginBottom: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ color: C.white, fontFamily: 'Syne, sans-serif', fontSize: 20, margin: 0 }}>🖼️ Logo Asset Manager</h2>
        <button onClick={() => fileInputRef.current?.click()} style={{ background: `${C.purple}22`, border: `1px solid ${C.purple}55`, color: C.purple, borderRadius: 10, padding: '7px 16px', cursor: 'pointer', fontSize: 13 }}>
          + Upload Variant
        </button>
        <input ref={fileInputRef} type="file" accept="image/*,.svg" style={{ display: 'none' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
        {LOGO_VARIANTS.map((logo) => (
          <div
            key={logo.id}
            onMouseEnter={() => setHoveredId(logo.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{ background: C.surface3, border: `1px solid ${hoveredId === logo.id ? C.teal : C.border}`, borderRadius: 12, padding: 16, transition: 'all 0.2s', position: 'relative' }}
          >
            <div style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.surface2, borderRadius: 10, marginBottom: 12, fontSize: 36, transition: 'transform 0.2s', transform: hoveredId === logo.id ? 'scale(1.05)' : 'scale(1)' }}>
              {logo.icon}
            </div>
            <div style={{ color: C.white, fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{logo.name}</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <span style={{ background: C.surface2, color: C.muted, borderRadius: 6, fontSize: 10, padding: '2px 8px' }}>{logo.dims}</span>
              <span style={{ background: `${C.teal}18`, color: C.teal, borderRadius: 6, fontSize: 10, padding: '2px 8px' }}>{logo.format}</span>
            </div>
            <button style={{ width: '100%', background: hoveredId === logo.id ? `${C.teal}22` : C.surface2, border: `1px solid ${hoveredId === logo.id ? C.teal : C.border}`, color: hoveredId === logo.id ? C.teal : C.muted, borderRadius: 8, padding: '7px 0', cursor: 'pointer', fontSize: 12, transition: 'all 0.2s' }}>
              ⬇ Download {logo.format}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function BrandVoiceGuide() {
  const [expanded, setExpanded] = useState({});

  const toggle = (id) => setExpanded((e) => ({ ...e, [id]: !e[id] }));

  return (
    <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28, marginBottom: 28 }}>
      <h2 style={{ color: C.white, fontFamily: 'Syne, sans-serif', fontSize: 20, margin: '0 0 20px' }}>🗣️ Brand Voice Guide</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
        {VOICE_PILLARS.map((p) => (
          <div key={p.id} style={{ background: C.surface3, border: `1px solid ${expanded[p.id] ? p.color : C.border}`, borderRadius: 14, overflow: 'hidden', transition: 'border-color 0.2s' }}>
            <div onClick={() => toggle(p.id)} style={{ padding: '16px 18px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 22 }}>{p.icon}</span>
                <span style={{ color: p.color, fontWeight: 700, fontSize: 15, fontFamily: 'Syne, sans-serif' }}>{p.name}</span>
              </div>
              <span style={{ color: C.muted, fontSize: 16 }}>{expanded[p.id] ? '▲' : '▼'}</span>
            </div>
            {expanded[p.id] && (
              <div style={{ padding: '0 18px 18px' }}>
                <p style={{ color: C.muted, fontSize: 13, marginTop: 0, marginBottom: 14, lineHeight: 1.6 }}>{p.description}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div style={{ background: `${C.green}14`, border: `1px solid ${C.green}33`, borderRadius: 10, padding: 12 }}>
                    <div style={{ color: C.green, fontSize: 11, fontWeight: 700, marginBottom: 8 }}>✓ DO</div>
                    {p.dos.map((d) => <div key={d} style={{ color: C.text, fontSize: 12, marginBottom: 4, lineHeight: 1.5 }}>• {d}</div>)}
                  </div>
                  <div style={{ background: `${C.red}14`, border: `1px solid ${C.red}33`, borderRadius: 10, padding: 12 }}>
                    <div style={{ color: C.red, fontSize: 11, fontWeight: 700, marginBottom: 8 }}>✕ DON'T</div>
                    {p.donts.map((d) => <div key={d} style={{ color: C.text, fontSize: 12, marginBottom: 4, lineHeight: 1.5 }}>• {d}</div>)}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ExportHub({ palette }) {
  const [activeExport, setActiveExport] = useState(null);
  const [copied, setCopied] = useState({});

  const exports = [
    { id: 'css', label: '🎨 CSS Variables', ext: '.css', color: C.teal, code: () => CSS_EXPORT(palette) },
    { id: 'json', label: '📦 Design Tokens (JSON)', ext: '.json', color: C.purple, code: () => JSON_EXPORT(palette) },
    { id: 'tailwind', label: '💨 Tailwind Config', ext: '.js', color: C.gold, code: () => TAILWIND_EXPORT(palette) },
  ];

  const copyCode = (id, code) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied((c) => ({ ...c, [id]: true }));
    setTimeout(() => setCopied((c) => ({ ...c, [id]: false })), 1500);
  };

  const simulateDownload = (id, ext) => {
    const ex = exports.find((e) => e.id === id);
    const code = ex.code();
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `brand-kit${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28, marginBottom: 28 }}>
      <h2 style={{ color: C.white, fontFamily: 'Syne, sans-serif', fontSize: 20, margin: '0 0 20px' }}>🚀 Export Hub</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {exports.map((ex) => {
          const code = ex.code();
          const open = activeExport === ex.id;
          return (
            <div key={ex.id} style={{ background: C.surface3, border: `1px solid ${open ? ex.color : C.border}`, borderRadius: 14, overflow: 'hidden', transition: 'border-color 0.2s' }}>
              <div style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                <div onClick={() => setActiveExport(open ? null : ex.id)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: ex.color, fontWeight: 700, fontSize: 14 }}>{ex.label}</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => setActiveExport(open ? null : ex.id)} style={{ background: `${ex.color}18`, border: `1px solid ${ex.color}44`, color: ex.color, borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 12 }}>
                    {open ? 'Hide Preview' : 'Preview'}
                  </button>
                  <button onClick={() => copyCode(ex.id, code)} style={{ background: copied[ex.id] ? `${C.green}22` : C.surface2, border: `1px solid ${copied[ex.id] ? C.green : C.border}`, color: copied[ex.id] ? C.green : C.muted, borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 12 }}>
                    {copied[ex.id] ? '✓ Copied' : '📋 Copy'}
                  </button>
                  <button onClick={() => simulateDownload(ex.id, ex.ext)} style={{ background: ex.color, color: '#000', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontWeight: 700, fontSize: 12 }}>
                    ⬇ Download
                  </button>
                </div>
              </div>
              {open && (
                <div style={{ borderTop: `1px solid ${C.border}`, padding: '0 18px 18px' }}>
                  <pre style={{ background: C.surface, borderRadius: 10, padding: 16, color: ex.color, fontSize: 11, fontFamily: 'DM Mono, monospace', overflowX: 'auto', margin: '14px 0 0' }}>
                    {code}
                  </pre>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function BrandKitManager() {
  const [kits, setKits] = useState(INITIAL_KITS);
  const [activeKitId, setActiveKitId] = useState(1);
  const [palette, setPalette] = useState(DEFAULT_PALETTE);
  const [showNewKitModal, setShowNewKitModal] = useState(false);
  const [newKitName, setNewKitName] = useState('');
  const [scanOffset, setScanOffset] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setScanOffset((o) => (o + 1) % 200), 30);
    return () => clearInterval(id);
  }, []);

  const duplicateKit = (kit) => {
    setKits((prev) => [...prev, { ...kit, id: Date.now(), name: `${kit.name} (Copy)`, updated: 'Just now' }]);
  };

  const deleteKit = (id) => {
    setKits((prev) => prev.filter((k) => k.id !== id));
    if (activeKitId === id && kits.length > 1) setActiveKitId(kits.find((k) => k.id !== id)?.id || null);
  };

  const createKit = () => {
    if (!newKitName.trim()) return;
    const kit = {
      id: Date.now(),
      name: newKitName.trim(),
      updated: 'Just now',
      colors: ['#f5b731', '#22d3ee', '#a78bfa', '#0e0e16', '#e2e8f0'],
      headingFont: 'Syne',
      bodyFont: 'DM Mono',
    };
    setKits((prev) => [...prev, kit]);
    setActiveKitId(kit.id);
    setNewKitName('');
    setShowNewKitModal(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: C.surface, color: C.text, fontFamily: 'DM Mono, monospace', padding: '0 0 60px' }}>

      {/* ── HERO ── */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${C.surface2} 0%, ${C.surface} 100%)`,
        borderBottom: `1px solid ${C.border}`,
        padding: '48px 40px 40px',
        marginBottom: 36,
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${C.gold}, ${C.purple}, transparent)`, backgroundSize: '200% 100%', backgroundPositionX: `${scanOffset}%` }} />
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 25% 60%, ${C.gold}08 0%, transparent 55%), radial-gradient(ellipse at 75% 40%, ${C.purple}08 0%, transparent 55%)`, pointerEvents: 'none' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
            <span style={{ fontSize: 36 }}>🎨</span>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 36, fontWeight: 800, background: `linear-gradient(135deg, ${C.white}, ${C.purple})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
              Brand Kit Manager
            </h1>
          </div>
          <p style={{ color: C.muted, fontSize: 15, margin: '0 0 20px' }}>Manage brand identities, design tokens, and visual guidelines in one place.</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <HeroBadge value="3" label="Kits" />
            <HeroBadge value="47" label="Assets" />
            <HeroBadge value="Live" label="Preview" />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>

        {/* ── KIT SELECTOR ── */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ color: C.white, fontFamily: 'Syne, sans-serif', fontSize: 20, margin: 0 }}>📁 Brand Kits</h2>
            <button onClick={() => setShowNewKitModal(true)} style={{ background: `linear-gradient(135deg, ${C.gold}, #d97706)`, color: '#000', border: 'none', borderRadius: 10, padding: '8px 20px', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
              + Create New Kit
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
            {kits.map((kit) => (
              <KitCard key={kit.id} kit={kit} isActive={activeKitId === kit.id} onClick={setActiveKitId} onDuplicate={duplicateKit} onDelete={deleteKit} />
            ))}
          </div>
        </div>

        {/* ── COLOR PALETTE EDITOR ── */}
        <ColorEditor palette={palette} onChange={setPalette} />

        {/* ── TYPOGRAPHY PANEL ── */}
        <TypographyPanel />

        {/* ── LOGO ASSET MANAGER ── */}
        <LogoAssetManager />

        {/* ── BRAND VOICE GUIDE ── */}
        <BrandVoiceGuide />

        {/* ── EXPORT HUB ── */}
        <ExportHub palette={palette} />
      </div>

      {/* ── CREATE KIT MODAL ── */}
      {showNewKitModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }} onClick={() => setShowNewKitModal(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 16, padding: 32, width: 380 }}>
            <h3 style={{ color: C.white, fontFamily: 'Syne, sans-serif', fontSize: 20, marginTop: 0, marginBottom: 20 }}>Create New Kit</h3>
            <label style={{ color: C.muted, fontSize: 12, display: 'block', marginBottom: 6 }}>Kit Name</label>
            <input
              autoFocus
              placeholder="e.g. Campaign 2026"
              value={newKitName}
              onChange={(e) => setNewKitName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && createKit()}
              style={{ width: '100%', background: C.surface3, border: `1px solid ${C.border}`, borderRadius: 10, padding: '10px 14px', color: C.text, fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 20 }}
            />
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowNewKitModal(false)} style={{ flex: 1, background: C.surface3, border: `1px solid ${C.border}`, color: C.muted, borderRadius: 10, padding: '10px', cursor: 'pointer', fontSize: 13 }}>Cancel</button>
              <button onClick={createKit} style={{ flex: 2, background: `linear-gradient(135deg, ${C.gold}, #d97706)`, color: '#000', border: 'none', borderRadius: 10, padding: '10px', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>Create Kit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
