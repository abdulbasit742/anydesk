import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useStore } from '../data/store';
import { useToast } from '../components/Toast';

const TONES = [
  { id: 'professional', label: '💼 Professional', desc: 'Formal, precise, enterprise-ready' },
  { id: 'creative', label: '🎨 Creative', desc: 'Bold, expressive, design-forward' },
  { id: 'concise', label: '⚡ Concise', desc: 'Short, sharp, high-signal' },
  { id: 'detailed', label: '📋 Detailed', desc: 'Comprehensive, technical, thorough' },
];

const ENHANCEMENTS = [
  { id: 'mobile', label: '📱 Mobile Responsive', snippet: '\n\n### Mobile Requirements:\n- Fully responsive from 320px to 2560px\n- Touch-friendly targets (min 44px)\n- No horizontal scroll\n- Adaptive typography' },
  { id: 'a11y', label: '♿ Accessibility', snippet: '\n\n### Accessibility (WCAG 2.1 AA):\n- Proper ARIA labels and roles\n- Keyboard navigation support\n- Focus indicators on all interactive elements\n- Sufficient color contrast ratios' },
  { id: 'perf', label: '🚀 Performance', snippet: '\n\n### Performance Optimization:\n- Lazy load images and heavy components\n- Code split by route\n- Minimize bundle size\n- Cache API responses appropriately' },
  { id: 'error', label: '🛡️ Error Handling', snippet: '\n\n### Error Handling:\n- Graceful degradation for all failure cases\n- User-friendly error messages\n- Loading skeletons for async data\n- Retry logic for network failures' },
  { id: 'types', label: '🔷 TypeScript', snippet: '\n\n### TypeScript Requirements:\n- Strict typing for all props and state\n- Interface definitions for data models\n- No implicit any types\n- Proper generic usage' },
  { id: 'tests', label: '🧪 Testing', snippet: '\n\n### Testing:\n- Unit tests for utility functions\n- Component tests for key interactions\n- Edge case coverage\n- Snapshot tests for UI components' },
];

function buildOptimizedPrompt(original, tone, selectedEnhancements) {
  const toneInstructions = {
    professional: 'Use formal, enterprise-grade language. Ensure production-ready, scalable implementation.',
    creative: 'Approach this with creative flair. Prioritize innovative design and user delight.',
    concise: 'Keep implementation minimal and precise. Avoid over-engineering. Ship fast.',
    detailed: 'Provide comprehensive implementation with full documentation and edge case handling.',
  };

  let result = `## Enhanced AI Prompt (${tone.charAt(0).toUpperCase() + tone.slice(1)} Tone)\n\n`;
  result += `### Core Request:\n${original}\n\n`;
  result += `### Tone & Approach:\n${toneInstructions[tone]}\n\n`;
  result += `### Technical Requirements:\n`;
  result += `- Clean, modular code architecture with separation of concerns\n`;
  result += `- Consistent naming conventions throughout\n`;
  result += `- Use a modern, premium design system with dark/light mode support\n`;
  result += `- Add smooth transitions and micro-animations (200-300ms ease)\n`;
  result += `- Use 8px grid spacing system consistently\n`;

  selectedEnhancements.forEach(id => {
    const enh = ENHANCEMENTS.find(e => e.id === id);
    if (enh) result += enh.snippet;
  });

  result += `\n\n### Quality Bar:\n`;
  result += `- Code must pass linting with zero warnings\n`;
  result += `- All interactive elements need hover/focus/active states\n`;
  result += `- Handle empty states gracefully\n`;
  result += `- No hardcoded values — use constants/config`;

  return result;
}

