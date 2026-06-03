import { useState, useEffect, useRef } from 'react';

const injectStyles = () => {
  if (document.getElementById('smartalerts-styles')) return;
  const s = document.createElement('style');
  s.id = 'smartalerts-styles';
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap');
    @keyframes sal-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.92)} }
    @keyframes sal-fadeup { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
    @keyframes sal-ring { 0%{box-shadow:0 0 0 0 rgba(239,68,68,0.6)} 70%{box-shadow:0 0 0 10px rgba(239,68,68,0)} 100%{box-shadow:0 0 0 0 rgba(239,68,68,0)} }
    @keyframes sal-scan { 0%{transform:translateY(-100%)} 100%{transform:translateY(100%)} }
    .sal-card:hover { border-color:rgba(245,183,49,0.3)!important; transform:translateY(-2px); box-shadow:0 8px 32px rgba(0,0,0,0.4)!important; }
    .sal-btn:hover { filter:brightness(1.15); transform:translateY(-1px); }
    .sal-row:hover { background:rgba(255,255,255,0.03)!important; }
    .sal-badge-crit { background:rgba(239,68,68,0.15); color:#ef4444; }
    .sal-badge-warn { background:rgba(245,183,49,0.15); color:#f5b731; }
    .sal-badge-info { background:rgba(59,130,246,0.15); color:#3b82f6; }
    .sal-badge-ok   { background:rgba(34,197,94,0.15); color:#22c55e; }
  `;
  document.head.appendChild(s);
};

const V = { gold:'#f5b731', teal:'#22d3ee', purple:'#a78bfa', surface:'#0e0e16', surface2:'#16161e', surface3:'#1d1d28', border:'rgba(255,255,255,0.07)', muted:'#6e7191', red:'#ef4444', blue:'#3b82f6', green:'#22c55e' };

const SEVERITIES = { critical:{ color:V.red, icon:'🔴', label:'Critical' }, warning:{ color:V.gold, icon:'🟡', label:'Warning' }, info:{ color:V.blue, icon:'🔵', label:'Info' }, resolved:{ color:V.green, icon:'✅', label:'Resolved' } };

const INITIAL_ALERTS = [
  { id:1, title:'API Rate Limit Exceeded', desc:'OpenAI endpoint hitting 429 errors — 847 failed calls in last 10 min', severity:'critical', service:'OpenAI API', time:'2 min ago', count:847, acknowledged:false, rule:'Rate > 500/10m' },
  { id:2, title:'Credit Balance Critical', desc:'Account workspace-7 below 50 credits — broadcast capacity impaired', severity:'critical', service:'Credit Monitor', time:'8 min ago', count:1, acknowledged:false, rule:'Credits < 100' },
  { id:3, title:'High Latency Detected', desc:'Average response time 4.2s — 180% above baseline threshold', severity:'warning', service:'Bolt.new', time:'12 min ago', count:23, acknowledged:false, rule:'Latency > 2000ms' },
  { id:4, title:'Failed Broadcast Batch', desc:'3 accounts returned session errors during scheduled broadcast', severity:'warning', service:'Broadcast Studio', time:'18 min ago', count:3, acknowledged:true, rule:'Error rate > 10%' },
  { id:5, title:'Model Token Overage', desc:'Token consumption 340% above daily quota — cost spike detected', severity:'warning', service:'Token Analyzer', time:'25 min ago', count:1, acknowledged:false, rule:'Daily tokens > 200K' },
  { id:6, title:'New Login Detected', desc:'Authentication from IP 185.234.x.x — location: Frankfurt, DE', severity:'info', service:'Security Vault', time:'1 hr ago', count:1, acknowledged:true, rule:'Geo-anomaly login' },
  { id:7, title:'Workflow Timeout', desc:'Pipeline step "AI Optimize" exceeded 30s timeout limit', severity:'info', service:'Workflows', time:'1 hr ago', count:5, acknowledged:false, rule:'Step timeout > 30s' },
  { id:8, title:'Scheduled Report Sent', desc:'Weekly performance digest delivered to 4 configured recipients', severity:'resolved', service:'Reports', time:'2 hr ago', count:1, acknowledged:true, rule:'Scheduled weekly' },
  { id:9, title:'Database Sync Complete', desc:'Knowledge base synced — 1,247 entries indexed successfully', severity:'resolved', service:'Knowledge Base', time:'3 hr ago', count:1247, acknowledged:true, rule:'Sync success' },
  { id:10, title:'SSL Certificate Renewal', desc:'Vault certificate renewed — valid for 365 days from today', severity:'resolved', service:'Security Vault', time:'6 hr ago', count:1, acknowledged:true, rule:'Cert expiry < 30d' },
];

const RULE_TEMPLATES = [
  { id:1, name:'API Rate Limit Guard', metric:'api_calls_per_min', op:'>', threshold:500, severity:'critical', enabled:true, channel:'webhook' },
  { id:2, name:'Credit Low Alert', metric:'account_credits', op:'<', threshold:100, severity:'critical', enabled:true, channel:'email' },
  { id:3, name:'Latency Spike', metric:'response_time_ms', op:'>', threshold:2000, severity:'warning', enabled:true, channel:'webhook' },
  { id:4, name:'Error Rate Elevated', metric:'error_rate_pct', op:'>', threshold:10, severity:'warning', enabled:true, channel:'email' },
  { id:5, name:'Token Daily Quota', metric:'daily_tokens', op:'>', threshold:200000, severity:'warning', enabled:false, channel:'email' },
  { id:6, name:'Geo-Anomaly Login', metric:'login_location_change', op:'=', threshold:1, severity:'info', enabled:true, channel:'email' },
];

const ANOMALY_POINTS = Array.from({length:48}, (_,i) => {
  const base = 120 + Math.sin(i*0.4)*40;
  const spike = (i===18||i===31) ? base+180 : 0;
  return Math.max(10, base + spike + (Math.random()-0.5)*20);
});

function AnomalyChart({ points }) {
  const w = 500, h = 80;
  const min = 0, max = Math.max(...points) * 1.1;
  const px = (i) => (i / (points.length - 1)) * w;
  const py = (v) => h - ((v - min) / (max - min)) * h;
  const d = points.map((v, i) => `${i===0?'M':'L'} ${px(i)} ${py(v)}`).join(' ');
  const anomalies = points.map((v,i) => ({ i, v, isAnomaly: v > 250 }));
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{display:'block'}}>
      <defs>
        <linearGradient id="anomgrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={V.teal} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={V.teal} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={`${d} L ${w} ${h} L 0 ${h} Z`} fill="url(#anomgrad)" />
      <path d={d} fill="none" stroke={V.teal} strokeWidth="1.5"/>
      {anomalies.filter(a=>a.isAnomaly).map(a => (
        <g key={a.i}>
          <circle cx={px(a.i)} cy={py(a.v)} r="5" fill={V.red} opacity="0.9"/>
          <line x1={px(a.i)} y1={0} x2={px(a.i)} y2={h} stroke={V.red} strokeWidth="1" strokeDasharray="3,3" opacity="0.4"/>
        </g>
      ))}
    </svg>
  );
}

function SeverityBadge({ severity }) {
  const s = SEVERITIES[severity] || SEVERITIES.info;
  return <span className={`sal-badge-${severity==='resolved'?'ok':severity==='critical'?'crit':severity==='warning'?'warn':'info'}`} style={{ padding:'2px 8px', borderRadius:999, fontSize:10, fontWeight:700 }}>{s.icon} {s.label}</span>;
}

const LOG_LINES = [
  '[SCAN] Running anomaly detection across {n} data points...',
  '[RULE] Evaluating "{r}" — current value: {v} (threshold: {t})',
  '[OK] All monitored metrics within normal bounds',
  '[ALERT] Threshold breach detected on {s} — notifying channels',
  '[WEBHOOK] POST https://hooks.slack.com/... → 200 OK ({ms}ms)',
  '[ML] Pattern recognition: potential anomaly window at T+{n}min',
  '[ACK] Alert ID-{id} acknowledged by operator',
  '[DIGEST] Compiling daily alert summary — {n} events processed',
];

export default function SmartAlerts() {

  useEffect(() => { injectStyles(); }, []);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [rules, setRules] = useState(RULE_TEMPLATES);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [showRuleForm, setShowRuleForm] = useState(false);
  const [newRule, setNewRule] = useState({ name:'', metric:'api_calls_per_min', op:'>', threshold:500, severity:'warning', channel:'email' });
  const [channelSettings, setChannelSettings] = useState({ email:true, webhook:true, slack:false, pagerduty:false });
  const [liveMode, setLiveMode] = useState(true);
  const [anomalyPoints, setAnomalyPoints] = useState(ANOMALY_POINTS);
  const logRef = useRef(null);
  const [eventLog, setEventLog] = useState([
    { id:1, time:'17:42:01', text:'[RULE] Rate limit guard triggered for OpenAI — threshold 500 req/min exceeded', color:V.red },
    { id:2, time:'17:40:12', text:'[SCAN] Anomaly scan complete — 2 spikes detected in API traffic', color:V.gold },
    { id:3, time:'17:35:44', text:'[ALERT] Credit balance warning sent → workspace-7@user.com', color:V.gold },
    { id:4, time:'17:28:09', text:'[RESOLVED] Knowledge base sync completed — alert auto-closed', color:V.green },
    { id:5, time:'17:15:33', text:'[RULE] Latency spike detected — bolt.new response 4200ms avg', color:V.gold },
  ]);


  useEffect(() => {
    if (!liveMode) return;
    const t = setInterval(() => {
      const tmpl = LOG_LINES[Math.floor(Math.random()*LOG_LINES.length)];
      const line = tmpl
        .replace(/{n}/g, Math.floor(100+Math.random()*900))
        .replace(/{r}/g, rules[Math.floor(Math.random()*rules.length)]?.name||'Rate Guard')
        .replace(/{v}/g, Math.floor(Math.random()*1000))
        .replace(/{t}/g, Math.floor(Math.random()*500))
        .replace(/{s}/g, ['OpenAI','Bolt.new','Lovable','Replit'][Math.floor(Math.random()*4)])
        .replace(/{ms}/g, Math.floor(50+Math.random()*200))
        .replace(/{id}/g, Math.floor(Math.random()*100));
      const now = new Date();
      const time = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
      const color = line.includes('[ALERT]') ? V.red : line.includes('[OK]') ? V.green : line.includes('[ML]') ? V.purple : V.teal;
      setEventLog(prev => [...prev.slice(-60), { id:Date.now(), time, text:line, color }]);
      setAnomalyPoints(prev => { const next = [...prev.slice(1), Math.max(10, 120 + Math.sin(Date.now()/3000)*40 + (Math.random()-0.5)*30)]; return next; });
      if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
    }, 3000);
    return () => clearInterval(t);
  }, [liveMode, rules]);

  const filtered = alerts.filter(a => filter==='all' ? true : filter==='unack' ? !a.acknowledged : a.severity===filter);
  const counts = { critical: alerts.filter(a=>a.severity==='critical'&&!a.acknowledged).length, warning: alerts.filter(a=>a.severity==='warning'&&!a.acknowledged).length, total: alerts.length };

  const ackAlert = (id) => setAlerts(prev => prev.map(a => a.id===id ? {...a, acknowledged:true, severity:'resolved'} : a));
  const deleteAlert = (id) => setAlerts(prev => prev.filter(a => a.id!==id));
  const addRule = () => { if(!newRule.name) return; setRules(prev => [...prev, {...newRule, id:Date.now(), enabled:true}]); setNewRule({ name:'', metric:'api_calls_per_min', op:'>', threshold:500, severity:'warning', channel:'email' }); setShowRuleForm(false); };

  return (
    <div style={{ padding:'0 0 80px', fontFamily:'Syne, sans-serif', background:V.surface, minHeight:'100vh' }}>
      {/* HERO */}
      <div style={{ background:'linear-gradient(135deg,#0e0e16 0%,#180a0a 50%,#0e0e16 100%)', borderBottom:`1px solid ${V.border}`, padding:'32px 32px 28px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20 }}>
          <div style={{ width:48, height:48, borderRadius:14, background:'rgba(239,68,68,0.15)', border:`1px solid ${V.red}44`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, animation: counts.critical>0?'sal-ring 2s infinite':undefined }}>🔔</div>
          <div>
            <h1 style={{ margin:0, fontSize:26, fontWeight:800, color:'#fff', letterSpacing:'-0.5px' }}>Smart Alert Center</h1>
            <div style={{ fontSize:12, color:V.muted, marginTop:2 }}>ML-powered anomaly detection & intelligent alerting</div>
          </div>
          <div style={{ marginLeft:'auto', display:'flex', gap:8, alignItems:'center' }}>
            <div onClick={() => setLiveMode(v=>!v)} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 14px', borderRadius:10, border:`1px solid ${liveMode?V.red:V.border}`, background:liveMode?'rgba(239,68,68,0.1)':'transparent', cursor:'pointer', transition:'all 0.2s' }}>
              <span style={{ width:7, height:7, borderRadius:'50%', background:liveMode?V.red:V.muted, animation:liveMode?'sal-pulse 1.5s infinite':undefined, display:'inline-block' }} />
              <span style={{ fontSize:11, fontWeight:700, color:liveMode?V.red:V.muted }}>LIVE</span>
            </div>
          </div>
        </div>
        <div style={{ display:'flex', gap:14, flexWrap:'wrap' }}>
          {[['🔴','Critical',counts.critical,V.red],['🟡','Warnings',counts.warning,V.gold],['📋','Total Alerts',counts.total,V.teal],['✅','Resolved',alerts.filter(a=>a.severity==='resolved').length,V.green]].map(([icon,label,val,color]) => (
            <div key={label} className="sal-card" style={{ background:V.surface2, border:`1px solid ${V.border}`, borderRadius:12, padding:'14px 20px', display:'flex', alignItems:'center', gap:12, flex:1, minWidth:130, transition:'all 0.2s' }}>
              <div style={{ fontSize:24 }}>{icon}</div>
              <div>
                <div style={{ fontSize:22, fontWeight:800, color, fontFamily:'Syne, sans-serif' }}>{val}</div>
                <div style={{ fontSize:11, color:V.muted }}>{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding:'28px 32px', display:'flex', flexDirection:'column', gap:28 }}>
        {/* ANOMALY CHART */}
        <div style={{ background:V.surface2, border:`1px solid ${V.border}`, borderRadius:16, padding:'20px 24px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <div>
              <div style={{ fontWeight:800, fontSize:15, color:'#fff' }}>📈 API Traffic Anomaly Detection</div>
              <div style={{ fontSize:11, color:V.muted, marginTop:2 }}>48-hour rolling window — ML-detected spikes highlighted in red</div>
            </div>
            <div style={{ display:'flex', gap:10, fontSize:11, color:V.muted }}>
              <span style={{ display:'flex', alignItems:'center', gap:4 }}><span style={{ width:10,height:2,background:V.teal,display:'inline-block',borderRadius:1 }} />Normal</span>
              <span style={{ display:'flex', alignItems:'center', gap:4 }}><span style={{ width:8,height:8,borderRadius:'50%',background:V.red,display:'inline-block' }} />Anomaly</span>
            </div>
          </div>
          <AnomalyChart points={anomalyPoints} />
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:10, color:V.muted, marginTop:6, fontFamily:'DM Mono, monospace' }}>
            <span>-48h</span><span>-36h</span><span>-24h</span><span>-12h</span><span>Now</span>
          </div>
        </div>

        {/* ALERT LIST */}
        <div style={{ background:V.surface2, border:`1px solid ${V.border}`, borderRadius:16, overflow:'hidden' }}>
          <div style={{ padding:'18px 24px', borderBottom:`1px solid ${V.border}`, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
            <div style={{ fontWeight:800, fontSize:15, color:'#fff' }}>🚨 Active Alerts</div>
            <div style={{ display:'flex', gap:6 }}>
              {['all','critical','warning','info','resolved','unack'].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{ padding:'4px 10px', borderRadius:6, border:`1px solid ${filter===f?V.gold:V.border}`, background:filter===f?'rgba(245,183,49,0.1)':'transparent', color:filter===f?V.gold:V.muted, cursor:'pointer', fontSize:10, fontWeight:700, textTransform:'capitalize', transition:'all 0.2s' }}>{f==='unack'?'Unread':f}</button>
              ))}
            </div>
          </div>
          <div>
            {filtered.length === 0 ? (
              <div style={{ padding:'40px', textAlign:'center', color:V.muted, fontSize:13 }}>✅ No alerts matching current filter</div>
            ) : filtered.map(alert => (
              <div key={alert.id} className="sal-row" onClick={() => setSelected(selected===alert.id?null:alert.id)} style={{ borderTop:`1px solid ${V.border}`, padding:'16px 24px', cursor:'pointer', transition:'background 0.15s', animation:'sal-fadeup 0.3s ease', borderLeft: !alert.acknowledged&&alert.severity==='critical'?`3px solid ${V.red}`:!alert.acknowledged&&alert.severity==='warning'?`3px solid ${V.gold}`:'3px solid transparent' }}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:14 }}>
                  <div style={{ fontSize:18, marginTop:2 }}>{SEVERITIES[alert.severity]?.icon||'ℹ️'}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4, flexWrap:'wrap' }}>
                      <span style={{ fontWeight:700, color:alert.acknowledged?V.muted:'#fff', fontSize:13 }}>{alert.title}</span>
                      <SeverityBadge severity={alert.severity} />
                      {!alert.acknowledged && <span style={{ padding:'1px 6px', borderRadius:999, background:'rgba(239,68,68,0.15)', color:V.red, fontSize:9, fontWeight:800 }}>UNREAD</span>}
                    </div>
                    <div style={{ fontSize:12, color:V.muted, marginBottom:6, lineHeight:1.5 }}>{alert.desc}</div>
                    <div style={{ display:'flex', gap:14, fontSize:10, color:V.muted, fontFamily:'DM Mono, monospace' }}>
                      <span>🖥 {alert.service}</span>
                      <span>⏰ {alert.time}</span>
                      <span>📋 {alert.rule}</span>
                      {alert.count > 1 && <span style={{ color:V.gold }}>×{alert.count.toLocaleString()}</span>}
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:6, flexShrink:0 }} onClick={e=>e.stopPropagation()}>
                    {!alert.acknowledged && <button className="sal-btn" onClick={() => ackAlert(alert.id)} style={{ padding:'5px 10px', borderRadius:7, border:`1px solid ${V.green}`, background:'transparent', color:V.green, cursor:'pointer', fontSize:10, fontWeight:700, transition:'all 0.2s' }}>✓ Ack</button>}
                    <button className="sal-btn" onClick={() => deleteAlert(alert.id)} style={{ padding:'5px 10px', borderRadius:7, border:`1px solid ${V.border}`, background:'transparent', color:V.muted, cursor:'pointer', fontSize:10, fontWeight:700, transition:'all 0.2s' }}>✕</button>
                  </div>
                </div>
                {selected === alert.id && (
                  <div style={{ marginTop:14, padding:'12px 14px', background:V.surface3, borderRadius:10, display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(160px, 1fr))', gap:12 }}>
                    {[['Alert ID',`#${alert.id}`],['Service',alert.service],['Trigger Rule',alert.rule],['Event Count',alert.count.toLocaleString()],['Severity',alert.severity],['Status',alert.acknowledged?'Acknowledged':'Open']].map(([k,v]) => (
                      <div key={k}><div style={{ fontSize:10, color:V.muted, marginBottom:3 }}>{k}</div><div style={{ fontSize:12, color:'#dde0f0', fontFamily:'DM Mono, monospace', fontWeight:700 }}>{v}</div></div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ALERT RULES */}
        <div style={{ background:V.surface2, border:`1px solid ${V.border}`, borderRadius:16, overflow:'hidden' }}>
          <div style={{ padding:'18px 24px', borderBottom:`1px solid ${V.border}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ fontWeight:800, fontSize:15, color:'#fff' }}>⚙️ Alert Rules</div>
            <button className="sal-btn" onClick={() => setShowRuleForm(v=>!v)} style={{ padding:'6px 14px', borderRadius:8, border:`1px solid ${V.gold}`, background:'transparent', color:V.gold, cursor:'pointer', fontSize:11, fontWeight:700, transition:'all 0.2s' }}>+ New Rule</button>
          </div>
          {showRuleForm && (
            <div style={{ padding:'20px 24px', borderBottom:`1px solid ${V.border}`, background:V.surface3 }}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(180px, 1fr))', gap:14, marginBottom:14 }}>
                {[{label:'Rule Name',key:'name',type:'text'},{label:'Metric',key:'metric',type:'select',opts:['api_calls_per_min','account_credits','response_time_ms','error_rate_pct','daily_tokens']},{label:'Operator',key:'op',type:'select',opts:['>','<','=','>=','<=']},{label:'Threshold',key:'threshold',type:'number'},{label:'Severity',key:'severity',type:'select',opts:['critical','warning','info']},{label:'Channel',key:'channel',type:'select',opts:['email','webhook','slack','pagerduty']}].map(f => (
                  <div key={f.key}>
                    <label style={{ fontSize:10, color:V.muted, fontWeight:700, display:'block', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.06em' }}>{f.label}</label>
                    {f.type==='select' ? (
                      <select value={newRule[f.key]} onChange={e=>setNewRule(p=>({...p,[f.key]:e.target.value}))} style={{ width:'100%', padding:'7px 10px', background:V.surface2, border:`1px solid ${V.border}`, borderRadius:7, color:'#e4e4ed', fontSize:12, outline:'none' }}>
                        {f.opts.map(o=><option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input type={f.type} value={newRule[f.key]} onChange={e=>setNewRule(p=>({...p,[f.key]:f.type==='number'?+e.target.value:e.target.value}))} placeholder={f.label} style={{ width:'100%', padding:'7px 10px', background:V.surface2, border:`1px solid ${V.border}`, borderRadius:7, color:'#e4e4ed', fontSize:12, outline:'none', boxSizing:'border-box' }} />
                    )}
                  </div>
                ))}
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <button className="sal-btn" onClick={addRule} style={{ padding:'8px 20px', borderRadius:8, background:`linear-gradient(135deg,${V.gold},#e0a020)`, color:'#000', border:'none', cursor:'pointer', fontWeight:800, fontSize:12, transition:'all 0.2s' }}>Create Rule</button>
                <button className="sal-btn" onClick={() => setShowRuleForm(false)} style={{ padding:'8px 20px', borderRadius:8, background:'transparent', border:`1px solid ${V.border}`, color:V.muted, cursor:'pointer', fontSize:12, transition:'all 0.2s' }}>Cancel</button>
              </div>
            </div>
          )}
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
              <thead><tr style={{ background:V.surface3 }}>{['Rule Name','Metric','Condition','Severity','Channel','Status','Actions'].map(h=><th key={h} style={{ padding:'10px 16px', textAlign:'left', color:V.muted, fontWeight:700, fontSize:10, textTransform:'uppercase', letterSpacing:'0.06em' }}>{h}</th>)}</tr></thead>
              <tbody>
                {rules.map(rule => (
                  <tr key={rule.id} className="sal-row" style={{ borderTop:`1px solid ${V.border}`, transition:'background 0.15s' }}>
                    <td style={{ padding:'12px 16px', color:'#e4e4ed', fontWeight:600 }}>{rule.name}</td>
                    <td style={{ padding:'12px 16px', color:V.muted, fontFamily:'DM Mono, monospace', fontSize:11 }}>{rule.metric}</td>
                    <td style={{ padding:'12px 16px', fontFamily:'DM Mono, monospace', fontSize:11 }}><span style={{ color:V.teal }}>{rule.metric}</span> <span style={{ color:V.gold }}>{rule.op}</span> <span style={{ color:'#fff' }}>{rule.threshold}</span></td>
                    <td style={{ padding:'12px 16px' }}><SeverityBadge severity={rule.severity} /></td>
                    <td style={{ padding:'12px 16px', color:V.muted, fontSize:11 }}>📨 {rule.channel}</td>
                    <td style={{ padding:'12px 16px' }}>
                      <div onClick={() => setRules(prev=>prev.map(r=>r.id===rule.id?{...r,enabled:!r.enabled}:r))} style={{ width:36,height:20,borderRadius:999,background:rule.enabled?V.green:'rgba(255,255,255,0.1)',cursor:'pointer',position:'relative',transition:'background 0.2s' }}>
                        <div style={{ position:'absolute',top:2,left:rule.enabled?18:2,width:16,height:16,borderRadius:'50%',background:'#fff',transition:'left 0.2s' }} />
                      </div>
                    </td>
                    <td style={{ padding:'12px 16px' }}>
                      <button className="sal-btn" onClick={() => setRules(prev=>prev.filter(r=>r.id!==rule.id))} style={{ padding:'4px 10px', borderRadius:6, border:`1px solid ${V.border}`, background:'transparent', color:V.red, cursor:'pointer', fontSize:10, fontWeight:700, transition:'all 0.2s' }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* NOTIFICATION CHANNELS */}
        <div style={{ background:V.surface2, border:`1px solid ${V.border}`, borderRadius:16, padding:'24px' }}>
          <div style={{ fontWeight:800, fontSize:15, color:'#fff', marginBottom:16 }}>📨 Notification Channels</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:14 }}>
            {[{key:'email',icon:'📧',name:'Email',desc:'Send alerts to configured email addresses'},{key:'webhook',icon:'🔗',name:'Webhook',desc:'POST JSON payload to custom endpoints'},{key:'slack',icon:'💬',name:'Slack',desc:'Push to Slack channel via incoming webhook'},{key:'pagerduty',icon:'📟',name:'PagerDuty',desc:'Create incidents in PagerDuty on-call system'}].map(ch => (
              <div key={ch.key} className="sal-card" style={{ background:V.surface3, border:`1px solid ${channelSettings[ch.key]?V.gold:V.border}`, borderRadius:12, padding:'16px', transition:'all 0.2s' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ fontSize:20 }}>{ch.icon}</span>
                    <span style={{ fontWeight:700, color:'#fff', fontSize:13 }}>{ch.name}</span>
                  </div>
                  <div onClick={() => setChannelSettings(p=>({...p,[ch.key]:!p[ch.key]}))} style={{ width:36,height:20,borderRadius:999,background:channelSettings[ch.key]?V.gold:'rgba(255,255,255,0.1)',cursor:'pointer',position:'relative',transition:'background 0.2s' }}>
                    <div style={{ position:'absolute',top:2,left:channelSettings[ch.key]?18:2,width:16,height:16,borderRadius:'50%',background:channelSettings[ch.key]?'#000':'#fff',transition:'left 0.2s' }} />
                  </div>
                </div>
                <div style={{ fontSize:11, color:V.muted, lineHeight:1.6 }}>{ch.desc}</div>
                {channelSettings[ch.key] && <div style={{ marginTop:10 }}><input placeholder={ch.key==='email'?'alerts@mycompany.com':'https://hooks.example.com/...'} style={{ width:'100%', padding:'6px 10px', background:V.surface2, border:`1px solid ${V.border}`, borderRadius:7, color:'#e4e4ed', fontSize:11, outline:'none', boxSizing:'border-box' }} /></div>}
              </div>
            ))}
          </div>
        </div>

        {/* LIVE EVENT LOG */}
        <div style={{ background:V.surface2, border:`1px solid ${V.border}`, borderRadius:16, overflow:'hidden' }}>
          <div style={{ padding:'14px 20px', borderBottom:`1px solid ${V.border}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ width:7,height:7,borderRadius:'50%',background:liveMode?V.red:V.muted,animation:liveMode?'sal-pulse 1.5s infinite':undefined,display:'inline-block' }} />
              <span style={{ fontWeight:800, fontSize:13, color:'#fff' }}>Alert Event Log</span>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <button className="sal-btn" onClick={() => setEventLog([])} style={{ padding:'4px 10px', borderRadius:6, border:`1px solid ${V.border}`, background:'transparent', color:V.muted, cursor:'pointer', fontSize:10, fontWeight:700, transition:'all 0.2s' }}>Clear</button>
              <button className="sal-btn" onClick={() => { const b=new Blob([eventLog.map(l=>`${l.time} ${l.text}`).join('\n')],{type:'text/plain'}); const a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download='alert-log.txt'; a.click(); }} style={{ padding:'4px 10px', borderRadius:6, border:`1px solid ${V.gold}`, background:'transparent', color:V.gold, cursor:'pointer', fontSize:10, fontWeight:700, transition:'all 0.2s' }}>Export</button>
            </div>
          </div>
          <div ref={logRef} style={{ height:200, overflowY:'auto', padding:'12px 16px', background:'#060609', fontFamily:'DM Mono, monospace', fontSize:11 }}>
            {eventLog.map(l => (
              <div key={l.id} style={{ color:l.color, padding:'1.5px 0', display:'flex', gap:10 }}>
                <span style={{ color:V.muted, flexShrink:0 }}>{l.time}</span>
                <span>{l.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
