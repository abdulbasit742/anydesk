import { useState, useEffect, useRef } from 'react';

const injectStyles = () => {
  if (document.getElementById('bench-styles')) return;
  const s = document.createElement('style');
  s.id = 'bench-styles';
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap');
    @keyframes bench-fadeup { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
    @keyframes bench-bar { from{width:0} to{width:var(--w)} }
    @keyframes bench-pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
    @keyframes bench-run { 0%{width:0%} 100%{width:100%} }
    .bench-card:hover { border-color:rgba(245,183,49,0.3)!important; transform:translateY(-2px); box-shadow:0 8px 32px rgba(0,0,0,0.4)!important; }
    .bench-btn:hover { filter:brightness(1.15); transform:translateY(-1px); }
    .bench-row:hover { background:rgba(255,255,255,0.03)!important; }
    .bench-tab { cursor:pointer; padding:7px 16px; border-radius:7px; font-size:12px; font-weight:700; transition:all 0.2s; }
    .bench-tab.active { background:var(--gold,#f5b731); color:#000; }
    .bench-tab:not(.active) { color:#6e7191; }
    .bench-tab:not(.active):hover { color:#fff; background:rgba(255,255,255,0.06); }
  `;
  document.head.appendChild(s);
};

const V = { gold:'#f5b731', teal:'#22d3ee', purple:'#a78bfa', surface:'#0e0e16', surface2:'#16161e', surface3:'#1d1d28', border:'rgba(255,255,255,0.07)', muted:'#6e7191', red:'#ef4444', blue:'#3b82f6', green:'#22c55e' };

const MODELS = [
  { id:'gpt4o',    name:'GPT-4o',         provider:'OpenAI',     color:'#10b981', scores:{ reasoning:97, coding:95, math:92, writing:96, speed:72, cost:58 }, ttft:380,  tok_s:82,  ctx:128,  price_in:5.0,  price_out:15.0,  mmlu:88.7, humaneval:90.2, gsm8k:96.1 },
  { id:'claude35', name:'Claude 3.5',      provider:'Anthropic',  color:'#f59e0b', scores:{ reasoning:96, coding:92, math:90, writing:98, speed:76, cost:62 }, ttft:420,  tok_s:78,  ctx:200,  price_in:3.0,  price_out:15.0,  mmlu:88.3, humaneval:92.0, gsm8k:95.0 },
  { id:'gemini',   name:'Gemini 1.5 Pro', provider:'Google',     color:V.blue,    scores:{ reasoning:91, coding:87, math:88, writing:90, speed:85, cost:74 }, ttft:290,  tok_s:110, ctx:1000, price_in:3.5,  price_out:10.5,  mmlu:85.9, humaneval:84.1, gsm8k:91.7 },
  { id:'llama3',   name:'Llama 3 70B',    provider:'Meta',       color:V.purple,  scores:{ reasoning:85, coding:83, math:81, writing:84, speed:90, cost:95 }, ttft:210,  tok_s:145, ctx:8,    price_in:0.9,  price_out:0.9,   mmlu:82.0, humaneval:81.7, gsm8k:90.0 },
  { id:'mistral',  name:'Mistral Large',  provider:'Mistral AI', color:V.teal,    scores:{ reasoning:88, coding:86, math:84, writing:87, speed:88, cost:82 }, ttft:250,  tok_s:130, ctx:32,   price_in:4.0,  price_out:12.0,  mmlu:84.0, humaneval:83.5, gsm8k:88.5 },
  { id:'gpt4mini', name:'GPT-4o mini',    provider:'OpenAI',     color:'#06b6d4', scores:{ reasoning:82, coding:80, math:78, writing:81, speed:95, cost:96 }, ttft:180,  tok_s:160, ctx:128,  price_in:0.15, price_out:0.6,   mmlu:82.0, humaneval:87.2, gsm8k:91.0 },
];

const BENCHMARKS = [
  { id:'mmlu',      name:'MMLU',          desc:'Massive Multitask Language Understanding — 57 academic subjects', category:'Knowledge' },
  { id:'humaneval', name:'HumanEval',     desc:'Code generation pass@1 on 164 Python problems', category:'Coding' },
  { id:'gsm8k',     name:'GSM8K',         desc:'Grade school math word problems — 8,500 problems', category:'Math' },
  { id:'reasoning', name:'Reasoning',     desc:'Composite logical reasoning & chain-of-thought score', category:'Reasoning' },
  { id:'writing',   name:'Writing',       desc:'Creative & technical writing quality from human evals', category:'Writing' },
  { id:'speed',     name:'Speed Index',   desc:'Composite of TTFT and tokens/sec — higher = faster', category:'Performance' },
];

const TASK_RESULTS = {
  coding: [
    { task:'Write a binary search tree', gpt4o:97, claude35:95, gemini:88, llama3:84, mistral:86 },
    { task:'Fix React useEffect memory leak', gpt4o:94, claude35:93, gemini:85, llama3:81, mistral:83 },
    { task:'Build REST API in FastAPI', gpt4o:96, claude35:91, gemini:87, llama3:82, mistral:85 },
    { task:'SQL query optimization', gpt4o:93, claude35:90, gemini:84, llama3:78, mistral:82 },
    { task:'TypeScript type utility', gpt4o:95, claude35:94, gemini:86, llama3:80, mistral:84 },
  ],
  reasoning: [
    { task:'Multi-step logic puzzle', gpt4o:98, claude35:96, gemini:91, llama3:83, mistral:87 },
    { task:'Causal inference question', gpt4o:95, claude35:97, gemini:89, llama3:82, mistral:86 },
    { task:'Analogy completion', gpt4o:96, claude35:95, gemini:92, llama3:85, mistral:88 },
    { task:'Abstract pattern matching', gpt4o:94, claude35:93, gemini:90, llama3:81, mistral:85 },
  ],
};

const SCORE_COLORS = ['#f5b731','#22d3ee','#3b82f6','#a78bfa','#22c55e','#06b6d4'];

function RadarChart({ models, selectedModels }) {
  const cx = 150, cy = 150, r = 110;
  const axes = ['reasoning','coding','math','writing','speed','cost'];
  const n = axes.length;
  const angle = (i) => (i / n) * Math.PI * 2 - Math.PI / 2;
  const pt = (val, i) => ({ x: cx + r * (val / 100) * Math.cos(angle(i)), y: cy + r * (val / 100) * Math.sin(angle(i)) });
  const gridPt = (scale, i) => ({ x: cx + r * scale * Math.cos(angle(i)), y: cy + r * scale * Math.sin(angle(i)) });
  const gridPath = (scale) => axes.map((_, i) => gridPt(scale, i)).map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
  const selected = models.filter(m => selectedModels.has(m.id));
  return (
    <svg width={300} height={300} viewBox="0 0 300 300">
      {[0.25, 0.5, 0.75, 1].map(s => (
        <path key={s} d={gridPath(s)} fill="none" stroke={V.border} strokeWidth="1" />
      ))}
      {axes.map((_, i) => (
        <line key={i} x1={cx} y1={cy} x2={gridPt(1, i).x} y2={gridPt(1, i).y} stroke={V.border} strokeWidth="1" />
      ))}
      {axes.map((ax, i) => {
        const p = gridPt(1.18, i);
        return <text key={ax} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" fontSize="9" fill={V.muted} textTransform="capitalize">{ax}</text>;
      })}
      {selected.map((model) => {
        const pts = axes.map((ax, i) => pt(model.scores[ax] || 0, i));
        const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
        const col = SCORE_COLORS[MODELS.findIndex(m => m.id === model.id)] || V.gold;
        return (
          <g key={model.id}>
            <path d={d} fill={`${col}22`} stroke={col} strokeWidth="2" />
            {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3" fill={col} />)}
          </g>
        );
      })}
    </svg>
  );
}

function ScoreBar({ value, max = 100, color }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(value), 100); return () => clearTimeout(t); }, [value]);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 6, background: V.surface3, borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${(w / max) * 100}%`, background: color, borderRadius: 999, transition: 'width 0.8s ease' }} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, color, fontFamily: 'DM Mono, monospace', minWidth: 32 }}>{value}</span>
    </div>
  );
}