export default function Optimizer({ onNav }) {
  const store = useStore();
  const toast = useToast();

  const [input, setInput] = useState('');
  const [optimized, setOptimized] = useState('');
  const [original, setOriginal] = useState('');
  const [loading, setLoading] = useState(false);
  const [tone, setTone] = useState('professional');
  const [selectedEnhancements, setSelectedEnhancements] = useState(['mobile', 'error']);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeRevisionId, setActiveRevisionId] = useState(null);
  const typingRef = useRef(null);
  const outputRef = useRef(null);

  const optimizations = store.optimizations || [];

  // ─── Interactive Sandbox playfields state
  const [todoTasks, setTodoTasks] = useState([
    { id: 1, text: 'Design UI Layout blueprint', checked: true },
    { id: 2, text: 'Hook up API completions', checked: false },
    { id: 3, text: 'Test robust error limits', checked: false },
  ]);
  const [newTodoText, setNewTodoText] = useState('');
  const [pricingTier, setPricingTier] = useState(29); // pricing slider
  const [isSandboxDark, setIsSandboxDark] = useState(true);

  // Dynamic 4-Dimension Diagnostics calculations
  const diagnostics = useMemo(() => {
    if (!input.trim()) return { clarity: 0, structure: 0, precision: 0, directive: 0, overall: 0 };

    let clarity = 20;
    let structure = 15;
    let precision = 10;
    let directive = 15;

    const words = input.split(/\s+/).filter(Boolean).length;

    // Clarity check
    if (words > 10) clarity += 30;
    if (words > 30) clarity += 30;
    if (words > 70) clarity += 20;

    // Structure check
    if (input.includes('\n') || input.includes('-') || input.includes('###')) structure += 40;
    if (/role|act as|identity/i.test(input)) structure += 25;
    if (input.length > 100) structure += 20;

    // Precision check
    if (/typescript|react|api|postgre|db|schema|route|next/i.test(input)) precision += 45;
    if (/responsive|mobile|aria|a11y|accessibility/i.test(input)) precision += 25;
    if (/performance|optimization|lazy|bundle/i.test(input)) precision += 20;

    // Directives check
    if (/implement|add|create|build|make|optimize|refactor/i.test(input)) directive += 45;
    if (/ensure|must|require|constraints|rules/i.test(input)) directive += 40;

    // Cap at 100
    clarity = Math.min(100, clarity);
    structure = Math.min(100, structure);
    precision = Math.min(100, precision);
    directive = Math.min(100, directive);

    const overall = Math.round((clarity + structure + precision + directive) / 4);

    return { clarity, structure, precision, directive, overall };
  }, [input]);

  const readability = useMemo(() => {
    if (!input.trim()) return { score: 100, label: '—', color: 'var(--muted)', words: 0, sentences: 0 };
    const sentences = input.split(/[.!?]+/).filter(x => x.trim().length > 0).length || 1;
    const words = input.split(/\s+/).filter(Boolean).length || 1;
    const syllableMatch = input.toLowerCase().match(/[aeiouy]+/g);
    const syllables = syllableMatch ? syllableMatch.length : 1;

    // Flesch Ease formula: 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words)
    let ease = Math.round(206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words));
    ease = Math.max(0, Math.min(100, ease));

    let label = 'Complex';
    let color = 'var(--purple)';
    if (ease > 75) { label = 'Conversational'; color = 'var(--teal)'; }
    else if (ease > 45) { label = 'Standard'; color = 'var(--gold)'; }

    return { score: ease, label, color, words, sentences };
  }, [input]);

  const dynamicTips = useMemo(() => {
    const tips = [];
    if (!input.trim()) return [];

    const text = input.toLowerCase();

    if (text.split(/\s+/).filter(Boolean).length < 25) {
      tips.push({ ok: false, text: 'Extend instructions past 25 words for richer details' });
    } else {
      tips.push({ ok: true, text: 'Ideal length requirement satisfied' });
    }

    if (!text.includes('#') && !text.includes('-') && !text.includes('*')) {
      tips.push({ ok: false, text: 'Add markdown headers (#) or bullets (-) for layout structure' });
    } else {
      tips.push({ ok: true, text: 'Good structural segmentation detected' });
    }

    if (!/role|act as|you are|expert|persona/i.test(text)) {
      tips.push({ ok: false, text: 'Define a custom agent persona (e.g. "Act as a lead programmer")' });
    } else {
      tips.push({ ok: true, text: 'Custom agent identity/persona declared' });
    }

    if (!/mobile|responsive|breakpoint|width/i.test(text)) {
      tips.push({ ok: false, text: 'Inject mobile layout limits (breakpoints, sizing constraints)' });
    } else {
      tips.push({ ok: true, text: 'Mobile responsive specifications found' });
    }

    if (!/error|grace|degrad|loading|exception/i.test(text)) {
      tips.push({ ok: false, text: 'Outline failure/error handling or fallback loading screens' });
    } else {
      tips.push({ ok: true, text: 'Error handling guidelines integrated' });
    }

    return tips;
  }, [input]);

  const scoreColor = diagnostics.overall >= 70 ? 'var(--teal)' : diagnostics.overall >= 40 ? 'var(--gold)' : 'var(--red)';
  const scoreLabel = diagnostics.overall >= 70 ? 'Strong' : diagnostics.overall >= 40 ? 'Good' : diagnostics.overall > 0 ? 'Weak' : '—';

  const toggleEnhancement = (id) => {
    setSelectedEnhancements(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Typewriter animated stream
  const startTypewriter = useCallback((text) => {
    setIsTyping(true);
    setDisplayedText('');
    let i = 0;
    const speed = Math.max(3, Math.floor(3000 / text.length));
    const tick = () => {
      if (i < text.length) {
        // Type 3 characters at a time for snappier feedback
        const chunk = Math.min(3, text.length - i);
        setDisplayedText(text.slice(0, i + chunk));
        i += chunk;
        typingRef.current = setTimeout(tick, speed);
        if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight;
      } else {
        setIsTyping(false);
      }
    };
    typingRef.current = setTimeout(tick, speed);
  }, []);

  useEffect(() => () => clearTimeout(typingRef.current), []);

  const handleOptimize = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) { toast.error('Please enter a prompt to optimize'); return; }
    clearTimeout(typingRef.current);
    setLoading(true);
    setOriginal(trimmed);
    setOptimized('');
    setDisplayedText('');

    setTimeout(() => {
      const result = buildOptimizedPrompt(trimmed, tone, selectedEnhancements);
      setOptimized(result);
      setLoading(false);
      startTypewriter(result);

      const newRevId = Math.random().toString(36).slice(2, 10);
      setActiveRevisionId(newRevId);

      store.setState(prev => ({
        ...prev,
        optimizations: [
          { id: newRevId, original: trimmed, enhanced: result, tone, createdAt: new Date().toISOString() },
          ...(prev.optimizations || []),
        ].slice(0, 50),
      }));
      toast.success('Prompt optimized!');
    }, 1100);
  }, [input, tone, selectedEnhancements, store, toast, startTypewriter]);

  const handleRestoreRevision = (rev) => {
    clearTimeout(typingRef.current);
    setInput(rev.original);
    setOriginal(rev.original);
    setOptimized(rev.enhanced);
    setDisplayedText(rev.enhanced);
    setTone(rev.tone || 'professional');
    setActiveRevisionId(rev.id);
    setIsTyping(false);
    toast.info('Restored iteration state');
  };

  const handleCopy = () => {
    if (!optimized) return;
    navigator.clipboard.writeText(optimized);
    toast.success('Copied to clipboard!');
  };

  const handleSaveToLibrary = () => {
    if (!optimized) return;
    store.addPrompt({ title: original.slice(0, 50) + (original.length > 50 ? '…' : ''), content: optimized, category: 'optimized', prompt: optimized });
    toast.bolt('Saved to Prompt Library!');
  };

  const handleBroadcast = () => {
    if (!optimized) return;
    navigator.clipboard.writeText(optimized);
    toast.info('Prompt payload copied — broadcasting...');
    onNav('broadcast');
  };

  // Determine which visual layout sandbox template to display based on keywords
  const activeSandboxTemplate = useMemo(() => {
    const text = input.toLowerCase();
    if (text.includes('dashboard') || text.includes('chart') || text.includes('analytic') || text.includes('metric')) {
      return 'dashboard';
    }
    if (text.includes('todo') || text.includes('task') || text.includes('kanban') || text.includes('check')) {
      return 'todo';
    }
    if (text.includes('landing') || text.includes('saas') || text.includes('form') || text.includes('login') || text.includes('pricing')) {
      return 'pricing';
    }
    return 'blueprint';
  }, [input]);

  const estimatedTokens = Math.ceil((optimized || '').split(' ').length * 1.3);

  // Todo Sandbox handlers
  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;
    setTodoTasks(prev => [...prev, { id: Date.now(), text: newTodoText.trim(), checked: false }]);
    setNewTodoText('');
  };

  const handleToggleTodo = (id) => {
    setTodoTasks(prev => prev.map(t => t.id === id ? { ...t, checked: !t.checked } : t));
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 16, alignItems: 'start' }}>

      {/* ── LEFT: Interactive Diagnostics & Inputs ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>✨ AI Prompt Optimizer</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>Fine-tune prompts with real-time feedback playfields</div>
          </div>
          {optimizations.length > 0 && (
            <div className="timeline-track">
              {optimizations.slice(0, 8).map(opt => (
                <div
                  key={opt.id}
                  onClick={() => handleRestoreRevision(opt)}
                  className={`timeline-node ${activeRevisionId === opt.id ? 'active' : ''}`}
                  title={`Restore: ${opt.tone} (${new Date(opt.createdAt).toLocaleTimeString()})`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Dynamic 4-Dimension Diagnostics gauges */}
        {input.trim() && (
          <div className="card" style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: '120px 1fr', gap: 20, alignItems: 'center', background: 'rgba(20,20,31,0.2)' }}>

            {/* Left: SVG Scoring Dial */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{ position: 'relative', width: 110, height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="110" height="110">
                  {/* Background Track Ring */}
                  <circle cx="55" cy="55" r="42" stroke="rgba(255,255,255,0.04)" strokeWidth="8" fill="none" />

                  {/* Glowing Active Score Ring */}
                  <circle
                    cx="55" cy="55" r="42"
                    stroke={scoreColor}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray="263.8"
                    strokeDashoffset={263.8 - (263.8 * diagnostics.overall) / 100}
                    strokeLinecap="round"
                    transform="rotate(-90 55 55)"
                    style={{
                      transition: 'stroke-dashoffset 0.6s cubic-bezier(0.34,1.56,0.64,1)',
                      filter: `drop-shadow(0 0 6px ${scoreColor}40)`
                    }}
                  />
                </svg>
                {/* Score percentage text in center */}
                <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>{diagnostics.overall}%</span>
                  <span style={{ fontSize: 8, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', marginTop: 1 }}>Grade</span>
                </div>
              </div>
              <span className="badge" style={{ background: scoreColor + '20', color: scoreColor, border: `1px solid ${scoreColor}40`, fontSize: 9.5, padding: '2px 8px', fontWeight: 800 }}>
                {scoreLabel}
              </span>
            </div>

            {/* Right: Metrics + Dynamic Advice Checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {/* Readability Score */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>📋 Prompt Engineering Telemetry</span>
                <span style={{ fontSize: 10, color: readability.color, fontWeight: 700 }}>
                  Readability: <strong style={{ color: '#fff' }}>{readability.label}</strong> ({readability.score}/100)
                </span>
              </div>

              {/* Checklist */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {dynamicTips.map((tip, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 10.5 }}>
                    <span style={{
                      color: tip.ok ? 'var(--teal)' : 'var(--gold)',
                      fontSize: tip.ok ? 12 : 10,
                      fontWeight: 'bold',
                      flexShrink: 0
                    }}>
                      {tip.ok ? '✓' : '⚠️'}
                    </span>
                    <span style={{ color: tip.ok ? 'rgba(255,255,255,0.7)' : 'var(--muted2)' }}>
                      {tip.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Input prompt area */}
        <div style={{ background: 'var(--surface2)', border: '1px solid var(--border2)', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Raw Master Command</span>
            <span style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'DM Mono, monospace' }}>{input.length} chars · {input.split(/\s+/).filter(Boolean).length} words</span>
          </div>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type or paste your developer master command...&#10;e.g. 'Build a SaaS dashboard with interactive HSL charts' or 'Create a Kanban task todo board with checkboxes'"
            rows={5}
            style={{
              width: '100%', background: 'transparent', border: 'none', outline: 'none',
              color: '#e4e4ed', fontFamily: '"Syne", sans-serif', fontSize: 13, lineHeight: 1.7,
              padding: '12px 14px', resize: 'vertical',
            }}
          />
        </div>

        {/* Tone buttons grid */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Laboratory Tone Filter</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {TONES.map(t => (
              <button
                key={t.id}
                onClick={() => setTone(t.id)}
                style={{
                  padding: '8px 12px', borderRadius: 8, border: `1px solid ${tone === t.id ? 'var(--gold)' : 'var(--border)'}`,
                  background: tone === t.id ? 'var(--gold-glow)' : 'var(--surface2)',
                  color: tone === t.id ? 'var(--gold)' : 'var(--muted2)',
                  cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 700 }}>{t.label}</div>
                <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 1 }}>{t.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Technical enhancements pills */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Inject Technical Modules</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {ENHANCEMENTS.map(e => (
              <button
                key={e.id}
                onClick={() => toggleEnhancement(e.id)}
                style={{
                  padding: '5px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                  border: `1px solid ${selectedEnhancements.includes(e.id) ? 'var(--teal)' : 'var(--border)'}`,
                  background: selectedEnhancements.includes(e.id) ? 'var(--teal-glow)' : 'transparent',
                  color: selectedEnhancements.includes(e.id) ? 'var(--teal)' : 'var(--muted)',
                  transition: 'all 0.15s',
                }}
              >
                {e.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action optimizer trigger */}
        <button
          onClick={handleOptimize}
          disabled={loading || !input.trim()}
          style={{
            padding: '12px 20px', borderRadius: 10, border: 'none', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            background: loading || !input.trim() ? 'var(--surface3)' : 'linear-gradient(135deg, #f5b731, #e0a020)',
            color: loading || !input.trim() ? 'var(--muted)' : '#000',
            fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: loading || !input.trim() ? 'none' : '0 4px 20px rgba(245,183,49,0.3)',
            transition: 'all 0.2s',
          }}
        >
          {loading ? (
            <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2, borderTopColor: 'var(--gold)' }} /> Compiling optimizations...</>
          ) : (
            <>🔬 Compile & Optimize Prompt</>
          )}
        </button>

      </div>

      {/* ── RIGHT: Playfield Viewport Sandbox & Monospace Outputs ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'sticky', top: 16 }}>

        {/* Dynamic Sandbox Viewport Playfield */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Live Sandbox Playfield Viewport</span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                onClick={() => setIsSandboxDark(!isSandboxDark)}
                style={{ fontSize: 10, background: 'var(--surface3)', border: '1px solid var(--border)', borderRadius: 4, cursor: 'pointer', padding: '1px 6px', color: 'var(--muted)' }}
              >
                {isSandboxDark ? '☀️ Light' : '🌙 Dark'}
              </button>
              <span className="lab-badge">Active Sandbox</span>
            </div>
          </div>

          <div className={`lab-viewport ${optimized ? 'glow-gold' : ''}`} style={{ background: isSandboxDark ? '#09090e' : '#fcfcfd' }}>
            {/* Mock Chrome frame Address bar */}
            <div className="lab-chrome-header" style={{ background: isSandboxDark ? 'rgba(20,20,31,0.95)' : '#f0f0f5', borderBottomColor: isSandboxDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
              <div className="lab-chrome-dot" style={{ background: '#ff5f5f' }} />
              <div className="lab-chrome-dot" style={{ background: '#f5b731' }} />
              <div className="lab-chrome-dot" style={{ background: '#00d4aa' }} />
              <div className="lab-chrome-address" style={{ background: isSandboxDark ? 'rgba(0,0,0,0.3)' : '#ffffff', color: isSandboxDark ? 'var(--muted2)' : '#5a5a6e', borderColor: isSandboxDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }}>
                https://bolt.studio/sandbox/{activeSandboxTemplate}
              </div>
            </div>

            {/* Sandbox Viewport content workspace */}
            <div className="lab-content">
              {activeSandboxTemplate === 'dashboard' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, color: isSandboxDark ? '#fff' : '#000' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>Telemetry Metrics Dashboard</div>
                    <span style={{ fontSize: 9, background: 'var(--teal-glow)', color: 'var(--teal)', padding: '1px 5px', borderRadius: 3, border: '1px solid rgba(0,212,170,0.2)' }}>Live Stream</span>
                  </div>

                  {/* Dashboard Slider Control */}
                  <div className="lab-widget" style={{ background: isSandboxDark ? 'var(--surface2)' : '#ffffff', border: isSandboxDark ? '1px solid var(--border)' : '1px solid rgba(0,0,0,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: isSandboxDark ? 'var(--muted)' : '#6b6b82', marginBottom: 6 }}>
                      <span>System Resource Load</span>
                      <strong style={{ color: 'var(--teal)' }}>{pricingTier}%</strong>
                    </div>
                    <input
                      type="range" min={10} max={99}
                      value={pricingTier}
                      onChange={e => setPricingTier(Number(e.target.value))}
                      style={{ width: '100%', accentColor: 'var(--teal)', cursor: 'pointer' }}
                    />
                  </div>

                  {/* Dashboard stats widget grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div className="lab-widget" style={{ background: isSandboxDark ? 'var(--surface2)' : '#ffffff', border: isSandboxDark ? '1px solid var(--border)' : '1px solid rgba(0,0,0,0.08)' }}>
                      <div style={{ fontSize: 9, color: 'var(--muted)' }}>Memory Buffer</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--gold)', marginTop: 2 }}>{Math.round(pricingTier * 1.5)} GB</div>
                    </div>
                    <div className="lab-widget" style={{ background: isSandboxDark ? 'var(--surface2)' : '#ffffff', border: isSandboxDark ? '1px solid var(--border)' : '1px solid rgba(0,0,0,0.08)' }}>
                      <div style={{ fontSize: 9, color: 'var(--muted)' }}>Network IOPS</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--blue)', marginTop: 2 }}>{pricingTier * 12} reqs</div>
                    </div>
                  </div>
                </div>
              )}

              {activeSandboxTemplate === 'todo' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, color: isSandboxDark ? '#fff' : '#000' }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>Interactive Task board Checklist</div>

                  <div className="lab-widget" style={{ display: 'flex', flexDirection: 'column', gap: 6, background: isSandboxDark ? 'var(--surface2)' : '#ffffff', border: isSandboxDark ? '1px solid var(--border)' : '1px solid rgba(0,0,0,0.08)' }}>
                    {todoTasks.map(t => (
                      <label key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, cursor: 'pointer', color: t.checked ? 'var(--muted)' : (isSandboxDark ? '#fff' : '#000') }} onClick={() => handleToggleTodo(t.id)}>
                        <div style={{
                          width: 14, height: 14, borderRadius: 3, border: `1px solid ${t.checked ? 'var(--teal)' : 'var(--border2)'}`,
                          background: t.checked ? 'var(--teal)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 9, color: '#09090e', fontWeight: 'bold'
                        }}>
                          {t.checked && '✓'}
                        </div>
                        <span style={{ textDecoration: t.checked ? 'line-through' : 'none' }}>{t.text}</span>
                      </label>
                    ))}
                  </div>

                  {/* Add task to playfield */}
                  <form onSubmit={handleAddTodo} style={{ display: 'flex', gap: 6 }}>
                    <input
                      value={newTodoText}
                      onChange={e => setNewTodoText(e.target.value)}
                      placeholder="Add task to sandbox..."
                      style={{
                        flex: 1, padding: '5px 8px', fontSize: 10.5, background: isSandboxDark ? 'var(--surface3)' : '#ffffff',
                        border: `1px solid ${isSandboxDark ? 'var(--border)' : 'rgba(0,0,0,0.1)'}`, borderRadius: 4, color: isSandboxDark ? '#fff' : '#000'
                      }}
                    />
                    <button type="submit" className="btn btn-teal btn-xs" style={{ padding: '0 8px' }}>+ Add</button>
                  </form>
                </div>
              )}

              {activeSandboxTemplate === 'pricing' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, color: isSandboxDark ? '#fff' : '#000' }}>
                  <div style={{ textDisplay: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>Pricing Calculator Widget</div>
                    <span style={{ fontSize: 9, background: 'var(--gold-glow)', color: 'var(--gold)', padding: '1px 5px', borderRadius: 3, border: '1px solid rgba(245,183,49,0.2)' }}>SaaS Tier</span>
                  </div>

                  <div className="lab-widget" style={{ textAlign: 'center', background: isSandboxDark ? 'var(--surface2)' : '#ffffff', border: isSandboxDark ? '1px solid var(--border)' : '1px solid rgba(0,0,0,0.08)' }}>
                    <div style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 2 }}>PRO subscription tier</div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--gold)' }}>${pricingTier} / mo</div>
                    <div style={{ fontSize: 9, color: 'var(--muted)', marginTop: 4 }}>Slide range slider above to adjust Pricing</div>
                  </div>

                  <button className="btn btn-gold btn-xs" style={{ width: '100%', justifyContent: 'center' }} onClick={() => toast.bolt('Mock billing portal handshake active!')}>
                    Subscribe to Sandbox
                  </button>
                </div>
              )}

              {activeSandboxTemplate === 'blueprint' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, color: isSandboxDark ? '#fff' : '#000' }}>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>Modular Architecture Blueprint</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, background: isSandboxDark ? '#040406' : '#f0f0f5', padding: 8, borderRadius: 6, border: '1px solid var(--border)', fontFamily: 'DM Mono, monospace', fontSize: 8.5 }}>
                    <div style={{ color: 'var(--teal)' }}>📁 src/</div>
                    <div style={{ color: 'var(--blue)', paddingLeft: 10 }}>📁 components/</div>
                    <div style={{ color: 'var(--gold)', paddingLeft: 20 }}>📄 ChartWidget.tsx (Active Node)</div>
                    <div style={{ color: 'var(--purple)', paddingLeft: 20 }}>📄 TelemetryLogs.tsx</div>
                    <div style={{ color: 'var(--muted)', paddingLeft: 10 }}>📁 styles/</div>
                    <div style={{ color: 'var(--muted2)', paddingLeft: 20 }}>📄 index.css</div>
                  </div>
                  <div style={{ fontSize: 9, color: 'var(--muted)', textAlign: 'center' }}>Dynamic keyword scanner mapped layout to Code Blueprint</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Monospace output text area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Output Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>Polished Prompt Payload</div>
              <div style={{ fontSize: 10.5, color: 'var(--muted)' }}>
                {optimized ? `~${estimatedTokens} tokens · ready to dispath` : 'Compile optimize to generate payload'}
              </div>
            </div>
            {isTyping && (
              <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, background: 'var(--teal-glow)', color: 'var(--teal)', border: '1px solid rgba(0,212,170,0.2)', animation: 'pulse-gold 1s infinite' }}>
                ✍️ Writing...
              </span>
            )}
          </div>

          {/* Text Output Box */}
          <div
            ref={outputRef}
            style={{
              background: 'var(--surface2)', border: `1px solid ${optimized ? 'var(--gold)' : 'var(--border)'}`,
              borderRadius: 10, minHeight: 180, maxHeight: 240, overflowY: 'auto',
              transition: 'border-color 0.3s',
              boxShadow: optimized ? '0 0 20px rgba(245,183,49,0.06)' : 'none',
            }}
          >
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 160, gap: 12 }}>
                <div className="spinner" style={{ width: 24, height: 24, borderWidth: 2.2, borderTopColor: 'var(--gold)' }} />
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>Optimizing Prompt payload parameters...</div>
              </div>
            ) : displayedText ? (
              <pre style={{
                fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#c8d0e0', lineHeight: 1.7,
                whiteSpace: 'pre-wrap', wordBreak: 'break-word', padding: '12px 14px', margin: 0,
              }}>
                {displayedText}
                {isTyping && <span style={{ opacity: 0.7, animation: 'pulse-gold 0.6s infinite' }}>▋</span>}
              </pre>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 160, gap: 6, color: 'var(--muted)' }}>
                <div style={{ fontSize: 26, opacity: 0.3 }}>✨</div>
                <div style={{ fontSize: 11.5 }}>Optimized prompt text will stream here</div>
              </div>
            )}
          </div>

          {/* Action Row */}
          {optimized && !loading && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              <button
                className="btn btn-ghost"
                onClick={handleCopy}
                style={{ justifyContent: 'center', fontSize: 12, padding: '8px 0' }}
              >
                📋 Copy Text
              </button>
              <button
                className="btn btn-teal"
                onClick={handleSaveToLibrary}
                style={{ justifyContent: 'center', fontSize: 12, padding: '8px 0' }}
              >
                💾 Save Library
              </button>
              <button
                className="btn btn-gold btn-pulse"
                onClick={handleBroadcast}
                style={{ justifyContent: 'center', fontSize: 12, padding: '8px 0', fontWeight: 'bold' }}
              >
                📡 Broadcast
              </button>
            </div>
          )}

          {/* Quick Start templates */}
          {!optimized && !loading && (
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>⚡ Laboratory Starter packs</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  'Build a responsive dashboard with real-time analytics widgets',
                  'Create an interactive Kanban board with checkmarks task items',
                  'Design a subscription billing pricing form slider',
                ].map(t => (
                  <button
                    key={t}
                    onClick={() => setInput(t)}
                    style={{
                      padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface2)',
                      color: 'var(--muted2)', cursor: 'pointer', textAlign: 'left', fontSize: 11.5, lineHeight: 1.5,
                      transition: 'all 0.15s', fontFamily: '"Syne", sans-serif',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; e.currentTarget.style.background = 'var(--gold-glow)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted2)'; e.currentTarget.style.background = 'var(--surface2)'; }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
