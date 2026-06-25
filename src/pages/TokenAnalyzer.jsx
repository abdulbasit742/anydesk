import { useState, useMemo } from 'react';
import { sound } from '../lib/soundEngine';

// Token counting estimation
function estimateTokens(text) {
  return Math.ceil((text || '').split(/\s+/).filter(Boolean).length * 1.35);
}

const MODEL_LIMITS = [
  { id: 'claude-3-5-sonnet', label: 'Claude 3.5 Sonnet', limit: 200000, costIn: 3.0,  costOut: 15.0,  color: '#f97316' },
  { id: 'gpt-4o',            label: 'GPT-4o',            limit: 128000, costIn: 2.5,  costOut: 10.0,  color: '#10b981' },
  { id: 'gemini-2-flash',    label: 'Gemini 2 Flash',    limit: 1000000,costIn: 0.075,costOut: 0.3,   color: '#4f8ef7' },
  { id: 'gpt-4-turbo',       label: 'GPT-4 Turbo',       limit: 128000, costIn: 10.0, costOut: 30.0,  color: '#10b981' },
  { id: 'claude-3-haiku',    label: 'Claude 3 Haiku',    limit: 200000, costIn: 0.25, costOut: 1.25,  color: '#f97316' },
  { id: 'qwen-2-5',          label: 'Qwen 2.5 Coder',    limit: 131072, costIn: 0.3,  costOut: 1.2,   color: '#06b6d4' },
  { id: 'deepseek-r1',       label: 'DeepSeek R1',       limit: 64000,  costIn: 0.14, costOut: 0.28,  color: '#a78bfa' },
  { id: 'llama-3-1-70b',     label: 'Llama 3.1 70B',     limit: 128000, costIn: 0.23, costOut: 0.4,   color: '#e879f9' },
];

const SAMPLE_TEXTS = [
  { label: 'Short prompt', text: 'Create a button component in React' },
  { label: 'Medium prompt', text: 'Build a complete SaaS landing page with hero section, feature list with 6 items, pricing table with 3 tiers, FAQ accordion with 8 questions, and a footer with links. Use Tailwind CSS and make it fully responsive. Add smooth scroll animations and a dark mode toggle.' },
  { label: 'Large codebase', text: Array(50).fill('function example() { const data = fetch("/api/data").then(r => r.json()); return data.map(item => item.value * 2); }').join('\n') },
  { label: 'System prompt', text: 'You are an expert senior software engineer with 15 years of experience in React, TypeScript, Node.js, PostgreSQL, Redis, Docker, and AWS. You write production-quality code that is clean, well-documented, and follows best practices. When asked to implement features, you always consider edge cases, error handling, performance, and security.' },
];

const STANDARD_SYSTEM_PROMPT = `You are a professional assistant operating in a secure sandbox. Optimize for security, speed, and standard lint safety rules. Avoid adding unnecessary library dependencies, prioritize vanilla CSS over external frame tools, and return clean structural codes.`;

function RingGauge({ pct, color, size = 80, stroke = 7 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const fill = (Math.min(100, Math.max(0, pct)) / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', display: 'block' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={`${fill} ${circ - fill}`} strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.5s ease' }} />
    </svg>
  );
}

