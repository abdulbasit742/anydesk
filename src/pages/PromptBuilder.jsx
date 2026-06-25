import { useState, useRef, useCallback, useMemo } from 'react';
import { useStore } from '../data/store';
import { PLATFORMS } from '../data/constants';
import { useToast } from '../components/Toast';
import { sound } from '../lib/soundEngine';
import { PromptOptimizer } from '../components/library/PromptOptimizer';
import { classifyPrompt } from '../lib/smartRouter';

/* ── Token / char estimation ─────────────────────────────── */
function estimateTokens(text) {
  return Math.ceil(text.trim().split(/\s+/).filter(Boolean).length * 1.35);
}

/* ── Variable scanner ────────────────────────────────────── */
function scanVars(text) {
  const matches = [...text.matchAll(/\{\{([^}]+)\}\}/g)];
  return [...new Set(matches.map(m => m[1].trim()))];
}

function injectVars(text, vars) {
  return text.replace(/\{\{([^}]+)\}\}/g, (_, key) => vars[key.trim()] || `{{${key.trim()}}}`);
}

/* ── Block type registry ─────────────────────────────────── */
const BLOCK_TYPES = [
  { id: 'role',        label: '🎭 Role',        color: 'var(--purple)', placeholder: 'You are a senior React developer with 10 years of experience...' },
  { id: 'context',     label: '📋 Context',     color: 'var(--blue)',   placeholder: 'The project is a multi-platform AI dashboard built with React + Vite...' },
  { id: 'task',        label: '🎯 Task',         color: 'var(--gold)',   placeholder: 'Your task is to implement a dark mode toggle...' },
  { id: 'steps',       label: '📝 Steps',        color: 'var(--teal)',   placeholder: '1. First, analyze the existing CSS variables\n2. Add a theme toggle button\n3. Switch between light and dark palettes' },
  { id: 'format',      label: '📐 Format',       color: 'var(--cyan)',   placeholder: 'Respond with complete, production-ready code. No explanations unless asked.' },
  { id: 'constraints', label: '⚠️ Constraints',  color: 'var(--red)',    placeholder: '- Do NOT use Tailwind CSS\n- Keep all styles in index.css\n- Preserve existing comments' },
  { id: 'examples',    label: '💡 Examples',     color: '#22c55e',       placeholder: 'Example input: "Add loading spinner"\nExample output: <Spinner className="btn-spinner" />' },
  { id: 'custom',      label: '✏️ Custom',        color: 'var(--muted2)', placeholder: 'Add any additional instructions here...' },
];

/* ── Block Templates ─────────────────────────────────────── */
const TEMPLATES = [
  {
    name: 'Full-Stack Feature Build',
    emoji: '⚡',
    desc: 'Build a complete feature end-to-end',
    blocks: [
      { type: 'role',        content: 'You are an expert full-stack React developer. You write clean, production-ready code.' },
      { type: 'context',     content: 'The project is {{projectName}}, a React + Vite application. Styling is done with vanilla CSS using design tokens in index.css.' },
      { type: 'task',        content: 'Build a {{featureName}} feature that {{featureDescription}}.' },
      { type: 'format',      content: 'Provide complete, working code. Include all necessary files. Do not leave placeholders.' },
      { type: 'constraints', content: '- No Tailwind CSS\n- Use existing CSS variables\n- Match the existing dark theme\n- Add proper error handling' },
    ],
  },
  {
    name: 'Bug Fix & Debug',
    emoji: '🐛',
    desc: 'Diagnose and fix a specific bug',
    blocks: [
      { type: 'role',    content: 'You are a senior debugging expert. You diagnose issues systematically and fix them completely.' },
      { type: 'context', content: 'The bug occurs in {{component}}. The error message is: {{errorMessage}}' },
      { type: 'task',    content: 'Find and fix the root cause of the bug. Ensure the fix does not break other functionality.' },
      { type: 'steps',   content: '1. Identify the root cause\n2. Propose a fix\n3. Implement the fix with complete code\n4. Add a comment explaining what was wrong' },
      { type: 'format',  content: 'Show the complete fixed file, not just the changed lines.' },
    ],
  },
  {
    name: 'UI Polish & Enhancement',
    emoji: '✨',
    desc: 'Improve visual design and UX',
    blocks: [
      { type: 'role',        content: 'You are a world-class UI/UX designer and frontend developer. You create stunning, modern interfaces.' },
      { type: 'task',        content: 'Enhance the {{component}} component with premium UI improvements.' },
      { type: 'steps',       content: '1. Add smooth hover animations\n2. Improve spacing and typography\n3. Add glassmorphism or gradient effects\n4. Make it fully responsive' },
      { type: 'constraints', content: '- Dark theme only\n- Use CSS variables for colors\n- Add micro-animations (transitions < 300ms)\n- Ensure accessibility (contrast ratios)' },
    ],
  },
  {
    name: 'API Integration',
    emoji: '🔗',
    desc: 'Connect to an external API',
    blocks: [
      { type: 'role',    content: 'You are a backend integration specialist. You write robust, well-error-handled API integrations.' },
      { type: 'context', content: 'We need to integrate with the {{apiName}} API. Base URL: {{baseUrl}}. Auth: {{authMethod}}.' },
      { type: 'task',    content: 'Create a complete API client with:\n- Request/response types\n- Error handling\n- Rate limiting awareness\n- Retry logic' },
      { type: 'format',  content: 'Provide a complete service file with all methods. Add JSDoc comments for each function.' },
    ],
  },
  {
    name: 'Mobile Responsive Fix',
    emoji: '📱',
    desc: 'Fix responsive layout issues',
    blocks: [
      { type: 'role',    content: 'You are a responsive design expert. You make apps look perfect on every screen size.' },
      { type: 'task',    content: 'Make the {{component}} fully responsive. It must work on mobile (320px), tablet (768px), and desktop (1440px).' },
      { type: 'steps',   content: '1. Identify layout breakpoints\n2. Use CSS Grid/Flexbox appropriately\n3. Add media queries\n4. Test edge cases (very small screens)' },
      { type: 'format',  content: 'Update the CSS file with proper responsive rules. Use mobile-first approach.' },
    ],
  },
];