export default function ModelBenchmarks() {
  useEffect(() => { injectStyles(); }, []);
  const [tab, setTab] = useState('overview');
  const [selectedModels, setSelectedModels] = useState(new Set(['gpt4o', 'claude35', 'gemini']));
  const [sortBy, setSortBy] = useState('mmlu');
  const [running, setRunning] = useState(false);
  const [runProgress, setRunProgress] = useState(0);
  const [runLog, setRunLog] = useState([]);
  const [taskCategory, setTaskCategory] = useState('coding');
  const logRef = useRef(null);

  const toggleModel = (id) => {
    setSelectedModels(prev => {
      const n = new Set(prev);
      if (n.has(id)) { if (n.size > 1) n.delete(id); } else { n.add(id); }
      return n;
    });
  };

  const runBenchmark = () => {
    setRunning(true);
    setRunProgress(0);
    setRunLog([]);
    const logs = [
      '[INIT] Loading benchmark suite — MMLU, HumanEval, GSM8K...',
      '[RUN] Testing GPT-4o — MMLU subset (57 subjects)...',
      '[RUN] Testing Claude 3.5 — MMLU subset (57 subjects)...',
      '[RUN] Testing Gemini 1.5 Pro — MMLU subset...',
      '[EVAL] Computing HumanEval pass@1 scores...',
      '[RUN] GSM8K math benchmark — 500 problems per model...',
      '[EVAL] Reasoning chain-of-thought evaluation...',
      '[EVAL] Speed benchmarks: TTFT + throughput measurement...',
      '[CALC] Normalizing scores to composite index...',
      '[DONE] Benchmark complete — results ready',
    ];
    let i = 0;
    const t = setInterval(() => {
      if (i < logs.length) {
        setRunLog(prev => [...prev, { id: Date.now(), text: logs[i], color: logs[i].includes('[DONE]') ? V.green : logs[i].includes('[EVAL]') ? V.teal : V.gold }]);
        setRunProgress(Math.round(((i + 1) / logs.length) * 100));
        if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
        i++;
      } else {
        clearInterval(t);
        setRunning(false);
      }
    }, 600);
  };

  const sorted = [...MODELS].sort((a, b) => (b[sortBy] || b.scores[sortBy] || 0) - (a[sortBy] || a.scores[sortBy] || 0));

  return (
    <div style={{ padding: '0 0 80px', fontFamily: 'Syne, sans-serif', background: V.surface, minHeight: '100vh' }}>
      {/* HERO */}
      <div style={{ background: 'linear-gradient(135deg, #0e0e16 0%, #0e1520 50%, #14100e 100%)', borderBottom: `1px solid ${V.border}`, padding: '32px 32px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <div style={{ fontSize: 28 }}>🏆</div>
          <div>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>AI Model Benchmarks</h1>
            <div style={{ fontSize: 12, color: V.muted, marginTop: 2 }}>Compare models across reasoning, coding, math, speed & cost</div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <button className="bench-btn" onClick={runBenchmark} disabled={running} style={{ padding: '10px 22px', borderRadius: 10, background: running ? V.surface3 : `linear-gradient(135deg,${V.gold},#e0a020)`, color: running ? V.muted : '#000', border: 'none', cursor: running ? 'not-allowed' : 'pointer', fontWeight: 800, fontSize: 13, transition: 'all 0.2s', fontFamily: 'Syne, sans-serif' }}>
              {running ? `⏳ Running... ${runProgress}%` : '▶ Run Benchmark'}
            </button>
          </div>
        </div>
        {/* Model selectors */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {MODELS.map((m, mi) => {
            const sel = selectedModels.has(m.id);
            const col = SCORE_COLORS[mi];
            return (
              <div key={m.id} onClick={() => toggleModel(m.id)} style={{ padding: '8px 16px', borderRadius: 10, border: `2px solid ${sel ? col : V.border}`, background: sel ? `${col}18` : 'transparent', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: col, display: 'inline-block', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: sel ? '#fff' : V.muted, lineHeight: 1.1 }}>{m.name}</div>
                  <div style={{ fontSize: 9, color: V.muted }}>{m.provider}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 28 }}>

        {/* TAB BAR */}
        <div style={{ display: 'flex', gap: 6, background: V.surface2, borderRadius: 10, padding: 5, border: `1px solid ${V.border}`, width: 'fit-content' }}>
          {['overview', 'radar', 'tasks', 'pricing', 'leaderboard'].map(t => (
            <button key={t} className={`bench-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)} style={{ border: 'none', fontFamily: 'Syne, sans-serif', textTransform: 'capitalize' }}>{t}</button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {tab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'bench-fadeup 0.3s ease' }}>
            {/* Score cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              {MODELS.filter(m => selectedModels.has(m.id)).map((model) => {
                const col = SCORE_COLORS[MODELS.findIndex(m2 => m2.id === model.id)];
                const avgScore = Math.round(Object.values(model.scores).reduce((a, b) => a + b, 0) / Object.values(model.scores).length);
                return (
                  <div key={model.id} className="bench-card" style={{ background: V.surface2, border: `1px solid ${col}44`, borderRadius: 16, padding: '20px', transition: 'all 0.2s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                      <div>
                        <div style={{ fontWeight: 800, color: '#fff', fontSize: 15 }}>{model.name}</div>
                        <div style={{ fontSize: 11, color: V.muted, marginTop: 2 }}>{model.provider}</div>
                      </div>
                      <div style={{ width: 56, height: 56, borderRadius: '50%', background: `${col}22`, border: `2px solid ${col}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                        <div style={{ fontSize: 17, fontWeight: 800, color: col, fontFamily: 'DM Mono, monospace', lineHeight: 1 }}>{avgScore}</div>
                        <div style={{ fontSize: 8, color: V.muted }}>avg</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {Object.entries(model.scores).map(([key, val]) => (
                        <div key={key}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: V.muted, marginBottom: 3, textTransform: 'capitalize' }}>
                            <span>{key}</span>
                          </div>
                          <ScoreBar value={val} color={col} />
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 14, paddingTop: 14, borderTop: `1px solid ${V.border}` }}>
                      {[['TTFT', `${model.ttft}ms`], ['Speed', `${model.tok_s} t/s`], ['Context', `${model.ctx}K`]].map(([k, v]) => (
                        <div key={k} style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 10, color: V.muted }}>{k}</div>
                          <div style={{ fontSize: 13, fontWeight: 800, color: col, fontFamily: 'DM Mono, monospace' }}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* RADAR TAB */}
        {tab === 'radar' && (
          <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', animation: 'bench-fadeup 0.3s ease' }}>
            <div style={{ background: V.surface2, border: `1px solid ${V.border}`, borderRadius: 16, padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontWeight: 800, color: '#fff', fontSize: 14, marginBottom: 16 }}>Multi-Axis Comparison</div>
              <RadarChart models={MODELS} selectedModels={selectedModels} />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 14, justifyContent: 'center' }}>
                {MODELS.filter(m => selectedModels.has(m.id)).map((m) => {
                  const col = SCORE_COLORS[MODELS.findIndex(m2 => m2.id === m.id)];
                  return (
                    <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11 }}>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: col, display: 'inline-block' }} />
                      <span style={{ color: '#dde0f0' }}>{m.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 280, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {BENCHMARKS.map(b => (
                <div key={b.id} className="bench-card" style={{ background: V.surface2, border: `1px solid ${V.border}`, borderRadius: 12, padding: '16px', transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>{b.name}</div>
                      <div style={{ fontSize: 10, color: V.muted, marginTop: 2 }}>{b.desc}</div>
                    </div>
                    <span style={{ padding: '2px 8px', borderRadius: 999, background: 'rgba(34,211,238,0.12)', color: V.teal, fontSize: 9, fontWeight: 700 }}>{b.category}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {MODELS.filter(m => selectedModels.has(m.id)).map((model) => {
                      const col = SCORE_COLORS[MODELS.findIndex(m2 => m2.id === model.id)];
                      const val = model[b.id] || model.scores[b.id] || 0;
                      return (
                        <div key={model.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 10, color: V.muted, minWidth: 90, fontFamily: 'DM Mono, monospace' }}>{model.name}</span>
                          <ScoreBar value={val} color={col} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TASKS TAB */}
        {tab === 'tasks' && (
          <div style={{ animation: 'bench-fadeup 0.3s ease' }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {Object.keys(TASK_RESULTS).map(cat => (
                <button key={cat} className={`bench-tab${taskCategory === cat ? ' active' : ''}`} onClick={() => setTaskCategory(cat)} style={{ border: `1px solid ${taskCategory === cat ? V.gold : V.border}`, fontFamily: 'Syne, sans-serif', textTransform: 'capitalize' }}>{cat}</button>
              ))}
            </div>
            <div style={{ background: V.surface2, border: `1px solid ${V.border}`, borderRadius: 16, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ background: V.surface3 }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', color: V.muted, fontWeight: 700, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Task</th>
                    {MODELS.slice(0, 5).map((m, i) => (
                      <th key={m.id} style={{ padding: '12px 16px', textAlign: 'center', color: selectedModels.has(m.id) ? SCORE_COLORS[i] : V.muted, fontWeight: 700, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{m.name.split(' ')[0]}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(TASK_RESULTS[taskCategory] || []).map((row, ri) => {
                    const scores = [row.gpt4o, row.claude35, row.gemini, row.llama3, row.mistral];
                    const best = Math.max(...scores);
                    return (
                      <tr key={ri} className="bench-row" style={{ borderTop: `1px solid ${V.border}`, transition: 'background 0.15s' }}>
                        <td style={{ padding: '12px 16px', color: '#e4e4ed', fontWeight: 600 }}>{row.task}</td>
                        {scores.map((sc, si) => {
                          const isBest = sc === best;
                          const col = SCORE_COLORS[si];
                          return (
                            <td key={si} style={{ padding: '12px 16px', textAlign: 'center' }}>
                              <span style={{ fontSize: 13, fontWeight: isBest ? 800 : 400, color: isBest ? col : V.muted, fontFamily: 'DM Mono, monospace' }}>
                                {sc}{isBest && <span style={{ fontSize: 8, marginLeft: 3 }}>★</span>}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PRICING TAB */}
        {tab === 'pricing' && (
          <div style={{ animation: 'bench-fadeup 0.3s ease' }}>
            <div style={{ background: V.surface2, border: `1px solid ${V.border}`, borderRadius: 16, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ background: V.surface3 }}>
                    {['Model', 'Provider', 'Context', 'Input $/1M', 'Output $/1M', 'TTFT', 'Tokens/s', 'Value Score'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: V.muted, fontWeight: 700, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MODELS.map((m, mi) => {
                    const col = SCORE_COLORS[mi];
                    const value = Math.round((m.scores.reasoning + m.scores.coding) / 2 / (m.price_in + 1) * 10);
                    return (
                      <tr key={m.id} className="bench-row" style={{ borderTop: `1px solid ${V.border}`, transition: 'background 0.15s', opacity: selectedModels.has(m.id) ? 1 : 0.5 }}>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: col, flexShrink: 0 }} />
                            <span style={{ color: '#e4e4ed', fontWeight: 700 }}>{m.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px', color: V.muted }}>{m.provider}</td>
                        <td style={{ padding: '12px 16px', color: '#dde0f0', fontFamily: 'DM Mono, monospace' }}>{m.ctx}K</td>
                        <td style={{ padding: '12px 16px', color: V.green, fontFamily: 'DM Mono, monospace', fontWeight: 700 }}>${m.price_in.toFixed(2)}</td>
                        <td style={{ padding: '12px 16px', color: V.red, fontFamily: 'DM Mono, monospace', fontWeight: 700 }}>${m.price_out.toFixed(2)}</td>
                        <td style={{ padding: '12px 16px', color: V.teal, fontFamily: 'DM Mono, monospace' }}>{m.ttft}ms</td>
                        <td style={{ padding: '12px 16px', color: V.purple, fontFamily: 'DM Mono, monospace' }}>{m.tok_s}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ height: 6, width: `${Math.min(100, value)}%`, background: col, borderRadius: 999, minWidth: 20 }} />
                            <span style={{ color: col, fontFamily: 'DM Mono, monospace', fontSize: 11, fontWeight: 700 }}>{value}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* LEADERBOARD TAB */}
        {tab === 'leaderboard' && (
          <div style={{ animation: 'bench-fadeup 0.3s ease' }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, color: V.muted, alignSelf: 'center' }}>Sort by:</span>
              {['mmlu', 'humaneval', 'gsm8k', 'reasoning', 'writing', 'speed'].map(s => (
                <button key={s} className={`bench-tab${sortBy === s ? ' active' : ''}`} onClick={() => setSortBy(s)} style={{ border: `1px solid ${sortBy === s ? V.gold : V.border}`, fontFamily: 'Syne, sans-serif', textTransform: 'uppercase', fontSize: 10 }}>{s}</button>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {sorted.map((model, rank) => {
                const col = SCORE_COLORS[MODELS.findIndex(m => m.id === model.id)];
                const score = model[sortBy] || model.scores[sortBy] || 0;
                const medals = ['🥇', '🥈', '🥉'];
                return (
                  <div key={model.id} className="bench-card" style={{ background: V.surface2, border: `1px solid ${rank === 0 ? col + '66' : V.border}`, borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, transition: 'all 0.2s', boxShadow: rank === 0 ? `0 0 20px ${col}22` : 'none' }}>
                    <div style={{ fontSize: 22, width: 30, textAlign: 'center', flexShrink: 0 }}>{medals[rank] || `#${rank + 1}`}</div>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: col, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, color: '#fff', fontSize: 14 }}>{model.name}</div>
                      <div style={{ fontSize: 11, color: V.muted }}>{model.provider}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 22, fontWeight: 800, color: col, fontFamily: 'DM Mono, monospace' }}>{score}</div>
                        <div style={{ fontSize: 9, color: V.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{sortBy}</div>
                      </div>
                      <div style={{ width: 120 }}>
                        <ScoreBar value={score} color={col} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* BENCHMARK RUNNER */}
        {(running || runLog.length > 0) && (
          <div style={{ background: V.surface2, border: `1px solid ${V.border}`, borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: `1px solid ${V.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: running ? V.gold : V.green, animation: running ? 'bench-pulse 1.5s infinite' : 'none', display: 'inline-block' }} />
              <span style={{ fontWeight: 800, color: '#fff', fontSize: 13 }}>Benchmark Runner</span>
              {running && <span style={{ fontSize: 11, color: V.gold, fontFamily: 'DM Mono, monospace' }}>{runProgress}%</span>}
            </div>
            {running && (
              <div style={{ height: 3, background: V.surface3 }}>
                <div style={{ height: '100%', width: `${runProgress}%`, background: `linear-gradient(90deg,${V.gold},${V.teal})`, transition: 'width 0.4s ease' }} />
              </div>
            )}
            <div ref={logRef} style={{ height: 160, overflowY: 'auto', padding: '12px 16px', background: '#060609', fontFamily: 'DM Mono, monospace', fontSize: 11 }}>
              {runLog.map(l => (
                <div key={l.id} style={{ color: l.color, padding: '1.5px 0', animation: 'bench-fadeup 0.2s ease' }}>{l.text}</div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
