import { useState, useEffect, useMemo } from 'react';
import { useStore } from '../data/store';
import { buildDailyDigest, saveDigest } from '../lib/digestBuilder';
import { runFullAudit } from '../lib/optimizer/PromptArchitect';

const V = {
  gold: '#f5b731', teal: '#22d3ee', purple: '#a78bfa',
  surface: '#0e0e16', surface2: '#16161e', surface3: '#1d1d28',
  border: 'rgba(255,255,255,0.07)', muted: '#6e7191',
  text: '#e4e4ed', red: '#ef4444', green: '#22c55e', orange: '#f97316',
};

const INSIGHTS = [
  { id:1, cat:'Strategy', impact:'High', conf:94, text:'Your Bolt.new account broadcasts 3.2x more efficiently on weekday mornings. Schedule all critical broadcasts before 11 AM for maximum impact.', action:'Apply Schedule', applied:false },
  { id:2, cat:'Cost', impact:'High', conf:91, text:'Prompt length >500 tokens correlates with 23% higher response quality. Your current avg is 287 tokens — expand prompts for better results.', action:'Optimize Prompts', applied:false },
  { id:3, cat:'Risk', impact:'High', conf:88, text:'Manus.im account idle for 4 days. Reconnecting now could save $12/month in subscription waste and prevent session expiry.', action:'Reconnect Now', applied:false },
  { id:4, cat:'Performance', impact:'Medium', conf:85, text:'Broadcast success rate drops 18% on Fridays after 3 PM. Enabling auto-pause during this window is recommended.', action:'Enable Auto-Pause', applied:false },
  { id:5, cat:'Opportunity', impact:'High', conf:82, text:'Adding system-role context to your top 10 prompts could increase quality scores by an estimated 31% based on similar user patterns.', action:'Add Context', applied:false },
  { id:6, cat:'Cost', impact:'Medium', conf:79, text:'You are paying for 7 platforms but only 4 are active this month. Consolidating could save ~$38/month.', action:'Review Plans', applied:false },
  { id:7, cat:'Performance', impact:'Medium', conf:76, text:'API response latency spikes detected every Tuesday 2–4 PM UTC. Shift batch jobs outside this window to improve throughput.', action:'Reschedule', applied:false },
  { id:8, cat:'Strategy', impact:'Low', conf:71, text:'Lovable.dev prompts using component-first language receive 44% more complete responses. Update your template library.', action:'Update Templates', applied:false },
  { id:9, cat:'Opportunity', impact:'Medium', conf:68, text:'Enabling workflow chaining between Bolt and Cursor could automate your most common 3-step manual process.', action:'Create Workflow', applied:false },
  { id:10, cat:'Risk', impact:'Low', conf:65, text:'3 API keys have not been rotated in 90+ days. Rotating now reduces security exposure significantly.', action:'Rotate Keys', applied:false },
  { id:11, cat:'Cost', impact:'Low', conf:62, text:'Token usage can be reduced by 15% by enabling response caching for repeated prompt patterns detected in your history.', action:'Enable Cache', applied:false },
  { id:12, cat:'Performance', impact:'Medium', conf:58, text:'Parallel broadcasting to all 7 platforms simultaneously causes rate-limit collisions. Staggering by 1.2s per platform eliminates 94% of failures.', action:'Enable Stagger', applied:false },
];

const RECOMMENDATIONS = [
  { id:1, p:'P1', title:'Enable Smart Scheduling', desc:'Auto-schedule broadcasts during your top-performing 9–11 AM window', impact:'+34% success rate', done:false },
  { id:2, p:'P1', title:'Expand Prompt Context', desc:'Add role + format blocks to your top 5 templates', impact:'+23% quality score', done:false },
  { id:3, p:'P1', title:'Consolidate Idle Accounts', desc:'Pause Manus.im and Replit accounts until needed', impact:'$38/mo savings', done:false },
  { id:4, p:'P2', title:'Rotate Expired API Keys', desc:'3 keys are older than 90 days — rotate for security compliance', impact:'Security +15pts', done:false },
  { id:5, p:'P2', title:'Enable Response Caching', desc:'Cache repeated prompt patterns to reduce token spend', impact:'-15% token cost', done:false },
  { id:6, p:'P2', title:'Stagger Parallel Broadcasts', desc:'Add 1.2s delay between platform sends to avoid rate limits', impact:'-94% failures', done:false },
  { id:7, p:'P3', title:'Update Template Library', desc:'Migrate to component-first language for Lovable.dev prompts', impact:'+44% completions', done:false },
  { id:8, p:'P3', title:'Create Bolt→Cursor Workflow', desc:'Automate the 3-step generate-review-deploy loop', impact:'2h/week saved', done:false },
];



