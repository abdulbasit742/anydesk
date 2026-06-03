import { useState, useEffect } from 'react';

const injectStyles = () => {
  if (document.getElementById('promptmkt-styles')) return;
  const s = document.createElement('style');
  s.id = 'promptmkt-styles';
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap');
    @keyframes pmkt-fadeup { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
    @keyframes pmkt-pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
    @keyframes pmkt-shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
    .pmkt-card { transition:all 0.22s cubic-bezier(0.34,1.56,0.64,1); cursor:pointer; }
    .pmkt-card:hover { transform:translateY(-4px) scale(1.01); border-color:rgba(245,183,49,0.4)!important; box-shadow:0 16px 48px rgba(0,0,0,0.5)!important; }
    .pmkt-btn:hover { filter:brightness(1.15); transform:translateY(-1px); }
    .pmkt-tag { display:inline-flex; align-items:center; padding:2px 8px; border-radius:999px; font-size:10px; font-weight:700; transition:all 0.15s; cursor:pointer; }
    .pmkt-tag:hover { filter:brightness(1.2); }
    .pmkt-row:hover { background:rgba(255,255,255,0.03)!important; }
  `;
  document.head.appendChild(s);
};

const V = { gold:'#f5b731', teal:'#22d3ee', purple:'#a78bfa', surface:'#0e0e16', surface2:'#16161e', surface3:'#1d1d28', border:'rgba(255,255,255,0.07)', muted:'#6e7191', red:'#ef4444', blue:'#3b82f6', green:'#22c55e', orange:'#fb923c' };

const CATEGORIES = [
  { id:'all', label:'All', icon:'✨' },
  { id:'productivity', label:'Productivity', icon:'⚡' },
  { id:'coding', label:'Coding', icon:'💻' },
  { id:'writing', label:'Writing', icon:'✍️' },
  { id:'analysis', label:'Analysis', icon:'📊' },
  { id:'creative', label:'Creative', icon:'🎨' },
  { id:'business', label:'Business', icon:'💼' },
  { id:'research', label:'Research', icon:'🔬' },
];

const PROMPTS = [
  { id:1, title:'Ultra-Precise Bug Hunter', author:'DevCore', avatar:'🤖', category:'coding', tags:['debugging','code-review','typescript'], desc:'Systematically identifies and explains bugs with root cause analysis, fix suggestions, and prevention strategies for any codebase.', rating:4.9, downloads:28400, price:0, featured:true, verified:true, model:'GPT-4o', tokens:820, preview:'You are an expert debugging assistant. Analyze the following code for bugs, edge cases, and potential issues. For each problem found: 1) Identify the exact line, 2) Explain why it\'s a bug, 3) Provide a corrected version, 4) Suggest a prevention strategy.\n\nCode to analyze:\n{{code}}' },
  { id:2, title:'10x Developer PRD Writer', author:'ProductGuild', avatar:'📋', category:'business', tags:['prd','product','planning'], desc:'Creates comprehensive product requirement documents with user stories, acceptance criteria, technical constraints, and success metrics.', rating:4.8, downloads:19200, price:0, featured:true, verified:true, model:'Claude-3.5', tokens:1240, preview:'Act as a senior product manager. Create a detailed PRD for: {{feature_name}}\n\nInclude: Executive Summary, Problem Statement, Goals & Success Metrics, User Stories, Technical Requirements, Out of Scope, Timeline, and Risks.' },
  { id:3, title:'Viral Thread Generator', author:'ContentLab', avatar:'🧵', category:'writing', tags:['twitter','threads','viral'], desc:'Crafts high-engagement Twitter/X threads with hooks, value-dense content, and strong CTAs based on any topic or article.', rating:4.7, downloads:42100, price:0, featured:false, verified:true, model:'GPT-4o', tokens:650, preview:'Write a 10-tweet thread about {{topic}} that:\n- Opens with a scroll-stopping hook\n- Delivers one insight per tweet\n- Uses power words and numbers\n- Ends with a strong CTA\nFormat: Tweet 1/10, Tweet 2/10...' },
  { id:4, title:'SQL Performance Optimizer', author:'DataStack', avatar:'🗄️', category:'coding', tags:['sql','database','performance'], desc:'Analyzes SQL queries for performance bottlenecks, suggests indexes, rewrites inefficient joins, and explains execution plans.', rating:4.8, downloads:15600, price:0, featured:false, verified:true, model:'Claude-3.5', tokens:930, preview:'Analyze this SQL query for performance issues:\n{{sql_query}}\n\nProvide: 1) Current execution bottlenecks, 2) Index recommendations, 3) Optimized query rewrite, 4) Expected performance improvement %.' },
  { id:5, title:'Competitive Market Analyst', author:'StrategyAI', avatar:'📈', category:'analysis', tags:['market','competitor','strategy'], desc:'Performs deep competitive analysis with SWOT, Porter\'s Five Forces, positioning maps, and actionable strategic recommendations.', rating:4.6, downloads:9800, price:0, featured:false, verified:false, model:'Gemini-Pro', tokens:1580, preview:'Perform a competitive analysis for {{company}} in the {{industry}} market.\n\nStructure: Market Overview, Top 5 Competitors, SWOT Analysis, Porter\'s 5 Forces, Positioning Map (describe), Key Differentiators, Strategic Gaps, 90-day Action Plan.' },
  { id:6, title:'React Component Architect', author:'FrontendPro', avatar:'⚛️', category:'coding', tags:['react','components','architecture'], desc:'Designs scalable React component architectures with TypeScript, proper prop interfaces, hooks patterns, and performance optimizations.', rating:4.9, downloads:33700, price:0, featured:true, verified:true, model:'GPT-4o', tokens:780, preview:'Design a production-ready React component for: {{component_description}}\n\nInclude: TypeScript interfaces, component structure, custom hooks, error boundaries, loading states, accessibility (ARIA), and performance memo patterns.' },
  { id:7, title:'Email Cold Outreach Wizard', author:'SalesForge', avatar:'📧', category:'business', tags:['email','sales','outreach'], desc:'Crafts personalized cold emails with high open rates using proven psychological triggers, pain-point targeting, and clear value propositions.', rating:4.5, downloads:24600, price:0, featured:false, verified:true, model:'Claude-3.5', tokens:520, preview:'Write a cold email to {{prospect_role}} at {{company_type}} offering {{your_product}}.\n\nUse: Personalized opening, pain point identification, unique value prop, social proof, low-friction CTA. Keep under 150 words.' },
  { id:8, title:'Research Paper Summarizer', author:'AcademiAI', avatar:'📚', category:'research', tags:['research','summarize','academic'], desc:'Condenses complex academic papers into structured summaries with key findings, methodology, limitations, and practical applications.', rating:4.7, downloads:11200, price:0, featured:false, verified:true, model:'Gemini-Pro', tokens:1100, preview:'Summarize this research paper:\n{{paper_text}}\n\nStructure: 1) One-sentence TLDR, 2) Problem being solved, 3) Methodology, 4) Key findings with numbers, 5) Limitations, 6) Practical applications, 7) Follow-up questions.' },
  { id:9, title:'Brand Voice Transformer', author:'CreativeLab', avatar:'🎨', category:'creative', tags:['brand','voice','copywriting'], desc:'Rewrites any content in a defined brand voice — from ultra-formal corporate to playful startup — while preserving core meaning.', rating:4.6, downloads:17800, price:0, featured:false, verified:false, model:'GPT-4o', tokens:440, preview:'Rewrite the following text in a {{brand_voice}} voice (e.g. professional, witty, authoritative, conversational):\n\nOriginal: {{text}}\n\nMaintain the core message but adapt tone, word choice, sentence structure, and personality completely.' },
  { id:10, title:'API Documentation Generator', author:'DevDocs', avatar:'📖', category:'coding', tags:['api','documentation','openapi'], desc:'Generates comprehensive API documentation with endpoint descriptions, request/response schemas, examples, and error codes.', rating:4.8, downloads:21300, price:0, featured:false, verified:true, model:'Claude-3.5', tokens:890, preview:'Generate complete API documentation for:\n{{api_endpoint_code}}\n\nInclude: Description, HTTP method, URL, Path params, Query params, Request body schema, Response schema, Example requests (curl, JS, Python), Error codes and meanings.' },
  { id:11, title:'Weekly Planning Commander', author:'ProdHQ', avatar:'📅', category:'productivity', tags:['planning','gtd','weekly'], desc:'Creates structured weekly plans with priority matrix, time-blocks, energy mapping, and focus sessions based on your goals and commitments.', rating:4.5, downloads:8900, price:0, featured:false, verified:false, model:'Llama-3', tokens:680, preview:'Create my weekly plan for the week of {{week_dates}}.\n\nGoals: {{goals}}\nCommitments: {{commitments}}\nEnergy pattern: {{morning/afternoon/evening person}}\n\nOutput: Daily schedule with 2-3 focus blocks, priority matrix (urgent/important), one big "deep work" session.' },
  { id:12, title:'Data Insight Narrator', author:'AnalyticsAI', avatar:'📊', category:'analysis', tags:['data','visualization','insights'], desc:'Transforms raw data or statistics into clear, compelling narratives with trend identification, anomaly callouts, and executive-ready summaries.', rating:4.7, downloads:13400, price:0, featured:false, verified:true, model:'GPT-4o', tokens:760, preview:'Analyze this data and create a narrative:\n{{data_table_or_stats}}\n\nProvide: Executive summary (2 sentences), 3 key trends, 1 anomaly or surprise finding, comparison to benchmarks, 3 actionable recommendations, and a chart description.' },
];

const SORT_OPTIONS = ['Most Popular', 'Highest Rated', 'Newest', 'Most Downloaded'];

function StarRating({ rating }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:3 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ fontSize:11, color: i <= Math.round(rating) ? V.gold : 'rgba(255,255,255,0.15)' }}>★</span>
      ))}
      <span style={{ fontSize:10, color:V.muted, marginLeft:3, fontFamily:'DM Mono, monospace' }}>{rating.toFixed(1)}</span>
    </div>
  );
}

export default function PromptMarketplace() {
  useEffect(() => { injectStyles(); }, []);

  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('Most Popular');
  const [search, setSearch] = useState('');
  const [installed, setInstalled] = useState(new Set([1, 4]));
  const [preview, setPreview] = useState(null);
  const [starred, setStarred] = useState(new Set([1, 6]));
  const [varValues, setVarValues] = useState({});
  const [toast, setToast] = useState(null);

  const showToast = (msg, color = V.green) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2500);
  };

  const filtered = PROMPTS.filter(p => {
    const matchCat = category === 'all' || p.category === category;
    const matchQ = !search.trim() || p.title.toLowerCase().includes(search.toLowerCase()) || p.desc.toLowerCase().includes(search.toLowerCase()) || p.tags.some(t => t.includes(search.toLowerCase()));
    return matchCat && matchQ;
  }).sort((a, b) => {
    if (sort === 'Highest Rated') return b.rating - a.rating;
    if (sort === 'Most Downloaded') return b.downloads - a.downloads;
    return b.downloads - a.downloads;
  });

  const featured = PROMPTS.filter(p => p.featured);

  const installPrompt = (id) => {
    setInstalled(prev => { const n = new Set(prev); n.add(id); return n; });
    showToast('✓ Prompt installed to your library!');
  };

  const uninstall = (id) => {
    setInstalled(prev => { const n = new Set(prev); n.delete(id); return n; });
    showToast('Prompt removed from library', V.muted);
  };

  const toggleStar = (id) => {
    setStarred(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const getVars = (text) => {
    const matches = text.match(/\{\{(\w+)\}\}/g) || [];
    return [...new Set(matches.map(m => m.slice(2, -2)))];
  };

  const interpolate = (text, vals) => {
    return text.replace(/\{\{(\w+)\}\}/g, (_, k) => vals[k] ? `[${vals[k]}]` : `{{${k}}}`);
  };

  const activePrompt = PROMPTS.find(p => p.id === preview);
  const vars = activePrompt ? getVars(activePrompt.preview) : [];

  const fmtDownloads = (n) => n >= 1000 ? `${(n/1000).toFixed(1)}k` : n;

  return (
    <div style={{ padding:'0 0 80px', fontFamily:'Syne, sans-serif', background:V.surface, minHeight:'100vh', position:'relative' }}>
      {/* Toast */}
      {toast && (
        <div style={{ position:'fixed', top:80, right:24, zIndex:9999, padding:'12px 20px', borderRadius:10, background:toast.color, color: toast.color===V.green?'#000':'#fff', fontWeight:800, fontSize:13, boxShadow:'0 8px 32px rgba(0,0,0,0.5)', animation:'pmkt-fadeup 0.3s ease' }}>{toast.msg}</div>
      )}

      {/* HERO */}
      <div style={{ background:'linear-gradient(135deg,#0e0e16 0%,#140e20 50%,#0e1416 100%)', borderBottom:`1px solid ${V.border}`, padding:'32px 32px 28px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20 }}>
          <div style={{ width:52, height:52, borderRadius:16, background:'linear-gradient(135deg,rgba(245,183,49,0.2),rgba(167,139,250,0.2))', border:`1px solid ${V.gold}44`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26 }}>🏪</div>
          <div>
            <h1 style={{ margin:0, fontSize:26, fontWeight:800, color:'#fff', letterSpacing:'-0.5px' }}>Prompt Marketplace</h1>
            <div style={{ fontSize:12, color:V.muted, marginTop:2 }}>Discover, install & share community-crafted AI prompts</div>
          </div>
          <div style={{ marginLeft:'auto', display:'flex', gap:14, flexWrap:'wrap' }}>
            {[['🏪','12,400+ prompts',V.gold],['⭐','Avg rating 4.7',V.purple],['📥',`${installed.size} installed`,V.teal]].map(([icon,text,color]) => (
              <div key={text} style={{ background:V.surface2, border:`1px solid ${V.border}`, borderRadius:10, padding:'10px 16px', textAlign:'center' }}>
                <div style={{ fontSize:16, marginBottom:2 }}>{icon}</div>
                <div style={{ fontSize:11, color, fontWeight:700 }}>{text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Search */}
        <div style={{ position:'relative', maxWidth:600 }}>
          <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:16, color:V.muted }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search prompts, tags, authors..." style={{ width:'100%', padding:'12px 14px 12px 40px', background:V.surface2, border:`1px solid ${V.border}`, borderRadius:12, color:'#e4e4ed', fontSize:13, outline:'none', boxSizing:'border-box', fontFamily:'Syne, sans-serif' }} />
        </div>
      </div>

      <div style={{ padding:'28px 32px', display:'flex', flexDirection:'column', gap:28 }}>

        {/* FEATURED */}
        {!search && category === 'all' && (
          <div>
            <div style={{ fontWeight:800, fontSize:15, color:'#fff', marginBottom:14, display:'flex', alignItems:'center', gap:8 }}>⭐ Featured Prompts <span style={{ fontSize:11, color:V.muted, fontWeight:400 }}>— hand-picked by the team</span></div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))', gap:16 }}>
              {featured.map(p => (
                <div key={p.id} className="pmkt-card" onClick={() => setPreview(p.id)} style={{ background:`linear-gradient(135deg,${V.surface2},${V.surface3})`, border:`1px solid rgba(245,183,49,0.2)`, borderRadius:16, padding:'20px', position:'relative', animation:'pmkt-fadeup 0.3s ease' }}>
                  <div style={{ position:'absolute', top:12, right:12, display:'flex', gap:6 }}>
                    <span onClick={e=>{e.stopPropagation();toggleStar(p.id);}} style={{ fontSize:16, cursor:'pointer', filter: starred.has(p.id)?'none':'grayscale(1)', transition:'filter 0.2s' }}>⭐</span>
                    {p.verified && <span title="Verified" style={{ fontSize:14 }}>✅</span>}
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                    <div style={{ width:36, height:36, borderRadius:10, background:`linear-gradient(135deg,rgba(245,183,49,0.2),rgba(167,139,250,0.2))`, border:`1px solid ${V.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>{p.avatar}</div>
                    <div>
                      <div style={{ fontWeight:800, color:'#fff', fontSize:14, lineHeight:1.2 }}>{p.title}</div>
                      <div style={{ fontSize:10, color:V.muted }}>by {p.author}</div>
                    </div>
                  </div>
                  <div style={{ fontSize:11, color:'#adb5bd', lineHeight:1.7, marginBottom:12, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{p.desc}</div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:12 }}>
                    {p.tags.map(t => <span key={t} className="pmkt-tag" style={{ background:'rgba(167,139,250,0.12)', color:V.purple }}>#{t}</span>)}
                  </div>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <div style={{ display:'flex', gap:12, fontSize:11, color:V.muted }}>
                      <StarRating rating={p.rating} />
                      <span>📥 {fmtDownloads(p.downloads)}</span>
                    </div>
                    <button className="pmkt-btn" onClick={e=>{e.stopPropagation(); installed.has(p.id)?uninstall(p.id):installPrompt(p.id);}} style={{ padding:'6px 14px', borderRadius:8, background: installed.has(p.id)?'rgba(255,255,255,0.06)':`linear-gradient(135deg,${V.gold},#e0a020)`, color: installed.has(p.id)?V.muted:'#000', border: installed.has(p.id)?`1px solid ${V.border}`:'none', cursor:'pointer', fontWeight:800, fontSize:11, transition:'all 0.2s', flexShrink:0 }}>
                      {installed.has(p.id)?'✓ Installed':'+ Install'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FILTERS + SORT */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
            {CATEGORIES.map(c => (
              <button key={c.id} onClick={() => setCategory(c.id)} style={{ padding:'6px 14px', borderRadius:8, border:`1px solid ${category===c.id?V.gold:V.border}`, background: category===c.id?'rgba(245,183,49,0.12)':'transparent', color: category===c.id?V.gold:V.muted, cursor:'pointer', fontSize:11, fontWeight:700, transition:'all 0.15s' }}>
                {c.icon} {c.label}
              </button>
            ))}
          </div>
          <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding:'7px 12px', background:V.surface2, border:`1px solid ${V.border}`, borderRadius:8, color:'#e4e4ed', fontSize:11, outline:'none', fontFamily:'Syne, sans-serif' }}>
            {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>

        {/* GRID */}
        <div>
          <div style={{ fontSize:12, color:V.muted, marginBottom:14 }}>{filtered.length} prompts{search ? ` matching "${search}"` : ''}</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(290px, 1fr))', gap:16 }}>
            {filtered.map(p => (
              <div key={p.id} className="pmkt-card" onClick={() => setPreview(p.id)} style={{ background:V.surface2, border:`1px solid ${V.border}`, borderRadius:14, padding:'18px', position:'relative', animation:'pmkt-fadeup 0.3s ease' }}>
                <div style={{ position:'absolute', top:12, right:12, display:'flex', gap:6 }}>
                  <span onClick={e=>{e.stopPropagation();toggleStar(p.id);}} style={{ fontSize:14, cursor:'pointer', filter: starred.has(p.id)?'none':'grayscale(1)', transition:'filter 0.2s', opacity: starred.has(p.id)?1:0.4 }}>⭐</span>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                  <div style={{ width:32, height:32, borderRadius:9, background:V.surface3, border:`1px solid ${V.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>{p.avatar}</div>
                  <div style={{ minWidth:0 }}>
                    <div style={{ fontWeight:800, color:'#fff', fontSize:13, lineHeight:1.2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', paddingRight:24 }}>{p.title}</div>
                    <div style={{ fontSize:10, color:V.muted }}>by {p.author} {p.verified&&'✅'}</div>
                  </div>
                </div>
                <div style={{ fontSize:11, color:'#9ca3af', lineHeight:1.7, marginBottom:10, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{p.desc}</div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginBottom:12 }}>
                  {p.tags.slice(0,3).map(t => <span key={t} className="pmkt-tag" style={{ background:'rgba(34,211,238,0.1)', color:V.teal }}>#{t}</span>)}
                </div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
                  <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                    <StarRating rating={p.rating} />
                    <div style={{ fontSize:10, color:V.muted, fontFamily:'DM Mono, monospace' }}>📥 {fmtDownloads(p.downloads)} · 🤖 {p.model}</div>
                  </div>
                  <button className="pmkt-btn" onClick={e=>{e.stopPropagation(); installed.has(p.id)?uninstall(p.id):installPrompt(p.id);}} style={{ padding:'6px 12px', borderRadius:8, background: installed.has(p.id)?'rgba(34,197,94,0.12)':`linear-gradient(135deg,${V.gold},#e0a020)`, color: installed.has(p.id)?V.green:'#000', border: installed.has(p.id)?`1px solid ${V.green}44`:'none', cursor:'pointer', fontWeight:800, fontSize:10, transition:'all 0.2s', flexShrink:0 }}>
                    {installed.has(p.id)?'✓ Installed':'+ Install'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* INSTALLED LIST */}
        <div style={{ background:V.surface2, border:`1px solid ${V.border}`, borderRadius:16, overflow:'hidden' }}>
          <div style={{ padding:'18px 24px', borderBottom:`1px solid ${V.border}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ fontWeight:800, fontSize:15, color:'#fff' }}>📥 My Installed Prompts <span style={{ fontSize:12, color:V.muted, fontWeight:400 }}>({installed.size})</span></div>
          </div>
          {installed.size === 0 ? (
            <div style={{ padding:'40px', textAlign:'center', color:V.muted, fontSize:13 }}>No prompts installed yet — browse the marketplace above</div>
          ) : (
            <div>
              {PROMPTS.filter(p => installed.has(p.id)).map(p => (
                <div key={p.id} className="pmkt-row" style={{ borderTop:`1px solid ${V.border}`, padding:'14px 24px', display:'flex', alignItems:'center', gap:14, transition:'background 0.15s' }}>
                  <div style={{ fontSize:20 }}>{p.avatar}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:700, color:'#fff', fontSize:13 }}>{p.title}</div>
                    <div style={{ fontSize:11, color:V.muted, marginTop:2 }}>{p.category} · {p.model} · {p.tokens} tokens</div>
                  </div>
                  <div style={{ display:'flex', gap:8 }}>
                    <button className="pmkt-btn" onClick={() => setPreview(p.id)} style={{ padding:'5px 12px', borderRadius:7, border:`1px solid ${V.teal}`, background:'transparent', color:V.teal, cursor:'pointer', fontSize:10, fontWeight:700, transition:'all 0.2s' }}>▶ Use</button>
                    <button className="pmkt-btn" onClick={() => uninstall(p.id)} style={{ padding:'5px 10px', borderRadius:7, border:`1px solid ${V.border}`, background:'transparent', color:V.muted, cursor:'pointer', fontSize:10, fontWeight:700, transition:'all 0.2s' }}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* PREVIEW MODAL */}
      {preview && activePrompt && (
        <div onClick={() => setPreview(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center', padding:24, backdropFilter:'blur(8px)' }}>
          <div onClick={e => e.stopPropagation()} style={{ background:V.surface2, border:`1px solid rgba(245,183,49,0.3)`, borderRadius:20, width:'100%', maxWidth:700, maxHeight:'85vh', overflowY:'auto', animation:'pmkt-fadeup 0.3s ease', boxShadow:`0 0 80px rgba(245,183,49,0.1)` }}>
            <div style={{ padding:'24px', borderBottom:`1px solid ${V.border}`, display:'flex', alignItems:'flex-start', gap:14 }}>
              <div style={{ width:44, height:44, borderRadius:12, background:V.surface3, border:`1px solid ${V.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{activePrompt.avatar}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:800, color:'#fff', fontSize:17, marginBottom:4 }}>{activePrompt.title}</div>
                <div style={{ display:'flex', gap:10, flexWrap:'wrap', fontSize:11, color:V.muted }}>
                  <span>by {activePrompt.author}</span>
                  <span>·</span><StarRating rating={activePrompt.rating} />
                  <span>· 📥 {fmtDownloads(activePrompt.downloads)}</span>
                  <span>· 🤖 {activePrompt.model}</span>
                  <span>· ⚡ {activePrompt.tokens} tokens</span>
                </div>
              </div>
              <button onClick={() => setPreview(null)} style={{ background:'transparent', border:'none', color:V.muted, fontSize:20, cursor:'pointer', padding:4, flexShrink:0 }}>✕</button>
            </div>
            <div style={{ padding:'24px' }}>
              <div style={{ fontSize:12, color:'#adb5bd', lineHeight:1.8, marginBottom:20 }}>{activePrompt.desc}</div>
              <div style={{ marginBottom:20 }}>
                <div style={{ fontSize:11, color:V.gold, fontWeight:700, marginBottom:10, textTransform:'uppercase', letterSpacing:'0.06em' }}>Prompt Template</div>
                <pre style={{ margin:0, padding:'16px', background:'#060609', borderRadius:10, border:`1px solid ${V.border}`, fontSize:11, color:'#adb5bd', fontFamily:'DM Mono, monospace', whiteSpace:'pre-wrap', wordBreak:'break-word', lineHeight:1.7 }}>
                  {interpolate(activePrompt.preview, varValues)}
                </pre>
              </div>
              {vars.length > 0 && (
                <div style={{ marginBottom:20 }}>
                  <div style={{ fontSize:11, color:V.teal, fontWeight:700, marginBottom:10, textTransform:'uppercase', letterSpacing:'0.06em' }}>Fill in Variables</div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px,1fr))', gap:12 }}>
                    {vars.map(v => (
                      <div key={v}>
                        <label style={{ fontSize:10, color:V.muted, fontWeight:700, display:'block', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.06em' }}>{v.replace(/_/g,' ')}</label>
                        <input value={varValues[v]||''} onChange={e=>setVarValues(p=>({...p,[v]:e.target.value}))} placeholder={`Enter ${v}...`} style={{ width:'100%', padding:'7px 10px', background:V.surface3, border:`1px solid ${V.border}`, borderRadius:8, color:'#e4e4ed', fontSize:12, outline:'none', boxSizing:'border-box', fontFamily:'DM Mono, monospace' }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div style={{ display:'flex', gap:10 }}>
                <button className="pmkt-btn" onClick={() => { installPrompt(activePrompt.id); setPreview(null); }} style={{ padding:'10px 24px', borderRadius:10, background:`linear-gradient(135deg,${V.gold},#e0a020)`, color:'#000', border:'none', cursor:'pointer', fontWeight:800, fontSize:13, transition:'all 0.2s', fontFamily:'Syne, sans-serif' }}>
                  {installed.has(activePrompt.id) ? '✓ Already Installed' : '+ Install Prompt'}
                </button>
                <button className="pmkt-btn" onClick={() => { navigator.clipboard?.writeText(interpolate(activePrompt.preview, varValues)); showToast('Prompt copied to clipboard!'); }} style={{ padding:'10px 20px', borderRadius:10, background:'transparent', border:`1px solid ${V.teal}`, color:V.teal, cursor:'pointer', fontWeight:700, fontSize:12, transition:'all 0.2s' }}>📋 Copy</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