/* ── Block Editor component ──────────────────────────────── */
function BlockEditor({ block, onUpdate, onDelete, onMoveUp, onMoveDown, isFirst, isLast }) {
  const bt = BLOCK_TYPES.find(b => b.id === block.type) || BLOCK_TYPES[BLOCK_TYPES.length - 1];
  const vars = scanVars(block.content);
  const [collapsed, setCollapsed] = useState(false);
  const textRef = useRef(null);

  const autoResize = () => {
    const el = textRef.current;
    if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; }
  };

  return (
    <div style={{
      background: 'var(--surface2)',
      border: `1px solid var(--border)`,
      borderLeft: `3px solid ${bt.color}`,
      borderRadius: 12,
      overflow: 'hidden',
      transition: 'box-shadow 0.2s',
      animation: 'fadeIn 0.2s ease',
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = `0 4px 20px rgba(0,0,0,0.3)`}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      {/* Block header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 14px',
        background: 'rgba(0,0,0,0.15)',
        cursor: 'pointer',
        userSelect: 'none',
      }} onClick={() => setCollapsed(c => !c)}>
        <span style={{ fontSize: 11, fontWeight: 800, color: bt.color, letterSpacing: '0.03em', flex: 1 }}>
          {bt.label}
        </span>
        {vars.length > 0 && (
          <div style={{ display: 'flex', gap: 4 }}>
            {vars.map(v => (
              <span key={v} style={{
                fontSize: 8.5, padding: '1px 6px', borderRadius: 4,
                background: `${bt.color}22`, color: bt.color,
                border: `1px solid ${bt.color}44`,
                fontFamily: 'DM Mono,monospace',
              }}>
                {'{{'}{v}{'}}'}
              </span>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', gap: 4 }} onClick={e => e.stopPropagation()}>
          <button className="btn btn-ghost btn-xs" onClick={onMoveUp}  disabled={isFirst}  style={{ padding: '2px 6px', fontSize: 11 }}>↑</button>
          <button className="btn btn-ghost btn-xs" onClick={onMoveDown} disabled={isLast}  style={{ padding: '2px 6px', fontSize: 11 }}>↓</button>
          <button className="btn btn-ghost btn-xs" onClick={onDelete}  style={{ padding: '2px 6px', fontSize: 11, color: 'var(--red)' }}>✕</button>
        </div>
        <span style={{ fontSize: 10, color: 'var(--muted)', userSelect: 'none' }}>{collapsed ? '▶' : '▼'}</span>
      </div>

      {/* Block textarea */}
      {!collapsed && (
        <div style={{ padding: '0 14px 12px' }}>
          <textarea
            ref={textRef}
            value={block.content}
            onChange={e => { onUpdate(e.target.value); autoResize(); }}
            onInput={autoResize}
            placeholder={bt.placeholder}
            style={{
              width: '100%', boxSizing: 'border-box',
              background: 'transparent', border: 'none', outline: 'none',
              color: '#dde0f0', fontSize: 12.5, fontFamily: 'DM Mono,monospace',
              lineHeight: 1.7, resize: 'none', paddingTop: 10,
              minHeight: 72,
            }}
            rows={4}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--muted)' }}>
            <span>{block.content.length} chars</span>
            <span>~{estimateTokens(block.content)} tokens</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Variable Input Row ──────────────────────────────────── */
function VarRow({ name, value, onChange }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: 8, alignItems: 'center' }}>
      <div style={{
        fontSize: 10.5, color: 'var(--gold)', fontFamily: 'DM Mono,monospace',
        background: 'rgba(245,183,49,0.08)', border: '1px solid rgba(245,183,49,0.2)',
        borderRadius: 6, padding: '5px 8px', textAlign: 'center',
      }}>
        {'{{'}{name}{'}}'}
      </div>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={`Value for ${name}`}
        style={{
          background: 'var(--surface3)', border: '1px solid var(--border)',
          borderRadius: 7, padding: '5px 10px', color: '#dde0f0',
          fontSize: 11.5, fontFamily: 'DM Mono,monospace', outline: 'none',
          transition: 'border-color 0.15s',
        }}
        onFocus={e => e.target.style.borderColor = 'var(--gold)'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
      />
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────── */
let blockIdCounter = 0;
function newBlock(type = 'task', content = '') {
  return { id: ++blockIdCounter, type, content };
}

export default function PromptBuilder({ onNav }) {
  const { accounts, addPrompt, addBroadcast, updateAccount } = useStore();
  const toast = useToast();

  const [blocks, setBlocks]           = useState([newBlock('role', ''), newBlock('task', ''), newBlock('format', '')]);
  const [varValues, setVarValues]     = useState({});
  const [selectedPlatforms, setSelectedPlatforms] = useState(new Set());
  const [promptName, setPromptName]   = useState('');
  const [activeTab, setActiveTab]     = useState('build'); // 'build' | 'preview' | 'variables'
  const [isSending, setIsSending]     = useState(false);
  const [sendLog, setSendLog]         = useState([]);
  const [savedToast, setSavedToast]   = useState(false);

  const activeAccounts = useMemo(() => accounts.filter(a => a.status === 'active'), [accounts]);

  /* ── Composed prompt text ─────────────────────────────── */
  const rawPrompt = useMemo(() =>
    blocks.map(b => {
      const bt = BLOCK_TYPES.find(t => t.id === b.type);
      return `[${bt?.label?.replace(/^.+ /, '') || b.type.toUpperCase()}]\n${b.content}`;
    }).filter(s => s.split('\n').slice(1).join('\n').trim()).join('\n\n'),
    [blocks]);

  const finalPrompt = useMemo(() => injectVars(rawPrompt, varValues), [rawPrompt, varValues]);
  const routerAnalysis = useMemo(() => classifyPrompt(finalPrompt), [finalPrompt]);
  const allVars     = useMemo(() => scanVars(rawPrompt), [rawPrompt]);
  const tokenCount  = useMemo(() => estimateTokens(finalPrompt), [finalPrompt]);
  const charCount   = finalPrompt.length;
  const hasUnfilled = allVars.some(v => !varValues[v]);

  /* ── Block operations ─────────────────────────────────── */
  const addBlock = useCallback((type) => {
    setBlocks(prev => [...prev, newBlock(type)]);
  }, []);

  const updateBlock = useCallback((idx, content) => {
    setBlocks(prev => prev.map((b, i) => i === idx ? { ...b, content } : b));
  }, []);

  const deleteBlock = useCallback((idx) => {
    setBlocks(prev => prev.filter((_, i) => i !== idx));
  }, []);

  const moveBlock = useCallback((idx, dir) => {
    setBlocks(prev => {
      const next = [...prev];
      const swap = idx + dir;
      if (swap < 0 || swap >= next.length) return prev;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return next;
    });
  }, []);

  /* ── Load template ────────────────────────────────────── */
  const loadTemplate = useCallback((tpl) => {
    setBlocks(tpl.blocks.map(b => newBlock(b.type, b.content)));
    setVarValues({});
    setActiveTab('build');
  }, []);

  /* ── Save to Library ──────────────────────────────────── */
  const saveToLibrary = useCallback(() => {
    if (!finalPrompt.trim()) return;
    addPrompt({
      name: promptName || 'Prompt Builder Export',
      content: finalPrompt,
      category: 'General',
      tags: ['builder'],
    });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  }, [finalPrompt, promptName, addPrompt]);

  /* ── Broadcast ────────────────────────────────────────── */
  const handleBroadcast = useCallback(async () => {
    if (!finalPrompt.trim()) return;
    const targets = selectedPlatforms.size > 0
      ? activeAccounts.filter(a => selectedPlatforms.has(a.platform))
      : activeAccounts;
    if (targets.length === 0) return;

    setIsSending(true);
    setSendLog([]);
    setActiveTab('preview');

    let ok = 0, fail = 0;
    for (const acc of targets) {
      await new Promise(r => setTimeout(r, 350 + Math.random() * 250));
      const success = Math.random() > 0.05;
      if (success) { ok++; updateAccount(acc.id, { broadcastCount: (acc.broadcastCount || 0) + 1, lastUsed: new Date().toISOString() }); }
      else fail++;
      setSendLog(prev => [...prev, { id: acc.id, name: acc.name, platform: acc.platform, success }]);
    }

    addBroadcast({ prompt: finalPrompt, targetIds: targets.map(a => a.id), successCount: ok, failureCount: fail, total: targets.length });
    setIsSending(false);
  }, [finalPrompt, selectedPlatforms, activeAccounts, updateAccount, addBroadcast]);

  const togglePlatform = (pid) => {
    setSelectedPlatforms(prev => {
      const next = new Set(prev);
      if (next.has(pid)) next.delete(pid); else next.add(pid);
      return next;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, height: '100%' }}>

      {/* ── Header ──────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 11,
            background: 'linear-gradient(135deg,rgba(245,183,49,.18),rgba(167,139,250,.14))',
            border: '1px solid rgba(245,183,49,.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
          }}>🧱</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: '-.4px' }}>Prompt Builder</div>
            <div style={{ fontSize: 9.5, color: 'var(--muted)', fontFamily: 'DM Mono,monospace' }}>
              {blocks.length} blocks · ~{tokenCount} tokens · {charCount} chars
            </div>
          </div>
        </div>

        {/* Prompt name input */}
        <input
          value={promptName}
          onChange={e => setPromptName(e.target.value)}
          placeholder="Prompt name (optional)"
          style={{
            background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8,
            padding: '7px 12px', color: '#e4e4ed', fontSize: 12, outline: 'none', width: 220,
            transition: 'border-color 0.15s',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--gold)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />

        {/* Actions */}
        <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
          <button className="btn btn-ghost btn-sm" onClick={saveToLibrary} disabled={!finalPrompt.trim()} style={{ fontSize: 11 }}>
            {savedToast ? '✓ Saved!' : '📚 Save to Library'}
          </button>
          <button
            className={`btn btn-gold btn-sm ${isSending ? 'btn-pulse' : ''}`}
            onClick={handleBroadcast}
            disabled={isSending || !finalPrompt.trim() || activeAccounts.length === 0}
            style={{ fontSize: 11, minWidth: 130 }}
          >
            {isSending
              ? <><span className="spinner" style={{ width: 10, height: 10, borderWidth: 1.5 }} /> Sending…</>
              : `⚡ Broadcast (${selectedPlatforms.size > 0 ? [...selectedPlatforms].length + ' plat' : activeAccounts.length + ' accts'})`
            }
          </button>
        </div>
      </div>

      {/* ── Main Layout: Builder + Side Panel ─────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 14, flex: 1, alignItems: 'start' }}>

        {/* LEFT — Tab area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, padding: '3px', background: 'var(--surface2)', borderRadius: 10, border: '1px solid var(--border)', width: 'fit-content' }}>
            {[
              { id: 'build',     label: '🧱 Build' },
              { id: 'variables', label: `{{}} Variables${allVars.length > 0 ? ` (${allVars.length})` : ''}` },
              { id: 'preview',   label: '👁 Preview' },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`btn btn-xs ${activeTab === t.id ? 'btn-gold' : 'btn-ghost'}`}
                style={{ fontSize: 11 }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* ── BUILD TAB ─────────────────────────────────── */}
          {activeTab === 'build' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {blocks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--muted)', background: 'var(--surface2)', borderRadius: 14, border: '1px dashed var(--border)' }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>🧱</div>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>No blocks yet</div>
                  <div style={{ fontSize: 11, marginBottom: 16 }}>Add blocks from the panel → or load a template</div>
                </div>
              ) : (
                blocks.map((block, idx) => (
                  <BlockEditor
                    key={block.id}
                    block={block}
                    idx={idx}
                    onUpdate={val => updateBlock(idx, val)}
                    onDelete={() => deleteBlock(idx)}
                    onMoveUp={() => moveBlock(idx, -1)}
                    onMoveDown={() => moveBlock(idx, 1)}
                    isFirst={idx === 0}
                    isLast={idx === blocks.length - 1}
                  />
                ))
              )}

              {/* Add block row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '10px 0' }}>
                <span style={{ fontSize: 9.5, color: 'var(--muted)', fontWeight: 700, alignSelf: 'center', marginRight: 4 }}>+ Add block:</span>
                {BLOCK_TYPES.map(bt => (
                  <button
                    key={bt.id}
                    onClick={() => addBlock(bt.id)}
                    style={{
                      fontSize: 9.5, padding: '4px 10px', borderRadius: 7, cursor: 'pointer',
                      background: `${bt.color}12`, border: `1px solid ${bt.color}35`, color: bt.color,
                      fontWeight: 600, transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = `${bt.color}25`; }}
                    onMouseLeave={e => { e.currentTarget.style.background = `${bt.color}12`; }}
                  >
                    {bt.label}
                  </button>
                ))}
              </div>

              {/* Feature 37: Quick insert dynamic variables button panel */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '10px 0', borderTop: '1px solid var(--border)', marginTop: 8 }}>
                <span style={{ fontSize: 9.5, color: 'var(--muted)', fontWeight: 700, alignSelf: 'center', marginRight: 4 }}>{'{ }'} Quick Vars:</span>
                {['projectName', 'featureName', 'featureDescription', 'component', 'errorMessage', 'apiName', 'baseUrl'].map(vName => (
                  <button
                    key={vName}
                    onClick={() => {
                      sound.play('click');
                      if (blocks.length > 0) {
                        const lastIdx = blocks.length - 1;
                        const updatedContent = blocks[lastIdx].content + ` {{${vName}}}`;
                        updateBlock(lastIdx, updatedContent);
                        toast.success(`Inserted {{${vName}}} into Step ${lastIdx + 1}`);
                      } else {
                        toast.error('Add a block first!');
                      }
                    }}
                    style={{
                      fontSize: 9, padding: '3px 8px', borderRadius: 6, cursor: 'pointer',
                      background: 'rgba(245,183,49,0.08)', border: '1px solid rgba(245,183,49,0.2)', color: 'var(--gold)',
                      fontFamily: 'DM Mono, monospace',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,183,49,0.15)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(245,183,49,0.08)'; }}
                  >
                    {vName}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── VARIABLES TAB ─────────────────────────────── */}
          {activeTab === 'variables' && (
            <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, padding: '16px 18px' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Variable Injection</div>
              <div style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 14 }}>
                Use <code style={{ color: 'var(--gold)', fontFamily: 'DM Mono,monospace' }}>{'{{variableName}}'}</code> in your blocks. Fill in values below to preview the final prompt.
              </div>
              {allVars.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--muted)', fontSize: 11 }}>
                  No variables detected yet. Add <code style={{ fontFamily: 'DM Mono,monospace', color: 'var(--gold)' }}>{'{{variable}}'}</code> to your blocks.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {allVars.map(v => (
                    <VarRow
                      key={v}
                      name={v}
                      value={varValues[v] || ''}
                      onChange={val => setVarValues(prev => ({ ...prev, [v]: val }))}
                    />
                  ))}
                  {hasUnfilled && (
                    <div style={{ fontSize: 10, color: 'var(--gold)', padding: '8px 10px', background: 'rgba(245,183,49,0.07)', borderRadius: 8, border: '1px solid rgba(245,183,49,0.2)', marginTop: 4 }}>
                      ⚠ Some variables are unfilled — they will appear as <code style={{ fontFamily: 'DM Mono,monospace' }}>{'{{name}}'}</code> in the broadcast.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── PREVIEW TAB ───────────────────────────────── */}
          {activeTab === 'preview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Stats bar */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                  { label: 'Blocks',  val: blocks.length,  color: 'var(--purple)' },
                  { label: 'Tokens',  val: `~${tokenCount}`, color: tokenCount > 3000 ? 'var(--red)' : tokenCount > 1500 ? 'var(--gold)' : 'var(--teal)' },
                  { label: 'Chars',   val: charCount,       color: 'var(--blue)' },
                  { label: 'Variables', val: allVars.length, color: 'var(--gold)' },
                ].map(s => (
                  <div key={s.label} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 9, padding: '8px 12px', display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 16, fontWeight: 800, color: s.color }}>{s.val}</span>
                    <span style={{ fontSize: 10, color: 'var(--muted)' }}>{s.label}</span>
                  </div>
                ))}
              </div>

              {/* Final prompt */}
              <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
                <div style={{ padding: '10px 16px', background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>Final Prompt</span>
                  <button
                    className="btn btn-ghost btn-xs"
                    onClick={() => navigator.clipboard?.writeText(finalPrompt)}
                    style={{ fontSize: 10 }}
                  >
                    📋 Copy
                  </button>
                </div>
                <pre style={{
                  margin: 0, padding: '14px 18px',
                  color: '#c8d0e8', fontSize: 11.5,
                  fontFamily: 'DM Mono,monospace', lineHeight: 1.8,
                  whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                  maxHeight: 400, overflowY: 'auto',
                }}>
                  {finalPrompt || <span style={{ color: 'var(--muted)' }}>Add blocks to build your prompt…</span>}
                </pre>
              </div>

              {/* Feature 36: Live rendered component display drawer */}
              <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
                <div style={{ padding: '10px 16px', background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--teal)' }}>👁️ Live UI Component Sandbox Preview</span>
                  <span style={{ fontSize: 9.5, color: 'var(--muted)', background: 'var(--surface3)', padding: '2px 8px', borderRadius: 4 }}>Rendering Frame</span>
                </div>
                <div style={{ padding: 20, minHeight: 180, background: '#09090e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {(() => {
                    const text = rawPrompt.toLowerCase();
                    if (text.includes('dashboard') || text.includes('chart') || text.includes('crm')) {
                      return (
                        <div style={{ width: '100%', maxWidth: 360, background: 'var(--surface2)', borderRadius: 8, padding: 12, border: '1px solid var(--border)', animation: 'fadeIn 0.5s ease', textAlign: 'left' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                            <span style={{ fontSize: 11, fontWeight: 800, color: '#fff' }}>📊 Live CRM Dashboard</span>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)' }} />
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                            <div style={{ background: 'var(--surface3)', borderRadius: 6, padding: 8, textAlign: 'center' }}>
                              <div style={{ fontSize: 8, color: 'var(--muted)' }}>REVENUE</div>
                              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gold)' }}>$12,420</div>
                            </div>
                            <div style={{ background: 'var(--surface3)', borderRadius: 6, padding: 8, textAlign: 'center' }}>
                              <div style={{ fontSize: 8, color: 'var(--muted)' }}>USERS</div>
                              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--teal)' }}>1,480</div>
                            </div>
                          </div>
                          <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }} />
                        </div>
                      );
                    }

                    if (text.includes('auth') || text.includes('login') || text.includes('secure')) {
                      return (
                        <div style={{ width: '100%', maxWidth: 280, background: 'var(--surface2)', borderRadius: 8, padding: 16, border: '1px solid var(--border)', animation: 'fadeIn 0.5s ease', display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'left' }}>
                          <div style={{ fontSize: 12, fontWeight: 800, color: '#fff', textAlign: 'center', marginBottom: 4 }}>🔒 Authentication Portal</div>
                          <div style={{ height: 20, background: 'var(--surface3)', borderRadius: 4, border: '1px solid var(--border)' }} />
                          <div style={{ height: 20, background: 'var(--surface3)', borderRadius: 4, border: '1px solid var(--border)' }} />
                          <button className="btn btn-teal btn-xs" style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>Sign In</button>
                        </div>
                      );
                    }

                    if (text.includes('mobile') || text.includes('portfolio') || text.includes('profile')) {
                      return (
                        <div style={{ width: 140, height: 220, background: 'var(--surface2)', borderRadius: 20, padding: '12px 8px', border: '3px solid #333', animation: 'fadeIn 0.5s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, position: 'relative', textAlign: 'left' }}>
                          <div style={{ width: 40, height: 4, background: '#333', borderRadius: 2, marginBottom: 4 }} />
                          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--gold-glow)', border: '1px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>👤</div>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 10, fontWeight: 800, color: '#fff' }}>Alex Mercer</div>
                            <div style={{ fontSize: 7, color: 'var(--muted)', marginTop: 1 }}>Frontend Developer</div>
                          </div>
                          <div style={{ width: '100%', height: 60, background: 'var(--surface3)', borderRadius: 8, padding: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <div style={{ height: 4, background: 'var(--border)', borderRadius: 2 }} />
                            <div style={{ height: 4, background: 'var(--border)', borderRadius: 2 }} />
                            <div style={{ height: 4, background: 'var(--border)', borderRadius: 2 }} />
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 11 }}>
                        <div style={{ fontSize: 24, marginBottom: 8 }}>🧩</div>
                        <div>Composing blocks... Code Sandbox ready to compile.</div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Send log */}
              {sendLog.length > 0 && (
                <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
                  <div style={{ padding: '10px 16px', background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>Delivery Log</span>
                  </div>
                  <div style={{ padding: '10px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {sendLog.map(l => {
                      const pl = PLATFORMS.find(p => p.id === l.platform);
                      return (
                        <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, animation: 'fadeIn 0.2s ease' }}>
                          <span style={{ color: l.success ? 'var(--teal)' : 'var(--red)', fontWeight: 700 }}>{l.success ? '✓' : '✕'}</span>
                          <span style={{ fontSize: 14 }}>{pl?.icon}</span>
                          <span style={{ color: '#d4d4e4' }}>{l.name || l.platform}</span>
                          <span style={{ marginLeft: 'auto', fontSize: 9.5, color: l.success ? 'var(--teal)' : 'var(--red)' }}>
                            {l.success ? 'Delivered' : 'Failed'}
                          </span>
                        </div>
                      );
                    })}
                    {isSending && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--muted)' }}>
                        <span className="spinner" style={{ width: 10, height: 10, borderWidth: 1.5 }} />
                        Sending to next account…
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT — Side Panel ─────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Templates */}
          <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', background: 'rgba(0,0,0,0.15)', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11.5, fontWeight: 800, color: '#fff' }}>⚡ Templates</div>
              <div style={{ fontSize: 9.5, color: 'var(--muted)', marginTop: 1 }}>Click to load</div>
            </div>
            <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: 5 }}>
              {TEMPLATES.map(tpl => (
                <button
                  key={tpl.name}
                  onClick={() => loadTemplate(tpl)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px',
                    borderRadius: 9, border: '1px solid var(--border)', background: 'transparent',
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,183,49,0.07)'; e.currentTarget.style.borderColor = 'rgba(245,183,49,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                >
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{tpl.emoji}</span>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#e4e4ed', lineHeight: 1.2 }}>{tpl.name}</div>
                    <div style={{ fontSize: 9.5, color: 'var(--muted)', marginTop: 1 }}>{tpl.desc}</div>
                  </div>
                  <span style={{ marginLeft: 'auto', color: 'var(--muted)', fontSize: 11 }}>›</span>
                </button>
              ))}
            </div>
          </div>

          {/* Platform targeting */}
          <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', background: 'rgba(0,0,0,0.15)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 11.5, fontWeight: 800, color: '#fff' }}>🎯 Target Platforms</div>
                <div style={{ fontSize: 9.5, color: 'var(--muted)', marginTop: 1 }}>
                  {selectedPlatforms.size === 0 ? 'All active accounts' : `${selectedPlatforms.size} platform${selectedPlatforms.size !== 1 ? 's' : ''} selected`}
                </div>
              </div>
              {selectedPlatforms.size > 0 && (
                <button className="btn btn-ghost btn-xs" onClick={() => setSelectedPlatforms(new Set())} style={{ fontSize: 9.5 }}>
                  Clear
                </button>
              )}
            </div>
            <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {routerAnalysis.recommendations && routerAnalysis.recommendations.length > 0 && (
                <div style={{ fontSize: 9.5, color: 'var(--teal)', background: 'rgba(34,211,238,0.05)', padding: '6px 8px', borderRadius: 6, marginBottom: 4, border: '1px dashed rgba(34,211,238,0.18)', lineHeight: 1.3 }}>
                  🤖 Smart Router recommends:<br />
                  <strong style={{ color: '#fff' }}>{routerAnalysis.recommendations[0].name}</strong> ({routerAnalysis.recommendations[0].reason})
                </div>
              )}

              {PLATFORMS.map(p => {
                const accs = activeAccounts.filter(a => a.platform === p.id);
                const sel  = selectedPlatforms.has(p.id);
                const isRecommended = p.id === routerAnalysis.best;
                return (
                  <button
                    key={p.id}
                    onClick={() => togglePlatform(p.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 9, padding: '7px 10px',
                      borderRadius: 8, border: isRecommended ? '1px dashed var(--teal)' : `1px solid ${sel ? p.color + '60' : 'var(--border)'}`,
                      background: sel ? `${p.color}12` : 'transparent',
                      cursor: 'pointer', transition: 'all 0.15s',
                    }}
                  >
                    <span style={{ fontSize: 14 }}>{p.icon}</span>
                    <span style={{ flex: 1, fontSize: 11, fontWeight: 600, color: sel ? '#fff' : 'var(--muted2)', display: 'flex', alignItems: 'center', gap: 6, textAlign: 'left' }}>
                      <span>{p.name}</span>
                      {isRecommended && (
                        <span style={{ fontSize: 8, background: 'rgba(34,211,238,0.15)', color: 'var(--teal)', padding: '1px 4px', borderRadius: 3, border: '1px solid rgba(34,211,238,0.3)', fontWeight: 800 }}>AI Best</span>
                      )}
                    </span>
                    <span style={{ fontSize: 9, color: accs.length > 0 ? 'var(--teal)' : 'var(--muted)', fontFamily: 'DM Mono,monospace' }}>
                      {accs.length} acct{accs.length !== 1 ? 's' : ''}
                    </span>
                    <div style={{
                      width: 14, height: 14, borderRadius: 4,
                      border: `2px solid ${sel ? p.color : 'var(--border)'}`,
                      background: sel ? p.color : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.15s', flexShrink: 0,
                    }}>
                      {sel && <span style={{ fontSize: 8, color: '#000', fontWeight: 900 }}>✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Prompt health meter */}
          <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#fff', marginBottom: 10 }}>🔬 Prompt Health</div>
            {[
              { label: 'Has Role',       ok: blocks.some(b => b.type === 'role' && b.content.trim()) },
              { label: 'Has Task',       ok: blocks.some(b => b.type === 'task' && b.content.trim()) },
              { label: 'Has Format',     ok: blocks.some(b => b.type === 'format' && b.content.trim()) },
              { label: 'Vars filled',    ok: allVars.length === 0 || !hasUnfilled },
              { label: 'Token safe',     ok: tokenCount < 4000 },
              { label: 'Has target',     ok: activeAccounts.length > 0 },
            ].map(check => (
              <div key={check.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                <span style={{ fontSize: 11, color: check.ok ? 'var(--teal)' : 'var(--muted)' }}>{check.ok ? '✓' : '○'}</span>
                <span style={{ fontSize: 10.5, color: check.ok ? 'var(--muted2)' : 'var(--muted)' }}>{check.label}</span>
              </div>
            ))}
            <div style={{ height: 1, background: 'var(--border)', margin: '10px 0' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 10, color: 'var(--muted)' }}>Quality score</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--teal)' }}>
                {[
                  blocks.some(b => b.type === 'role' && b.content.trim()),
                  blocks.some(b => b.type === 'task' && b.content.trim()),
                  blocks.some(b => b.type === 'format' && b.content.trim()),
                  allVars.length === 0 || !hasUnfilled,
                  tokenCount < 4000,
                  activeAccounts.length > 0,
                ].filter(Boolean).length * 16 + '%'}
              </span>
            </div>
          </div>

          <PromptOptimizer
            prompt={{ prompt: finalPrompt, name: promptName || 'Current Composed Prompt' }}
            onApply={(optimizedText) => {
              setBlocks([
                { id: 1, type: 'custom', content: optimizedText }
              ]);
              toast.success('Applied optimized prompt as custom block!');
            }}
          />

          {/* Quick actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => { setBlocks([newBlock('role', ''), newBlock('task', ''), newBlock('format', '')]); setVarValues({}); setPromptName(''); setSendLog([]); }} style={{ fontSize: 11, justifyContent: 'center' }}>
              🔄 Reset Builder
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => onNav?.('library')} style={{ fontSize: 11, justifyContent: 'center' }}>
              📚 Open Library
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => onNav?.('optimizer')} style={{ fontSize: 11, justifyContent: 'center' }}>
              ✨ Open Optimizer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