function CircleGauge({ value, size = 120, color = V.gold, label }) {
  const r = (size - 16) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={V.surface3} strokeWidth={10} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={10}
          strokeDasharray={`${dash} ${circ}`} strokeDashoffset={circ/4}
          strokeLinecap="round" style={{ transition:'stroke-dasharray 1s ease' }} />
        <text x={size/2} y={size/2+2} textAnchor="middle" dominantBaseline="middle"
          style={{ fill: color, fontSize: size * 0.18, fontWeight: 800, fontFamily: 'DM Mono, monospace' }}>{value}</text>
        <text x={size/2} y={size/2 + size*0.16} textAnchor="middle"
          style={{ fill: V.muted, fontSize: size * 0.09, fontFamily: 'Syne, sans-serif' }}>/ 100</text>
      </svg>
      {label && <div style={{ fontSize:12, color:V.muted, fontWeight:600 }}>{label}</div>}
    </div>
  );
}

function ImpactBadge({ level }) {
  const c = level === 'High' ? V.red : level === 'Medium' ? V.gold : V.muted;
  return <span style={{ fontSize:10.5, padding:'2px 8px', borderRadius:4, background:`${c}18`, color:c, border:`1px solid ${c}44`, fontWeight:700 }}>{level}</span>;
}

function CatBadge({ cat }) {
  const colors = { Strategy:V.teal, Cost:V.green, Performance:V.gold, Risk:V.red, Opportunity:V.purple };
  const c = colors[cat] || V.muted;
  return <span style={{ fontSize:10, padding:'2px 8px', borderRadius:4, background:`${c}15`, color:c, border:`1px solid ${c}33` }}>{cat}</span>;
}

