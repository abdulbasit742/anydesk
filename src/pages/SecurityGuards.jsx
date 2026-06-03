import { useState, useEffect, useRef } from 'react';

/* ─────────────────────────────────────────────────
   CSS-in-JS keyframe injector (runs once)
───────────────────────────────────────────────── */
const STYLE_ID = 'sg-keyframes';
if (!document.getElementById(STYLE_ID)) {
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@400;600;700;800&display=swap');
    @keyframes pulse-ring{0%{transform:scale(1);opacity:.6}70%{transform:scale(1.6);opacity:0}100%{transform:scale(1.6);opacity:0}}
    @keyframes radar{0%{transform:scale(0.8);opacity:.9}50%{transform:scale(1.4);opacity:.3}100%{transform:scale(0.8);opacity:.9}}
    @keyframes blink-red{0%,100%{background:rgba(239,68,68,0.12)}50%{background:rgba(239,68,68,0.28)}}
    @keyframes slide-in{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes fade-up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
    @keyframes toast-in{from{opacity:0;transform:translateX(60px)}to{opacity:1;transform:translateX(0)}}
    .sg-guard-blink{animation:blink-red 1.2s ease-in-out infinite}
    .sg-slide{animation:slide-in .28s ease}
    .sg-fade-up{animation:fade-up .35s ease}
    .sg-toast{animation:toast-in .3s ease}
    ::-webkit-scrollbar{width:6px;height:6px}
    ::-webkit-scrollbar-track{background:transparent}
    ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:3px}
  `;
  document.head.appendChild(s);
}

/* ─────────────────────────────────────────────────
   CONSTANTS & MOCK DATA
───────────────────────────────────────────────── */
const C = {
  gold:    '#f5b731',
  teal:    '#22d3ee',
  purple:  '#a78bfa',
  surface: '#0e0e16',
  surface2:'#16161e',
  surface3:'#1d1d28',
  border:  'rgba(255,255,255,0.07)',
  muted:   '#6e7191',
  red:     '#ef4444',
  green:   '#22c55e',
  orange:  '#f97316',
  text:    '#e2e8f0',
};

const THREAT_LEVELS = [
  { label: 'CLEAR',    color: C.green,  bg: 'rgba(34,197,94,0.12)'  },
  { label: 'LOW',      color: C.teal,   bg: 'rgba(34,211,238,0.12)' },
  { label: 'MEDIUM',   color: C.gold,   bg: 'rgba(245,183,49,0.12)' },
  { label: 'HIGH',     color: C.orange, bg: 'rgba(249,115,22,0.12)' },
  { label: 'CRITICAL', color: C.red,    bg: 'rgba(239,68,68,0.12)'  },
];

const INITIAL_GUARDS = [
  { id:1,  name:'Prompt Injection Blocker', type:'Input Validation',   status:'Active',   blocks:342, lastTrig:'2m ago',   enabled:true  },
  { id:2,  name:'Rate Limiter',             type:'Throttling',         status:'Active',   blocks:891, lastTrig:'8s ago',   enabled:true  },
  { id:3,  name:'Token Budget Guard',       type:'Resource Control',   status:'Active',   blocks:57,  lastTrig:'1m ago',   enabled:true  },
  { id:4,  name:'PII Detector',             type:'Data Privacy',       status:'Warning',  blocks:23,  lastTrig:'4m ago',   enabled:true  },
  { id:5,  name:'Hallucination Filter',     type:'Output Validation',  status:'Active',   blocks:112, lastTrig:'12m ago',  enabled:true  },
  { id:6,  name:'SSRF Shield',              type:'Network Security',   status:'Active',   blocks:18,  lastTrig:'34m ago',  enabled:true  },
  { id:7,  name:'SQL Injection Checker',    type:'Input Validation',   status:'Active',   blocks:67,  lastTrig:'22m ago',  enabled:true  },
  { id:8,  name:'XSS Sanitizer',            type:'Output Sanitization',status:'Active',   blocks:204, lastTrig:'3m ago',   enabled:true  },
  { id:9,  name:'Auth Token Validator',     type:'Authentication',     status:'Active',   blocks:9,   lastTrig:'1h ago',   enabled:true  },
  { id:10, name:'IP Allowlist',             type:'Access Control',     status:'Active',   blocks:441, lastTrig:'just now', enabled:true  },
  { id:11, name:'Session Guard',            type:'Session Management', status:'Active',   blocks:31,  lastTrig:'18m ago',  enabled:true  },
  { id:12, name:'Credential Masker',        type:'Data Privacy',       status:'Disabled', blocks:0,   lastTrig:'never',    enabled:false },
  { id:13, name:'Audit Logger',             type:'Compliance',         status:'Active',   blocks:0,   lastTrig:'just now', enabled:true  },
  { id:14, name:'Anomaly Detector',         type:'Behavioral Analysis',status:'Warning',  blocks:76,  lastTrig:'6m ago',   enabled:true  },
];

const THREAT_NAMES = [
  'Prompt injection attempt','SQL injection pattern','XSS payload detected',
  'Rate limit exceeded','PII data leak attempt','SSRF probe detected',
  'Credential stuffing','Jailbreak pattern','Token budget exceeded',
  'Anomalous request volume','Auth bypass attempt','Session hijack probe',
];
const ACTIONS = ['Request blocked','Input sanitized','Session terminated','IP banned','Alert raised','Request rate-limited'];

const genIP = () => `${10+Math.floor(Math.random()*245)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*254)+1}`;
const genEvent = () => {
  const types = ['BLOCKED','BLOCKED','WARNING','INFO'];
  const type = types[Math.floor(Math.random()*types.length)];
  return {
    id: Date.now() + Math.random(),
    ts: new Date().toLocaleTimeString(),
    type,
    ip: genIP(),
    threat: THREAT_NAMES[Math.floor(Math.random()*THREAT_NAMES.length)],
    action: ACTIONS[Math.floor(Math.random()*ACTIONS.length)],
  };
};

const INIT_ALLOWLIST = ['192.168.1.0/24','10.0.0.1','172.16.0.0/12','203.0.113.50','198.51.100.10','10.10.10.1','127.0.0.1','192.0.2.100','203.0.113.99','10.5.5.5'];
const INIT_BLOCKLIST = ['45.33.32.156','198.199.77.34','104.238.46.80','167.71.6.44','192.241.186.111','68.183.60.115','139.59.4.215','178.62.52.237','159.65.1.210','206.81.7.71'];

const INIT_AUDIT = Array.from({length:20},(_,i)=>({
  id:i+1,
  ts: new Date(Date.now() - i*180000).toLocaleString(),
  user: ['admin@bolt.ai','dev@bolt.ai','ci-bot','deploy-user','monitor@bolt.ai'][i%5],
  action: ['LOGIN','API_CALL','CONFIG_CHANGE','FILE_READ','EXPORT','DELETE','ROTATE_KEY','POLICY_UPDATE'][i%8],
  resource: ['/api/models','/config/guards','/audit/logs','/keys/rotate','/users/list','/data/export'][i%6],
  result: i%7===0?'Deny':'Allow',
  ip: genIP(),
}));

const API_KEYS = [
  { id:1, name:'OpenAI Production',    age:12,  scope:'read,write,delete', rotated:'May 20, 2026' },
  { id:2, name:'Anthropic API',        age:45,  scope:'read,write',        rotated:'Apr 17, 2026' },
  { id:3, name:'Stripe Payments',      age:98,  scope:'read,write,delete', rotated:'Feb 23, 2026' },
  { id:4, name:'SendGrid Email',       age:120, scope:'read,write',        rotated:'Feb 01, 2026' },
  { id:5, name:'Google Cloud Vision',  age:7,   scope:'read',              rotated:'May 25, 2026' },
  { id:6, name:'AWS S3 Storage',       age:88,  scope:'read,write',        rotated:'Mar 05, 2026' },
  { id:7, name:'PagerDuty Alerts',     age:33,  scope:'read,write',        rotated:'Apr 29, 2026' },
  { id:8, name:'Datadog Monitoring',   age:150, scope:'read,write,delete', rotated:'Jan 02, 2026' },
];

const COMPLIANCE_ITEMS = [
  { id:1,  label:'API keys encrypted at rest',          status:'Pass',    desc:'AES-256 encryption verified' },
  { id:2,  label:'Audit logs retained ≥90 days',        status:'Pass',    desc:'Retention policy: 365 days' },
  { id:3,  label:'No PII in prompt logs',               status:'Warning', desc:'2 instances flagged this week' },
  { id:4,  label:'2FA enabled for all admins',          status:'Pass',    desc:'All 6 admin accounts verified' },
  { id:5,  label:'TLS 1.3 on all endpoints',            status:'Pass',    desc:'Certificate valid until 2027' },
  { id:6,  label:'RBAC policy enforced',                status:'Pass',    desc:'Role-based access active' },
  { id:7,  label:'Secrets rotation < 90d',              status:'Fail',    desc:'3 keys overdue for rotation' },
  { id:8,  label:'Rate limiting on public APIs',        status:'Pass',    desc:'1,000 req/min enforced' },
  { id:9,  label:'GDPR data deletion workflow',         status:'Pass',    desc:'Automated deletion pipeline' },
  { id:10, label:'SOC2 Type II audit completed',        status:'Pass',    desc:'Completed March 2026' },
  { id:11, label:'Vulnerability scan last 30d',         status:'Pass',    desc:'Last scan: May 28, 2026' },
  { id:12, label:'Incident response plan updated',      status:'Warning', desc:'Last update 91 days ago' },
  { id:13, label:'Employee security training current',  status:'Pass',    desc:'All 24 staff certified' },
  { id:14, label:'Backup encryption verified',          status:'Pass',    desc:'Daily encrypted backups' },
  { id:15, label:'Dependency vulnerability check',      status:'Fail',    desc:'4 high-severity CVEs pending' },
];

const INJECTION_PATTERNS = [
  { pattern: /ignore (all |previous |the )?(instructions|prompt|context|rules)/i, label: 'Jailbreak attempt: ignore previous instructions' },
  { pattern: /you are now|you will now act as|pretend you are|act as if|roleplay as/i, label: 'Role override pattern' },
  { pattern: /(system prompt|hidden prompt|meta prompt|initial prompt)/i, label: 'Prompt leak attempt' },
  { pattern: /\bdan\b|do anything now|jailbreak|no restrictions|without limitations/i, label: 'DAN / unrestricted mode trigger' },
  { pattern: /(eval|exec|system|subprocess|os\.)/i, label: 'Code execution injection' },
  { pattern: /(select|drop|insert|update|delete|union).*(from|into|table|database)/i, label: 'SQL injection pattern' },
  { pattern: /<script|onerror=|javascript:|onload=|alert\(/i, label: 'XSS payload detected' },
  { pattern: /base64|atob|btoa|\\x[0-9a-f]{2}/i, label: 'Obfuscated payload encoding' },
];

/* ─────────────────────────────────────────────────
   SHARED SUB-COMPONENTS
───────────────────────────────────────────────── */
const Card = ({ children, style }) => (
  <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 16, padding: '24px', ...style }}>
    {children}
  </div>
);

const SectionTitle = ({ icon, children, color = C.gold }) => (
  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
    <span style={{ fontSize:20 }}>{icon}</span>
    <h2 style={{ fontFamily:'Syne', fontSize:18, fontWeight:700, color, margin:0, letterSpacing:.5 }}>
      {children}
    </h2>
  </div>
);

const Badge = ({ children, color, bg }) => (
  <span style={{
    display:'inline-flex', alignItems:'center', padding:'3px 10px', borderRadius:20,
    fontSize:11, fontWeight:600, fontFamily:'DM Mono', letterSpacing:.8,
    color: color || C.text, background: bg || C.surface3, border:`1px solid ${color || C.border}22`,
  }}>
    {children}
  </span>
);

const Btn = ({ children, onClick, color = C.gold, small, danger, disabled, style }) => (
  <button onClick={onClick} disabled={disabled} style={{
    fontFamily:'DM Mono', fontSize: small?11:13, fontWeight:600,
    padding: small?'5px 12px':'8px 20px', borderRadius:8, cursor: disabled?'not-allowed':'pointer',
    background: danger?`rgba(239,68,68,.15)`:color?`rgba(245,183,49,.12)`:'transparent',
    border:`1.5px solid ${danger?C.red:color}`,
    color: danger?C.red:color, transition:'all .2s', opacity: disabled?.5:1, ...style,
  }}>{children}</button>
);

const PulsingDot = ({ color = C.green }) => (
  <span style={{ position:'relative', display:'inline-flex', width:12, height:12 }}>
    <span style={{
      position:'absolute', inset:0, borderRadius:'50%', background: color,
      animation:'pulse-ring 2s ease-out infinite', opacity:.6,
    }}/>
    <span style={{ position:'relative', borderRadius:'50%', width:'100%', height:'100%', background: color }}/>
  </span>
);

/* ─────────────────────────────────────────────────
   SECTION 1: HERO HEADER
───────────────────────────────────────────────── */
const HeroHeader = ({ threatLevel }) => {
  const tl = THREAT_LEVELS[threatLevel];
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(239,68,68,.18) 0%, rgba(245,183,49,.12) 100%)',
      border: `1px solid rgba(239,68,68,.25)`, borderRadius:20, padding:'32px 36px',
      marginBottom:28, position:'relative', overflow:'hidden',
    }}>
      <div style={{ position:'absolute', top:-40, right:-40, width:240, height:240, borderRadius:'50%', background:'radial-gradient(circle, rgba(239,68,68,.08) 0%, transparent 70%)' }}/>
      <div style={{ position:'absolute', bottom:-60, left:-20, width:180, height:180, borderRadius:'50%', background:'radial-gradient(circle, rgba(245,183,49,.06) 0%, transparent 70%)' }}/>
      <div style={{ position:'relative', display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:20 }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:8 }}>
            <span style={{ fontSize:32 }}>🛡️</span>
            <h1 style={{ fontFamily:'Syne', fontSize:32, fontWeight:800, color:C.text, margin:0, letterSpacing:-.5 }}>
              Security Guards
            </h1>
          </div>
          <p style={{ fontFamily:'DM Mono', fontSize:13, color:C.muted, margin:'0 0 20px 44px' }}>
            Real-time threat detection, access control, and audit compliance
          </p>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginLeft:44 }}>
            <PulsingDot color={tl.color}/>
            <span style={{ fontFamily:'DM Mono', fontSize:13, fontWeight:600, color:tl.color }}>
              THREAT LEVEL: {tl.label}
            </span>
          </div>
        </div>
        <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
          {[
            { label:'Guards Active', val:'14', color:C.teal, icon:'⚡' },
            { label:'Threats Blocked', val:'1,248', color:C.red, icon:'🚫' },
            { label:'Compliance Score', val:'98.4%', color:C.green, icon:'✅' },
          ].map(s => (
            <div key={s.label} style={{
              background: C.surface2, border:`1px solid ${s.color}33`,
              borderRadius:14, padding:'16px 22px', textAlign:'center', minWidth:130,
            }}>
              <div style={{ fontSize:22, marginBottom:4 }}>{s.icon}</div>
              <div style={{ fontFamily:'Syne', fontSize:22, fontWeight:800, color:s.color }}>{s.val}</div>
              <div style={{ fontFamily:'DM Mono', fontSize:11, color:C.muted, marginTop:2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────
   SECTION 2: THREAT LEVEL INDICATOR
───────────────────────────────────────────────── */
const ThreatLevelPanel = ({ level, setLevel }) => {
  const tl = THREAT_LEVELS[level];
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());
  return (
    <Card style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:24, position:'relative', overflow:'hidden' }}>
      {/* Radar bg */}
      <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', pointerEvents:'none' }}>
        {[1,2,3].map(i => (
          <div key={i} style={{
            position:'absolute', borderRadius:'50%',
            width: i*120, height: i*120,
            top:'50%', left:'50%', transform:'translate(-50%,-50%)',
            border:`1px solid ${tl.color}22`,
            animation:`radar ${1.5+i*.5}s ease-in-out infinite`,
            animationDelay:`${i*.3}s`,
          }}/>
        ))}
      </div>
      <SectionTitle icon="🎯" color={tl.color}>Threat Level Status</SectionTitle>
      <div style={{
        position:'relative', width:160, height:160, borderRadius:'50%',
        background: tl.bg, border:`3px solid ${tl.color}`,
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        boxShadow:`0 0 40px ${tl.color}40`,
      }}>
        <span style={{ fontFamily:'Syne', fontSize:15, fontWeight:800, color:tl.color, letterSpacing:2 }}>{tl.label}</span>
        <span style={{ fontSize:32, marginTop:6 }}>
          {['🟢','🔵','🟡','🟠','🔴'][level]}
        </span>
        <span style={{ fontFamily:'DM Mono', fontSize:10, color:C.muted, marginTop:4 }}>LEVEL {level}</span>
      </div>
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', justifyContent:'center' }}>
        {THREAT_LEVELS.map((t,i) => (
          <button key={t.label} onClick={()=>{setLevel(i);setLastUpdated(new Date().toLocaleTimeString());}} style={{
            fontFamily:'DM Mono', fontSize:11, padding:'5px 12px', borderRadius:20, cursor:'pointer',
            background: i===level ? t.bg : 'transparent',
            border:`1.5px solid ${t.color}`, color:t.color, fontWeight:600, letterSpacing:.5,
          }}>{t.label}</button>
        ))}
      </div>
      <div style={{ fontFamily:'DM Mono', fontSize:11, color:C.muted }}>
        Last updated: {lastUpdated} &nbsp;|&nbsp;
        <span style={{ color:tl.color }}>Manual Override Active</span>
      </div>
    </Card>
  );
};

/* ─────────────────────────────────────────────────
   SECTION 3: ACTIVE GUARDS LIST
───────────────────────────────────────────────── */
const ActiveGuards = () => {
  const [guards, setGuards] = useState(INITIAL_GUARDS);
  const toggle = id => setGuards(g => g.map(x => x.id===id ? {...x, enabled:!x.enabled, status:x.enabled?'Disabled':'Active'} : x));
  const statusColor = s => s==='Active'?C.teal:s==='Warning'?C.gold:C.muted;
  const recentBlocked = g => g.lastTrig==='just now'||g.lastTrig==='8s ago'||g.lastTrig==='2m ago';
  return (
    <Card>
      <SectionTitle icon="⚡" color={C.teal}>Active Guards ({guards.filter(g=>g.enabled).length}/14)</SectionTitle>
      <div style={{ overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontFamily:'DM Mono', fontSize:12 }}>
          <thead>
            <tr style={{ borderBottom:`1px solid ${C.border}` }}>
              {['Guard Name','Type','Status','Blocks Today','Last Triggered','Toggle'].map(h=>(
                <th key={h} style={{ padding:'10px 12px', textAlign:'left', color:C.muted, fontWeight:600, fontSize:11, letterSpacing:.8, whiteSpace:'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {guards.map(g => (
              <tr key={g.id} className={g.enabled && recentBlocked(g) ? 'sg-guard-blink' : ''}
                style={{ borderBottom:`1px solid ${C.border}`, transition:'background .2s' }}>
                <td style={{ padding:'11px 12px', color:C.text, fontWeight:500 }}>
                  <span style={{ color:g.enabled?C.text:C.muted }}>{g.name}</span>
                </td>
                <td style={{ padding:'11px 12px', color:C.muted }}>{g.type}</td>
                <td style={{ padding:'11px 12px' }}>
                  <Badge color={statusColor(g.status)} bg={`${statusColor(g.status)}18`}>{g.status}</Badge>
                </td>
                <td style={{ padding:'11px 12px', color: g.blocks>100?C.red:g.blocks>50?C.gold:C.teal, fontWeight:600 }}>
                  {g.enabled ? g.blocks.toLocaleString() : '—'}
                </td>
                <td style={{ padding:'11px 12px', color:C.muted }}>{g.enabled ? g.lastTrig : '—'}</td>
                <td style={{ padding:'11px 12px' }}>
                  <button onClick={()=>toggle(g.id)} style={{
                    width:42, height:22, borderRadius:11, border:'none', cursor:'pointer',
                    background: g.enabled ? `linear-gradient(90deg,${C.teal},${C.teal}99)` : C.surface3,
                    position:'relative', transition:'all .3s',
                  }}>
                    <span style={{
                      position:'absolute', top:3, left: g.enabled?22:3,
                      width:16, height:16, borderRadius:'50%', background:'#fff',
                      transition:'left .3s', boxShadow:'0 1px 4px rgba(0,0,0,.4)',
                    }}/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

/* ─────────────────────────────────────────────────
   SECTION 4: REAL-TIME THREAT FEED
───────────────────────────────────────────────── */
const ThreatFeed = () => {
  const [events, setEvents] = useState(() => Array.from({length:6}, genEvent));
  const [paused, setPaused] = useState(false);
  const feedRef = useRef(null);
  useEffect(() => {
    if (paused) return;
    const iv = setInterval(() => {
      setEvents(ev => [genEvent(), ...ev].slice(0,15));
    }, 2500);
    return () => clearInterval(iv);
  }, [paused]);
  useEffect(() => {
    if (feedRef.current) feedRef.current.scrollTop = 0;
  }, [events]);
  const typeColor = t => t==='BLOCKED'?C.red:t==='WARNING'?C.gold:C.teal;
  return (
    <Card>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <SectionTitle icon="📡" color={C.red}>Real-Time Threat Feed</SectionTitle>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          {!paused && <PulsingDot color={C.red}/>}
          <Btn small onClick={()=>setPaused(p=>!p)} color={paused?C.green:C.gold}>{paused?'▶ Resume':'⏸ Pause'}</Btn>
          <Btn small danger onClick={()=>setEvents([])}>🗑 Clear</Btn>
        </div>
      </div>
      <div ref={feedRef} style={{ maxHeight:300, overflowY:'auto', display:'flex', flexDirection:'column', gap:6 }}>
        {events.length === 0 && (
          <div style={{ color:C.muted, fontFamily:'DM Mono', fontSize:12, textAlign:'center', padding:24 }}>Feed cleared. Awaiting events…</div>
        )}
        {events.map(e => (
          <div key={e.id} className="sg-slide" style={{
            display:'flex', gap:10, alignItems:'flex-start', padding:'10px 14px', borderRadius:10,
            background:`${typeColor(e.type)}0d`, border:`1px solid ${typeColor(e.type)}22`,
          }}>
            <Badge color={typeColor(e.type)} bg={`${typeColor(e.type)}18`}>{e.type}</Badge>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontFamily:'DM Mono', fontSize:12, color:C.text, fontWeight:500 }}>{e.threat}</div>
              <div style={{ fontFamily:'DM Mono', fontSize:11, color:C.muted, marginTop:2 }}>
                {e.action} &nbsp;·&nbsp; src: <span style={{ color:C.teal }}>{e.ip}</span>
              </div>
            </div>
            <span style={{ fontFamily:'DM Mono', fontSize:11, color:C.muted, whiteSpace:'nowrap' }}>{e.ts}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

/* ─────────────────────────────────────────────────
   SECTION 5: IP ALLOWLIST / BLOCKLIST
───────────────────────────────────────────────── */
const IpInput = ({ val, onChange, placeholder }) => (
  <input value={val} onChange={onChange} placeholder={placeholder} style={{
    flex:1, background:C.surface3, border:`1px solid ${C.border}`, borderRadius:8,
    padding:'7px 12px', color:C.text, fontFamily:'DM Mono', fontSize:12, outline:'none',
  }}/>
);

const ListPanel = ({ title, color, list, setList, addVal, setAddVal, search, setSearch }) => (
  <div style={{ flex:1, minWidth:0 }}>
    <div style={{ fontFamily:'Syne', fontSize:14, fontWeight:700, color, marginBottom:12 }}>{title}</div>
    <IpInput val={search} onChange={e=>setSearch(e.target.value)} placeholder="Search IPs…"/>
    <div style={{ margin:'10px 0', maxHeight:200, overflowY:'auto', display:'flex', flexDirection:'column', gap:4 }}>
      {list.filter(ip=>ip.includes(search)).map((ip,i)=>(
        <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
          background:C.surface3, borderRadius:8, padding:'7px 12px',
          border:`1px solid ${C.border}`, fontFamily:'DM Mono', fontSize:12, color:C.text }}>
          <span>{ip}</span>
          <button onClick={()=>setList(l=>l.filter((_,j)=>j!==i))} style={{
            background:'none', border:'none', color:C.red, cursor:'pointer', fontSize:15, lineHeight:1, padding:'0 4px',
          }}>×</button>
        </div>
      ))}
    </div>
    <div style={{ display:'flex', gap:8 }}>
      <IpInput val={addVal} onChange={e=>setAddVal(e.target.value)} placeholder="Add IP or CIDR…"/>
      <Btn small color={color} onClick={()=>{if(addVal.trim()){setList(l=>[addVal.trim(),...l]);setAddVal('');}}}>+ Add</Btn>
    </div>
    <div style={{ display:'flex', gap:8, marginTop:10 }}>
      <Btn small color={C.muted} style={{ flex:1 }}>⬇ Import</Btn>
      <Btn small color={C.muted} style={{ flex:1 }}>⬆ Export</Btn>
    </div>
  </div>
);

const IPLists = () => {
  const [allow, setAllow] = useState(INIT_ALLOWLIST);
  const [block, setBlock] = useState(INIT_BLOCKLIST);
  const [addAllow, setAddAllow] = useState('');
  const [addBlock, setAddBlock] = useState('');
  const [searchAllow, setSearchAllow] = useState('');
  const [searchBlock, setSearchBlock] = useState('');

  return (
    <Card>
      <SectionTitle icon="🌐" color={C.purple}>IP Allowlist / Blocklist</SectionTitle>
      <div style={{ display:'flex', gap:24, flexWrap:'wrap' }}>
        <ListPanel title="✅ Allowlist" color={C.green} list={allow} setList={setAllow}
          addVal={addAllow} setAddVal={setAddAllow} search={searchAllow} setSearch={setSearchAllow}/>
        <div style={{ width:1, background:C.border }}/>
        <ListPanel title="🚫 Blocklist" color={C.red} list={block} setList={setBlock}
          addVal={addBlock} setAddVal={setAddBlock} search={searchBlock} setSearch={setSearchBlock}/>
      </div>
    </Card>
  );
};

/* ─────────────────────────────────────────────────
   SECTION 6: PROMPT INJECTION SCANNER
───────────────────────────────────────────────── */
const InjectionScanner = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState(null);
  const [scanning, setScanning] = useState(false);

  const scan = () => {
    setScanning(true);
    setResult(null);
    setTimeout(() => {
      const found = INJECTION_PATTERNS.filter(p => p.pattern.test(prompt));
      const score = Math.min(100, found.length * 28 + (prompt.length > 500 ? 10 : 0));
      const verdict = found.length === 0 ? 'SAFE' : found.length >= 2 ? 'DANGEROUS' : 'SUSPICIOUS';
      setResult({ verdict, score, patterns: found.map(f => f.label), confidence: Math.min(100, 60 + score) });
      setScanning(false);
    }, 900);
  };

  const verdictColor = v => v==='SAFE'?C.green:v==='SUSPICIOUS'?C.gold:C.red;

  return (
    <Card>
      <SectionTitle icon="🔬" color={C.gold}>Prompt Injection Scanner</SectionTitle>
      <textarea value={prompt} onChange={e=>setPrompt(e.target.value)}
        placeholder="Paste a prompt here to scan for injection patterns, jailbreaks, role overrides, or code execution attempts…"
        style={{
          width:'100%', minHeight:120, background:C.surface3, border:`1px solid ${C.border}`,
          borderRadius:10, padding:'12px 14px', color:C.text, fontFamily:'DM Mono', fontSize:12,
          resize:'vertical', outline:'none', boxSizing:'border-box', lineHeight:1.6,
        }}/>
      <div style={{ marginTop:12, display:'flex', gap:10, alignItems:'center' }}>
        <Btn onClick={scan} disabled={!prompt.trim()||scanning} color={C.gold}>
          {scanning ? '⏳ Scanning…' : '🔍 Scan Prompt'}
        </Btn>
        <Btn small color={C.muted} onClick={()=>{setPrompt('');setResult(null);}}>Clear</Btn>
      </div>
      {result && (
        <div className="sg-fade-up" style={{
          marginTop:16, padding:'16px 20px', borderRadius:12,
          background:`${verdictColor(result.verdict)}0d`,
          border:`1.5px solid ${verdictColor(result.verdict)}44`,
        }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
            <div style={{ fontFamily:'Syne', fontSize:22, fontWeight:800, color:verdictColor(result.verdict) }}>
              {result.verdict==='SAFE'?'✅':result.verdict==='SUSPICIOUS'?'⚠️':'🚨'} {result.verdict}
            </div>
            <div style={{ fontFamily:'DM Mono', fontSize:12, color:C.muted }}>
              Confidence: <span style={{ color:verdictColor(result.verdict), fontWeight:600 }}>{result.confidence}%</span>
            </div>
          </div>
          {result.patterns.length > 0 && (
            <div>
              <div style={{ fontFamily:'DM Mono', fontSize:11, color:C.muted, marginBottom:8, letterSpacing:.8 }}>DETECTED PATTERNS:</div>
              {result.patterns.map((p,i) => (
                <div key={i} style={{
                  fontFamily:'DM Mono', fontSize:12, padding:'6px 12px', borderRadius:8, marginBottom:6,
                  background:`${C.red}15`, border:`1px solid ${C.red}33`, color:C.red,
                }}>⚠ {p}</div>
              ))}
            </div>
          )}
          {result.patterns.length === 0 && (
            <div style={{ fontFamily:'DM Mono', fontSize:12, color:C.green }}>No injection patterns detected. Prompt appears safe.</div>
          )}
        </div>
      )}
    </Card>
  );
};

/* ─────────────────────────────────────────────────
   SECTION 7: AUDIT LOG
───────────────────────────────────────────────── */
const AuditLog = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [page, setPage] = useState(0);
  const PER_PAGE = 5;

  const filtered = INIT_AUDIT.filter(e =>
    (filter==='All'||e.result===filter) &&
    Object.values(e).some(v=>String(v).toLowerCase().includes(search.toLowerCase()))
  );
  const pages = Math.ceil(filtered.length / PER_PAGE);
  const slice = filtered.slice(page*PER_PAGE, page*PER_PAGE+PER_PAGE);

  const exportCSV = () => {
    const rows = [['ID','Timestamp','User','Action','Resource','Result','IP'],...filtered.map(e=>[e.id,e.ts,e.user,e.action,e.resource,e.result,e.ip])];
    const csv = rows.map(r=>r.join(',')).join('\n');
    const blob = new Blob([csv],{type:'text/csv'});
    const a = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='audit_log.csv'; a.click();
  };

  return (
    <Card>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16, flexWrap:'wrap', gap:10 }}>
        <SectionTitle icon="📋" color={C.purple}>Audit Log</SectionTitle>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          <input value={search} onChange={e=>{setSearch(e.target.value);setPage(0);}} placeholder="Search…" style={{
            background:C.surface3, border:`1px solid ${C.border}`, borderRadius:8, padding:'7px 12px',
            color:C.text, fontFamily:'DM Mono', fontSize:12, outline:'none', width:160,
          }}/>
          {['All','Allow','Deny'].map(f=>(
            <button key={f} onClick={()=>{setFilter(f);setPage(0);}} style={{
              fontFamily:'DM Mono', fontSize:11, padding:'6px 14px', borderRadius:20, cursor:'pointer',
              background:filter===f?C.surface3:'transparent',
              border:`1.5px solid ${filter===f?C.purple:C.border}`, color:filter===f?C.purple:C.muted,
            }}>{f}</button>
          ))}
          <Btn small color={C.teal} onClick={exportCSV}>⬇ Export CSV</Btn>
        </div>
      </div>
      <div style={{ overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontFamily:'DM Mono', fontSize:12 }}>
          <thead>
            <tr style={{ borderBottom:`1px solid ${C.border}` }}>
              {['Time','User','Action','Resource','Result','IP'].map(h=>(
                <th key={h} style={{ padding:'9px 12px', textAlign:'left', color:C.muted, fontSize:11, letterSpacing:.8 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slice.map(e=>(
              <tr key={e.id} style={{ borderBottom:`1px solid ${C.border}33` }}>
                <td style={{ padding:'9px 12px', color:C.muted, whiteSpace:'nowrap' }}>{e.ts}</td>
                <td style={{ padding:'9px 12px', color:C.text }}>{e.user}</td>
                <td style={{ padding:'9px 12px', color:C.teal }}>{e.action}</td>
                <td style={{ padding:'9px 12px', color:C.muted }}>{e.resource}</td>
                <td style={{ padding:'9px 12px' }}>
                  <Badge color={e.result==='Allow'?C.green:C.red} bg={e.result==='Allow'?`${C.green}18`:`${C.red}18`}>{e.result}</Badge>
                </td>
                <td style={{ padding:'9px 12px', color:C.muted }}>{e.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:16 }}>
        <span style={{ fontFamily:'DM Mono', fontSize:11, color:C.muted }}>{filtered.length} entries</span>
        <div style={{ display:'flex', gap:8 }}>
          <Btn small disabled={page===0} onClick={()=>setPage(p=>p-1)} color={C.muted}>← Prev</Btn>
          <span style={{ fontFamily:'DM Mono', fontSize:12, color:C.muted, alignSelf:'center' }}>Page {page+1} / {Math.max(1,pages)}</span>
          <Btn small disabled={page>=pages-1} onClick={()=>setPage(p=>p+1)} color={C.muted}>Next →</Btn>
        </div>
      </div>
    </Card>
  );
};

/* ─────────────────────────────────────────────────
   SECTION 8: API SECURITY SCANNER
───────────────────────────────────────────────── */
const APIScanner = () => {
  const [keys, setKeys] = useState(API_KEYS.map(k=>({...k, rotating:false, rotated:false})));
  const [scanning, setScanning] = useState(false);
  const [report, setReport] = useState(null);

  const rotate = id => {
    setKeys(ks=>ks.map(k=>k.id===id?{...k,rotating:true}:k));
    setTimeout(()=>setKeys(ks=>ks.map(k=>k.id===id?{...k,rotating:false,rotated:true,age:0,rotated_ts:new Date().toLocaleDateString()}:k)),1200);
  };

  const scanAll = () => {
    setScanning(true);
    setTimeout(()=>{
      const issues = keys.filter(k=>k.age>=90);
      setReport({ total:keys.length, pass:keys.filter(k=>k.age<90).length, fail:issues.length, issues });
      setScanning(false);
    },1600);
  };

  return (
    <Card>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <SectionTitle icon="🔑" color={C.gold}>API Security Scanner</SectionTitle>
        <Btn onClick={scanAll} disabled={scanning} color={C.gold}>{scanning?'⏳ Scanning…':'🔍 Scan All'}</Btn>
      </div>
      {report && (
        <div className="sg-fade-up" style={{
          marginBottom:16, padding:'14px 18px', borderRadius:12,
          background:report.fail>0?`${C.red}0d`:`${C.green}0d`,
          border:`1px solid ${report.fail>0?C.red:C.green}44`,
        }}>
          <div style={{ fontFamily:'Syne', fontSize:15, fontWeight:700, color:report.fail>0?C.red:C.green, marginBottom:6 }}>
            {report.fail>0?`⚠ ${report.fail} key(s) require rotation`:'✅ All keys within rotation policy'}
          </div>
          <div style={{ fontFamily:'DM Mono', fontSize:11, color:C.muted }}>
            {report.pass} / {report.total} keys healthy &nbsp;·&nbsp;
            {report.issues.map(k=>k.name).join(', ') || 'None'}
          </div>
          <Btn small color={C.muted} style={{ marginTop:8 }} onClick={()=>setReport(null)}>Dismiss</Btn>
        </div>
      )}
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {keys.map(k=>(
          <div key={k.id} style={{
            display:'flex', alignItems:'center', gap:12, padding:'12px 16px', borderRadius:12,
            background: k.age>=90?`${C.orange}0d`:`${C.surface3}`,
            border:`1px solid ${k.age>=90?C.orange:C.border}`,
            flexWrap:'wrap',
          }}>
            <div style={{ flex:1, minWidth:160 }}>
              <div style={{ fontFamily:'Syne', fontSize:13, fontWeight:600, color:C.text }}>{k.name}</div>
              <div style={{ fontFamily:'DM Mono', fontSize:11, color:C.muted, marginTop:3 }}>
                Scope: {k.scope} &nbsp;·&nbsp; Last rotated: {k.rotated_ts || k.rotated}
              </div>
            </div>
            <Badge color={k.age<90?C.green:C.orange} bg={k.age<90?`${C.green}15`:`${C.orange}15`}>
              {k.rotated?'Rotated':k.age<90?`${k.age}d old`:`⚠ ${k.age}d — overdue`}
            </Badge>
            <Btn small color={k.age>=90?C.orange:C.muted} disabled={k.rotating||k.rotated} onClick={()=>rotate(k.id)}>
              {k.rotating?'⏳…':k.rotated?'✅ Done':'↻ Rotate'}
            </Btn>
          </div>
        ))}
      </div>
    </Card>
  );
};

/* ─────────────────────────────────────────────────
   SECTION 9: COMPLIANCE CHECKLIST
───────────────────────────────────────────────── */
const ComplianceChecklist = () => {
  const items = COMPLIANCE_ITEMS;
  const score = Math.round(items.filter(i=>i.status==='Pass').length / items.length * 100);
  const statusColor = s => s==='Pass'?C.green:s==='Fail'?C.red:C.gold;
  const statusIcon  = s => s==='Pass'?'✅':s==='Fail'?'❌':'⚠️';

  return (
    <Card>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <SectionTitle icon="📜" color={C.green}>Compliance Checklist</SectionTitle>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontFamily:'Syne', fontSize:26, fontWeight:800, color: score>=90?C.green:score>=70?C.gold:C.red }}>{score}%</div>
          <div style={{ fontFamily:'DM Mono', fontSize:10, color:C.muted }}>Overall Score</div>
        </div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {items.map(item=>(
          <div key={item.id} style={{
            display:'flex', alignItems:'center', gap:12, padding:'12px 16px', borderRadius:12,
            background:C.surface3, border:`1px solid ${statusColor(item.status)}22`,
            flexWrap:'wrap',
          }}>
            <span style={{ fontSize:18 }}>{statusIcon(item.status)}</span>
            <div style={{ flex:1, minWidth:160 }}>
              <div style={{ fontFamily:'DM Mono', fontSize:13, color:C.text, fontWeight:500 }}>{item.label}</div>
              <div style={{ fontFamily:'DM Mono', fontSize:11, color:C.muted, marginTop:2 }}>{item.desc}</div>
            </div>
            <Badge color={statusColor(item.status)} bg={`${statusColor(item.status)}18`}>{item.status}</Badge>
            <Btn small color={item.status==='Fail'?C.red:item.status==='Warning'?C.gold:C.muted}>
              {item.status==='Fail'?'Fix Now':item.status==='Warning'?'Review':'View'}
            </Btn>
          </div>
        ))}
      </div>
    </Card>
  );
};

/* ─────────────────────────────────────────────────
   SECTION 10: SECURITY SETTINGS PANEL
───────────────────────────────────────────────── */
const SettingsToggle = ({ value, onChange, color=C.teal }) => (
  <button onClick={()=>onChange(!value)} style={{
    width:46, height:24, borderRadius:12, border:'none', cursor:'pointer',
    background: value?`linear-gradient(90deg,${color},${color}99)`:C.surface3,
    position:'relative', transition:'all .3s', flexShrink:0,
  }}>
    <span style={{
      position:'absolute', top:4, left: value?26:4,
      width:16, height:16, borderRadius:'50%', background:'#fff',
      transition:'left .3s', boxShadow:'0 1px 4px rgba(0,0,0,.4)',
    }}/>
  </button>
);

const SettingRow = ({ label, desc, children }) => (
  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 0',
    borderBottom:`1px solid ${C.border}`, gap:16, flexWrap:'wrap' }}>
    <div>
      <div style={{ fontFamily:'DM Mono', fontSize:13, color:C.text, fontWeight:500 }}>{label}</div>
      {desc && <div style={{ fontFamily:'DM Mono', fontSize:11, color:C.muted, marginTop:3 }}>{desc}</div>}
    </div>
    {children}
  </div>
);

const SecuritySettings = () => {
  const [maxAttempts, setMaxAttempts] = useState(5);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [twoFA, setTwoFA] = useState(true);
  const [cidr, setCidr] = useState('10.0.0.0/8');
  const [webhookSchedule, setWebhookSchedule] = useState('30d');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [toast, setToast] = useState(false);

  const save = () => {
    setToast(true);
    setTimeout(()=>setToast(false), 3000);
  };

  const inputStyle = {
    background:C.surface3, border:`1px solid ${C.border}`, borderRadius:8,
    padding:'7px 12px', color:C.text, fontFamily:'DM Mono', fontSize:12, outline:'none', minWidth:120,
  };

  return (
    <Card style={{ position:'relative' }}>
      {toast && (
        <div className="sg-toast" style={{
          position:'absolute', top:20, right:20, background:C.green, color:'#fff',
          fontFamily:'DM Mono', fontSize:12, padding:'10px 18px', borderRadius:10,
          fontWeight:600, zIndex:10, boxShadow:'0 4px 20px rgba(34,197,94,.4)',
        }}>✅ Settings saved successfully!</div>
      )}
      <SectionTitle icon="⚙️" color={C.purple}>Security Settings</SectionTitle>
      <SettingRow label="Max Failed Attempts Before Lockout" desc={`Current: ${maxAttempts} attempts`}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <input type="range" min={3} max={10} value={maxAttempts} onChange={e=>setMaxAttempts(+e.target.value)}
            style={{ width:120, accentColor:C.purple }}/>
          <span style={{ fontFamily:'DM Mono', fontSize:14, color:C.purple, fontWeight:700, minWidth:20 }}>{maxAttempts}</span>
        </div>
      </SettingRow>
      <SettingRow label="Session Timeout" desc="Auto-logout after inactivity">
        <select value={sessionTimeout} onChange={e=>setSessionTimeout(e.target.value)} style={{...inputStyle}}>
          {['15','30','60','120'].map(v=><option key={v} value={v}>{v} minutes</option>)}
        </select>
      </SettingRow>
      <SettingRow label="Two-Factor Authentication" desc="Enforce 2FA for all admin accounts">
        <SettingsToggle value={twoFA} onChange={setTwoFA} color={C.teal}/>
      </SettingRow>
      <SettingRow label="Allowed IP Range (CIDR)" desc="Restrict admin access to these ranges">
        <input value={cidr} onChange={e=>setCidr(e.target.value)} style={inputStyle}/>
      </SettingRow>
      <SettingRow label="Webhook Secret Rotation Schedule" desc="Automatic rotation period">
        <select value={webhookSchedule} onChange={e=>setWebhookSchedule(e.target.value)} style={{...inputStyle}}>
          {[['7d','7 days'],['14d','14 days'],['30d','30 days'],['90d','90 days']].map(([v,l])=><option key={v} value={v}>{l}</option>)}
        </select>
      </SettingRow>
      <SettingRow label="Email Alerts on CRITICAL Events" desc={`Send to: admin@bolt.ai`}>
        <SettingsToggle value={emailAlerts} onChange={setEmailAlerts} color={C.red}/>
      </SettingRow>
      <div style={{ marginTop:20, display:'flex', justifyContent:'flex-end' }}>
        <Btn onClick={save} color={C.gold} style={{ padding:'10px 32px', fontSize:14 }}>💾 Save Settings</Btn>
      </div>
    </Card>
  );
};

/* ─────────────────────────────────────────────────
   ROOT COMPONENT
───────────────────────────────────────────────── */
export default function SecurityGuards() {
  const [threatLevel, setThreatLevel] = useState(1); // 0=CLEAR, 1=LOW, 2=MEDIUM, 3=HIGH, 4=CRITICAL

  return (
    <div style={{
      background: C.surface, minHeight:'100vh', padding:'32px 28px',
      fontFamily:'Syne, sans-serif', color:C.text,
      maxWidth:1400, margin:'0 auto',
    }}>
      {/* Hero */}
      <HeroHeader threatLevel={threatLevel}/>

      {/* Row 1: Threat Level + Threat Feed */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1.6fr', gap:20, marginBottom:20, alignItems:'start' }}>
        <ThreatLevelPanel level={threatLevel} setLevel={setThreatLevel}/>
        <ThreatFeed/>
      </div>

      {/* Row 2: Active Guards (full width) */}
      <div style={{ marginBottom:20 }}>
        <ActiveGuards/>
      </div>

      {/* Row 3: IP Lists + Injection Scanner */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20, alignItems:'start' }}>
        <IPLists/>
        <InjectionScanner/>
      </div>

      {/* Row 4: Audit Log (full width) */}
      <div style={{ marginBottom:20 }}>
        <AuditLog/>
      </div>

      {/* Row 5: API Scanner + Compliance */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20, alignItems:'start' }}>
        <APIScanner/>
        <ComplianceChecklist/>
      </div>

      {/* Row 6: Security Settings (full width) */}
      <div style={{ marginBottom:20 }}>
        <SecuritySettings/>
      </div>

      {/* Footer */}
      <div style={{ textAlign:'center', padding:'20px 0', borderTop:`1px solid ${C.border}` }}>
        <span style={{ fontFamily:'DM Mono', fontSize:11, color:C.muted }}>
          🛡️ Bolt Studio Pro &nbsp;·&nbsp; Security Guards v2.4.1 &nbsp;·&nbsp;
          Last full scan: {new Date().toLocaleString()} &nbsp;·&nbsp;
          <span style={{ color:C.green }}>All systems operational</span>
        </span>
      </div>
    </div>
  );
}
