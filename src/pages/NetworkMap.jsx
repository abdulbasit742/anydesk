import { useState, useEffect, useRef, useCallback, Fragment } from 'react';

/* ─── Design tokens ───────────────────────────────────────────────────────── */
const G = {
  gold:     '#f5b731',
  teal:     '#22d3ee',
  purple:   '#a78bfa',
  surface:  '#0e0e16',
  surface2: '#16161e',
  surface3: '#1d1d28',
  border:   'rgba(255,255,255,0.07)',
  muted:    '#6e7191',
  red:      '#ef4444',
  green:    '#22c55e',
  blue:     '#60a5fa',
  text:     '#e2e8f0',
};

/* ─── Keyframes ───────────────────────────────────────────────────────────── */
const injectStyles = () => {
  if (document.getElementById('nm-styles')) return;
  const el = document.createElement('style');
  el.id = 'nm-styles';
  el.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@400;500;600;700;800&display=swap');
    @keyframes flow    { from{stroke-dashoffset:30}  to{stroke-dashoffset:0} }
    @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.35} }
    @keyframes fadeUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
    @keyframes countUp { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
    @keyframes spin    { to{transform:rotate(360deg)} }
    .nm-card:hover { transform:translateY(-2px)!important; box-shadow:0 8px 32px rgba(0,0,0,.45)!important; }
    .nm-row:hover  { background:rgba(255,255,255,.03)!important; }
    .nm-btn:hover  { opacity:.82; transform:scale(1.03); }
    .nm-node:hover { filter:brightness(1.25); cursor:pointer; }
  `;
  document.head.appendChild(el);
};

/* ─── Node definitions ────────────────────────────────────────────────────── */
const NODES = [
  { id:'gw',   label:'API GW',      type:'API Gateway',   x:390, y:60,  lat:8,   rpm:14200, health:99.8, uptime:99.97 },
  { id:'auth', label:'Auth',        type:'Auth Service',  x:180, y:140, lat:12,  rpm:8900,  health:98.4, uptime:99.91 },
  { id:'cdn',  label:'CDN',         type:'CDN',           x:600, y:140, lat:4,   rpm:32000, health:100,  uptime:100   },
  { id:'api1', label:'Users API',   type:'API Gateway',   x:100, y:260, lat:18,  rpm:5400,  health:97.2, uptime:99.88 },
  { id:'api2', label:'Orders API',  type:'API Gateway',   x:280, y:260, lat:22,  rpm:7800,  health:96.8, uptime:99.72 },
  { id:'api3', label:'Products',    type:'API Gateway',   x:460, y:260, lat:15,  rpm:4200,  health:99.1, uptime:99.95 },
  { id:'api4', label:'Notif API',   type:'API Gateway',   x:640, y:260, lat:30,  rpm:1800,  health:94.6, uptime:99.41 },
  { id:'cache1',label:'Redis',      type:'Cache',         x:140, y:380, lat:2,   rpm:22000, health:100,  uptime:100   },
  { id:'cache2',label:'Memcached',  type:'Cache',         x:360, y:380, lat:3,   rpm:18000, health:99.8, uptime:99.99 },
  { id:'db1',  label:'Users DB',    type:'Database',      x:80,  y:460, lat:28,  rpm:3200,  health:99.4, uptime:99.87 },
  { id:'db2',  label:'Orders DB',   type:'Database',      x:240, y:460, lat:35,  rpm:4100,  health:98.7, uptime:99.81 },
  { id:'db3',  label:'Analytics',   type:'Database',      x:420, y:460, lat:48,  rpm:800,   health:97.6, uptime:99.66 },
  { id:'db4',  label:'Mongo',       type:'Database',      x:570, y:460, lat:22,  rpm:2600,  health:99.2, uptime:99.9  },
  { id:'wk1',  label:'Job Queue',   type:'Worker',        x:700, y:360, lat:45,  rpm:600,   health:95.0, uptime:99.3  },
  { id:'wk2',  label:'Mailer',      type:'Worker',        x:700, y:430, lat:60,  rpm:240,   health:93.2, uptime:98.8  },
  { id:'search',label:'Search',     type:'Cache',         x:550, y:360, lat:14,  rpm:9800,  health:99.6, uptime:99.93 },
];

const EDGES = [
  ['gw','auth'],['gw','cdn'],['gw','api1'],['gw','api2'],['gw','api3'],['gw','api4'],
  ['api1','cache1'],['api1','db1'],['api2','cache2'],['api2','db2'],
  ['api3','cache2'],['api3','db3'],['api3','search'],['api4','wk1'],['api4','wk2'],
  ['cache1','db1'],['cache2','db2'],['wk1','db2'],['wk2','db4'],['api2','db4'],
  ['search','db3'],['cdn','api3'],['auth','db1'],
];

const TYPE_COLOR = {
  'API Gateway': G.gold,
  'Database':    G.blue,
  'Cache':       G.teal,
  'Auth Service':G.purple,
  'CDN':         G.green,
  'Worker':      G.muted,
};
const TYPE_ICON = {
  'API Gateway': '⬡',
  'Database':    '🗄',
  'Cache':       '⚡',
  'Auth Service':'🔐',
  'CDN':         '🌐',
  'Worker':      '⚙',
};

/* ─── Traffic rows ────────────────────────────────────────────────────────── */
const TRAFFIC = [
  { from:'API GW',    to:'CDN',        rpm:32000, lat:4,  err:0.01, bw:'1.2 GB/s' },
  { from:'API GW',    to:'Users API',  rpm:14200, lat:8,  err:0.08, bw:'420 MB/s' },
  { from:'API GW',    to:'Orders API', rpm:7800,  lat:22, err:0.12, bw:'310 MB/s' },
  { from:'Redis',     to:'Users DB',   rpm:22000, lat:2,  err:0.00, bw:'840 MB/s' },
  { from:'Orders API',to:'Orders DB',  rpm:4100,  lat:35, err:0.18, bw:'180 MB/s' },
  { from:'Search',    to:'Analytics',  rpm:9800,  lat:14, err:0.05, bw:'270 MB/s' },
  { from:'Auth',      to:'Users DB',   rpm:8900,  lat:12, err:0.03, bw:'200 MB/s' },
  { from:'Notif API', to:'Job Queue',  rpm:1800,  lat:30, err:0.42, bw:'48 MB/s'  },
  { from:'Job Queue', to:'Orders DB',  rpm:600,   lat:45, err:0.20, bw:'28 MB/s'  },
  { from:'Mailer',    to:'Mongo',      rpm:240,   lat:60, err:0.85, bw:'12 MB/s'  },
];

/* ─── Health data ─────────────────────────────────────────────────────────── */
const HEALTH_CARDS = [
  { label:'Overall Health', val:98.4, color:G.teal,   incidents:0 },
  { label:'API Layer',      val:97.2, color:G.gold,   incidents:1 },
  { label:'Database Layer', val:99.1, color:G.blue,   incidents:0 },
  { label:'Cache Layer',    val:100,  color:G.green,  incidents:0 },
  { label:'Auth Layer',     val:98.4, color:G.purple, incidents:0 },
  { label:'CDN',            val:100,  color:G.green,  incidents:0 },
];

/* ─── Incidents ───────────────────────────────────────────────────────────── */
const INCIDENTS = [
  { sev:'CRITICAL', svc:'Notif API',   desc:'Memory leak causing OOM kills',        start:'14:22',end:'14:48',dur:'26m', resolved:true  },
  { sev:'HIGH',     svc:'Orders API',  desc:'P99 latency spike >500ms',             start:'11:05',end:'11:19',dur:'14m', resolved:true  },
  { sev:'MEDIUM',   svc:'Mailer',      desc:'SMTP relay throttled — queue backup',  start:'09:33',end:'—',    dur:'ongoing', resolved:false },
  { sev:'LOW',      svc:'Analytics',   desc:'Slow query detected >5s',              start:'07:12',end:'07:41',dur:'29m', resolved:true  },
  { sev:'LOW',      svc:'Job Queue',   desc:'Worker starvation (3 idle workers)',   start:'03:45',end:'04:02',dur:'17m', resolved:true  },
];

const SEV_COLOR = { CRITICAL:G.red, HIGH:'#f97316', MEDIUM:G.gold, LOW:G.muted };

/* ─── Latency heatmap data ────────────────────────────────────────────────── */
const HM_SERVICES = ['API GW','Auth','CDN','Users API','Orders','Redis','Users DB','Search'];
const HM_DATA = HM_SERVICES.map((r,i)=>HM_SERVICES.map((c,j)=>{
  if(i===j) return 0;
  const base = Math.abs(i-j)*8 + 4;
  return Math.round(base + Math.random()*base*0.6);
}));
const latColor = v => {
  if(v===0) return 'rgba(0,0,0,0)';
  if(v<15) return `rgba(34,197,94,${0.3+v/50})`;
  if(v<40) return `rgba(245,183,49,${0.3+v/80})`;
  return `rgba(239,68,68,${0.4+Math.min(v/120,0.6)})`;
};

/* ─── Sparkline ───────────────────────────────────────────────────────────── */
function Sparkline({ data, color }) {
  const W=120, H=36, pad=4;
  const max=Math.max(...data), min=Math.min(...data);
  const pts = data.map((v,i)=>({
    x: pad+(i/(data.length-1))*(W-pad*2),
    y: pad+(1-(v-min)/(max-min||1))*(H-pad*2)
  }));
  const line = pts.map((p,i)=>`${i?'L':'M'}${p.x},${p.y}`).join('');
  return (
    <svg width={W} height={H} style={{ overflow:'visible' }}>
      <path d={line} fill="none" stroke={color} strokeWidth={1.5}
        style={{ strokeDasharray:300, strokeDashoffset:300,
          animation:'nm-dash 1s ease .2s forwards' }}/>
      {pts.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r={1.5} fill={color}/>)}
    </svg>
  );
}

/* ─── Animated number counter ─────────────────────────────────────────────── */
function Counter({ value, decimals=0 }) {
  const [disp, setDisp] = useState(0);
  const prev = useRef(0);
  useEffect(()=>{
    const diff = value - prev.current;
    const steps = 20;
    let i=0;
    const t=setInterval(()=>{
      i++;
      setDisp(prev.current + diff*(i/steps));
      if(i>=steps){ prev.current=value; clearInterval(t); }
    },16);
    return()=>clearInterval(t);
  },[value]);
  return <>{Number(disp).toFixed(decimals)}</>;
}

/* ─── MAIN COMPONENT ──────────────────────────────────────────────────────── */
export default function NetworkMap() {
  useEffect(()=>{ injectStyles(); },[]);

  /* State */
  const [selectedNode, setSelectedNode] = useState(null);
  const [tooltip, setTooltip]           = useState(null); // { x,y, node }

  const [hmTooltip, setHmTooltip]       = useState(null);
  const [visibleTypes, setVisibleTypes] = useState(new Set(Object.keys(TYPE_COLOR)));
  const [layout, setLayout]             = useState('Default');
  const [zoom, setZoom]                 = useState(1);
  const [liveMetrics, setLiveMetrics]   = useState({ reqs:0, errors:0, throughput:0, conns:87 });
  const [sparkData]                     = useState(()=>Array.from({length:12},()=>Math.floor(Math.random()*8000+6000)));
  const svgRef = useRef(null);

  /* Live metrics ticker */
  useEffect(()=>{
    const t=setInterval(()=>{
      setLiveMetrics(p=>({
        reqs: p.reqs + Math.floor(Math.random()*400+200),
        errors: p.errors + (Math.random()<.15 ? 1 : 0),
        throughput: Math.round(Math.random()*500+1800),
        conns: Math.max(75, p.conns + Math.floor((Math.random()-.5)*4)),
      }));
    }, 1000);
    return()=>clearInterval(t);
  },[]);

  /* Derived: which edges are connected to selectedNode */
  const connectedIds = selectedNode
    ? new Set(EDGES.filter(([a,b])=>a===selectedNode||b===selectedNode).flatMap(e=>e))
    : new Set();

  const selectedNodeData = selectedNode ? NODES.find(n=>n.id===selectedNode) : null;

  /* Helpers */
  const toggleType = t => setVisibleTypes(prev=>{
    const next = new Set(prev);
    next.has(t) ? next.delete(t) : next.add(t);
    return next;
  });

  const card = (extra={}) => ({
    background: G.surface2,
    borderRadius: 12,
    border: `1px solid ${G.border}`,
    padding: 20,
    transition: 'transform .2s, box-shadow .2s',
    ...extra,
  });

  const sectionTitle = (title, sub) => (
    <div style={{ marginBottom:16 }}>
      <h2 style={{ margin:0, fontFamily:'Syne', fontSize:17, fontWeight:700, color:G.text }}>{title}</h2>
      {sub&&<p style={{ margin:'3px 0 0', fontSize:11, color:G.muted, fontFamily:'DM Mono' }}>{sub}</p>}
    </div>
  );

  /* Node hover SVG coords → screen coords conversion */
  const handleNodeHover = (e, node) => {
    if(!node){ setTooltip(null); return; }
    const rect = svgRef.current?.getBoundingClientRect();
    if(!rect) return;
    const svgW = 780, svgH = 520;
    const scaleX = rect.width / svgW;
    const scaleY = rect.height / svgH;
    const screenX = rect.left + node.x * scaleX * zoom;
    const screenY = rect.top  + node.y * scaleY * zoom;
    setTooltip({ x: screenX, y: screenY, node });
  };

  /* Node positions (possibly transformed by layout) */
  const nodePos = useCallback((n) => {
    if(layout==='Circular'){
      const idx = NODES.indexOf(n);
      const angle = (idx/NODES.length)*2*Math.PI - Math.PI/2;
      return { x: 390 + 220*Math.cos(angle), y: 260 + 200*Math.sin(angle) };
    }
    if(layout==='Hierarchical'){
      const tiers = {
        'gw':0,'cdn':0,
        'auth':1,'api1':1,'api2':1,'api3':1,'api4':1,
        'cache1':2,'cache2':2,'search':2,'wk1':2,'wk2':2,
        'db1':3,'db2':3,'db3':3,'db4':3,
      };
      const tier = tiers[n.id]??2;
      const same = NODES.filter(x=>(tiers[x.id]??2)===tier);
      const idx = same.indexOf(n);
      return { x: 80 + idx * (680/(same.length-1||1)), y: 60 + tier*130 };
    }
    return { x:n.x, y:n.y };
  },[layout]);

  const visibleNodes = NODES.filter(n=>visibleTypes.has(n.type));
  const visibleNodeIds = new Set(visibleNodes.map(n=>n.id));
  const visibleEdges = EDGES.filter(([a,b])=>visibleNodeIds.has(a)&&visibleNodeIds.has(b));

  /* ── RENDER ── */
  return (
    <div style={{ minHeight:'100vh', background:G.surface, fontFamily:'Syne', color:G.text, paddingBottom:60 }}>

      {/* Floating tooltip */}
      {tooltip&&(
        <div style={{ position:'fixed', left:tooltip.x+16, top:tooltip.y-20, zIndex:9999, pointerEvents:'none',
          background:G.surface3, border:`1px solid ${TYPE_COLOR[tooltip.node.type]}66`,
          borderRadius:10, padding:'10px 14px', minWidth:160, animation:'fadeUp .15s ease',
          boxShadow:'0 8px 24px rgba(0,0,0,.5)' }}>
          <div style={{ fontFamily:'Syne', fontWeight:700, fontSize:13, color:TYPE_COLOR[tooltip.node.type] }}>
            {tooltip.node.label}
          </div>
          <div style={{ fontFamily:'DM Mono', fontSize:10, color:G.muted, marginTop:2 }}>{tooltip.node.type}</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4px 12px', marginTop:8 }}>
            {[
              ['Latency',    `${tooltip.node.lat}ms`],
              ['Req/min',    `${(tooltip.node.rpm/1000).toFixed(1)}K`],
              ['Health',     `${tooltip.node.health}%`],
              ['Uptime',     `${tooltip.node.uptime}%`],
            ].map(([l,v])=>(
              <div key={l}>
                <div style={{ fontFamily:'DM Mono', fontSize:9, color:G.muted }}>{l}</div>
                <div style={{ fontFamily:'DM Mono', fontSize:11, color:G.text }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── HERO ── */}
      <div style={{ background:`linear-gradient(180deg,${G.surface2} 0%,${G.surface} 100%)`,
        borderBottom:`1px solid ${G.border}`, padding:'36px 40px 28px' }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16, flexWrap:'wrap' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
              <div style={{ width:9, height:9, borderRadius:'50%', background:G.green,
                boxShadow:`0 0 10px ${G.green}`, animation:'pulse 2s ease infinite' }}/>
              <span style={{ fontFamily:'DM Mono', fontSize:11, color:G.green, letterSpacing:'0.1em' }}>ALL SYSTEMS OPERATIONAL</span>
            </div>
            <h1 style={{ margin:0, fontFamily:'Syne', fontSize:30, fontWeight:800,
              background:`linear-gradient(135deg,${G.teal},${G.purple})`,
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              Network Topology Map
            </h1>
            <p style={{ margin:'6px 0 0', color:G.muted, fontFamily:'DM Mono', fontSize:12 }}>
              Real-time service mesh visualization and health monitoring
            </p>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginTop:24 }}>
          {[
            { label:'Services',     val:24,   suffix:'',    color:G.teal },
            { label:'Connections',  val:87,   suffix:'',    color:G.gold },
            { label:'Avg Latency',  val:12,   suffix:'ms',  color:G.purple },
            { label:'Health Score', val:98.4, suffix:'%',   color:G.green },
          ].map(s=>(
            <div key={s.label} className="nm-card"
              style={{ background:G.surface3, borderRadius:12, border:`1px solid ${G.border}`,
                padding:'18px 18px 14px', transition:'transform .2s,box-shadow .2s' }}>
              <div style={{ fontFamily:'DM Mono', fontSize:10, color:G.muted, marginBottom:5, letterSpacing:'0.06em' }}>{s.label}</div>
              <div style={{ fontFamily:'Syne', fontSize:26, fontWeight:800, color:s.color }}>
                {s.val}{s.suffix}
              </div>
              <div style={{ height:2, background:G.border, borderRadius:1, marginTop:8 }}>
                <div style={{ height:'100%', width:`${Math.min(s.val,100)}%`, background:s.color, borderRadius:1, boxShadow:`0 0 6px ${s.color}` }}/>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding:'28px 40px', display:'flex', flexDirection:'column', gap:28 }}>

        {/* ── FILTER BAR ── */}
        <div style={{ ...card(), padding:'14px 20px', display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
          <span style={{ fontFamily:'DM Mono', fontSize:11, color:G.muted, marginRight:4 }}>Show:</span>
          {Object.entries(TYPE_COLOR).map(([type,color])=>(
            <button key={type} className="nm-btn" onClick={()=>toggleType(type)}
              style={{ background:visibleTypes.has(type)?`${color}22`:G.surface3,
                border:`1px solid ${visibleTypes.has(type)?color:G.border}`,
                borderRadius:8, color:visibleTypes.has(type)?color:G.muted,
                padding:'4px 12px', cursor:'pointer', fontFamily:'DM Mono', fontSize:11,
                transition:'all .15s' }}>
              {TYPE_ICON[type]} {type.split(' ')[0]}
            </button>
          ))}
          <div style={{ flex:1 }}/>
          <span style={{ fontFamily:'DM Mono', fontSize:11, color:G.muted }}>Layout:</span>
          {['Default','Circular','Hierarchical'].map(l=>(
            <button key={l} className="nm-btn" onClick={()=>setLayout(l)}
              style={{ background:layout===l?`${G.teal}22`:G.surface3,
                border:`1px solid ${layout===l?G.teal:G.border}`,
                borderRadius:8, color:layout===l?G.teal:G.muted,
                padding:'4px 12px', cursor:'pointer', fontFamily:'DM Mono', fontSize:11, transition:'all .15s' }}>
              {l}
            </button>
          ))}
          <div style={{ display:'flex', gap:4 }}>
            {[['−',-.15],['+', .15],['⊡',null]].map(([sym,d])=>(
              <button key={sym} className="nm-btn" onClick={()=>d===null?setZoom(1):setZoom(z=>Math.max(.4,Math.min(2,z+d)))}
                style={{ background:G.surface3, border:`1px solid ${G.border}`, borderRadius:6,
                  color:G.text, width:28, height:28, cursor:'pointer', fontFamily:'DM Mono', fontSize:13 }}>
                {sym}
              </button>
            ))}
            <span style={{ fontFamily:'DM Mono', fontSize:10, color:G.muted, alignSelf:'center', marginLeft:4 }}>
              {Math.round(zoom*100)}%
            </span>
          </div>
        </div>

        {/* ── SVG GRAPH + NODE DETAIL PANEL ── */}
        <div style={{ display:'grid', gridTemplateColumns:selectedNode?'1fr 280px':'1fr', gap:20, alignItems:'start' }}>
          <div style={{ ...card(), padding:0, overflow:'hidden', position:'relative' }}>
            <div style={{ padding:'16px 20px 0', borderBottom:`1px solid ${G.border}` }}>
              {sectionTitle('Network Graph','Click a node to inspect · Hover for details')}
            </div>
            <div style={{ overflow:'hidden', cursor:'grab' }}>
              <svg ref={svgRef} width="100%" viewBox="0 0 780 520"
                style={{ display:'block', background:'radial-gradient(ellipse at 50% 30%,rgba(34,211,238,.04) 0%,transparent 70%)',
                  transform:`scale(${zoom})`, transformOrigin:'top left',
                  transition:'transform .3s ease', height: 520*zoom }}>

                {/* Grid dots bg */}
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <circle cx="40" cy="40" r="1" fill="rgba(255,255,255,.04)"/>
                  </pattern>
                </defs>
                <rect width="780" height="520" fill="url(#grid)"/>

                {/* Edges */}
                {visibleEdges.map(([a,b],i)=>{
                  const na=NODES.find(n=>n.id===a), nb=NODES.find(n=>n.id===b);
                  if(!na||!nb) return null;
                  const pa=nodePos(na), pb=nodePos(nb);
                  const isActive = connectedIds.has(a)||connectedIds.has(b);
                  const isHighlighted = selectedNode && (connectedIds.has(a)&&connectedIds.has(b));
                  return (
                    <line key={i} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y}
                      stroke={isHighlighted?G.gold:isActive&&selectedNode?'rgba(255,255,255,.04)':G.border}
                      strokeWidth={isHighlighted?2:1}
                      strokeDasharray={isHighlighted?'8 4':'none'}
                      style={isHighlighted?{ animation:'flow 1s linear infinite' }:{}}
                      opacity={selectedNode&&!isHighlighted?.2:1}/>
                  );
                })}

                {/* Nodes */}
                {visibleNodes.map(n=>{
                  const p = nodePos(n);
                  const color = TYPE_COLOR[n.type];
                  const isSelected = selectedNode===n.id;
                  const isDim = selectedNode && !connectedIds.has(n.id);
                  return (
                    <g key={n.id} className="nm-node"
                      onMouseEnter={e=>{ handleNodeHover(e,{...n,...nodePos(n)}); }}
                      onMouseLeave={()=>{ setTooltip(null); }}
                      onClick={()=>setSelectedNode(p=>p===n.id?null:n.id)}
                      style={{ transition:'opacity .2s', opacity:isDim?.3:1 }}>
                      {/* Glow ring for selected */}
                      {isSelected&&(
                        <circle cx={p.x} cy={p.y} r={36}
                          fill="none" stroke={color} strokeWidth={2} opacity={.5}
                          style={{ animation:'pulse 2s ease infinite' }}/>
                      )}
                      <circle cx={p.x} cy={p.y} r={26}
                        fill={isSelected?`${color}33`:G.surface3}
                        stroke={color} strokeWidth={isSelected?2.5:1.5}
                        style={{ filter:isSelected?`drop-shadow(0 0 10px ${color})`:undefined,
                          transition:'all .2s' }}/>
                      <text x={p.x} y={p.y-5} textAnchor="middle" fontSize={14} style={{ userSelect:'none' }}>
                        {TYPE_ICON[n.type]}
                      </text>
                      <text x={p.x} y={p.y+10} textAnchor="middle" fontSize={8}
                        fill={isSelected?color:G.text} fontFamily="DM Mono" style={{ userSelect:'none' }}>
                        {n.label}
                      </text>
                      {/* Health dot */}
                      <circle cx={p.x+18} cy={p.y-18} r={4}
                        fill={n.health>=99?G.green:n.health>=96?G.gold:G.red}
                        style={{ animation:'pulse 2.5s ease infinite' }}/>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Node Detail Panel */}
          {selectedNode&&selectedNodeData&&(
            <div style={{ ...card(), animation:'fadeUp .25s ease' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
                <div>
                  <div style={{ fontSize:22 }}>{TYPE_ICON[selectedNodeData.type]}</div>
                  <div style={{ fontFamily:'Syne', fontWeight:700, fontSize:16, color:TYPE_COLOR[selectedNodeData.type], marginTop:4 }}>
                    {selectedNodeData.label}
                  </div>
                  <div style={{ fontFamily:'DM Mono', fontSize:10, color:G.muted }}>{selectedNodeData.type}</div>
                </div>
                <button onClick={()=>setSelectedNode(null)}
                  style={{ background:'transparent', border:'none', color:G.muted, cursor:'pointer', fontSize:18 }}>✕</button>
              </div>

              <div style={{ background:`${G.green}22`, border:`1px solid ${G.green}44`, borderRadius:8,
                padding:'6px 12px', marginBottom:16, display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ width:7, height:7, borderRadius:'50%', background:G.green, display:'inline-block',
                  animation:'pulse 1.5s ease infinite' }}/>
                <span style={{ fontFamily:'DM Mono', fontSize:11, color:G.green }}>
                  Operational · {selectedNodeData.uptime}% uptime
                </span>
              </div>

              {/* Metrics grid */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:16 }}>
                {[
                  ['Latency',  `${selectedNodeData.lat}ms`,   G.teal],
                  ['Req/min',  `${(selectedNodeData.rpm/1000).toFixed(1)}K`, G.gold],
                  ['Health',   `${selectedNodeData.health}%`,  G.green],
                  ['Uptime',   `${selectedNodeData.uptime}%`,  G.purple],
                ].map(([l,v,c])=>(
                  <div key={l} style={{ background:G.surface3, borderRadius:8, padding:'10px 12px',
                    border:`1px solid ${G.border}` }}>
                    <div style={{ fontFamily:'DM Mono', fontSize:9, color:G.muted }}>{l}</div>
                    <div style={{ fontFamily:'Syne', fontSize:16, fontWeight:700, color:c, marginTop:2 }}>{v}</div>
                  </div>
                ))}
              </div>

              {/* Mini sparkline */}
              <div style={{ marginBottom:14 }}>
                <div style={{ fontFamily:'DM Mono', fontSize:10, color:G.muted, marginBottom:6 }}>Requests/min (12h)</div>
                <Sparkline data={sparkData} color={TYPE_COLOR[selectedNodeData.type]}/>
              </div>

              {/* Dependencies */}
              <div>
                <div style={{ fontFamily:'DM Mono', fontSize:10, color:G.muted, marginBottom:8 }}>Dependencies</div>
                {EDGES.filter(([a,b])=>a===selectedNode||b===selectedNode)
                  .map(([a,b],i)=>{
                    const peerId = a===selectedNode?b:a;
                    const peer = NODES.find(n=>n.id===peerId);
                    if(!peer) return null;
                    return (
                      <div key={i} onClick={()=>setSelectedNode(peerId)}
                        style={{ display:'flex', alignItems:'center', gap:8, padding:'5px 8px',
                          borderRadius:6, cursor:'pointer', marginBottom:3,
                          transition:'background .15s' }}
                        onMouseEnter={e=>e.currentTarget.style.background=G.surface3}
                        onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                        <span style={{ width:6, height:6, borderRadius:'50%', background:TYPE_COLOR[peer.type] }}/>
                        <span style={{ fontFamily:'DM Mono', fontSize:11, color:G.text }}>{peer.label}</span>
                        <span style={{ marginLeft:'auto', fontFamily:'DM Mono', fontSize:10, color:G.muted }}>{peer.lat}ms</span>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>

        {/* ── HEALTH DASHBOARD ── */}
        <div style={card()}>
          {sectionTitle('Health Dashboard','System layer status overview')}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:12 }}>
            {HEALTH_CARDS.map(h=>{
              const status = h.val>=99?'Healthy':h.val>=95?'Degraded':'Critical';
              const sColor = h.val>=99?G.green:h.val>=95?G.gold:G.red;
              return (
                <div key={h.label} className="nm-card"
                  style={{ background:G.surface3, borderRadius:12, border:`1px solid ${sColor}33`,
                    padding:'16px 14px', textAlign:'center', transition:'transform .2s,box-shadow .2s' }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:sColor, margin:'0 auto 8px',
                    boxShadow:`0 0 8px ${sColor}`, animation:'pulse 2s ease infinite' }}/>
                  <div style={{ fontFamily:'Syne', fontSize:11, fontWeight:600, color:G.text, marginBottom:4 }}>{h.label}</div>
                  <div style={{ fontFamily:'Syne', fontSize:22, fontWeight:800, color:sColor }}>{h.val}%</div>
                  <div style={{ fontFamily:'DM Mono', fontSize:9, color:sColor, marginTop:4 }}>{status}</div>
                  {h.incidents>0&&(
                    <div style={{ fontFamily:'DM Mono', fontSize:9, color:G.gold, marginTop:4 }}>
                      {h.incidents} active incident
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── LATENCY HEATMAP ── */}
        <div style={card()}>
          {sectionTitle('Latency Heatmap','Service-to-service roundtrip latency (ms) — hover for details')}
          <div style={{ overflowX:'auto' }}>
            <div style={{ display:'grid', gridTemplateColumns:`80px repeat(${HM_SERVICES.length},1fr)`, gap:2, minWidth:600 }}>
              {/* Header row */}
              <div/>
              {HM_SERVICES.map(s=>(
                <div key={s} style={{ fontFamily:'DM Mono', fontSize:9, color:G.muted, padding:'4px 2px',
                  textAlign:'center', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                  {s}
                </div>
              ))}
              {/* Data rows */}
              {HM_SERVICES.map((row,i)=>(
                <Fragment key={row}>
                  <div style={{ fontFamily:'DM Mono', fontSize:9, color:G.muted, padding:'4px 6px',
                    display:'flex', alignItems:'center', justifyContent:'flex-end' }}>
                    {row}
                  </div>
                  {HM_DATA[i].map((v,j)=>(
                    <div key={j}
                      style={{ background:latColor(v), borderRadius:4, aspectRatio:'1', minHeight:32,
                        display:'flex', alignItems:'center', justifyContent:'center',
                        fontFamily:'DM Mono', fontSize:9, color:v===0?'transparent':G.text,
                        cursor:'default', transition:'transform .15s, filter .15s',
                        border:`1px solid ${G.border}` }}
                      onMouseEnter={e=>setHmTooltip({ x:e.clientX, y:e.clientY, from:row, to:HM_SERVICES[j], v })}
                      onMouseLeave={()=>setHmTooltip(null)}
                      title={v===0?'—':`${v}ms`}>
                      {v===0?'—':v}
                    </div>
                  ))}
                </Fragment>

              ))}
            </div>
          </div>
          {hmTooltip&&(
            <div style={{ position:'fixed', left:hmTooltip.x+12, top:hmTooltip.y-40, zIndex:9999,
              background:G.surface3, border:`1px solid ${G.border}`, borderRadius:8,
              padding:'8px 12px', pointerEvents:'none', fontFamily:'DM Mono', fontSize:11 }}>
              <span style={{ color:G.muted }}>{hmTooltip.from} → {hmTooltip.to}: </span>
              <span style={{ color:hmTooltip.v<15?G.green:hmTooltip.v<40?G.gold:G.red, fontWeight:600 }}>
                {hmTooltip.v}ms
              </span>
            </div>
          )}
        </div>

        {/* ── TRAFFIC FLOW MONITOR ── */}
        <div style={card()}>
          {sectionTitle('Traffic Flow Monitor','Top service-to-service connections by volume')}
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr>
                  {['From','To','Req/min','Avg Latency','Error %','Bandwidth'].map(h=>(
                    <th key={h} style={{ padding:'8px 12px', textAlign:'left', fontFamily:'DM Mono',
                      fontSize:10, color:G.muted, fontWeight:500, letterSpacing:'0.06em',
                      borderBottom:`1px solid ${G.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TRAFFIC.map((t,i)=>(
                  <tr key={i} className="nm-row" style={{ transition:'background .15s' }}>
                    <td style={{ padding:'9px 12px', fontFamily:'Syne', fontWeight:600, fontSize:12, color:G.gold }}>{t.from}</td>
                    <td style={{ padding:'9px 12px', fontFamily:'Syne', fontWeight:600, fontSize:12, color:G.teal }}>{t.to}</td>
                    <td style={{ padding:'9px 12px', fontFamily:'DM Mono', fontSize:11, color:G.text }}>
                      {t.rpm>=1000?`${(t.rpm/1000).toFixed(1)}K`:t.rpm}
                    </td>
                    <td style={{ padding:'9px 12px', fontFamily:'DM Mono', fontSize:11,
                      color:t.lat<15?G.green:t.lat<40?G.gold:G.red }}>{t.lat}ms</td>
                    <td style={{ padding:'9px 12px', fontFamily:'DM Mono', fontSize:11,
                      color:t.err<0.1?G.green:t.err<0.5?G.gold:G.red }}>{t.err.toFixed(2)}%</td>
                    <td style={{ padding:'9px 12px', fontFamily:'DM Mono', fontSize:11, color:G.muted }}>{t.bw}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── INCIDENT TIMELINE ── */}
        <div style={card()}>
          {sectionTitle('Incident Timeline','Last 5 incidents across all services')}
          <div style={{ position:'relative' }}>
            {/* Horizontal track */}
            <div style={{ position:'absolute', top:28, left:0, right:0, height:2, background:G.border, borderRadius:1 }}/>
            <div style={{ display:'flex', gap:0, justifyContent:'space-between', paddingBottom:80 }}>
              {INCIDENTS.map((inc,i)=>(
                <div key={i} style={{ flex:1, paddingTop:0, position:'relative', paddingRight:8 }}>
                  {/* Timeline dot */}
                  <div style={{ width:14, height:14, borderRadius:'50%',
                    background:SEV_COLOR[inc.sev], margin:'21px auto 0',
                    boxShadow:`0 0 8px ${SEV_COLOR[inc.sev]}`, position:'relative', zIndex:1 }}/>
                  {/* Card below */}
                  <div style={{ background:G.surface3, borderRadius:10, padding:'10px 12px', marginTop:14,
                    border:`1px solid ${SEV_COLOR[inc.sev]}44` }}>
                    <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:5, flexWrap:'wrap' }}>
                      <span style={{ background:`${SEV_COLOR[inc.sev]}22`, color:SEV_COLOR[inc.sev],
                        border:`1px solid ${SEV_COLOR[inc.sev]}44`, borderRadius:5,
                        padding:'1px 6px', fontSize:9, fontFamily:'DM Mono', fontWeight:600 }}>
                        {inc.sev}
                      </span>
                      <span style={{ fontFamily:'DM Mono', fontSize:9,
                        color:inc.resolved?G.green:G.gold }}>
                        {inc.resolved?'✓ Resolved':'⚠ Active'}
                      </span>
                    </div>
                    <div style={{ fontFamily:'Syne', fontWeight:600, fontSize:11, color:G.text, marginBottom:3 }}>
                      {inc.svc}
                    </div>
                    <div style={{ fontFamily:'DM Mono', fontSize:9, color:G.muted, marginBottom:5 }}>{inc.desc}</div>
                    <div style={{ fontFamily:'DM Mono', fontSize:9, color:G.muted }}>
                      {inc.start} – {inc.end} · {inc.dur}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── REAL-TIME METRICS STRIP ── */}
        <div style={{ background:`linear-gradient(135deg,${G.surface3},${G.surface2})`,
          border:`1px solid ${G.border}`, borderRadius:14,
          padding:'16px 28px', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:0 }}>
          {[
            { label:'Total Requests',    val:liveMetrics.reqs,       suffix:'',    color:G.teal,   decimals:0 },
            { label:'Error Count',       val:liveMetrics.errors,     suffix:'',    color:G.red,    decimals:0 },
            { label:'Throughput',        val:liveMetrics.throughput, suffix:' MB/s', color:G.gold,  decimals:0 },
            { label:'Active Conns',      val:liveMetrics.conns,      suffix:'',    color:G.purple, decimals:0 },
          ].map((m,i)=>(
            <div key={m.label} style={{ textAlign:'center', padding:'8px 0',
              borderRight:i<3?`1px solid ${G.border}`:'none' }}>
              <div style={{ fontFamily:'DM Mono', fontSize:10, color:G.muted, marginBottom:4, letterSpacing:'0.06em' }}>
                {m.label}
              </div>
              <div style={{ fontFamily:'Syne', fontSize:24, fontWeight:800, color:m.color }}>
                <Counter value={m.val} decimals={m.decimals}/>{m.suffix}
              </div>
              <div style={{ width:40, height:2, background:m.color, margin:'8px auto 0',
                borderRadius:1, boxShadow:`0 0 6px ${m.color}`, opacity:.6 }}/>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