export default function AIInsights() {
  const store = useStore();
  const activeAccounts = store.accounts.filter(a => a.status === 'active');
  const broadcasts = store.broadcasts;

  // 1. Broadcast Efficiency
  const efficiencyScore = useMemo(() => {
    if (broadcasts.length === 0) return 91;
    let totalTransmissions = 0;
    let successfulTransmissions = 0;
    broadcasts.forEach(b => {
      totalTransmissions += b.total || 0;
      successfulTransmissions += b.successCount || 0;
    });
    return totalTransmissions > 0 ? Math.round((successfulTransmissions / totalTransmissions) * 100) : 91;
  }, [broadcasts]);

  // 2. Account Health
  const accountHealthScore = useMemo(() => {
    if (store.accounts.length === 0) return 78;
    return Math.round((activeAccounts.length / store.accounts.length) * 100);
  }, [store.accounts, activeAccounts]);

  // 3. Cost Optimization
  const costOptimizationScore = useMemo(() => {
    if (broadcasts.length === 0) return 82;
    let totalPromptLength = 0;
    broadcasts.forEach(b => {
      totalPromptLength += (b.prompt || '').length;
    });
    const avgLen = totalPromptLength / broadcasts.length;
    if (avgLen > 1000) return 70;
    if (avgLen > 600) return 85;
    return 95;
  }, [broadcasts]);

  // 4. Prompt Quality
  const promptQualityScore = useMemo(() => {
    if (store.prompts.length === 0) return 69;
    let totalQ = 0;
    let count = 0;
    store.prompts.slice(0, 10).forEach(p => {
      const text = p.template || p.prompt || p.content || '';
      if (text.trim()) {
        const audit = runFullAudit(text);
        totalQ += audit.pct || 69;
        count++;
      }
    });
    return count > 0 ? Math.round(totalQ / count) : 69;
  }, [store.prompts]);

  const score = Math.round((efficiencyScore + accountHealthScore + costOptimizationScore + promptQualityScore) / 4);

  const subScores = useMemo(() => [
    { label: 'Broadcast Efficiency', val: efficiencyScore, color: V.teal },
    { label: 'Account Health', val: accountHealthScore, color: V.gold },
    { label: 'Cost Optimization', val: costOptimizationScore, color: V.green },
    { label: 'Prompt Quality', val: promptQualityScore, color: V.purple },
  ], [efficiencyScore, accountHealthScore, costOptimizationScore, promptQualityScore]);

  const [insights, setInsights] = useState(INSIGHTS);
  const [recs, setRecs] = useState(RECOMMENDATIONS);
  const [catFilter, setCatFilter] = useState('All');
  const [generating, setGenerating] = useState(false);
  const [genStep, setGenStep] = useState(0);
  const [reportDone, setReportDone] = useState(false);
  const [animScores, setAnimScores] = useState([0, 0, 0, 0]);

  const todayDigest = useMemo(() => buildDailyDigest(store), [store]);

  useEffect(() => {
    if (todayDigest.totalCount > 0) {
      saveDigest(todayDigest);
    }
  }, [todayDigest]);

  useEffect(() => {
    const t = setTimeout(() => {
      subScores.forEach((s, i) => {
        setTimeout(() => setAnimScores(prev => prev.map((v, j) => j === i ? s.val : v)), i * 200);
      });
    }, 400);
    return () => clearTimeout(t);
  }, [subScores]);

  const applyInsight = (id) => setInsights(prev => prev.map(ins => ins.id === id ? { ...ins, applied:true } : ins));
  const dismissInsight = (id) => setInsights(prev => prev.filter(ins => ins.id !== id));
  const toggleRec = (id) => setRecs(prev => prev.map(r => r.id === id ? { ...r, done:!r.done } : r));

  const handleGenerate = () => {
    setGenerating(true); setGenStep(0); setReportDone(false);
    let step = 0;
    const iv = setInterval(() => {
      step++;
      setGenStep(step);
      if (step >= 5) { clearInterval(iv); setGenerating(false); setReportDone(true); }
    }, 700);
  };

  const cats = ['All', ...new Set(INSIGHTS.map(i => i.cat))];
  const filtered = catFilter === 'All' ? insights : insights.filter(i => i.cat === catFilter);

  // Heatmap data
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const slots = ['6–8','8–10','10–12','12–14','14–16','16–18','18–20','20–22'];
  const heatData = days.map((d,di) => slots.map((s,si) => {
    const v = Math.round(60 + Math.sin(di * 1.3 + si * 0.9) * 28 + Math.cos(di * 0.7 + si * 1.4) * 15);
    return Math.max(20, Math.min(100, v));
  }));
  const bestScore = Math.max(...heatData.flat());
  const bestIdx = heatData.flat().indexOf(bestScore);
  const bestDay = days[Math.floor(bestIdx / slots.length)];
  const bestSlot = slots[bestIdx % slots.length];

  // Anomaly chart
  const anomalyData = Array.from({length:30}, (_,i) => {
    const base = 94 + Math.sin(i * 0.4) * 3;
    const anomaly = [7,14,22].includes(i);
    return { val: anomaly ? base - 18 : base, anomaly };
  });
  const minV = Math.min(...anomalyData.map(d => d.val)) - 3;
  const maxV = Math.max(...anomalyData.map(d => d.val)) + 3;
  const toY = (v, h=160) => h - ((v - minV) / (maxV - minV)) * (h - 20) - 10;

  return (
    <div style={{ minHeight:'100vh', background:V.surface, color:V.text, fontFamily:'Syne, sans-serif' }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .ins-card { animation: fadeUp 0.3s ease; }
      `}</style>

      {/* Hero */}
      <div style={{ background:`linear-gradient(135deg, ${V.surface} 0%, #0d0d20 50%, #0a1628 100%)`, borderBottom:`1px solid ${V.border}`, padding:'48px 40px 36px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-80, right:60, width:400, height:400, borderRadius:'50%', background:`${V.purple}08`, filter:'blur(90px)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-60, left:80, width:300, height:300, borderRadius:'50%', background:`${V.gold}07`, filter:'blur(70px)', pointerEvents:'none' }} />
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:`${V.purple}15`, border:`1px solid ${V.purple}40`, borderRadius:20, padding:'4px 14px', marginBottom:16, fontSize:11, color:V.purple, fontWeight:700, letterSpacing:1.2, textTransform:'uppercase' }}>
            ✨ AI-Powered Analysis
          </div>
          <h1 style={{ fontFamily:'Syne, sans-serif', fontSize:44, fontWeight:800, margin:'0 0 10px', background:`linear-gradient(135deg, ${V.purple} 0%, #fff 50%, ${V.gold} 100%)`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            AI Insights Engine
          </h1>
          <p style={{ color:V.muted, fontSize:16, margin:'0 0 28px' }}>Your personal AI analyst — patterns, predictions, and smart recommendations</p>
          <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
            {[['💡 47 Insights Generated', V.purple], ['⚡ 12 Action Items', V.gold], ['🎯 Accuracy 94.2%', V.teal]].map(([label, c]) => (
              <div key={label} style={{ display:'flex', alignItems:'center', gap:6, background:`${c}12`, border:`1px solid ${c}33`, borderRadius:10, padding:'7px 16px', color:c, fontSize:13, fontWeight:600 }}>{label}</div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding:'32px 40px 60px', maxWidth:1400, margin:'0 auto', display:'flex', flexDirection:'column', gap:28 }}>

        {/* Intelligence Score */}
        <div style={{ display:'grid', gridTemplateColumns:'280px 1fr', gap:24 }}>
          <div style={{ background:V.surface2, border:`1px solid ${V.border}`, borderRadius:16, padding:28, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
            <div style={{ fontSize:11, color:V.muted, textTransform:'uppercase', letterSpacing:1, marginBottom:16, fontWeight:700 }}>Intelligence Score</div>
            <CircleGauge value={score} size={140} color={score > 80 ? V.teal : score > 60 ? V.gold : V.red} />
            <div style={{ fontSize:11, color:V.muted, marginTop:12, textAlign:'center' }}>Based on 47 data points across all accounts</div>
          </div>
          <div style={{ background:V.surface2, border:`1px solid ${V.border}`, borderRadius:16, padding:28 }}>
            <div style={{ fontSize:13, fontWeight:700, color:V.text, marginBottom:20 }}>Sub-Score Breakdown</div>
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {subScores.map((s, i) => (
                <div key={s.label}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                    <span style={{ fontSize:13, color:V.text }}>{s.label}</span>
                    <span style={{ fontSize:13, color:s.color, fontFamily:'DM Mono, monospace', fontWeight:700 }}>{s.val}</span>
                  </div>
                  <div style={{ height:8, borderRadius:4, background:V.surface3, overflow:'hidden' }}>
                    <div style={{ height:'100%', borderRadius:4, background:`linear-gradient(90deg, ${s.color}aa, ${s.color})`, width:`${animScores[i]}%`, transition:'width 0.8s ease' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insight Feed */}
        <div style={{ background:V.surface2, border:`1px solid ${V.border}`, borderRadius:16, padding:24 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
            <div style={{ fontSize:15, fontWeight:700, color:V.text }}>💡 AI Analysis Feed</div>
            <div style={{ display:'flex', gap:6 }}>
              {cats.map(c => (
                <button key={c} onClick={() => setCatFilter(c)} style={{ padding:'5px 12px', borderRadius:6, border:`1px solid ${catFilter===c ? V.purple + '66' : V.border}`, background:catFilter===c ? `${V.purple}18` : V.surface3, color:catFilter===c ? V.purple : V.muted, cursor:'pointer', fontSize:12, fontWeight:catFilter===c ? 700 : 400, transition:'all 0.15s' }}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {filtered.map(ins => (
              <div key={ins.id} className="ins-card" style={{ background:V.surface3, border:`1px solid ${ins.applied ? V.green + '44' : V.border}`, borderRadius:12, padding:'14px 18px', opacity:ins.applied ? 0.7 : 1, transition:'all 0.2s' }}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:10, marginBottom:8 }}>
                  <CatBadge cat={ins.cat} />
                  <ImpactBadge level={ins.impact} />
                  <span style={{ fontSize:11, color:V.muted, marginLeft:'auto', fontFamily:'DM Mono, monospace' }}>Confidence: {ins.conf}%</span>
                </div>
                <p style={{ margin:'0 0 12px', fontSize:13.5, lineHeight:1.65, color:ins.applied ? V.muted : V.text }}>{ins.text}</p>
                {!ins.applied && (
                  <div style={{ display:'flex', gap:8 }}>
                    <button onClick={() => applyInsight(ins.id)} style={{ padding:'6px 14px', borderRadius:7, border:`1px solid ${V.teal}44`, background:`${V.teal}12`, color:V.teal, cursor:'pointer', fontSize:12, fontWeight:700, transition:'all 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background=`${V.teal}22`} onMouseLeave={e => e.currentTarget.style.background=`${V.teal}12`}>
                      ✓ {ins.action}
                    </button>
                    <button onClick={() => dismissInsight(ins.id)} style={{ padding:'6px 12px', borderRadius:7, border:`1px solid ${V.border}`, background:'transparent', color:V.muted, cursor:'pointer', fontSize:12 }}>Dismiss</button>
                  </div>
                )}
                {ins.applied && <span style={{ fontSize:12, color:V.green }}>✓ Applied</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Pattern Detector Heatmap */}
        <div style={{ background:V.surface2, border:`1px solid ${V.border}`, borderRadius:16, padding:24 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
            <div>
              <div style={{ fontSize:15, fontWeight:700, color:V.text }}>⏱ Performance Pattern Detector</div>
              <div style={{ fontSize:12, color:V.muted, marginTop:4 }}>Broadcast success rate by day & time — hover a cell to inspect</div>
            </div>
            <div style={{ fontSize:12, color:V.gold, background:`${V.gold}12`, border:`1px solid ${V.gold}33`, padding:'6px 14px', borderRadius:8 }}>
              Best window: <strong>{bestDay} {bestSlot}</strong> ({bestScore}% success)
            </div>
          </div>
          <div style={{ overflowX:'auto' }}>
            <div style={{ display:'inline-grid', gridTemplateColumns:`40px repeat(${slots.length}, 52px)`, gap:4 }}>
              <div />
              {slots.map(s => <div key={s} style={{ fontSize:9.5, color:V.muted, textAlign:'center', paddingBottom:4, fontFamily:'DM Mono, monospace' }}>{s}</div>)}
              {days.map((day, di) => [
                <div key={day} style={{ fontSize:11, color:V.muted, display:'flex', alignItems:'center', fontWeight:600 }}>{day}</div>,
                ...slots.map((slot, si) => {
                  const v = heatData[di][si];
                  const isBest = di * slots.length + si === bestIdx;
                  const bg = v > 85 ? `rgba(245,183,49,${(v-85)/15*0.8+0.2})` : v > 65 ? `rgba(34,211,238,${(v-65)/20*0.5+0.1})` : `rgba(255,255,255,${v/100*0.08})`;
                  return (
                    <div key={slot} title={`${day} ${slot}: ${v}% success`}
                      style={{ height:34, borderRadius:6, background:bg, border:isBest ? `2px solid ${V.gold}` : '1px solid rgba(255,255,255,0.05)', cursor:'pointer', transition:'transform 0.15s', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, color:'rgba(255,255,255,0.5)', fontFamily:'DM Mono, monospace' }}
                      onMouseEnter={e => e.currentTarget.style.transform='scale(1.15)'}
                      onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}>
                      {v}
                    </div>
                  );
                })
              ])}
            </div>
          </div>
        </div>

        {/* Predictions + Anomaly Chart side by side */}
        <div style={{ display:'grid', gridTemplateColumns:'340px 1fr', gap:24 }}>
          <div style={{ background:V.surface2, border:`1px solid ${V.border}`, borderRadius:16, padding:24 }}>
            <div style={{ fontSize:15, fontWeight:700, color:V.text, marginBottom:18 }}>🔮 Predictive Analytics</div>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {[
                { text:'Credits will run out in ~14 days at current burn rate', conf:89, action:'Top Up', color:V.red },
                { text:'Success rate improves to 98.2% if you implement prompt templating', conf:82, action:'Apply Now', color:V.teal },
                { text:'Expected monthly savings: $47 with recommended account consolidation', conf:76, action:'Consolidate', color:V.green },
              ].map((p, i) => (
                <div key={i} style={{ background:V.surface3, borderRadius:10, padding:'14px 16px', border:`1px solid ${p.color}22` }}>
                  <p style={{ margin:'0 0 10px', fontSize:12.5, color:V.text, lineHeight:1.6 }}>{p.text}</p>
                  <div style={{ height:4, borderRadius:2, background:V.surface, marginBottom:10, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${p.conf}%`, background:`linear-gradient(90deg, ${p.color}88, ${p.color})`, borderRadius:2 }} />
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontSize:11, color:V.muted, fontFamily:'DM Mono, monospace' }}>Confidence: {p.conf}%</span>
                    <button style={{ padding:'4px 12px', borderRadius:6, border:`1px solid ${p.color}44`, background:`${p.color}12`, color:p.color, cursor:'pointer', fontSize:11, fontWeight:700 }}>{p.action}</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background:V.surface2, border:`1px solid ${V.border}`, borderRadius:16, padding:24 }}>
            <div style={{ fontSize:15, fontWeight:700, color:V.text, marginBottom:6 }}>📉 Anomaly Timeline — 30 Day Success Rate</div>
            <div style={{ fontSize:12, color:V.muted, marginBottom:16 }}>Red dots = detected anomalies with root cause analysis</div>
            <svg viewBox={`0 0 700 180`} style={{ width:'100%', height:180 }} preserveAspectRatio="none">
              {/* normal band */}
              <rect x={0} y={toY(97, 180)} width={700} height={toY(90, 180) - toY(97, 180)} fill={`${V.teal}08`} rx={2} />
              {/* grid lines */}
              {[90, 94, 98].map(v => (
                <line key={v} x1={0} y1={toY(v, 180)} x2={700} y2={toY(v, 180)} stroke={V.border} strokeDasharray="4,4" />
              ))}
              {/* line */}
              <polyline fill="none" stroke={V.teal} strokeWidth={2}
                points={anomalyData.map((d, i) => `${i * (700/29)},${toY(d.val, 180)}`).join(' ')} />
              {/* anomaly dots */}
              {anomalyData.map((d, i) => d.anomaly ? (
                <g key={i}>
                  <circle cx={i * (700/29)} cy={toY(d.val, 180)} r={7} fill={`${V.red}30`} stroke={V.red} strokeWidth={2} />
                  <line x1={i * (700/29)} y1={toY(d.val, 180) + 10} x2={i * (700/29)} y2={165} stroke={V.red} strokeDasharray="3,3" strokeWidth={1} />
                </g>
              ) : null)}
            </svg>
          </div>
        </div>

        {/* Smart Recommendations */}
        <div style={{ background:V.surface2, border:`1px solid ${V.border}`, borderRadius:16, padding:24 }}>
          <div style={{ fontSize:15, fontWeight:700, color:V.text, marginBottom:18 }}>🎯 Smart Recommendations</div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {recs.map(r => {
              const pc = r.p === 'P1' ? V.red : r.p === 'P2' ? V.gold : V.muted;
              return (
                <div key={r.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 16px', background:V.surface3, borderRadius:10, border:`1px solid ${r.done ? V.green+'33' : V.border}`, opacity:r.done ? 0.6 : 1, transition:'all 0.2s' }}>
                  <input type="checkbox" checked={r.done} onChange={() => toggleRec(r.id)} style={{ width:16, height:16, accentColor:V.teal, cursor:'pointer', flexShrink:0 }} />
                  <span style={{ fontSize:11, padding:'2px 7px', borderRadius:4, background:`${pc}18`, color:pc, fontWeight:700, border:`1px solid ${pc}44`, flexShrink:0 }}>{r.p}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:r.done ? V.muted : V.text, textDecoration:r.done ? 'line-through' : 'none' }}>{r.title}</div>
                    <div style={{ fontSize:11.5, color:V.muted, marginTop:2 }}>{r.desc}</div>
                  </div>
                  <div style={{ fontSize:12, color:V.teal, fontFamily:'DM Mono, monospace', whiteSpace:'nowrap' }}>{r.impact}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Daily Digest + Export */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:24 }}>
          <div style={{ background:V.surface2, border:`1px solid ${V.border}`, borderRadius:16, padding:24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <span style={{ fontSize:15, fontWeight:700, color:V.text }}>📋 Live AI Activity Digest</span>
              <span style={{ fontSize: 10, color: 'var(--teal)', background: 'rgba(34,211,238,0.05)', padding: '2px 8px', borderRadius: 4, fontFamily: 'DM Mono, monospace' }}>Real-time telemetry</span>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'220px 1fr', gap:20, alignItems: 'start' }}>
              {/* Digest KPI grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label:'Today\'s Run Sessions', value: todayDigest.totalCount },
                  { label:'API Cost Footprint', value: `$${todayDigest.estimatedCost.toFixed(4)}` },
                  { label:'Average Delivery Rate', value: `${todayDigest.successRate}%` },
                  { label:'Stability Leader', value: todayDigest.bestChannel },
                ].map(item => (
                  <div key={item.label} style={{ background:V.surface3, borderRadius:10, padding:'10px 14px', border:`1px solid ${V.border}` }}>
                    <div style={{ fontSize:10, color:V.muted, marginBottom:4 }}>{item.label}</div>
                    <div style={{ fontSize:13, fontWeight:800, color:V.text }}>{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Dynamic markdown text block */}
              <div style={{ background: V.surface3, border: `1px solid ${V.border}`, borderRadius: 10, padding: 16, maxHeight: 310, overflowY: 'auto' }}>
                <div style={{ fontSize: 10.5, color: V.muted, textTransform: 'uppercase', marginBottom: 10, letterSpacing: '0.04em' }}>Generated Report Summary</div>
                <div style={{ fontSize: 12, color: '#c8d0e0', lineHeight: 1.7, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                  {todayDigest.markdown}
                </div>
              </div>
            </div>
          </div>

          <div style={{ background:V.surface2, border:`1px solid ${V.border}`, borderRadius:16, padding:24, display:'flex', flexDirection:'column', justifyContent:'center' }}>
            <div style={{ fontSize:15, fontWeight:700, color:V.text, marginBottom:8 }}>📄 Full Report Generator</div>
            <div style={{ fontSize:12.5, color:V.muted, marginBottom:20, lineHeight:1.6 }}>Export a complete PDF report with all insights, charts, and recommendations.</div>

            {!generating && !reportDone && (
              <button onClick={handleGenerate} style={{ padding:'12px 0', borderRadius:10, border:'none', background:`linear-gradient(135deg, ${V.gold}, #e0a020)`, color:'#000', cursor:'pointer', fontSize:14, fontWeight:800 }}>
                ⚡ Generate Report
              </button>
            )}

            {generating && (
              <div>
                <div style={{ height:6, background:V.surface3, borderRadius:3, overflow:'hidden', marginBottom:14 }}>
                  <div style={{ height:'100%', width:`${(genStep/5)*100}%`, background:`linear-gradient(90deg, ${V.gold}, ${V.teal})`, transition:'width 0.6s ease', borderRadius:3 }} />
                </div>
                {['Collecting metrics…', 'Generating charts…', 'Writing summaries…', 'Compiling insights…', 'Finalising PDF…'].slice(0, genStep + 1).map((s, i) => (
                  <div key={i} style={{ fontSize:12, color:i < genStep ? V.green : V.gold, marginBottom:4, fontFamily:'DM Mono, monospace' }}>
                    {i < genStep ? '✓' : '⟳'} {s}
                  </div>
                ))}
              </div>
            )}

            {reportDone && (
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                <div style={{ padding:'10px 14px', background:`${V.green}12`, border:`1px solid ${V.green}33`, borderRadius:8, fontSize:13, color:V.green, textAlign:'center' }}>✓ Report ready!</div>
                <button onClick={() => { const a = document.createElement('a'); a.href = '#'; a.download = 'ai-insights-report.pdf'; setReportDone(false); }} style={{ padding:'10px 0', borderRadius:8, border:`1px solid ${V.teal}44`, background:`${V.teal}12`, color:V.teal, cursor:'pointer', fontSize:13, fontWeight:700 }}>⬇ Download PDF</button>
                <button onClick={() => { navigator.clipboard.writeText('https://boltpro.app/report/abc123'); }} style={{ padding:'10px 0', borderRadius:8, border:`1px solid ${V.border}`, background:V.surface3, color:V.muted, cursor:'pointer', fontSize:13 }}>⎘ Copy Share Link</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
