import { useState, useEffect, useRef } from 'react';

const injectStyles = () => {
  if (document.getElementById('aitraining-styles')) return;
  const s = document.createElement('style');
  s.id = 'aitraining-styles';
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap');
    @keyframes ait-pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
    @keyframes ait-spin { to{transform:rotate(360deg)} }
    @keyframes ait-fadeup { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
    @keyframes ait-shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
    @keyframes ait-counter { from{opacity:0} to{opacity:1} }
    @keyframes ait-fill { from{stroke-dashoffset:var(--from,200)} to{stroke-dashoffset:var(--to,0)} }
    .ait-card:hover { border-color: rgba(245,183,49,0.3) !important; transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.4) !important; }
    .ait-btn:hover { filter: brightness(1.15); transform: translateY(-1px); }
    .ait-row:hover { background: rgba(255,255,255,0.03) !important; }
    .ait-tab { cursor:pointer; padding:6px 14px; border-radius:6px; font-size:12px; font-weight:700; transition:all 0.2s; }
    .ait-tab.active { background:var(--gold); color:#000; }
    .ait-tab:not(.active) { color:var(--muted); }
    .ait-tab:not(.active):hover { color:#fff; background:rgba(255,255,255,0.06); }
  `;
  document.head.appendChild(s);
};

const VARS = { gold:'#f5b731', teal:'#22d3ee', purple:'#a78bfa', surface:'#0e0e16', surface2:'#16161e', surface3:'#1d1d28', border:'rgba(255,255,255,0.07)', muted:'#6e7191', red:'#ef4444', blue:'#3b82f6', green:'#22c55e' };

const MOCK_DATASETS = [
  { id:1, name:'Instruction-Tuning-v3', size:284, rows:125000, type:'Instruction', status:'Ready', date:'2026-05-28' },
  { id:2, name:'CodeGen-Python-2M', size:1820, rows:2100000, type:'Code', status:'Ready', date:'2026-05-25' },
  { id:3, name:'QA-Medical-Expert', size:97, rows:48000, type:'QA', status:'Processing', date:'2026-05-30' },
  { id:4, name:'Conversational-Chat-XL', size:542, rows:890000, type:'Text', status:'Ready', date:'2026-05-22' },
  { id:5, name:'SciPapers-Summarizer', size:374, rows:62000, type:'Text', status:'Error', date:'2026-05-29' },
  { id:6, name:'Legal-Contract-QA', size:128, rows:35000, type:'QA', status:'Ready', date:'2026-05-20' },
  { id:7, name:'Multi-Turn-Dialog-v2', size:660, rows:310000, type:'Instruction', status:'Ready', date:'2026-05-18' },
  { id:8, name:'SQL-Schema-Codegen', size:209, rows:78000, type:'Code', status:'Processing', date:'2026-05-31' },
];

const SAMPLE_ROWS = {
  Instruction: ['{"instruction":"Summarize the following text","input":"The Apollo 11 mission...","output":"Apollo 11 was the first crewed lunar landing mission."}','{"instruction":"Translate to French","input":"Hello world","output":"Bonjour le monde"}','{"instruction":"Fix this bug","input":"def add(a,b): return a-b","output":"def add(a,b): return a+b"}','{"instruction":"Write a poem about AI","input":"","output":"Silicon dreams in endless streams..."}','{"instruction":"Classify sentiment","input":"This product is amazing!","output":"POSITIVE"}'],
  Code: ['// Python: Fibonacci sequence\\ndef fib(n): return n if n<=1 else fib(n-1)+fib(n-2)','// TypeScript: Sort array\\nconst sort = (arr: number[]) => arr.sort((a,b) => a-b)','// SQL: Get top 10 users\\nSELECT * FROM users ORDER BY score DESC LIMIT 10','// Bash: Count files\\nfind . -type f | wc -l','// React: useEffect hook\\nuseEffect(() => { fetchData(); }, [id]);'],
  QA: ['Q: What is the capital of France? A: Paris','Q: Who invented the telephone? A: Alexander Graham Bell','Q: What is 2+2? A: 4','Q: What year did WW2 end? A: 1945','Q: What is the speed of light? A: ~299,792,458 m/s'],
  Text: ['The transformer architecture revolutionized NLP by introducing self-attention mechanisms.','Large language models are trained on vast corpora of internet text using next-token prediction.','Fine-tuning adapts a pre-trained model to a specific task with supervised learning.','RLHF aligns language models with human preferences using reinforcement learning.','Quantization reduces model size by representing weights with fewer bits.'],
};

const TRAINED_MODELS = [
  { id:1, name:'InstructBot-v2.1', base:'GPT-4o', date:'2026-05-20', accuracy:96.3, size:14.2, status:'Production' },
  { id:2, name:'CodeAssist-Pro', base:'Claude-3.5', date:'2026-05-15', accuracy:94.8, size:7.8, status:'Production' },
  { id:3, name:'MedQA-Expert', base:'Llama-3', date:'2026-05-10', accuracy:91.2, size:3.4, status:'Staging' },
  { id:4, name:'LegalBot-Alpha', base:'Mistral-7B', date:'2026-05-05', accuracy:88.7, size:4.1, status:'Staging' },
  { id:5, name:'ChatHelper-v1', base:'Gemini-Pro', date:'2026-04-28', accuracy:85.4, size:6.2, status:'Archived' },
  { id:6, name:'SQLGen-Base', base:'Llama-3', date:'2026-04-20', accuracy:82.1, size:3.4, status:'Archived' },
];

const HYPERPARAM_SWEEP = [
  { lr:'0.0001', epochs:10, batch:16, valLoss:0.124, valAcc:96.3 },
  { lr:'0.0003', epochs:10, batch:16, valLoss:0.118, valAcc:97.1 },
  { lr:'0.0005', epochs:15, batch:32, valLoss:0.109, valAcc:97.8 },
  { lr:'0.001',  epochs:15, batch:32, valLoss:0.103, valAcc:98.2 },
  { lr:'0.001',  epochs:20, batch:64, valLoss:0.098, valAcc:98.7 },
  { lr:'0.002',  epochs:20, batch:64, valLoss:0.112, valAcc:97.4 },
  { lr:'0.003',  epochs:20, batch:32, valLoss:0.131, valAcc:96.1 },
  { lr:'0.005',  epochs:25, batch:16, valLoss:0.157, valAcc:94.3 },
  { lr:'0.005',  epochs:30, batch:32, valLoss:0.143, valAcc:95.2 },
  { lr:'0.007',  epochs:25, batch:64, valLoss:0.172, valAcc:93.1 },
  { lr:'0.01',   epochs:30, batch:32, valLoss:0.198, valAcc:91.4 },
  { lr:'0.01',   epochs:30, batch:64, valLoss:0.211, valAcc:90.2 },
];

const LOG_TEMPLATES = [
  '[TRAIN] Epoch {e}/20 — loss: {l} — acc: {a}% — lr: 0.0005',
  '[VALID] Val loss: {l} — Val acc: {a}% — ETA: {t}min',
  '[GPU] Memory: {m}GB / 40GB — Utilization: {u}%',
  '[DATA] Batch {b}/3906 loaded — tokens/sec: {k}K',
  '[CKPT] Checkpoint saved → model_epoch_{e}.pt',
  '[OPTIM] AdamW step {s} — gradient norm: {g}',
  '[INFO] Learning rate scheduled: {lr} → {lr2}',
  '[WARN] High loss spike detected at step {s} — monitoring',
];

const AUG_TECHNIQUES = [
  { id:'synonym', name:'Synonym Replacement', desc:'Randomly replaces words with synonyms to increase lexical diversity', before:'The model performs well on benchmarks', after:'The model excels well on evaluations' },
  { id:'backtrans', name:'Back-Translation', desc:'Translates text to another language and back for paraphrase diversity', before:'Fix the bug in the function', after:'Resolve the defect within the function' },
  { id:'insertion', name:'Random Insertion', desc:'Randomly inserts relevant synonyms into the sentence', before:'Train the neural network', after:'Train the advanced neural deep network' },
  { id:'shuffle', name:'Sentence Shuffling', desc:'Shuffles sentences in a document to improve order robustness', before:'First: collect data. Second: train. Third: evaluate.', after:'Second: train. First: collect data. Third: evaluate.' },
  { id:'noise', name:'Noise Injection', desc:'Adds character-level noise to simulate typos and misspellings', before:'Analyze the codebase for errors', after:'Analy2e the codebaes for errrs' },
  { id:'paraphrase', name:'Paraphrase Generation', desc:'Uses a paraphrase model to generate semantically equivalent variants', before:'How do I connect to the database?', after:'What is the procedure to establish a database connection?' },
];

function StatCard({ label, value, color, icon }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const num = parseFloat(value);
    if (isNaN(num)) return;
    let start = 0; const end = num; const steps = 40; const step = end / steps;
    const t = setInterval(() => { start += step; if (start >= end) { setDisplay(end); clearInterval(t); } else { setDisplay(parseFloat(start.toFixed(1))); } }, 30);
    return () => clearInterval(t);
  }, [value]);
  return (
    <div style={{ background: VARS.surface2, border: `1px solid ${VARS.border}`, borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 140, transition: 'all 0.2s' }} className="ait-card">
      <div style={{ fontSize: 28 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color: color || VARS.gold, fontFamily: 'Syne, sans-serif', lineHeight: 1.1 }}>{display}{typeof value === 'string' && value.includes('%') ? '%' : ''}</div>
        <div style={{ fontSize: 11, color: VARS.muted, marginTop: 2 }}>{label}</div>
      </div>
    </div>
  );
}

function LossSparkline({ points }) {
  const w = 160, h = 50;
  const min = Math.min(...points), max = Math.max(...points), range = max - min || 1;
  const px = (i) => (i / (points.length - 1)) * w;
  const py = (v) => h - ((v - min) / range) * (h - 6) - 3;
  const d = points.map((v, i) => `${i === 0 ? 'M' : 'L'} ${px(i)} ${py(v)}`).join(' ');
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <defs><linearGradient id="lossgrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={VARS.gold} stopOpacity="0.3"/><stop offset="100%" stopColor={VARS.gold} stopOpacity="0"/></linearGradient></defs>
      <path d={`${d} L ${w} ${h} L 0 ${h} Z`} fill="url(#lossgrad)" />
      <path d={d} fill="none" stroke={VARS.gold} strokeWidth="1.5" />
    </svg>
  );
}

function RadarChart() {
  const metrics = ['Accuracy', 'Speed', 'Coherence', 'Safety', 'Creativity'];
  const valA = [0.963, 0.72, 0.88, 0.95, 0.74];
  const valB = [0.948, 0.86, 0.81, 0.91, 0.82];
  const cx = 120, cy = 120, r = 90;
  const angle = (i) => (i / 5) * Math.PI * 2 - Math.PI / 2;
  const pt = (val, i) => ({ x: cx + r * val * Math.cos(angle(i)), y: cy + r * val * Math.sin(angle(i)) });
  const gridPts = (scale) => metrics.map((_, i) => pt(scale, i));
  const gridPath = (scale) => gridPts(scale).map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
  return (
    <svg width={240} height={240} viewBox="0 0 240 240">
      {[0.25, 0.5, 0.75, 1].map(s => <path key={s} d={gridPath(s)} fill="none" stroke={VARS.border} strokeWidth="1" />)}
      {metrics.map((m, i) => { const p = pt(1.15, i); return <text key={m} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" fontSize="9" fill={VARS.muted}>{m}</text>; })}
      <polygon points={valA.map((v,i)=>{ const p=pt(v,i); return `${p.x},${p.y}`; }).join(' ')} fill={`${VARS.gold}33`} stroke={VARS.gold} strokeWidth="2" />
      <polygon points={valB.map((v,i)=>{ const p=pt(v,i); return `${p.x},${p.y}`; }).join(' ')} fill={`${VARS.teal}33`} stroke={VARS.teal} strokeWidth="2" />
    </svg>
  );
}

export default function AITraining() {
  useEffect(() => { injectStyles(); }, []);

  const [datasets, setDatasets] = useState(MOCK_DATASETS);
  const [previewId, setPreviewId] = useState(null);
  const [models, setModels] = useState(TRAINED_MODELS);
  const [selectedHyper, setSelectedHyper] = useState(4);
  const [augToggles, setAugToggles] = useState({ synonym:true, backtrans:false, insertion:false, shuffle:true, noise:false, paraphrase:false });
  const [augPreview, setAugPreview] = useState(null);
  const [logs, setLogs] = useState([]);
  const [training, setTraining] = useState(false);
  const [trainProgress, setTrainProgress] = useState(0);
  const [form, setForm] = useState({ model:'GPT-4o', dataset:'', lr:0.001, epochs:20, batch:32, lora:false, loraRank:16 });
  const [formOpen, setFormOpen] = useState(true);
  const logRef = useRef(null);
  const epochRef = useRef(1);

  const [runLoss, setRunLoss] = useState(() => [
    Array.from({length:20}, (_,i) => 0.8 - i*0.032 + (Math.random()-0.5)*0.04),
    Array.from({length:20}, (_,i) => 0.75 - i*0.028 + (Math.random()-0.5)*0.04),
    Array.from({length:20}, (_,i) => 0.72 - i*0.025 + (Math.random()-0.5)*0.04),
  ]);


  const ACTIVE_RUNS = [
    { id:1, model:'GPT-4o', dataset:'Instruction-Tuning-v3', epoch:14, totalEpochs:20, acc:96.8, gpuMem:28.4, eta:'12' },
    { id:2, model:'Llama-3', dataset:'CodeGen-Python-2M', epoch:7, totalEpochs:25, acc:91.2, gpuMem:18.7, eta:'38' },
    { id:3, model:'Mistral-7B', dataset:'QA-Medical-Expert', epoch:3, totalEpochs:15, acc:84.5, gpuMem:9.2, eta:'22' },
  ];

  useEffect(() => {
    const t = setInterval(() => {
      setRunLoss(prev => prev.map(arr => {
        const last = arr[arr.length-1];
        const next = Math.max(0.05, last - 0.003 + (Math.random()-0.5)*0.012);
        return [...arr.slice(1), next];
      }));
    }, 2000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const templates = LOG_TEMPLATES;
    const t = setInterval(() => {
      const tmpl = templates[Math.floor(Math.random()*templates.length)];
      const e = epochRef.current;
      const line = tmpl
        .replace(/{e}/g, e)
        .replace(/{l}/g, (0.1 + Math.random()*0.05).toFixed(4))
        .replace(/{a}/g, (94 + Math.random()*4).toFixed(1))
        .replace(/{t}/g, Math.floor(5+Math.random()*30))
        .replace(/{m}/g, (20+Math.random()*15).toFixed(1))
        .replace(/{u}/g, Math.floor(75+Math.random()*20))
        .replace(/{b}/g, Math.floor(Math.random()*3906))
        .replace(/{k}/g, Math.floor(40+Math.random()*20))
        .replace(/{s}/g, Math.floor(Math.random()*50000))
        .replace(/{g}/g, (0.5+Math.random()*2).toFixed(3))
        .replace(/{lr}/g, '0.0005')
        .replace(/{lr2}/g, '0.0003');
      epochRef.current = (e % 20) + 1;
      setLogs(prev => [...prev.slice(-80), { id: Date.now(), text: line, color: line.includes('[WARN]') ? VARS.gold : line.includes('[CKPT]') ? VARS.teal : '#4ade80' }]);
      if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
    }, 2500);
    return () => clearInterval(t);
  }, []);

  const startTraining = () => {
    if (training) return;
    setTraining(true);
    setTrainProgress(0);
    let p = 0;
    const t = setInterval(() => {
      p += 100 / 40;
      setTrainProgress(Math.min(100, p));
      if (p >= 100) { clearInterval(t); setTraining(false); }
    }, 100);
  };

  const statusColor = (s) => ({ Ready: VARS.green, Processing: VARS.gold, Error: VARS.red }[s] || VARS.muted);

  return (
    <div style={{ padding: '0 0 80px', fontFamily: 'Syne, sans-serif', background: VARS.surface, minHeight: '100vh' }}>
      {/* HERO */}
      <div style={{ background: 'linear-gradient(135deg, #0e0e16 0%, #1a1020 50%, #0e1420 100%)', borderBottom: `1px solid ${VARS.border}`, padding: '32px 32px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
          <div style={{ fontSize: 28 }}>🧠</div>
          <div>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>AI Training Studio</h1>
            <div style={{ fontSize: 12, color: VARS.muted, marginTop: 2 }}>Fine-tune, evaluate, and deploy custom AI models</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 14, marginTop: 20, flexWrap: 'wrap' }}>
          <StatCard label="Datasets" value={47} icon="📦" color={VARS.teal} />
          <StatCard label="Active Runs" value={3} icon="⚡" color={VARS.gold} />
          <StatCard label="Models Trained" value={128} icon="🤖" color={VARS.purple} />
          <StatCard label="Avg Accuracy %" value={94.7} icon="🎯" color={VARS.green} />
        </div>
      </div>

      <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 28 }}>

        {/* DATASET MANAGER */}
        <div style={{ background: VARS.surface2, border: `1px solid ${VARS.border}`, borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px', borderBottom: `1px solid ${VARS.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: '#fff' }}>📦 Dataset Manager</div>
            <button className="ait-btn" style={{ padding: '6px 14px', borderRadius: 8, border: `1px solid ${VARS.gold}`, background: 'transparent', color: VARS.gold, cursor: 'pointer', fontSize: 11, fontWeight: 700, transition: 'all 0.2s' }}>+ Upload Dataset</button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ background: VARS.surface3 }}>
                  {['Name', 'Size (MB)', 'Rows', 'Type', 'Status', 'Date', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: VARS.muted, fontWeight: 700, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {datasets.map(ds => (
                  <>
                    <tr key={ds.id} className="ait-row" style={{ borderTop: `1px solid ${VARS.border}`, transition: 'background 0.15s' }}>
                      <td style={{ padding: '12px 16px', color: '#e4e4ed', fontWeight: 600 }}>{ds.name}</td>
                      <td style={{ padding: '12px 16px', color: VARS.muted, fontFamily: 'DM Mono, monospace' }}>{ds.size.toLocaleString()}</td>
                      <td style={{ padding: '12px 16px', color: VARS.muted, fontFamily: 'DM Mono, monospace' }}>{ds.rows.toLocaleString()}</td>
                      <td style={{ padding: '12px 16px' }}><span style={{ padding: '2px 8px', borderRadius: 999, fontSize: 10, fontWeight: 700, background: 'rgba(167,139,250,0.15)', color: VARS.purple }}>{ds.type}</span></td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 999, fontSize: 10, fontWeight: 700, background: `${statusColor(ds.status)}22`, color: statusColor(ds.status) }}>
                          <span style={{ width: 5, height: 5, borderRadius: '50%', background: statusColor(ds.status), animation: ds.status === 'Processing' ? 'ait-pulse 1.5s infinite' : 'none' }} />
                          {ds.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', color: VARS.muted, fontFamily: 'DM Mono, monospace', fontSize: 11 }}>{ds.date}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {['Train','Preview','Delete'].map(a => (
                            <button key={a} className="ait-btn" onClick={() => { if(a==='Preview') setPreviewId(previewId===ds.id?null:ds.id); if(a==='Delete') setDatasets(prev=>prev.filter(d=>d.id!==ds.id)); }} style={{ padding: '4px 10px', borderRadius: 6, border: `1px solid ${a==='Delete'?VARS.red:a==='Train'?VARS.gold:VARS.border}`, background: 'transparent', color: a==='Delete'?VARS.red:a==='Train'?VARS.gold:'#ccc', cursor: 'pointer', fontSize: 10, fontWeight: 700, transition: 'all 0.2s' }}>{a}</button>
                          ))}
                        </div>
                      </td>
                    </tr>
                    {previewId === ds.id && (
                      <tr key={`preview-${ds.id}`}>
                        <td colSpan={7} style={{ padding: '0 16px 12px', background: VARS.surface3 }}>
                          <div style={{ padding: '12px', borderRadius: 8, background: '#060609', border: `1px solid ${VARS.border}`, fontFamily: 'DM Mono, monospace', fontSize: 11 }}>
                            <div style={{ color: VARS.gold, fontWeight: 700, marginBottom: 8, fontSize: 10 }}>SAMPLE ROWS ({ds.type})</div>
                            {(SAMPLE_ROWS[ds.type] || SAMPLE_ROWS.Text).map((row, i) => (
                              <div key={i} style={{ color: '#adb5bd', padding: '4px 0', borderBottom: i < 4 ? `1px solid rgba(255,255,255,0.04)` : 'none', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{i+1}. {row}</div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TRAINING JOB BUILDER */}
        <div style={{ background: VARS.surface2, border: `1px solid ${VARS.border}`, borderRadius: 16, overflow: 'hidden' }}>
          <div onClick={() => setFormOpen(v=>!v)} style={{ padding: '18px 24px', borderBottom: formOpen ? `1px solid ${VARS.border}` : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: '#fff' }}>⚙️ Training Job Builder</div>
            <span style={{ color: VARS.muted, fontSize: 16, transition: 'transform 0.2s', transform: formOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
          </div>
          {formOpen && (
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 18, marginBottom: 20 }}>
                {[
                  { label: 'Base Model', key: 'model', type: 'select', opts: ['GPT-4o','Claude-3.5','Llama-3','Mistral-7B','Gemini-Pro'] },
                  { label: 'Dataset', key: 'dataset', type: 'select', opts: ['', ...datasets.map(d=>d.name)] },
                  { label: 'Epochs', key: 'epochs', type: 'number', min:1, max:50 },
                  { label: 'Batch Size', key: 'batch', type: 'select', opts: [8,16,32,64] },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ fontSize: 11, color: VARS.muted, fontWeight: 700, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{f.label}</label>
                    {f.type === 'select' ? (
                      <select value={form[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} style={{ width:'100%', padding:'8px 12px', background:VARS.surface3, border:`1px solid ${VARS.border}`, borderRadius:8, color:'#e4e4ed', fontSize:12, outline:'none' }}>
                        {f.opts.map(o=><option key={o} value={o}>{o||'Select dataset...'}</option>)}
                      </select>
                    ) : (
                      <input type="number" value={form[f.key]} min={f.min} max={f.max} onChange={e=>setForm(p=>({...p,[f.key]:+e.target.value}))} style={{ width:'100%', padding:'8px 12px', background:VARS.surface3, border:`1px solid ${VARS.border}`, borderRadius:8, color:'#e4e4ed', fontSize:12, outline:'none', boxSizing:'border-box' }} />
                    )}
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={{ fontSize: 11, color: VARS.muted, fontWeight: 700, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Learning Rate: {form.lr.toFixed(4)}</label>
                <input type="range" min="0.0001" max="0.01" step="0.0001" value={form.lr} onChange={e=>setForm(p=>({...p,lr:parseFloat(e.target.value)}))} style={{ width:'100%', accentColor: VARS.gold }} />
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:10, color:VARS.muted, marginTop:3 }}><span>0.0001</span><span>0.01</span></div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
                <input type="checkbox" id="lora" checked={form.lora} onChange={e=>setForm(p=>({...p,lora:e.target.checked}))} style={{ accentColor:VARS.purple, width:14, height:14 }} />
                <label htmlFor="lora" style={{ fontSize:12, color:'#dde0f0', cursor:'pointer' }}>Enable LoRA (Low-Rank Adaptation)</label>
                {form.lora && (
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ fontSize:11, color:VARS.muted }}>Rank:</span>
                    <input type="number" value={form.loraRank} min={4} max={128} step={4} onChange={e=>setForm(p=>({...p,loraRank:+e.target.value}))} style={{ width:60, padding:'4px 8px', background:VARS.surface3, border:`1px solid ${VARS.border}`, borderRadius:6, color:'#e4e4ed', fontSize:11, outline:'none' }} />
                  </div>
                )}
              </div>
              {training && (
                <div style={{ marginBottom:16 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:VARS.muted, marginBottom:6 }}>
                    <span>Training progress...</span><span style={{ color:VARS.gold, fontWeight:700 }}>{Math.round(trainProgress)}%</span>
                  </div>
                  <div style={{ height:6, background:VARS.surface3, borderRadius:999, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${trainProgress}%`, background:`linear-gradient(90deg,${VARS.gold},${VARS.teal})`, borderRadius:999, transition:'width 0.1s linear' }} />
                  </div>
                </div>
              )}
              <button className="ait-btn" onClick={startTraining} disabled={training} style={{ padding:'10px 28px', borderRadius:10, background:training?VARS.surface3:`linear-gradient(135deg,${VARS.gold},#e0a020)`, color:training?VARS.muted:'#000', border:'none', cursor:training?'not-allowed':'pointer', fontWeight:800, fontSize:13, transition:'all 0.2s', fontFamily:'Syne, sans-serif' }}>
                {training ? '⏳ Training...' : '🚀 Start Training'}
              </button>
            </div>
          )}
        </div>

        {/* ACTIVE RUNS MONITOR */}
        <div>
          <div style={{ fontWeight:800, fontSize:15, color:'#fff', marginBottom:14 }}>⚡ Active Training Runs</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(340px, 1fr))', gap:16 }}>
            {ACTIVE_RUNS.map((run, ri) => (
              <div key={run.id} className="ait-card" style={{ background:VARS.surface2, border:`1px solid ${VARS.border}`, borderRadius:14, padding:'20px', transition:'all 0.2s' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                  <div>
                    <div style={{ fontWeight:800, color:'#fff', fontSize:13 }}>{run.model}</div>
                    <div style={{ fontSize:11, color:VARS.muted, marginTop:2 }}>{run.dataset}</div>
                  </div>
                  <span style={{ display:'flex', alignItems:'center', gap:5, padding:'3px 9px', borderRadius:999, background:'rgba(34,211,238,0.15)', color:VARS.teal, fontSize:10, fontWeight:700 }}>
                    <span style={{ width:5,height:5,borderRadius:'50%',background:VARS.teal,animation:'ait-pulse 1.5s infinite' }} />Running
                  </span>
                </div>
                <div style={{ marginBottom:10 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:VARS.muted, marginBottom:5 }}>
                    <span>Epoch {run.epoch}/{run.totalEpochs}</span>
                    <span style={{ color:VARS.green, fontWeight:700 }}>Acc: {run.acc}%</span>
                  </div>
                  <div style={{ height:4, background:VARS.surface3, borderRadius:999, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${(run.epoch/run.totalEpochs)*100}%`, background:`linear-gradient(90deg,${VARS.teal},${VARS.purple})`, borderRadius:999 }} />
                  </div>
                </div>
                <div style={{ marginBottom:12 }}>
                  <div style={{ fontSize:10, color:VARS.muted, marginBottom:5, fontWeight:700 }}>Loss Curve</div>
                  <LossSparkline points={runLoss[ri]} />
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                  <div>
                    <div style={{ fontSize:10, color:VARS.muted, marginBottom:4 }}>GPU Memory</div>
                    <div style={{ height:4, background:VARS.surface3, borderRadius:999, overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${(run.gpuMem/40)*100}%`, background:run.gpuMem>30?VARS.red:VARS.gold, borderRadius:999 }} />
                    </div>
                    <div style={{ fontSize:10, color:VARS.muted, marginTop:3, fontFamily:'DM Mono, monospace' }}>{run.gpuMem}GB / 40GB</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:10, color:VARS.muted }}>ETA</div>
                    <div style={{ fontSize:18, fontWeight:800, color:VARS.gold, fontFamily:'DM Mono, monospace' }}>{run.eta}m</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MODEL REGISTRY */}
        <div style={{ background:VARS.surface2, border:`1px solid ${VARS.border}`, borderRadius:16, overflow:'hidden' }}>
          <div style={{ padding:'18px 24px', borderBottom:`1px solid ${VARS.border}` }}>
            <div style={{ fontWeight:800, fontSize:15, color:'#fff' }}>🤖 Model Registry</div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:16, padding:'20px' }}>
            {models.map(m => {
              const statusColor = m.status === 'Production' ? VARS.green : m.status === 'Staging' ? VARS.gold : VARS.muted;
              return (
                <div key={m.id} className="ait-card" style={{ background:VARS.surface3, border:`1px solid ${VARS.border}`, borderRadius:12, padding:'18px', transition:'all 0.2s' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
                    <div style={{ fontWeight:800, color:'#fff', fontSize:13 }}>{m.name}</div>
                    <span style={{ padding:'2px 8px', borderRadius:999, fontSize:10, fontWeight:700, background:`${statusColor}22`, color:statusColor }}>{m.status}</span>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:14 }}>
                    {[['Base', m.base], ['Date', m.date], ['Size', `${m.size}GB`], ['Accuracy', `${m.accuracy}%`]].map(([k,v]) => (
                      <div key={k}>
                        <div style={{ fontSize:10, color:VARS.muted }}>{k}</div>
                        <div style={{ fontSize:12, color: k==='Accuracy'?VARS.green:'#dde0f0', fontWeight:700, fontFamily:'DM Mono, monospace' }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display:'flex', gap:8 }}>
                    <button className="ait-btn" onClick={() => setModels(prev=>prev.map(x=>x.id===m.id?{...x,status:x.status==='Production'?'Staging':'Production'}:x))} style={{ flex:1, padding:'6px', borderRadius:7, border:`1px solid ${VARS.gold}`, background:'transparent', color:VARS.gold, cursor:'pointer', fontSize:10, fontWeight:700, transition:'all 0.2s' }}>Deploy</button>
                    <button className="ait-btn" onClick={() => setModels(prev=>prev.map(x=>x.id===m.id?{...x,status:'Archived'}:x))} style={{ flex:1, padding:'6px', borderRadius:7, border:`1px solid ${VARS.border}`, background:'transparent', color:VARS.muted, cursor:'pointer', fontSize:10, fontWeight:700, transition:'all 0.2s' }}>Archive</button>
                    <button className="ait-btn" onClick={() => setModels(prev=>prev.filter(x=>x.id!==m.id))} style={{ padding:'6px 10px', borderRadius:7, border:`1px solid ${VARS.red}`, background:'transparent', color:VARS.red, cursor:'pointer', fontSize:10, fontWeight:700, transition:'all 0.2s' }}>✕</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* EVALUATION DASHBOARD */}
        <div style={{ background:VARS.surface2, border:`1px solid ${VARS.border}`, borderRadius:16, padding:'24px' }}>
          <div style={{ fontWeight:800, fontSize:15, color:'#fff', marginBottom:20 }}>📊 Evaluation Dashboard</div>
          <div style={{ display:'grid', gridTemplateColumns:'240px 1fr', gap:28, alignItems:'start' }}>
            <div>
              <div style={{ fontSize:10, color:VARS.muted, marginBottom:8, fontWeight:700, textTransform:'uppercase' }}>Model Comparison</div>
              <RadarChart />
              <div style={{ display:'flex', gap:12, marginTop:10 }}>
                <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11 }}><span style={{ width:12,height:3,background:VARS.gold,borderRadius:2,display:'inline-block' }} /><span style={{ color:VARS.muted }}>InstructBot-v2.1</span></div>
                <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11 }}><span style={{ width:12,height:3,background:VARS.teal,borderRadius:2,display:'inline-block' }} /><span style={{ color:VARS.muted }}>CodeAssist-Pro</span></div>
              </div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {[['BLEU Score', 87.3, 84.1], ['Perplexity (lower=better)', 12.4, 15.8], ['Coherence', 88.0, 81.0], ['Safety Score', 95.0, 91.0]].map(([label, a, b]) => (
                <div key={label}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:VARS.muted, marginBottom:6 }}>
                    <span>{label}</span>
                    <span style={{ fontFamily:'DM Mono, monospace' }}><span style={{ color:VARS.gold }}>{a}</span> vs <span style={{ color:VARS.teal }}>{b}</span></span>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                    <div style={{ height:6, background:VARS.surface3, borderRadius:999, overflow:'hidden' }}><div style={{ height:'100%', width:`${a}%`, background:VARS.gold, borderRadius:999 }} /></div>
                    <div style={{ height:6, background:VARS.surface3, borderRadius:999, overflow:'hidden' }}><div style={{ height:'100%', width:`${b}%`, background:VARS.teal, borderRadius:999 }} /></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* HYPERPARAMETER SWEEP */}
        <div style={{ background:VARS.surface2, border:`1px solid ${VARS.border}`, borderRadius:16, overflow:'hidden' }}>
          <div style={{ padding:'18px 24px', borderBottom:`1px solid ${VARS.border}` }}>
            <div style={{ fontWeight:800, fontSize:15, color:'#fff' }}>🔬 Hyperparameter Sweep</div>
          </div>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
              <thead>
                <tr style={{ background:VARS.surface3 }}>
                  {['#','LR','Epochs','Batch','Val Loss','Val Acc'].map(h=><th key={h} style={{ padding:'10px 16px', textAlign:'left', color:VARS.muted, fontWeight:700, fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em' }}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {HYPERPARAM_SWEEP.map((exp, i) => {
                  const isBest = i === 4;
                  const isSelected = i === selectedHyper;
                  return (
                    <>
                      <tr key={i} className="ait-row" onClick={() => setSelectedHyper(isSelected ? null : i)} style={{ borderTop:`1px solid ${VARS.border}`, cursor:'pointer', background: isBest ? 'rgba(245,183,49,0.05)' : 'transparent', transition:'background 0.15s' }}>
                        <td style={{ padding:'10px 16px', color:VARS.muted, fontFamily:'DM Mono, monospace' }}>{i+1}</td>
                        <td style={{ padding:'10px 16px', color:'#e4e4ed', fontFamily:'DM Mono, monospace' }}>{exp.lr}</td>
                        <td style={{ padding:'10px 16px', color:'#e4e4ed', fontFamily:'DM Mono, monospace' }}>{exp.epochs}</td>
                        <td style={{ padding:'10px 16px', color:'#e4e4ed', fontFamily:'DM Mono, monospace' }}>{exp.batch}</td>
                        <td style={{ padding:'10px 16px', color: exp.valLoss < 0.11 ? VARS.green : exp.valLoss > 0.16 ? VARS.red : VARS.gold, fontFamily:'DM Mono, monospace', fontWeight:700 }}>{exp.valLoss}</td>
                        <td style={{ padding:'10px 16px', fontFamily:'DM Mono, monospace' }}>
                          <span style={{ color: isBest ? VARS.gold : VARS.green, fontWeight: isBest ? 800 : 400 }}>{exp.valAcc}%</span>
                          {isBest && <span style={{ marginLeft:6, padding:'1px 6px', borderRadius:999, background:`${VARS.gold}22`, color:VARS.gold, fontSize:9, fontWeight:800 }}>BEST</span>}
                        </td>
                      </tr>
                      {isSelected && (
                        <tr key={`cfg-${i}`}>
                          <td colSpan={6} style={{ padding:'0 16px 12px', background:VARS.surface3 }}>
                            <pre style={{ margin:0, padding:'12px', background:'#060609', borderRadius:8, fontSize:11, color:'#4ade80', fontFamily:'DM Mono, monospace', border:`1px solid ${VARS.border}` }}>{JSON.stringify({ learning_rate: parseFloat(exp.lr), epochs: exp.epochs, batch_size: exp.batch, optimizer:'AdamW', scheduler:'cosine_annealing', warmup_steps:100, weight_decay:0.01, val_loss: exp.valLoss, val_accuracy: exp.valAcc }, null, 2)}</pre>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* DATA AUGMENTATION */}
        <div style={{ background:VARS.surface2, border:`1px solid ${VARS.border}`, borderRadius:16, padding:'24px' }}>
          <div style={{ fontWeight:800, fontSize:15, color:'#fff', marginBottom:20 }}>🔄 Data Augmentation</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:14 }}>
            {AUG_TECHNIQUES.map(tech => (
              <div key={tech.id} className="ait-card" style={{ background:VARS.surface3, border:`1px solid ${augToggles[tech.id]?VARS.gold:VARS.border}`, borderRadius:12, padding:'16px', transition:'all 0.2s' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                  <div style={{ fontWeight:700, color:'#fff', fontSize:12 }}>{tech.name}</div>
                  <div onClick={() => setAugToggles(p=>({...p,[tech.id]:!p[tech.id]}))} style={{ width:36, height:20, borderRadius:999, background:augToggles[tech.id]?VARS.gold:'rgba(255,255,255,0.1)', cursor:'pointer', position:'relative', transition:'background 0.2s', flexShrink:0 }}>
                    <div style={{ position:'absolute', top:2, left:augToggles[tech.id]?18:2, width:16, height:16, borderRadius:'50%', background:'#fff', transition:'left 0.2s' }} />
                  </div>
                </div>
                <div style={{ fontSize:11, color:VARS.muted, marginBottom:10, lineHeight:1.6 }}>{tech.desc}</div>
                <button className="ait-btn" onClick={() => setAugPreview(augPreview===tech.id?null:tech.id)} style={{ padding:'4px 10px', borderRadius:6, border:`1px solid ${VARS.border}`, background:'transparent', color:VARS.muted, cursor:'pointer', fontSize:10, fontWeight:700, transition:'all 0.2s' }}>Preview</button>
                {augPreview === tech.id && (
                  <div style={{ marginTop:10, padding:'10px', background:'#060609', borderRadius:8, border:`1px solid ${VARS.border}` }}>
                    <div style={{ fontSize:10, color:VARS.muted, marginBottom:4, fontWeight:700 }}>BEFORE</div>
                    <div style={{ fontSize:11, color:'#adb5bd', fontFamily:'DM Mono, monospace', marginBottom:8 }}>{tech.before}</div>
                    <div style={{ fontSize:10, color:VARS.teal, marginBottom:4, fontWeight:700 }}>AFTER</div>
                    <div style={{ fontSize:11, color:'#4ade80', fontFamily:'DM Mono, monospace' }}>{tech.after}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* TRAINING LOGS TERMINAL */}
        <div style={{ background:VARS.surface2, border:`1px solid ${VARS.border}`, borderRadius:16, overflow:'hidden' }}>
          <div style={{ padding:'14px 20px', borderBottom:`1px solid ${VARS.border}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ width:8,height:8,borderRadius:'50%',background:VARS.green,animation:'ait-pulse 1.5s infinite',display:'inline-block' }} />
              <span style={{ fontWeight:800, fontSize:13, color:'#fff' }}>Training Logs</span>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <button className="ait-btn" onClick={() => setLogs([])} style={{ padding:'4px 10px', borderRadius:6, border:`1px solid ${VARS.border}`, background:'transparent', color:VARS.muted, cursor:'pointer', fontSize:10, fontWeight:700, transition:'all 0.2s' }}>Clear</button>
              <button className="ait-btn" onClick={() => { const blob=new Blob([logs.map(l=>l.text).join('\n')],{type:'text/plain'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='training-logs.txt'; a.click(); }} style={{ padding:'4px 10px', borderRadius:6, border:`1px solid ${VARS.gold}`, background:'transparent', color:VARS.gold, cursor:'pointer', fontSize:10, fontWeight:700, transition:'all 0.2s' }}>Export</button>
            </div>
          </div>
          <div ref={logRef} style={{ height:200, overflowY:'auto', padding:'12px 16px', background:'#060609', fontFamily:'DM Mono, monospace', fontSize:11 }}>
            {logs.length === 0 ? <div style={{ color:VARS.muted, textAlign:'center', marginTop:60 }}>Waiting for training logs...</div> : logs.map(l => (
              <div key={l.id} style={{ color:l.color, padding:'1.5px 0', animation:'ait-fadeup 0.3s ease' }}>{l.text}</div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