export default function TokenAnalyzer() {
  const [text, setText]   = useState('');
  const [model, setModel] = useState(MODEL_LIMITS[0]);
  const [outputEst, setOutputEst] = useState(1000);
  const [includeSystemPrompt, setIncludeSystemPrompt] = useState(false);

  // Parse total analyzed text based on System Prompt toggle (Feature 17)
  const fullAnalyzedText = useMemo(() => {
    if (includeSystemPrompt) {
      return `${STANDARD_SYSTEM_PROMPT}\n\n${text}`;
    }
    return text;
  }, [text, includeSystemPrompt]);

  const tokens = useMemo(() => estimateTokens(fullAnalyzedText), [fullAnalyzedText]);
  const pct    = Math.min(100, Math.round((tokens / model.limit) * 100));
  const inCost  = (tokens / 1000000) * model.costIn;
  const outCost = (outputEst / 1000000) * model.costOut;
  const words   = (fullAnalyzedText || '').split(/\s+/).filter(Boolean).length;
  const chars   = (fullAnalyzedText || '').length;
  const sentences = (fullAnalyzedText || '').split(/[.!?]+/).filter(Boolean).length;
  const safe    = pct < 80;

  // Feature 18: Live Keyword Word Cloud calculations
  const keywordCloud = useMemo(() => {
    if (!text.trim()) return [];
    const stopWords = new Set(['the', 'and', 'a', 'to', 'of', 'in', 'is', 'you', 'that', 'it', 'he', 'was', 'for', 'on', 'are', 'as', 'with', 'his', 'they', 'i', 'this', 'but', 'be', 'or', 'an']);
    const cleanWords = text
      .toLowerCase()
      .replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, '')
      .split(/\s+/)
      .filter(w => w.length > 2 && !stopWords.has(w));

    const freq = {};
    cleanWords.forEach(w => { freq[w] = (freq[w] || 0) + 1; });

    return Object.entries(freq)
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 12);
  }, [text]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 11, background: 'linear-gradient(135deg,rgba(6,182,212,.2),rgba(167,139,250,.12))', border: '1px solid rgba(6,182,212,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🔢</div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: '-.4px' }}>Token Analyzer</div>
          <div style={{ fontSize: 9.5, color: 'var(--muted)', fontFamily: 'DM Mono,monospace' }}>Count tokens, estimate costs, check model limits</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 14, alignItems: 'start' }}>
        {/* Left: Input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Quick samples */}
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700, alignSelf: 'center' }}>Load sample:</span>
              {SAMPLE_TEXTS.map(s => (
                <button key={s.label} onClick={() => { sound.play('click'); setText(s.text); }}
                  className="btn btn-ghost btn-xs" style={{ fontSize: 10 }}>{s.label}</button>
              ))}
            </div>

            {/* Feature 17 Toggle System Prompt */}
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, cursor: 'pointer', color: includeSystemPrompt ? 'var(--gold)' : 'var(--muted)', fontWeight: 700 }}>
              <input
                type="checkbox"
                checked={includeSystemPrompt}
                onChange={e => { sound.play('click'); setIncludeSystemPrompt(e.target.checked); }}
                style={{ accentColor: 'var(--gold)' }}
              />
              ⚙️ Inject System Prompt (+120 tokens)
            </label>
          </div>

          {/* Text area */}
          <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '8px 14px', background: 'rgba(0,0,0,.15)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--muted2)' }}>📝 Input Text</span>
              <button onClick={() => { sound.play('click'); setText(''); }} className="btn btn-ghost btn-xs" style={{ fontSize: 9 }}>Clear</button>
            </div>

            {/* Show injected indicator if active */}
            {includeSystemPrompt && (
              <div style={{ padding: '8px 12px', background: 'rgba(245,183,49,0.06)', borderBottom: '1px solid rgba(245,183,49,0.1)', fontSize: 10.5, color: 'var(--gold)', fontFamily: 'DM Mono, monospace', lineHeight: 1.4 }}>
                <strong>System instructions prepended:</strong> {STANDARD_SYSTEM_PROMPT}
              </div>
            )}

            <textarea value={text} onChange={e => setText(e.target.value)}
              placeholder="Paste your prompt, context, or code here…"
              style={{ width: '100%', boxSizing: 'border-box', background: 'transparent', border: 'none', outline: 'none', color: '#dde0f0', fontSize: 12, fontFamily: 'DM Mono,monospace', lineHeight: 1.7, resize: 'none', padding: '12px 14px', minHeight: 220 }}
              rows={10}
            />
          </div>

          {/* Feature 18 Keyword Word Cloud view */}
          {keywordCloud.length > 0 && (
            <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 14px' }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>📊 Key Word Cloud (Frequency Index)</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {keywordCloud.map((item, idx) => {
                  const sizePercent = 80 + Math.min(60, item.count * 15);
                  const hue = (idx * 30) % 360;
                  return (
                    <span
                      key={item.word}
                      style={{
                        padding: '4px 8px',
                        borderRadius: 6,
                        background: `hsla(${hue}, 70%, 40%, 0.1)`,
                        border: `1px solid hsla(${hue}, 70%, 40%, 0.3)`,
                        color: `hsl(${hue}, 80%, 75%)`,
                        fontSize: `${sizePercent}%`,
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4
                      }}
                    >
                      {item.word} <span style={{ opacity: 0.5, fontSize: '80%' }}>x{item.count}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Text stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
            {[
              { label: 'Characters', val: chars.toLocaleString(),    color: 'var(--muted2)' },
              { label: 'Words',      val: words.toLocaleString(),    color: 'var(--blue)' },
              { label: 'Sentences',  val: sentences.toLocaleString(), color: 'var(--purple)' },
              { label: 'Paragraphs', val: (fullAnalyzedText || '').split(/\n\n+/).filter(Boolean).length || 0, color: 'var(--muted2)' },
            ].map(s => (
              <div key={s.label} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 12px', textAlign: 'center' }}>
                <div style={{ fontSize: 9, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.val}</div>
              </div>
            ))}
          </div>

          {/* Feature 16: Multi-model cost estimation comparison grid */}
          <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '10px 14px', background: 'rgba(0,0,0,.15)', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 11.5, fontWeight: 800, color: '#fff' }}>All Models &amp; Projected Costs — {tokens.toLocaleString()} tokens</span>
            </div>
            {MODEL_LIMITS.map((m, i) => {
              const p = Math.min(100, Math.round((tokens / m.limit) * 100));
              const currentModelSafe = p < 80;

              // Projected Costs for this model
              const projInCost = (tokens / 1000000) * m.costIn;
              const projOutCost = (outputEst / 1000000) * m.costOut;
              const totalCost = projInCost + projOutCost;

              return (
                <div key={m.id} style={{ padding: '9px 14px', borderBottom: i < MODEL_LIMITS.length-1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#dde0f0' }}>{m.label}</span>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span style={{ fontSize: 9.5, color: 'var(--muted)', fontFamily: 'DM Mono,monospace' }}>{(m.limit/1000).toFixed(0)}K ctx</span>
                      <span style={{ fontSize: 9.5, color: 'var(--teal)', fontWeight: 700, fontFamily: 'DM Mono,monospace' }}>${totalCost.toFixed(5)}</span>
                      <span style={{ fontSize: 9.5, fontWeight: 700, color: currentModelSafe ? 'var(--teal)' : p < 100 ? 'var(--gold)' : 'var(--red)' }}>{p}%</span>
                    </div>
                  </div>
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 99 }}>
                    <div style={{ height: '100%', width: `${p}%`, background: currentModelSafe ? m.color : p < 100 ? 'var(--gold)' : 'var(--red)', borderRadius: 99, transition: 'width 0.4s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Token gauge */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, position: 'sticky', top: 0 }}>
          {/* Model selector */}
          <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 14px' }}>
            <label style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.05em', display: 'block', marginBottom: 6 }}>Model</label>
            <select value={model.id} onChange={e => { sound.play('click'); setModel(MODEL_LIMITS.find(m => m.id === e.target.value)); }}
              style={{ width: '100%', background: 'var(--surface3)', border: '1px solid var(--border)', borderRadius: 8, padding: '7px 10px', color: '#e4e4ed', fontSize: 11.5, outline: 'none', cursor: 'pointer' }}>
              {MODEL_LIMITS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
            </select>
          </div>

          {/* Feature 15: Dual Ring Gauges (Input Character count & Token limit) */}
          <div style={{ background: 'var(--surface2)', border: `1px solid ${safe ? 'var(--border)' : pct < 100 ? 'rgba(245,183,49,0.3)' : 'rgba(255,95,95,0.3)'}`, borderRadius: 14, padding: '20px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 12 }}>

              {/* Token Gauge */}
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <RingGauge pct={pct} color={safe ? model.color : pct < 100 ? 'var(--gold)' : 'var(--red)'} size={90} stroke={8} />
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
                  <div style={{ fontSize: 16, fontWeight: 900, color: safe ? '#fff' : pct < 100 ? 'var(--gold)' : 'var(--red)' }}>{pct}%</div>
                  <div style={{ fontSize: 7, color: 'var(--muted)', textTransform: 'uppercase' }}>Tokens</div>
                </div>
              </div>

              {/* Character Limit Gauge (100k char benchmark) */}
              <div style={{ position: 'relative', display: 'inline-block' }}>
                {/* Benchmark limit 150k characters */}
                <RingGauge pct={Math.min(100, Math.round((chars / 150000) * 100))} color="var(--purple)" size={90} stroke={8} />
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
                  <div style={{ fontSize: 16, fontWeight: 900, color: '#fff' }}>{Math.min(100, Math.round((chars / 150000) * 100))}%</div>
                  <div style={{ fontSize: 7, color: 'var(--muted)', textTransform: 'uppercase' }}>Chars</div>
                </div>
              </div>

            </div>

            <div style={{ fontSize: 24, fontWeight: 900, color: model.color, fontFamily: 'DM Mono,monospace', marginBottom: 2 }}>
              {tokens.toLocaleString()}
            </div>
            <div style={{ fontSize: 9.5, color: 'var(--muted)' }}>tokens / {(model.limit/1000).toFixed(0)}K limit</div>
            <div style={{ marginTop: 10, padding: '6px 12px', borderRadius: 8, background: safe ? 'rgba(0,212,170,0.1)' : pct < 100 ? 'rgba(245,183,49,0.1)' : 'rgba(255,95,95,0.1)', color: safe ? 'var(--teal)' : pct < 100 ? 'var(--gold)' : 'var(--red)', fontSize: 11, fontWeight: 700 }}>
              {safe ? '✓ Within limits' : pct < 100 ? '⚠ Approaching limit' : '✕ Exceeds context window'}
            </div>
          </div>

          {/* Cost estimate (Feature 16 slider) */}
          <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#fff', marginBottom: 12 }}>💰 Cost Estimate</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                <span style={{ color: 'var(--muted)' }}>Input ({tokens.toLocaleString()} tok)</span>
                <span style={{ color: 'var(--teal)', fontFamily: 'DM Mono,monospace' }}>${inCost.toFixed(5)}</span>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                  <span style={{ color: 'var(--muted)' }}>Output (est. {outputEst} tok)</span>
                  <span style={{ color: 'var(--gold)', fontFamily: 'DM Mono,monospace' }}>${outCost.toFixed(5)}</span>
                </div>
                <input type="range" min="100" max="8000" step="100" value={outputEst} onChange={e => setOutputEst(+e.target.value)}
                  style={{ width: '100%', accentColor: 'var(--gold)' }} />
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ fontWeight: 700, color: '#e4e4ed' }}>Total ({model.label})</span>
                <span style={{ fontWeight: 900, color: 'var(--gold)', fontFamily: 'DM Mono,monospace' }}>${(inCost + outCost).toFixed(5)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
