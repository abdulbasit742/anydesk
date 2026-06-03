import { useState, useEffect, useRef } from 'react';

/* ─── CSS variables injected once ─────────────────────────────────────────── */
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

/* ─── Keyframes injected into <head> once ─────────────────────────────────── */
const injectStyles = () => {
  if (document.getElementById('dp-styles')) return;
  const el = document.createElement('style');
  el.id = 'dp-styles';
  el.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@400;500;600;700;800&display=swap');
    @keyframes dash { to { stroke-dashoffset: 0; } }
    @keyframes dashFlow { from { stroke-dashoffset: 40; } to { stroke-dashoffset: 0; } }
    @keyframes pulseRing { 0%,100%{opacity:1} 50%{opacity:.4} }
    @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
    @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
    @keyframes counterUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
    @keyframes ringFill { from{stroke-dashoffset:var(--ring-empty)} to{stroke-dashoffset:var(--ring-offset)} }
    .dp-card:hover { transform: translateY(-2px) !important; box-shadow: 0 8px 32px rgba(0,0,0,.4) !important; }
    .dp-row:hover { background: rgba(255,255,255,0.03) !important; }
    .dp-btn:hover { opacity:.85; transform:scale(1.02); }
    .dp-node-box:hover { filter: brightness(1.2); cursor:pointer; }
    .dp-log-line { animation: fadeUp .2s ease both; }
    .dp-ring { animation: ringFill 1.2s cubic-bezier(.4,0,.2,1) both; }
    .dp-toast { animation: fadeUp .3s ease both; }
  `;
  document.head.appendChild(el);
};

/* ─── Mock data ───────────────────────────────────────────────────────────── */
const PIPELINES = [
  { id:1, name:'User Analytics ETL',  src:'Postgres',  dst:'BigQuery',   cron:'0 * * * *',   lastRun:'2m ago',  records:'1.2M', status:'Running', dur:'4m 12s' },
  { id:2, name:'Order Sync',          src:'MySQL',     dst:'Snowflake',  cron:'*/5 * * * *', lastRun:'1m ago',  records:'48K',  status:'Running', dur:'52s' },
  { id:3, name:'Product Catalog',     src:'REST API',  dst:'Postgres',   cron:'0 0 * * *',   lastRun:'6h ago',  records:'92K',  status:'Paused',  dur:'1m 8s' },
  { id:4, name:'Event Stream',        src:'Kafka',     dst:'Elasticsearch', cron:'realtime', lastRun:'now',     records:'2.1M', status:'Running', dur:'ongoing' },
  { id:5, name:'Media Backup',        src:'S3',        dst:'Glacier',    cron:'0 2 * * 0',   lastRun:'3d ago',  records:'840K', status:'Paused',  dur:'18m' },
  { id:6, name:'Log Aggregator',      src:'Kafka',     dst:'S3',         cron:'*/15 * * * *',lastRun:'2m ago',  records:'5.4M', status:'Running', dur:'1m 34s' },
  { id:7, name:'Customer Export',     src:'Postgres',  dst:'REST API',   cron:'0 8 * * 1',   lastRun:'5d ago',  records:'310K', status:'Failed',  dur:'—' },
  { id:8, name:'Inventory Delta',     src:'MySQL',     dst:'Redis',      cron:'*/1 * * * *', lastRun:'30s ago', records:'22K',  status:'Running', dur:'8s' },
];

const STAGE_DATA = [
  { id:'src',   label:'Source',    icon:'⬡', status:'active', tp:'48K/s' },
  { id:'ext',   label:'Extract',   icon:'⬢', status:'active', tp:'47.8K/s' },
  { id:'trn',   label:'Transform', icon:'⟳', status:'active', tp:'46.2K/s' },
  { id:'val',   label:'Validate',  icon:'✓', status:'idle',   tp:'44.9K/s' },
  { id:'load',  label:'Load',      icon:'↓', status:'active', tp:'44.1K/s' },
  { id:'sink',  label:'Sink',      icon:'⬛', status:'active', tp:'43.8K/s' },
];

const ERRORS = [
  { id:1, ts:'17:04:22', pipeline:'Customer Export',  stage:'Load',      msg:'Connection timeout after 30s',          retries:3 },
  { id:2, ts:'16:58:11', pipeline:'Product Catalog',  stage:'Validate',  msg:'Schema mismatch: field "price" is null', retries:1 },
  { id:3, ts:'16:42:07', pipeline:'Media Backup',     stage:'Extract',   msg:'S3 rate limit exceeded (429)',           retries:5 },
  { id:4, ts:'15:30:55', pipeline:'Order Sync',       stage:'Transform', msg:'Division by zero in aggregate rule',    retries:0 },
  { id:5, ts:'14:12:39', pipeline:'Event Stream',     stage:'Source',    msg:'Kafka broker unreachable',              retries:2 },
];

const QUALITY = [
  { label:'Completeness', value:96.4, color: G.teal },
  { label:'Uniqueness',   value:99.1, color: G.gold },
  { label:'Validity',     value:94.7, color: G.purple },
  { label:'Consistency',  value:97.3, color: G.blue },
  { label:'Timeliness',   value:91.8, color: G.green },
  { label:'Accuracy',     value:98.6, color: G.red },
];

const SOURCE_FIELDS = ['user_id','email','created_at','first_name','last_name','country','plan_type','mrr'];
const DEST_FIELDS   = ['id','contact_email','signup_date','given_name','family_name','geo_country','subscription','revenue'];



/* ─── Circular Quality Ring ───────────────────────────────────────────────── */
function QualityRing({ value, color, label }) {
  const r = 36, circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8, padding:'20px 16px',
      background:G.surface3, borderRadius:12, border:`1px solid ${G.border}`,
      transition:'transform .2s,box-shadow .2s' }} className="dp-card">
      <svg width={88} height={88} viewBox="0 0 88 88">
        <circle cx={44} cy={44} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={7}/>
        <circle cx={44} cy={44} r={r} fill="none" stroke={color} strokeWidth={7}
          strokeLinecap="round" strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transform:'rotate(-90deg)', transformOrigin:'50% 50%',
            transition:'stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)' }}/>
        <text x={44} y={49} textAnchor="middle" fill={G.text} fontSize={15} fontFamily="DM Mono" fontWeight={500}>{value}%</text>
      </svg>
      <span style={{ fontSize:11, color:G.muted, fontFamily:'DM Mono', letterSpacing:'0.05em' }}>{label}</span>
    </div>
  );
}

/* ─── Throughput SVG Chart ────────────────────────────────────────────────── */
function ThroughputChart() {
  const [data] = useState(() => Array.from({length:24},(_,i)=>{
    const base = 40000 + Math.sin(i/4)*12000;
    return Math.max(8000, base + (Math.random()-0.5)*8000);
  }));

  const W=680, H=160, pad=32;
  const max=Math.max(...data), min=Math.min(...data);
  const pts = data.map((v,i)=>({
    x: pad + (i/(data.length-1))*(W-pad*2),
    y: pad + (1-(v-min)/(max-min))*(H-pad*2)
  }));
  const linePath = pts.map((p,i)=>`${i===0?'M':'L'}${p.x},${p.y}`).join(' ');
  const areaPath = `${linePath} L${pts[pts.length-1].x},${H-pad} L${pts[0].x},${H-pad} Z`;
  const [hover, setHover] = useState(null);
  return (
    <div style={{ position:'relative' }}>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow:'visible' }}>
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={G.teal} stopOpacity={0.3}/>
            <stop offset="100%" stopColor={G.teal} stopOpacity={0}/>
          </linearGradient>
        </defs>
        {[0,1,2,3].map(i=>{
          const y = pad + (i/3)*(H-pad*2);
          return <line key={i} x1={pad} y1={y} x2={W-pad} y2={y} stroke={G.border} strokeWidth={1}/>;
        })}
        {[0,6,12,18,23].map(i=>{
          const p=pts[i];
          return p ? <text key={i} x={p.x} y={H-8} textAnchor="middle" fill={G.muted} fontSize={9} fontFamily="DM Mono">{i}:00</text> : null;
        })}
        <path d={areaPath} fill="url(#chartGrad)"/>
        <path d={linePath} fill="none" stroke={G.teal} strokeWidth={2}
          style={{ strokeDasharray:1200, strokeDashoffset:1200,
            animation:'dash 1.6s cubic-bezier(.4,0,.2,1) .3s forwards' }}/>
        {pts.map((p,i)=>(
          <circle key={i} cx={p.x} cy={p.y} r={hover===i?5:3}
            fill={hover===i?G.gold:G.teal} style={{cursor:'crosshair',transition:'r .15s'}}
            onMouseEnter={()=>setHover(i)} onMouseLeave={()=>setHover(null)}/>
        ))}
        {hover!==null&&pts[hover]&&(
          <g>
            <rect x={pts[hover].x-40} y={pts[hover].y-34} width={80} height={26} rx={6}
              fill={G.surface3} stroke={G.border} strokeWidth={1}/>
            <text x={pts[hover].x} y={pts[hover].y-16} textAnchor="middle"
              fill={G.gold} fontSize={10} fontFamily="DM Mono">
              {(data[hover]/1000).toFixed(1)}K/s
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

/* ─── Pipeline Canvas SVG ─────────────────────────────────────────────────── */
function PipelineCanvas({ onSelectStage, selectedStage }) {
  const W=720, H=140, bw=92, bh=66, gap=24;
  const totalW = STAGE_DATA.length*bw + (STAGE_DATA.length-1)*gap;
  const startX = (W-totalW)/2;
  const boxes = STAGE_DATA.map((s,i)=>({ ...s, x:startX+i*(bw+gap), y:(H-bh)/2 }));
  const statusColor = s => s==='active'?G.teal:s==='error'?G.red:G.muted;
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow:'visible' }}>
      <defs>
        <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill={G.gold}/>
        </marker>
      </defs>
      {boxes.slice(0,-1).map((b,i)=>{
        const x1=b.x+bw, x2=boxes[i+1].x, y=H/2;
        return (
          <line key={i} x1={x1} y1={y} x2={x2} y2={y}
            stroke={G.gold} strokeWidth={2} markerEnd="url(#arrowhead)"
            strokeDasharray="6 3"
            style={{ animation:`dashFlow 1.2s linear infinite`, animationDelay:`${i*0.2}s` }}/>
        );
      })}
      {boxes.map((b)=>(
        <g key={b.id} className="dp-node-box" onClick={()=>onSelectStage(selectedStage===b.id?null:b.id)}
          style={{ cursor:'pointer' }}>
          <rect x={b.x} y={b.y} width={bw} height={bh} rx={10}
            fill={selectedStage===b.id ? 'rgba(34,211,238,0.15)' : G.surface3}
            stroke={selectedStage===b.id ? G.teal : G.border} strokeWidth={selectedStage===b.id?2:1}
            style={{ transition:'all .2s' }}/>
          <text x={b.x+bw/2} y={b.y+22} textAnchor="middle" fontSize={18} fill={G.gold}>{b.icon}</text>
          <text x={b.x+bw/2} y={b.y+38} textAnchor="middle" fontSize={10} fill={G.text} fontFamily="Syne" fontWeight={600}>{b.label}</text>
          <text x={b.x+bw/2} y={b.y+52} textAnchor="middle" fontSize={8} fill={G.muted} fontFamily="DM Mono">{b.tp}</text>
          <circle cx={b.x+bw-10} cy={b.y+10} r={4} fill={statusColor(b.status)}
            style={{ animation: b.status==='active'?'pulseRing 2s ease infinite':'' }}/>
        </g>
      ))}
    </svg>
  );
}

/* ─── Schema Mapper ───────────────────────────────────────────────────────── */
function SchemaMapper() {
  const [selected, setSelected] = useState(null);
  const svgH = SOURCE_FIELDS.length * 38 + 20;
  const rowH = 38;
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 80px 1fr', gap:0, alignItems:'stretch' }}>
      <div>
        {SOURCE_FIELDS.map((f,i)=>(
          <div key={f} onClick={()=>setSelected(i===selected?null:i)}
            style={{ height:rowH, display:'flex', alignItems:'center', padding:'0 12px',
              background:selected===i?'rgba(245,183,49,0.1)':i%2===0?G.surface3:G.surface2,
              border:`1px solid ${selected===i?G.gold:G.border}`, borderRadius:6, marginBottom:2,
              cursor:'pointer', fontFamily:'DM Mono', fontSize:12, color:selected===i?G.gold:G.text,
              transition:'all .15s' }}>
            <span style={{ color:G.muted, marginRight:8 }}>①</span>{f}
          </div>
        ))}
      </div>
      <svg width={80} height={svgH} style={{ overflow:'visible' }}>
        {SOURCE_FIELDS.map((_,i)=>{
          const y1 = 10 + i*rowH + rowH/2 - 1;
          const y2 = 10 + i*rowH + rowH/2 - 1;
          return (
            <line key={i} x1={0} y1={y1} x2={80} y2={y2}
              stroke={selected===i?G.gold:G.border} strokeWidth={selected===i?2:1}
              strokeDasharray={selected===i?'none':'4 2'}
              style={{ transition:'stroke .2s' }}/>
          );
        })}
      </svg>
      <div>
        {DEST_FIELDS.map((f,i)=>(
          <div key={f}
            style={{ height:rowH, display:'flex', alignItems:'center', padding:'0 12px',
              background:selected===i?'rgba(34,211,238,0.1)':i%2===0?G.surface3:G.surface2,
              border:`1px solid ${selected===i?G.teal:G.border}`, borderRadius:6, marginBottom:2,
              fontFamily:'DM Mono', fontSize:12, color:selected===i?G.teal:G.text,
              transition:'all .15s' }}>
            {f}<span style={{ color:G.muted, marginLeft:8 }}>①</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Log Terminal ────────────────────────────────────────────────────────── */
const LOG_TEMPLATES = [
  t=>`[${t}] INFO  pipeline:order-sync stage:extract rows=1248 batch=92`,
  t=>`[${t}] INFO  pipeline:event-stream kafka.offset=9842017 lag=0`,
  t=>`[${t}] WARN  pipeline:product-catalog validate.null_check field=sku count=3`,
  t=>`[${t}] INFO  pipeline:log-aggregator stage:load elasticsearch.docs=5400`,
  t=>`[${t}] DEBUG pipeline:user-analytics transform.apply rule=dedup elapsed=12ms`,
  t=>`[${t}] INFO  pipeline:inventory-delta stage:sink redis.keys_updated=847`,
  t=>`[${t}] ERROR pipeline:customer-export stage:load connection_timeout retries=3`,
  t=>`[${t}] INFO  pipeline:media-backup s3.bytes_read=40960 throughput=8MB/s`,
];
const logColor = l => l.includes('ERROR')?G.red:l.includes('WARN')?G.gold:l.includes('DEBUG')?G.purple:G.teal;

function LogTerminal() {
  const [logs, setLogs] = useState([]);
  const ref = useRef(null);
  useEffect(()=>{
    const now = ()=>new Date().toTimeString().slice(0,8);
    const add = ()=>{
      const tpl = LOG_TEMPLATES[Math.floor(Math.random()*LOG_TEMPLATES.length)];
      setLogs(p=>[...p.slice(-80), tpl(now())]);
    };
    add(); add(); add(); add(); add();
    const t = setInterval(add, 2800);
    return ()=>clearInterval(t);
  },[]);
  useEffect(()=>{ if(ref.current) ref.current.scrollTop=ref.current.scrollHeight; },[logs]);
  return (
    <div ref={ref} style={{ background:'#060609', borderRadius:10, border:`1px solid ${G.border}`,
      height:200, overflowY:'auto', padding:'12px 16px',
      fontFamily:'DM Mono', fontSize:11, lineHeight:1.7 }}>
      <div style={{ color:G.muted, marginBottom:8 }}>
        <span style={{ color:G.green }}>●</span> pipeline-daemon v2.4.1 — live logs
      </div>
      {logs.map((l,i)=>(
        <div key={i} className="dp-log-line" style={{ color:logColor(l), whiteSpace:'pre' }}>{l}</div>
      ))}
      <span style={{ animation:'blink 1s step-end infinite', color:G.teal }}>▋</span>
    </div>
  );
}

/* ─── Wizard Steps ────────────────────────────────────────────────────────── */
const PRESETS = ['0 * * * *','0 0 * * *','0 0 * * 0'];
const PRESET_LABELS = ['Every Hour','Daily','Weekly'];

function PipelineWizard({ onSuccess }) {
  const [step, setStep] = useState(0);
  const [src, setSrc] = useState({ type:'Postgres', conn:'' });
  const [rules, setRules] = useState([{ field:'', op:'map', expr:'' }]);
  const [dst, setDst] = useState({ type:'BigQuery', path:'' });
  const [schedule, setSchedule] = useState('0 * * * *');

  const inputStyle = { background:G.surface, border:`1px solid ${G.border}`, borderRadius:8,
    padding:'8px 12px', color:G.text, fontFamily:'DM Mono', fontSize:12, width:'100%',
    boxSizing:'border-box', outline:'none' };
  const selStyle = { ...inputStyle, cursor:'pointer' };
  const labelStyle = { fontSize:11, color:G.muted, fontFamily:'DM Mono', marginBottom:4, display:'block' };

  const steps = ['Source','Transform','Destination','Schedule'];
  return (
    <div style={{ background:G.surface3, borderRadius:12, border:`1px solid ${G.border}`, padding:24 }}>
      {/* Step indicators */}
      <div style={{ display:'flex', gap:8, marginBottom:24 }}>
        {steps.map((s,i)=>(
          <div key={s} style={{ flex:1, textAlign:'center' }}>
            <div style={{ width:28, height:28, borderRadius:'50%', margin:'0 auto 4px',
              background:i<=step?G.gold:G.surface2, color:i<=step?G.surface:G.muted,
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:12, fontFamily:'DM Mono', fontWeight:600, border:`1px solid ${i<=step?G.gold:G.border}` }}>
              {i+1}
            </div>
            <div style={{ fontSize:10, color:i===step?G.gold:G.muted, fontFamily:'DM Mono' }}>{s}</div>
          </div>
        ))}
      </div>

      {step===0&&(
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          <div>
            <label style={labelStyle}>Source Type</label>
            <select style={selStyle} value={src.type} onChange={e=>setSrc(p=>({...p,type:e.target.value}))}>
              {['Postgres','MySQL','REST API','S3','Kafka'].map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Connection String</label>
            <input style={inputStyle} placeholder="postgresql://user:pass@host:5432/db"
              value={src.conn} onChange={e=>setSrc(p=>({...p,conn:e.target.value}))}/>
          </div>
        </div>
      )}
      {step===1&&(
        <div>
          {rules.map((r,i)=>(
            <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 120px 1fr 36px', gap:8, marginBottom:8 }}>
              <input style={inputStyle} placeholder="field name" value={r.field}
                onChange={e=>setRules(p=>p.map((x,j)=>j===i?{...x,field:e.target.value}:x))}/>
              <select style={selStyle} value={r.op}
                onChange={e=>setRules(p=>p.map((x,j)=>j===i?{...x,op:e.target.value}:x))}>
                {['map','filter','aggregate','rename'].map(o=><option key={o}>{o}</option>)}
              </select>
              <input style={inputStyle} placeholder="expression" value={r.expr}
                onChange={e=>setRules(p=>p.map((x,j)=>j===i?{...x,expr:e.target.value}:x))}/>
              <button onClick={()=>setRules(p=>p.filter((_,j)=>j!==i))}
                style={{ background:G.red+'22', border:`1px solid ${G.red}44`, borderRadius:6,
                  color:G.red, cursor:'pointer', fontSize:14 }}>✕</button>
            </div>
          ))}
          <button onClick={()=>setRules(p=>[...p,{field:'',op:'map',expr:''}])}
            style={{ background:G.teal+'22', border:`1px solid ${G.teal}44`, borderRadius:8,
              color:G.teal, padding:'6px 16px', cursor:'pointer', fontFamily:'DM Mono', fontSize:12 }}>
            + Add Rule
          </button>
        </div>
      )}
      {step===2&&(
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          <div>
            <label style={labelStyle}>Destination Type</label>
            <select style={selStyle} value={dst.type} onChange={e=>setDst(p=>({...p,type:e.target.value}))}>
              {['BigQuery','Snowflake','Postgres','S3','Elasticsearch','Redis'].map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Target Table / Path</label>
            <input style={inputStyle} placeholder="dataset.table or s3://bucket/path"
              value={dst.path} onChange={e=>setDst(p=>({...p,path:e.target.value}))}/>
          </div>
        </div>
      )}
      {step===3&&(
        <div>
          <label style={labelStyle}>Cron Expression</label>
          <input style={{...inputStyle, marginBottom:12}} value={schedule}
            onChange={e=>setSchedule(e.target.value)} placeholder="0 * * * *"/>
          <div style={{ display:'flex', gap:8 }}>
            {PRESET_LABELS.map((l,i)=>(
              <button key={l} onClick={()=>setSchedule(PRESETS[i])}
                style={{ background:schedule===PRESETS[i]?G.gold+'22':G.surface2,
                  border:`1px solid ${schedule===PRESETS[i]?G.gold:G.border}`, borderRadius:8,
                  color:schedule===PRESETS[i]?G.gold:G.muted, padding:'6px 14px', cursor:'pointer',
                  fontFamily:'DM Mono', fontSize:11 }}>{l}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ display:'flex', gap:8, marginTop:20, justifyContent:'flex-end' }}>
        {step>0&&(
          <button className="dp-btn" onClick={()=>setStep(p=>p-1)}
            style={{ background:G.surface2, border:`1px solid ${G.border}`, borderRadius:8,
              color:G.text, padding:'8px 20px', cursor:'pointer', fontFamily:'DM Mono', fontSize:12 }}>
            Back
          </button>
        )}
        {step<3?(
          <button className="dp-btn" onClick={()=>setStep(p=>p+1)}
            style={{ background:`linear-gradient(135deg,${G.gold},${G.teal})`, border:'none', borderRadius:8,
              color:G.surface, padding:'8px 20px', cursor:'pointer', fontFamily:'DM Mono', fontSize:12, fontWeight:600 }}>
            Next →
          </button>
        ):(
          <button className="dp-btn" onClick={onSuccess}
            style={{ background:`linear-gradient(135deg,${G.gold},${G.teal})`, border:'none', borderRadius:8,
              color:G.surface, padding:'8px 24px', cursor:'pointer', fontFamily:'DM Mono', fontSize:12, fontWeight:600 }}>
            Create Pipeline ✓
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Main Component ──────────────────────────────────────────────────────── */
export default function DataPipeline() {
  useEffect(()=>{ injectStyles(); },[]);

  const [selectedStage, setSelectedStage] = useState(null);
  const [pipelines, setPipelines] = useState(PIPELINES);
  const [errors, setErrors] = useState(ERRORS);
  const [showToast, setShowToast] = useState(false);
  const [showBuilder, setShowBuilder] = useState(false);
  const [stats, setStats] = useState({ active:12, rps:48000, success:99.2, queue:247 });

  // Simulate live counter updates
  useEffect(()=>{
    const t = setInterval(()=>{
      setStats(p=>({
        ...p,
        rps: Math.max(40000, p.rps + (Math.random()-0.5)*1000),
        queue: Math.max(200, p.queue + Math.floor((Math.random()-0.5)*10)),
      }));
    }, 2000);
    return ()=>clearInterval(t);
  },[]);

  const togglePipeline = id => {
    setPipelines(p=>p.map(pl=>pl.id===id&&pl.status!=='Failed'
      ? {...pl, status:pl.status==='Running'?'Paused':'Running'} : pl));
  };
  const retryError = id => setErrors(p=>p.filter(e=>e.id!==id));

  const handleSuccess = () => {
    setShowToast(true);
    setTimeout(()=>setShowToast(false), 3500);
    setShowBuilder(false);
  };

  const card = (children, extra={}) => ({
    background: G.surface2,
    borderRadius: 12,
    border: `1px solid ${G.border}`,
    padding: 24,
    transition: 'transform .2s, box-shadow .2s',
    ...extra,
  });

  const sectionTitle = (title, sub) => (
    <div style={{ marginBottom:20 }}>
      <h2 style={{ margin:0, fontFamily:'Syne', fontSize:18, fontWeight:700, color:G.text }}>{title}</h2>
      {sub&&<p style={{ margin:'4px 0 0', fontSize:12, color:G.muted, fontFamily:'DM Mono' }}>{sub}</p>}
    </div>
  );

  const statusBadge = s => {
    const c = s==='Running'?G.teal:s==='Failed'?G.red:G.muted;
    return (
      <span style={{ background:`${c}22`, color:c, border:`1px solid ${c}44`,
        borderRadius:6, padding:'2px 8px', fontSize:10, fontFamily:'DM Mono', fontWeight:600 }}>
        {s==='Running'&&<span style={{ marginRight:4, animation:'pulseRing 1.5s ease infinite' }}>●</span>}{s}
      </span>
    );
  };

  return (
    <div style={{ minHeight:'100vh', background:G.surface, fontFamily:'Syne', color:G.text, padding:'0 0 60px' }}>

      {/* Toast */}
      {showToast&&(
        <div className="dp-toast" style={{ position:'fixed', top:24, right:24, zIndex:9999,
          background:`linear-gradient(135deg,${G.surface3},${G.surface2})`,
          border:`1px solid ${G.teal}`, borderRadius:12, padding:'14px 24px',
          display:'flex', alignItems:'center', gap:10, boxShadow:'0 8px 32px rgba(0,0,0,.6)' }}>
          <span style={{ fontSize:20 }}>✅</span>
          <div>
            <div style={{ fontFamily:'Syne', fontWeight:600, color:G.teal, fontSize:14 }}>Pipeline Created!</div>
            <div style={{ fontFamily:'DM Mono', fontSize:11, color:G.muted, marginTop:2 }}>Scheduled and ready to run.</div>
          </div>
        </div>
      )}

      {/* ── HERO ── */}
      <div style={{ background:`linear-gradient(180deg,${G.surface2} 0%,${G.surface} 100%)`,
        borderBottom:`1px solid ${G.border}`, padding:'40px 40px 32px' }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:8 }}>
              <div style={{ width:10, height:10, borderRadius:'50%', background:G.teal,
                boxShadow:`0 0 10px ${G.teal}`, animation:'pulseRing 2s ease infinite' }}/>
              <span style={{ fontFamily:'DM Mono', fontSize:11, color:G.teal, letterSpacing:'0.1em' }}>LIVE</span>
            </div>
            <h1 style={{ margin:0, fontFamily:'Syne', fontSize:32, fontWeight:800,
              background:`linear-gradient(135deg,${G.gold},${G.teal})`,
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              Data Pipeline Builder
            </h1>
            <p style={{ margin:'6px 0 0', color:G.muted, fontFamily:'DM Mono', fontSize:12 }}>
              Orchestrate, monitor and debug your data flows in real-time
            </p>
          </div>
          <button className="dp-btn" onClick={()=>setShowBuilder(p=>!p)}
            style={{ background:`linear-gradient(135deg,${G.gold},${G.teal})`, border:'none',
              borderRadius:10, color:G.surface, padding:'10px 24px', cursor:'pointer',
              fontFamily:'Syne', fontSize:13, fontWeight:700, boxShadow:`0 4px 16px ${G.gold}44` }}>
            + New Pipeline
          </button>
        </div>
        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginTop:28 }}>
          {[
            { label:'Active Pipelines', val:stats.active, suffix:'', color:G.teal },
            { label:'Records / sec',    val:Math.round(stats.rps/1000), suffix:'K', color:G.gold },
            { label:'Success Rate',     val:stats.success, suffix:'%', color:G.green },
            { label:'Queue Depth',      val:stats.queue,   suffix:'', color:G.purple },
          ].map(s=>(
            <div key={s.label} className="dp-card"
              style={{ background:G.surface3, borderRadius:12, border:`1px solid ${G.border}`,
                padding:'20px 20px 16px', transition:'transform .2s,box-shadow .2s' }}>
              <div style={{ fontFamily:'DM Mono', fontSize:11, color:G.muted, marginBottom:6, letterSpacing:'0.06em' }}>
                {s.label}
              </div>
              <div style={{ fontFamily:'Syne', fontSize:28, fontWeight:800, color:s.color }}>
                {s.val}{s.suffix}
              </div>
              <div style={{ height:2, background:G.border, borderRadius:1, marginTop:10 }}>
                <div style={{ height:'100%', width:'70%', background:s.color, borderRadius:1,
                  boxShadow:`0 0 6px ${s.color}` }}/>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding:'32px 40px', display:'flex', flexDirection:'column', gap:32 }}>

        {/* ── PIPELINE CANVAS ── */}
        <div style={card()}>
          {sectionTitle('Pipeline Canvas','Click a stage to configure')}
          <PipelineCanvas selectedStage={selectedStage} onSelectStage={setSelectedStage}/>
          {selectedStage&&(()=>{
            const s = STAGE_DATA.find(x=>x.id===selectedStage);
            return (
              <div style={{ marginTop:20, padding:16, background:G.surface3, borderRadius:10,
                border:`1px solid ${G.teal}44`, animation:'fadeUp .2s ease' }}>
                <div style={{ fontFamily:'Syne', fontWeight:700, color:G.teal, marginBottom:12 }}>
                  {s.icon} {s.label} — Configuration
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
                  {['Batch Size','Parallelism','Timeout (s)'].map(f=>(
                    <div key={f}>
                      <div style={{ fontFamily:'DM Mono', fontSize:10, color:G.muted, marginBottom:4 }}>{f}</div>
                      <input style={{ background:G.surface, border:`1px solid ${G.border}`, borderRadius:6,
                        padding:'6px 10px', color:G.text, fontFamily:'DM Mono', fontSize:12,
                        width:'100%', boxSizing:'border-box', outline:'none' }}
                        defaultValue={f==='Parallelism'?4:f==='Timeout (s)'?30:1000}/>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>

        {/* ── THROUGHPUT CHART ── */}
        <div style={card()}>
          {sectionTitle('Throughput — 24h Records/sec','Real-time ingestion volume')}
          <ThroughputChart/>
        </div>

        {/* ── BUILDER WIZARD ── */}
        {showBuilder&&(
          <div style={{ animation:'fadeUp .3s ease' }}>
            {sectionTitle('Pipeline Builder','Configure your new data pipeline')}
            <PipelineWizard onSuccess={handleSuccess}/>
          </div>
        )}

        {/* ── PIPELINE LIST ── */}
        <div style={card()}>
          {sectionTitle('Pipelines','8 active pipelines')}
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr>
                  {['Name','Source → Dest','Schedule','Last Run','Records','Duration','Status','Actions'].map(h=>(
                    <th key={h} style={{ padding:'8px 12px', textAlign:'left', fontFamily:'DM Mono',
                      fontSize:10, color:G.muted, fontWeight:500, letterSpacing:'0.06em',
                      borderBottom:`1px solid ${G.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pipelines.map(p=>(
                  <tr key={p.id} className="dp-row" style={{ transition:'background .15s' }}>
                    <td style={{ padding:'10px 12px', fontFamily:'Syne', fontWeight:600, fontSize:13, color:G.text }}>{p.name}</td>
                    <td style={{ padding:'10px 12px', fontFamily:'DM Mono', fontSize:11, color:G.muted }}>{p.src} → {p.dst}</td>
                    <td style={{ padding:'10px 12px', fontFamily:'DM Mono', fontSize:11, color:G.purple }}>{p.cron}</td>
                    <td style={{ padding:'10px 12px', fontFamily:'DM Mono', fontSize:11, color:G.muted }}>{p.lastRun}</td>
                    <td style={{ padding:'10px 12px', fontFamily:'DM Mono', fontSize:12, color:G.gold }}>{p.records}</td>
                    <td style={{ padding:'10px 12px', fontFamily:'DM Mono', fontSize:11, color:G.muted }}>{p.dur}</td>
                    <td style={{ padding:'10px 12px' }}>{statusBadge(p.status)}</td>
                    <td style={{ padding:'10px 12px' }}>
                      <button onClick={()=>togglePipeline(p.id)}
                        disabled={p.status==='Failed'}
                        style={{ background:'transparent', border:`1px solid ${p.status==='Running'?G.gold:G.teal}`,
                          borderRadius:6, color:p.status==='Running'?G.gold:p.status==='Failed'?G.muted:G.teal,
                          padding:'3px 10px', cursor:p.status==='Failed'?'not-allowed':'pointer',
                          fontFamily:'DM Mono', fontSize:10, opacity:p.status==='Failed'?0.4:1 }}>
                        {p.status==='Running'?'⏸ Pause':'▶ Resume'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── DATA QUALITY ── */}
        <div style={card()}>
          {sectionTitle('Data Quality Monitor','Measured across all active pipelines')}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:12 }}>
            {QUALITY.map(q=><QualityRing key={q.label} {...q}/>)}
          </div>
        </div>

        {/* ── ERROR INSPECTOR ── */}
        <div style={card()}>
          {sectionTitle('Error Inspector',`${errors.length} recent errors`)}
          {errors.length===0?(
            <div style={{ textAlign:'center', padding:'32px 0', fontFamily:'DM Mono', fontSize:13, color:G.teal }}>
              ✓ All clear — no pipeline errors
            </div>
          ):(
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {errors.map(e=>(
                <div key={e.id} style={{ display:'flex', alignItems:'center', gap:12,
                  background:G.surface3, borderRadius:10, padding:'12px 16px',
                  border:`1px solid ${G.red}33`, animation:'fadeUp .2s ease' }}>
                  <div style={{ color:G.red, fontSize:18 }}>⚠</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:2 }}>
                      <span style={{ fontFamily:'DM Mono', fontSize:10, color:G.muted }}>{e.ts}</span>
                      <span style={{ background:`${G.red}22`, color:G.red, borderRadius:4, padding:'0 6px', fontSize:10, fontFamily:'DM Mono' }}>{e.stage}</span>
                      <span style={{ fontFamily:'Syne', fontSize:12, fontWeight:600, color:G.text }}>{e.pipeline}</span>
                    </div>
                    <div style={{ fontFamily:'DM Mono', fontSize:11, color:G.red, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{e.msg}</div>
                  </div>
                  <div style={{ fontFamily:'DM Mono', fontSize:10, color:G.muted, whiteSpace:'nowrap' }}>retries: {e.retries}</div>
                  <button onClick={()=>retryError(e.id)} className="dp-btn"
                    style={{ background:`${G.gold}22`, border:`1px solid ${G.gold}44`, borderRadius:6,
                      color:G.gold, padding:'4px 12px', cursor:'pointer', fontFamily:'DM Mono', fontSize:10 }}>
                    Retry
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── SCHEMA MAPPER ── */}
        <div style={card()}>
          {sectionTitle('Schema Mapper','Click a row to highlight mapping')}
          <SchemaMapper/>
        </div>

        {/* ── LOG TERMINAL ── */}
        <div style={card()}>
          {sectionTitle('Pipeline Logs','Live terminal output — updates every 3s')}
          <LogTerminal/>
        </div>

      </div>
    </div>
  );
}
