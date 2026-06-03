import React, { useState, useCallback, useEffect, useMemo } from "react";

// ── Color / meta maps ──────────────────────────────────────────────────────────
const STRAND_TYPES = {
  Persona:    { color: "#a78bfa", icon: "🎭", label: "Persona" },
  Context:    { color: "#60a5fa", icon: "🌍", label: "Context" },
  Task:       { color: "#f5b731", icon: "🎯", label: "Task" },
  Format:     { color: "#22d3ee", icon: "📐", label: "Format" },
  Constraint: { color: "#ef4444", icon: "🔒", label: "Constraint" },
  Example:    { color: "#4ade80", icon: "💡", label: "Example" },
};

const PALETTE_ITEMS = {
  Persona: [
    { id:"p1", content:"You are an expert full-stack developer with 10+ years building scalable systems." },
    { id:"p2", content:"You are a creative writer specializing in technical storytelling and clear documentation." },
    { id:"p3", content:"You are a senior data scientist proficient in ML pipelines and statistical analysis." },
    { id:"p4", content:"You are a product manager focused on user outcomes and measurable business value." },
    { id:"p5", content:"You are a security auditor with expertise in OWASP top-10 and secure code review." },
    { id:"p6", content:"You are a UX designer who prioritizes accessibility, clarity, and delightful interactions." },
  ],
  Context: [
    { id:"c1", content:"The codebase is a monorepo using TypeScript, React, and Node.js microservices." },
    { id:"c2", content:"Reference the provided technical documentation and adhere to its conventions." },
    { id:"c3", content:"User research shows 70% of users are non-technical and value simplicity." },
    { id:"c4", content:"Market data indicates a 3-month runway; prioritize speed over perfection." },
    { id:"c5", content:"Historical logs show peak traffic at 2am UTC — optimize for that window." },
    { id:"c6", content:"The API spec uses REST with JSON:API format and OAuth2 bearer tokens." },
  ],
  Task: [
    { id:"t1", content:"Generate production-ready code with error handling, logging, and comments." },
    { id:"t2", content:"Analyze the bug described below, identify root cause, and suggest a fix." },
    { id:"t3", content:"Write comprehensive unit and integration tests covering edge cases." },
    { id:"t4", content:"Refactor the given code for readability, performance, and maintainability." },
    { id:"t5", content:"Write clear, concise documentation for the given function or module." },
    { id:"t6", content:"Review the PR changes below and flag issues, improvements, and risks." },
    { id:"t7", content:"Design a scalable architecture diagram and explain each component's role." },
  ],
  Format: [
    { id:"f1", content:"Respond in well-structured Markdown with headers, code blocks, and lists." },
    { id:"f2", content:"Return a single valid JSON object matching the schema I'll describe." },
    { id:"f3", content:"Use bullet points. Be concise. Maximum 3 levels of nesting." },
    { id:"f4", content:"Wrap all code in fenced code blocks with the correct language tag." },
    { id:"f5", content:"Present your answer as numbered steps. Each step: title + explanation." },
    { id:"f6", content:"Return a Markdown table with columns: Field, Type, Description, Example." },
  ],
  Constraint: [
    { id:"cn1", content:"Your response must not exceed 500 tokens. Be concise." },
    { id:"cn2", content:"Do not import or reference any external libraries beyond what is provided." },
    { id:"cn3", content:"All code must be TypeScript. Avoid 'any'. Use strict mode." },
    { id:"cn4", content:"Output must be production-safe. No debug logs, TODOs, or console.log." },
    { id:"cn5", content:"Do not use placeholders like 'your-api-key'. Provide real, working code." },
    { id:"cn6", content:"Follow idiomatic style for the given language. No unnecessary abstractions." },
  ],
  Example: [
    { id:"ex1", content:"Input: [user code] → Output: [refactored code + explanation of each change]." },
    { id:"ex2", content:"Few-shot (3 examples): here are three examples of input→output pairs before your task." },
    { id:"ex3", content:"Think step-by-step (chain-of-thought): show your reasoning before the final answer." },
    { id:"ex4", content:"Zero-shot: solve the task directly without examples or intermediate steps." },
    { id:"ex5", content:"Reference implementation: study this canonical example before generating your solution." },
  ],
};

const MUTATION_VARIANTS = {
  Persona:    ["You are a 20-year veteran systems architect.", "You are a startup CTO who ships fast.", "You are an open-source maintainer who values community."],
  Context:    ["The project uses a serverless architecture on AWS Lambda.", "Context: early-stage startup, move fast.", "Legacy codebase, PHP 7.4, no tests exist yet."],
  Task:       ["Optimize for readability above all else.", "Prioritize performance and minimal allocations.", "Write with a junior developer audience in mind."],
  Format:     ["Return XML with a strict schema.", "Respond only with YAML frontmatter.", "Use ADR (Architecture Decision Record) format."],
  Constraint:["Hard limit: 200 tokens.", "No classes — pure functional code only.", "ESM modules only, no CommonJS."],
  Example:   ["Chain-of-thought with self-critique at the end.", "Provide a counter-example too.", "Show two competing implementations side by side."],
};

const SAVED_GENOMES = [
  { id:"g1", name:"Full-Stack Dev Prompt", strands:[
    { id:Date.now()+"a", type:"Persona", content:PALETTE_ITEMS.Persona[0].content },
    { id:Date.now()+"b", type:"Context", content:PALETTE_ITEMS.Context[0].content },
    { id:Date.now()+"c", type:"Task",    content:PALETTE_ITEMS.Task[0].content },
    { id:Date.now()+"d", type:"Format",  content:PALETTE_ITEMS.Format[0].content },
    { id:Date.now()+"e", type:"Constraint", content:PALETTE_ITEMS.Constraint[2].content },
  ]},
  { id:"g2", name:"Bug Reporter", strands:[
    { id:"g2a", type:"Persona", content:PALETTE_ITEMS.Persona[0].content },
    { id:"g2b", type:"Task",    content:PALETTE_ITEMS.Task[1].content },
    { id:"g2c", type:"Format",  content:PALETTE_ITEMS.Format[0].content },
  ]},
  { id:"g3", name:"Code Reviewer", strands:[
    { id:"g3a", type:"Persona",    content:PALETTE_ITEMS.Persona[4].content },
    { id:"g3b", type:"Task",       content:PALETTE_ITEMS.Task[5].content },
    { id:"g3c", type:"Format",     content:PALETTE_ITEMS.Format[2].content },
    { id:"g3d", type:"Constraint", content:PALETTE_ITEMS.Constraint[3].content },
  ]},
  { id:"g4", name:"API Designer", strands:[
    { id:"g4a", type:"Persona", content:PALETTE_ITEMS.Persona[0].content },
    { id:"g4b", type:"Context", content:PALETTE_ITEMS.Context[5].content },
    { id:"g4c", type:"Task",    content:PALETTE_ITEMS.Task[6].content },
    { id:"g4d", type:"Format",  content:PALETTE_ITEMS.Format[5].content },
  ]},
  { id:"g5", name:"Test Generator", strands:[
    { id:"g5a", type:"Persona",    content:PALETTE_ITEMS.Persona[0].content },
    { id:"g5b", type:"Task",       content:PALETTE_ITEMS.Task[2].content },
    { id:"g5c", type:"Constraint", content:PALETTE_ITEMS.Constraint[2].content },
    { id:"g5d", type:"Example",    content:PALETTE_ITEMS.Example[0].content },
  ]},
];

// ── Utility ────────────────────────────────────────────────────────────────────
let _uid = 1000;
const uid = () => `s${++_uid}_${Date.now()}`;
const tokenCount = (str) => Math.ceil(str.length / 4);

function assemblePrompt(strands) {
  return strands.map(s => s.content).join("\n\n");
}

function fitnessScore(strands, weights) {
  const text = assemblePrompt(strands);
  const clarity = Math.min(100, Math.round((text.split(".").length / text.split(" ").length) * 600));
  const specificity = Math.min(100, Math.round((text.match(/\b\w{7,}\b/g)||[]).length / text.split(" ").length * 400));
  const brevity = Math.max(0, 100 - Math.round(text.length / 30));
  const creativity = strands.filter(s => s.type === "Example" || s.type === "Persona").length * 20;
  return Math.round(
    (clarity * weights.clarity + specificity * weights.specificity + brevity * weights.brevity + Math.min(100,creativity) * weights.creativity) /
    (weights.clarity + weights.specificity + weights.brevity + weights.creativity)
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function HeroHeader() {
  return (
    <div style={{
      background:"linear-gradient(135deg,#0e0e16 0%,#1a0a2e 40%,#0a1a2e 70%,#0e0e16 100%)",
      borderBottom:"1px solid rgba(167,139,250,0.2)",
      padding:"36px 40px 28px",
      position:"relative",
      overflow:"hidden",
    }}>
      {/* animated helix bg */}
      <svg style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",opacity:0.07,pointerEvents:"none"}} viewBox="0 0 1200 160" preserveAspectRatio="none">
        {Array.from({length:24}).map((_,i)=>(
          <ellipse key={i} cx={i*52} cy={i%2===0?40:120} rx={24} ry={16} fill="none" stroke="#a78bfa" strokeWidth="1.5">
            <animate attributeName="cy" values={i%2===0?"40;120;40":"120;40;120"} dur="4s" begin={`${i*0.18}s`} repeatCount="indefinite"/>
          </ellipse>
        ))}
        <line x1="0" y1="80" x2="1200" y2="80" stroke="#22d3ee" strokeWidth="0.5" strokeDasharray="4 8"/>
      </svg>

      <div style={{position:"relative",zIndex:1}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
          <span style={{fontSize:32}}>🧬</span>
          <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:32,fontWeight:800,
            background:"linear-gradient(90deg,#a78bfa,#22d3ee,#f5b731)",
            WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",margin:0}}>
            Prompt DNA Editor
          </h1>
        </div>
        <p style={{color:"#6e7191",fontFamily:"'DM Mono',monospace",fontSize:14,margin:"0 0 20px 44px"}}>
          Visually assemble, mutate, and evolve your prompts at the molecular level
        </p>
        <div style={{display:"flex",gap:12,marginLeft:44,flexWrap:"wrap"}}>
          {[["6","Strand Types","#a78bfa"],["∞","Combinations","#22d3ee"],["Live","Preview","#f5b731"]].map(([val,lbl,clr])=>(
            <div key={lbl} style={{background:"rgba(255,255,255,0.04)",border:`1px solid ${clr}33`,borderRadius:8,padding:"6px 14px",display:"flex",alignItems:"center",gap:8}}>
              <span style={{color:clr,fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:18}}>{val}</span>
              <span style={{color:"#6e7191",fontSize:12,fontFamily:"'DM Mono',monospace"}}>{lbl}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DNAVisualizer({ strands, selectedId, onSelect }) {
  const W = 900, H = 120, pad = 30;
  const segW = strands.length ? Math.min(100, (W - pad*2) / strands.length - 4) : 80;

  return (
    <div style={{background:"#0a0a12",borderRadius:12,border:"1px solid rgba(255,255,255,0.07)",overflow:"hidden",margin:"0 0 0 0"}}>
      <div style={{padding:"10px 16px 0",display:"flex",alignItems:"center",gap:8}}>
        <span style={{color:"#6e7191",fontFamily:"'DM Mono',monospace",fontSize:11}}>DNA STRAND VISUALIZER</span>
        <div style={{flex:1,height:1,background:"rgba(255,255,255,0.05)"}}/>
        <div style={{width:8,height:8,borderRadius:"50%",background:"#4ade80",boxShadow:"0 0 6px #4ade80"}}/>
        <span style={{color:"#4ade80",fontSize:10,fontFamily:"'DM Mono',monospace"}}>LIVE</span>
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{display:"block",overflow:"visible"}}>
        {/* backbone lines */}
        <line x1={pad} y1={32} x2={W-pad} y2={32} stroke="rgba(167,139,250,0.2)" strokeWidth="2" strokeDasharray="6 3"/>
        <line x1={pad} y1={88} x2={W-pad} y2={88} stroke="rgba(34,211,238,0.2)" strokeWidth="2" strokeDasharray="6 3"/>

        {strands.map((s, i) => {
          const x = pad + i * (segW + 4);
          const col = STRAND_TYPES[s.type]?.color || "#888";
          const isActive = s.id === selectedId;
          return (
            <g key={s.id} onClick={() => onSelect(s.id)} style={{cursor:"pointer"}}>
              {/* base pair connector */}
              <line x1={x + segW/2} y1={40} x2={x + segW/2} y2={80} stroke={col} strokeWidth="1.5" strokeOpacity="0.4">
                <animate attributeName="stroke-opacity" values="0.2;0.7;0.2" dur="2.5s" begin={`${i*0.2}s`} repeatCount="indefinite"/>
              </line>
              {/* top segment */}
              <rect x={x} y={18} width={segW} height={28} rx={6} fill={col} fillOpacity={isActive?0.9:0.55}
                stroke={isActive?col:"transparent"} strokeWidth={isActive?2:0}>
                {isActive && <animate attributeName="fill-opacity" values="0.7;1;0.7" dur="1.2s" repeatCount="indefinite"/>}
              </rect>
              {/* bottom complement */}
              <rect x={x} y={74} width={segW} height={28} rx={6} fill={col} fillOpacity={isActive?0.5:0.2}
                stroke="transparent"/>
              {/* label top */}
              <text x={x+segW/2} y={36} textAnchor="middle" fill="white" fontSize="9" fontFamily="DM Mono,monospace" fillOpacity="0.9">
                {STRAND_TYPES[s.type]?.icon}
              </text>
              {/* label bottom - type abbrev */}
              <text x={x+segW/2} y={92} textAnchor="middle" fill={col} fontSize="8" fontFamily="DM Mono,monospace" fillOpacity="0.7">
                {s.type.slice(0,3).toUpperCase()}
              </text>
              {isActive && (
                <rect x={x-2} y={16} width={segW+4} height={32} rx={7} fill="none" stroke={col} strokeWidth="1.5" strokeOpacity="0.6">
                  <animate attributeName="stroke-opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite"/>
                </rect>
              )}
            </g>
          );
        })}

        {strands.length === 0 && (
          <text x={W/2} y={H/2} textAnchor="middle" fill="#6e7191" fontSize="13" fontFamily="DM Mono,monospace">
            Add strands to visualize DNA →
          </text>
        )}
      </svg>
    </div>
  );
}

function StrandPalette({ onAddStrand, searchQuery, setSearchQuery }) {
  const [expanded, setExpanded] = useState({ Persona:true });

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return PALETTE_ITEMS;
    const result = {};
    Object.entries(PALETTE_ITEMS).forEach(([type, items]) => {
      const f = items.filter(it => it.content.toLowerCase().includes(q) || type.toLowerCase().includes(q));
      if (f.length) result[type] = f;
    });
    return result;
  }, [searchQuery]);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:0,height:"100%",overflowY:"auto"}}>
      <div style={{padding:"12px 14px 8px",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
        <span style={{color:"#6e7191",fontSize:10,fontFamily:"'DM Mono',monospace",letterSpacing:1}}>STRAND PALETTE</span>
        <input
          value={searchQuery}
          onChange={e=>setSearchQuery(e.target.value)}
          placeholder="Search strands…"
          style={{marginTop:8,width:"100%",boxSizing:"border-box",background:"#16161e",border:"1px solid rgba(255,255,255,0.08)",borderRadius:6,color:"white",padding:"6px 10px",fontSize:12,fontFamily:"'DM Mono',monospace",outline:"none"}}
        />
      </div>

      {Object.entries(filtered).map(([type, items]) => {
        const meta = STRAND_TYPES[type];
        const isOpen = expanded[type];
        return (
          <div key={type} style={{borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
            <button
              onClick={()=>setExpanded(p=>({...p,[type]:!p[type]}))}
              style={{width:"100%",background:"none",border:"none",padding:"9px 14px",display:"flex",alignItems:"center",gap:8,cursor:"pointer",color:"white"}}>
              <span>{meta.icon}</span>
              <span style={{flex:1,textAlign:"left",fontSize:12,fontFamily:"'DM Mono',monospace",color:meta.color}}>{type}</span>
              <span style={{color:"#6e7191",fontSize:10,fontFamily:"'DM Mono',monospace"}}>{items.length}</span>
              <span style={{color:"#6e7191",fontSize:10}}>{isOpen?"▲":"▼"}</span>
            </button>
            {isOpen && (
              <div style={{paddingBottom:6}}>
                {items.map(item=>(
                  <div key={item.id}
                    onClick={()=>onAddStrand(type, item.content)}
                    style={{margin:"2px 10px",padding:"7px 10px",background:"#16161e",border:`1px solid ${meta.color}22`,borderRadius:6,
                      cursor:"pointer",fontSize:11,color:"#c4c4d4",fontFamily:"'DM Mono',monospace",lineHeight:1.4,
                      transition:"background 0.15s,border-color 0.15s",display:"flex",alignItems:"flex-start",gap:6}}
                    onMouseEnter={e=>{e.currentTarget.style.background="#1d1d28";e.currentTarget.style.borderColor=meta.color+"55";}}
                    onMouseLeave={e=>{e.currentTarget.style.background="#16161e";e.currentTarget.style.borderColor=meta.color+"22";}}>
                    <span style={{color:meta.color,marginTop:1,flexShrink:0}}>+</span>
                    <span style={{overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{item.content}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function StrandBlock({ strand, index, isSelected, onSelect, onDelete, onMutate, onMoveUp, onMoveDown }) {
  const meta = STRAND_TYPES[strand.type];
  const [animIn, setAnimIn] = useState(false);
  useEffect(()=>{ setTimeout(()=>setAnimIn(true),30); },[]);

  return (
    <div
      onClick={()=>onSelect(strand.id)}
      style={{
        background: isSelected ? `${meta.color}11` : "#16161e",
        border: `1px solid ${isSelected ? meta.color+"66" : "rgba(255,255,255,0.07)"}`,
        borderRadius:10,padding:"12px 14px",cursor:"pointer",
        transition:"all 0.2s",
        transform: animIn ? "translateY(0)" : "translateY(-12px)",
        opacity: animIn ? 1 : 0,
        boxShadow: isSelected ? `0 0 0 1px ${meta.color}33, 0 4px 20px ${meta.color}15` : "none",
      }}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
        <span style={{fontSize:14}}>{meta.icon}</span>
        <span style={{background:`${meta.color}22`,color:meta.color,fontSize:10,fontFamily:"'DM Mono',monospace",
          padding:"2px 8px",borderRadius:4,fontWeight:600,letterSpacing:0.5}}>{strand.type.toUpperCase()}</span>
        <div style={{flex:1}}/>
        <button title="Move up" onClick={e=>{e.stopPropagation();onMoveUp(index);}} style={btnStyle("#6e7191")}>↑</button>
        <button title="Move down" onClick={e=>{e.stopPropagation();onMoveDown(index);}} style={btnStyle("#6e7191")}>↓</button>
        <button title="Mutate" onClick={e=>{e.stopPropagation();onMutate(strand.id);}}
          style={btnStyle(meta.color)}>⚡</button>
        <button title="Delete" onClick={e=>{e.stopPropagation();onDelete(strand.id);}}
          style={btnStyle("#ef4444")}>✕</button>
      </div>
      <p style={{margin:0,fontSize:12,color:"#c4c4d4",fontFamily:"'DM Mono',monospace",lineHeight:1.5,
        overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>
        {strand.content}
      </p>
    </div>
  );
}

const btnStyle = (c) => ({
  background:`${c}18`,border:`1px solid ${c}33`,color:c,borderRadius:5,
  width:24,height:24,display:"flex",alignItems:"center",justifyContent:"center",
  cursor:"pointer",fontSize:11,padding:0,transition:"background 0.15s",flexShrink:0,
});

function AssemblyCanvas({ strands, selectedId, onSelect, onDelete, onMutate, onMoveUp, onMoveDown }) {
  return (
    <div style={{flex:1,overflowY:"auto",padding:"14px",display:"flex",flexDirection:"column",gap:8}}>
      {strands.length === 0 ? (
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
          border:"2px dashed rgba(255,255,255,0.07)",borderRadius:12,minHeight:200,gap:12}}>
          <span style={{fontSize:40}}>🧬</span>
          <p style={{color:"#6e7191",fontFamily:"'DM Mono',monospace",fontSize:13,margin:0,textAlign:"center"}}>
            Drag strands here to build your prompt DNA
          </p>
          <p style={{color:"rgba(110,113,145,0.5)",fontSize:11,margin:0,fontFamily:"'DM Mono',monospace"}}>
            or click + on any palette item
          </p>
        </div>
      ) : strands.map((s,i) => (
        <StrandBlock key={s.id} strand={s} index={i} isSelected={selectedId===s.id}
          onSelect={onSelect} onDelete={onDelete} onMutate={onMutate}
          onMoveUp={onMoveUp} onMoveDown={onMoveDown} />
      ))}
    </div>
  );
}

function StrandInspector({ strand, onUpdate, onSave }) {
  const [temp, setTemp] = useState(50);
  const [priority, setPriority] = useState(75);
  const meta = strand ? STRAND_TYPES[strand.type] : null;
  const variants = strand ? MUTATION_VARIANTS[strand.type] || [] : [];

  if (!strand) return (
    <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:8,padding:20}}>
      <span style={{fontSize:32,opacity:0.3}}>🔬</span>
      <p style={{color:"#6e7191",fontSize:12,fontFamily:"'DM Mono',monospace",textAlign:"center",margin:0}}>
        Select a strand block to inspect and edit
      </p>
    </div>
  );

  return (
    <div style={{padding:"14px",display:"flex",flexDirection:"column",gap:12,overflowY:"auto",flex:1}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontSize:18}}>{meta.icon}</span>
        <span style={{background:`${meta.color}22`,color:meta.color,fontSize:11,fontFamily:"'DM Mono',monospace",
          padding:"3px 10px",borderRadius:5,fontWeight:700}}>{strand.type.toUpperCase()}</span>
      </div>

      <div>
        <label style={{color:"#6e7191",fontSize:10,fontFamily:"'DM Mono',monospace",display:"block",marginBottom:4}}>CONTENT</label>
        <textarea value={strand.content} onChange={e=>onUpdate({...strand,content:e.target.value})}
          rows={5} style={{width:"100%",boxSizing:"border-box",background:"#0e0e16",border:"1px solid rgba(255,255,255,0.08)",
          borderRadius:7,color:"white",padding:"9px",fontSize:12,fontFamily:"'DM Mono',monospace",resize:"vertical",outline:"none",lineHeight:1.5}}/>
      </div>

      <SliderField label="Temperature Influence" value={temp} onChange={setTemp} color={meta.color} min={0} max={100}/>
      <SliderField label="Priority Weight" value={priority} onChange={setPriority} color={meta.color} min={0} max={100}/>

      <div>
        <label style={{color:"#6e7191",fontSize:10,fontFamily:"'DM Mono',monospace",display:"block",marginBottom:6}}>VARIATIONS</label>
        {variants.map((v,i)=>(
          <div key={i} onClick={()=>onUpdate({...strand,content:v})}
            style={{background:"#16161e",border:`1px solid rgba(255,255,255,0.06)`,borderRadius:7,padding:"8px 10px",
              marginBottom:5,cursor:"pointer",fontSize:11,color:"#a0a0b8",fontFamily:"'DM Mono',monospace",lineHeight:1.4,
              transition:"border-color 0.15s"}}
            onMouseEnter={e=>e.currentTarget.style.borderColor=meta.color+"44"}
            onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.06)"}>
            <span style={{color:meta.color,marginRight:6}}>↳</span>{v}
          </div>
        ))}
      </div>

      <button onClick={onSave}
        style={{background:`${meta.color}22`,border:`1px solid ${meta.color}55`,color:meta.color,borderRadius:7,
          padding:"8px",fontFamily:"'DM Mono',monospace",fontSize:12,cursor:"pointer",marginTop:4}}>
        💾 Save Custom Strand
      </button>
    </div>
  );
}

function SliderField({ label, value, onChange, color, min=0, max=100 }) {
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
        <label style={{color:"#6e7191",fontSize:10,fontFamily:"'DM Mono',monospace"}}>{label.toUpperCase()}</label>
        <span style={{color,fontSize:10,fontFamily:"'DM Mono',monospace",fontWeight:700}}>{value}</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={e=>onChange(+e.target.value)}
        style={{width:"100%",accentColor:color,cursor:"pointer"}}/>
    </div>
  );
}

function LivePreview({ strands }) {
  const [copied, setCopied] = useState(false);
  const [minified, setMinified] = useState(false);
  const prompt = useMemo(()=>assemblePrompt(strands),[strands]);
  const tokens = tokenCount(prompt);
  const display = minified ? prompt.replace(/\s+/g," ").trim() : prompt;

  const copy = () => {
    navigator.clipboard.writeText(display);
    setCopied(true);
    setTimeout(()=>setCopied(false),1800);
  };

  const models = [
    { name:"GPT-4",     limit:8000,  ok: tokens<=8000 },
    { name:"Claude 3",  limit:10000, ok: tokens<=10000 },
    { name:"Gemini Pro",limit:16000, ok: tokens<=16000 },
    { name:"Llama 8B",  limit:2000,  ok: tokens<=2000 },
  ];

  return (
    <div style={{borderTop:"1px solid rgba(255,255,255,0.07)",padding:"14px 16px",background:"#0a0a12"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
        <span style={{color:"#6e7191",fontSize:10,fontFamily:"'DM Mono',monospace",letterSpacing:1}}>LIVE PROMPT PREVIEW</span>
        <div style={{flex:1,height:1,background:"rgba(255,255,255,0.05)"}}/>
        <span style={{color:"#f5b731",fontSize:11,fontFamily:"'DM Mono',monospace"}}>{tokens} tokens</span>
        <div style={{display:"flex",gap:6}}>
          {models.map(m=>(
            <span key={m.name} style={{
              fontSize:10,fontFamily:"'DM Mono',monospace",padding:"2px 7px",borderRadius:4,
              background: m.ok?"#4ade8022":"#ef444422",
              color: m.ok?"#4ade80":"#ef4444",
              border:`1px solid ${m.ok?"#4ade8033":"#ef444433"}`
            }}>{m.name} {m.ok?"✓":"✗"}</span>
          ))}
        </div>
        <button onClick={()=>setMinified(p=>!p)}
          style={{background:"#1d1d28",border:"1px solid rgba(255,255,255,0.08)",color:"#6e7191",borderRadius:6,
            padding:"4px 10px",fontSize:11,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>
          {minified?"Expand":"Minify"}
        </button>
        <button onClick={copy}
          style={{background: copied?"#4ade8022":"#f5b73122",border:`1px solid ${copied?"#4ade8055":"#f5b73155"}`,
            color: copied?"#4ade80":"#f5b731",borderRadius:6,padding:"4px 10px",fontSize:11,
            fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>
          {copied?"Copied ✓":"Copy"}
        </button>
      </div>

      <div style={{background:"#16161e",borderRadius:8,padding:"12px",maxHeight:140,overflowY:"auto",
        border:"1px solid rgba(255,255,255,0.05)"}}>
        {strands.length === 0
          ? <span style={{color:"#6e7191",fontSize:12,fontFamily:"'DM Mono',monospace"}}>No strands assembled yet…</span>
          : strands.map((s,i)=>(
            <React.Fragment key={s.id}>
              <span style={{color:STRAND_TYPES[s.type]?.color,fontSize:12,fontFamily:"'DM Mono',monospace",
                background:`${STRAND_TYPES[s.type]?.color}12`,borderRadius:3,padding:"0 2px"}}>
                {s.content}
              </span>
              {i<strands.length-1 && <span style={{color:"rgba(255,255,255,0.15)",fontFamily:"'DM Mono',monospace",fontSize:12}}> ¶ </span>}
            </React.Fragment>
          ))
        }
      </div>
    </div>
  );
}

function EvolutionEngine({ strands, onApply }) {
  const [fitnessWeights, setFitnessWeights] = useState({ clarity:30, specificity:30, brevity:20, creativity:20 });
  const [evolved, setEvolved] = useState([]);
  const [running, setRunning] = useState(false);

  const runEvolution = () => {
    if (!strands.length) return;
    setRunning(true);
    setTimeout(()=>{
      const variants = Array.from({length:5}).map(()=>{
        const mutated = strands.map(s=>{
          const roll = Math.random();
          if (roll < 0.3) {
            const vars = MUTATION_VARIANTS[s.type]||[];
            return {...s, content: vars[Math.floor(Math.random()*vars.length)] || s.content};
          }
          if (roll < 0.5) {
            const poolType = Object.keys(PALETTE_ITEMS)[Math.floor(Math.random()*6)];
            const pool = PALETTE_ITEMS[poolType];
            return {...s, type:poolType, content: pool[Math.floor(Math.random()*pool.length)].content};
          }
          return s;
        });
        return {strands:mutated, score: fitnessScore(mutated, fitnessWeights)};
      });
      const baseScore = fitnessScore(strands, fitnessWeights);
      setEvolved(variants.map(v=>({...v, delta: v.score - baseScore})));
      setRunning(false);
    },1200);
  };

  return (
    <div style={{padding:16,display:"flex",flexDirection:"column",gap:14}}>
      <div style={{background:"#16161e",borderRadius:10,padding:14,border:"1px solid rgba(255,255,255,0.06)"}}>
        <p style={{color:"#6e7191",fontSize:10,fontFamily:"'DM Mono',monospace",margin:"0 0 10px",letterSpacing:1}}>FITNESS FUNCTION WEIGHTS</p>
        {Object.entries(fitnessWeights).map(([k,v])=>(
          <SliderField key={k} label={k} value={v} onChange={val=>setFitnessWeights(p=>({...p,[k]:val}))} color="#a78bfa"/>
        ))}
      </div>

      <button onClick={runEvolution} disabled={running || !strands.length}
        style={{background:running?"#1d1d28":"linear-gradient(90deg,#a78bfa,#22d3ee)",border:"none",color:"white",
          borderRadius:8,padding:"10px",fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,cursor:"pointer",
          opacity: (!strands.length)?0.4:1}}>
        {running ? "⚙️ Evolving…" : "🧬 Run Evolution"}
      </button>

      {evolved.length > 0 && (
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {evolved.map((v,i)=>(
            <div key={i} style={{background:"#16161e",borderRadius:9,padding:"12px 14px",border:"1px solid rgba(255,255,255,0.06)"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                <span style={{color:"white",fontFamily:"'DM Mono',monospace",fontSize:12,fontWeight:700}}>Variant #{i+1}</span>
                <span style={{background:"#1d1d28",color:"#f5b731",fontFamily:"'DM Mono',monospace",fontSize:11,padding:"2px 8px",borderRadius:4}}>
                  Score: {v.score}
                </span>
                <span style={{color:v.delta>=0?"#4ade80":"#ef4444",fontFamily:"'DM Mono',monospace",fontSize:11}}>
                  {v.delta>=0?"+":""}{v.delta}
                </span>
                <div style={{flex:1}}/>
                <button onClick={()=>onApply(v.strands)}
                  style={{background:"#a78bfa22",border:"1px solid #a78bfa55",color:"#a78bfa",borderRadius:6,
                    padding:"4px 10px",fontSize:11,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>
                  Select Winner
                </button>
              </div>
              <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                {v.strands.map((s,j)=>(
                  <span key={j} style={{background:`${STRAND_TYPES[s.type]?.color}22`,color:STRAND_TYPES[s.type]?.color,
                    fontSize:9,fontFamily:"'DM Mono',monospace",padding:"2px 6px",borderRadius:3}}>
                    {STRAND_TYPES[s.type]?.icon} {s.type}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function GenomeLibrary({ strands, savedGenomes, onLoad, onSave }) {
  const [name, setName] = useState("");

  const exportGenome = (g) => {
    const blob = new Blob([JSON.stringify(g,null,2)], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download=`${g.name}.json`; a.click();
  };

  return (
    <div style={{padding:14,display:"flex",flexDirection:"column",gap:10}}>
      <div style={{display:"flex",gap:8}}>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Genome name…"
          style={{flex:1,background:"#16161e",border:"1px solid rgba(255,255,255,0.08)",borderRadius:6,
            color:"white",padding:"7px 10px",fontSize:12,fontFamily:"'DM Mono',monospace",outline:"none"}}/>
        <button onClick={()=>{if(name&&strands.length){onSave(name);setName("");}}}
          style={{background:"#f5b73122",border:"1px solid #f5b73155",color:"#f5b731",borderRadius:6,
            padding:"7px 14px",fontFamily:"'DM Mono',monospace",fontSize:12,cursor:"pointer"}}>
          Save
        </button>
      </div>

      {savedGenomes.map(g=>(
        <div key={g.id} style={{background:"#16161e",borderRadius:9,padding:"12px 14px",
          border:"1px solid rgba(255,255,255,0.06)"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
            <span style={{color:"white",fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:600,flex:1}}>{g.name}</span>
            <span style={{color:"#6e7191",fontSize:10,fontFamily:"'DM Mono',monospace"}}>{g.strands.length} strands</span>
            <span style={{color:"#f5b731",fontSize:10,fontFamily:"'DM Mono',monospace"}}>~{tokenCount(assemblePrompt(g.strands))}t</span>
          </div>
          <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:8}}>
            {g.strands.map((s,i)=>(
              <span key={i} style={{background:`${STRAND_TYPES[s.type]?.color}18`,color:STRAND_TYPES[s.type]?.color,
                fontSize:9,fontFamily:"'DM Mono',monospace",padding:"2px 6px",borderRadius:3}}>
                {STRAND_TYPES[s.type]?.icon}
              </span>
            ))}
          </div>
          <div style={{display:"flex",gap:6}}>
            <button onClick={()=>onLoad(g.strands)}
              style={{background:"#22d3ee18",border:"1px solid #22d3ee33",color:"#22d3ee",borderRadius:5,
                padding:"4px 10px",fontSize:11,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>
              Load
            </button>
            <button onClick={()=>exportGenome(g)}
              style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",color:"#6e7191",
                borderRadius:5,padding:"4px 10px",fontSize:11,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>
              Export JSON
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function DiffViewer({ savedGenomes }) {
  const [idA, setIdA] = useState(savedGenomes[0]?.id||"");
  const [idB, setIdB] = useState(savedGenomes[1]?.id||"");
  const [merged, setMerged] = useState(null);

  const gA = savedGenomes.find(g=>g.id===idA);
  const gB = savedGenomes.find(g=>g.id===idB);

  const diff = useMemo(()=>{
    if (!gA||!gB) return {added:[],removed:[],shared:[]};
    const typesA = gA.strands.map(s=>s.type+":"+s.content.slice(0,30));
    const typesB = gB.strands.map(s=>s.type+":"+s.content.slice(0,30));
    const setA = new Set(typesA), setB = new Set(typesB);
    return {
      added: gB.strands.filter(s=>!setA.has(s.type+":"+s.content.slice(0,30))),
      removed: gA.strands.filter(s=>!setB.has(s.type+":"+s.content.slice(0,30))),
      shared: gA.strands.filter(s=>setB.has(s.type+":"+s.content.slice(0,30))),
    };
  },[gA,gB]);

  const similarity = useMemo(()=>{
    if (!gA||!gB) return 0;
    const total = new Set([...gA.strands, ...gB.strands].map(s=>s.type+s.content.slice(0,20))).size;
    return total ? Math.round(diff.shared.length/total*100) : 0;
  },[diff,gA,gB]);

  const merge = () => {
    if (!gA||!gB) return;
    const seen = new Set();
    const all = [...gA.strands,...gB.strands].filter(s=>{
      const k=s.type+s.content.slice(0,20);
      if(seen.has(k))return false; seen.add(k); return true;
    });
    setMerged(all);
  };

  const SelectStyle = { background:"#16161e",border:"1px solid rgba(255,255,255,0.08)",borderRadius:6,
    color:"white",padding:"6px 10px",fontSize:12,fontFamily:"'DM Mono',monospace",outline:"none",width:"100%" };

  return (
    <div style={{padding:14,display:"flex",flexDirection:"column",gap:12}}>
      <div style={{display:"flex",gap:8}}>
        <select value={idA} onChange={e=>setIdA(e.target.value)} style={SelectStyle}>
          {savedGenomes.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
        <span style={{color:"#6e7191",alignSelf:"center",fontFamily:"'DM Mono',monospace"}}>vs</span>
        <select value={idB} onChange={e=>setIdB(e.target.value)} style={SelectStyle}>
          {savedGenomes.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
      </div>

      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{flex:1,height:4,background:"#16161e",borderRadius:2,overflow:"hidden"}}>
          <div style={{width:`${similarity}%`,height:"100%",background:"linear-gradient(90deg,#a78bfa,#22d3ee)",borderRadius:2}}/>
        </div>
        <span style={{color:"#22d3ee",fontFamily:"'DM Mono',monospace",fontSize:12,fontWeight:700}}>{similarity}% similar</span>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:5}}>
        {diff.shared.map((s,i)=>(
          <div key={i} style={{background:"rgba(255,255,255,0.03)",borderRadius:6,padding:"7px 10px",
            border:"1px solid rgba(255,255,255,0.05)",fontSize:11,color:"#c4c4d4",fontFamily:"'DM Mono',monospace"}}>
            <span style={{color:STRAND_TYPES[s.type]?.color,marginRight:6}}>{STRAND_TYPES[s.type]?.icon}</span>
            {s.content.slice(0,60)}…
          </div>
        ))}
        {diff.added.map((s,i)=>(
          <div key={i} style={{background:"#4ade8010",borderRadius:6,padding:"7px 10px",
            border:"1px solid #4ade8030",fontSize:11,color:"#4ade80",fontFamily:"'DM Mono',monospace"}}>
            <span style={{marginRight:6}}>+ {STRAND_TYPES[s.type]?.icon}</span>
            {s.content.slice(0,60)}…
          </div>
        ))}
        {diff.removed.map((s,i)=>(
          <div key={i} style={{background:"#ef444410",borderRadius:6,padding:"7px 10px",
            border:"1px solid #ef444430",fontSize:11,color:"#ef4444",fontFamily:"'DM Mono',monospace"}}>
            <span style={{marginRight:6}}>− {STRAND_TYPES[s.type]?.icon}</span>
            {s.content.slice(0,60)}…
          </div>
        ))}
      </div>

      <button onClick={merge}
        style={{background:"linear-gradient(90deg,#a78bfa22,#22d3ee22)",border:"1px solid #a78bfa44",color:"#a78bfa",
          borderRadius:7,padding:"9px",fontFamily:"'DM Mono',monospace",fontSize:12,cursor:"pointer"}}>
        🔀 Merge Genomes
      </button>

      {merged && (
        <div style={{background:"#16161e",borderRadius:9,padding:12,border:"1px solid #22d3ee33"}}>
          <p style={{color:"#22d3ee",fontSize:11,fontFamily:"'DM Mono',monospace",margin:"0 0 6px"}}>
            Merged: {merged.length} unique strands
          </p>
          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
            {merged.map((s,i)=>(
              <span key={i} style={{background:`${STRAND_TYPES[s.type]?.color}22`,color:STRAND_TYPES[s.type]?.color,
                fontSize:9,fontFamily:"'DM Mono',monospace",padding:"2px 6px",borderRadius:3}}>
                {STRAND_TYPES[s.type]?.icon} {s.type}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AnalyticsTab({ strands, savedGenomes }) {
  const allStrands = useMemo(() => [...strands, ...savedGenomes.flatMap(g=>g.strands)], [strands, savedGenomes]);
  const typeCounts = useMemo(()=>{
    const m = {};
    allStrands.forEach(s=>{ m[s.type]=(m[s.type]||0)+1; });
    return m;
  },[allStrands]);

  const total = Object.values(typeCounts).reduce((a,b)=>a+b,0)||1;

  // SVG donut
  let cumAngle = -Math.PI/2;
  const donutSegs = Object.entries(typeCounts).map(([type,count])=>{
    const frac = count/total;
    const angle = frac*2*Math.PI;
    const startAngle = cumAngle;
    cumAngle += angle;
    const R=50, r=30;
    const x1=60+R*Math.cos(startAngle), y1=60+R*Math.sin(startAngle);
    const x2=60+R*Math.cos(cumAngle), y2=60+R*Math.sin(cumAngle);
    const ix1=60+r*Math.cos(startAngle), iy1=60+r*Math.sin(startAngle);
    const ix2=60+r*Math.cos(cumAngle), iy2=60+r*Math.sin(cumAngle);
    const large=angle>Math.PI?1:0;
    const d=`M${x1},${y1} A${R},${R} 0 ${large},1 ${x2},${y2} L${ix2},${iy2} A${r},${r} 0 ${large},0 ${ix1},${iy1} Z`;
    return { type, count, d, color:STRAND_TYPES[type]?.color||"#888" };
  });

  const insights = [
    "You use Persona strands 3× more than average users.",
    "Constraint strands improve output quality by ~28%.",
    "Genomes with 4-6 strands score highest on clarity.",
    "Adding Example strands cuts hallucination by ~15%.",
  ];

  return (
    <div style={{padding:16,display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
        {[["Total Genomes",savedGenomes.length,"#a78bfa"],["Total Strands",allStrands.length,"#22d3ee"],
          ["Avg Length",savedGenomes.length?Math.round(allStrands.length/savedGenomes.length):0,"#f5b731"],
          ["Session",`${new Date().getHours()}:${String(new Date().getMinutes()).padStart(2,"0")}h`,"#4ade80"]].map(([l,v,c])=>(
          <div key={l} style={{flex:"1 1 100px",background:"#16161e",borderRadius:9,padding:"12px 14px",
            border:`1px solid ${c}22`,textAlign:"center"}}>
            <div style={{color:c,fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800}}>{v}</div>
            <div style={{color:"#6e7191",fontSize:10,fontFamily:"'DM Mono',monospace",marginTop:2}}>{l}</div>
          </div>
        ))}
      </div>

      <div style={{display:"flex",gap:14,alignItems:"flex-start",flexWrap:"wrap"}}>
        <div style={{background:"#16161e",borderRadius:10,padding:"14px",border:"1px solid rgba(255,255,255,0.06)",flex:"0 0 auto"}}>
          <p style={{color:"#6e7191",fontSize:10,fontFamily:"'DM Mono',monospace",margin:"0 0 10px",letterSpacing:1}}>STRAND TYPE DISTRIBUTION</p>
          <svg width="120" height="120" viewBox="0 0 120 120">
            {total>1 ? donutSegs.map((s,i)=>(
              <path key={i} d={s.d} fill={s.color} opacity="0.85">
                <animate attributeName="opacity" values="0;0.85" dur="0.6s" begin={`${i*0.1}s`} fill="freeze"/>
              </path>
            )) : <circle cx="60" cy="60" r="50" fill="rgba(255,255,255,0.05)"/>}
            <text x="60" y="65" textAnchor="middle" fill="white" fontSize="14" fontFamily="Syne,sans-serif" fontWeight="700">{total}</text>
          </svg>
          <div style={{display:"flex",flexDirection:"column",gap:3,marginTop:8}}>
            {donutSegs.map((s,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:6}}>
                <div style={{width:8,height:8,borderRadius:2,background:s.color,flexShrink:0}}/>
                <span style={{color:"#c4c4d4",fontSize:10,fontFamily:"'DM Mono',monospace",flex:1}}>{s.type}</span>
                <span style={{color:s.color,fontSize:10,fontFamily:"'DM Mono',monospace"}}>{s.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{flex:1,display:"flex",flexDirection:"column",gap:10}}>
          {Object.entries(typeCounts).map(([type,count])=>(
            <div key={type}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                <span style={{color:STRAND_TYPES[type]?.color,fontSize:11,fontFamily:"'DM Mono',monospace"}}>
                  {STRAND_TYPES[type]?.icon} {type}
                </span>
                <span style={{color:"#6e7191",fontSize:11,fontFamily:"'DM Mono',monospace"}}>{count}</span>
              </div>
              <div style={{height:6,background:"#0e0e16",borderRadius:3,overflow:"hidden"}}>
                <div style={{width:`${count/total*100}%`,height:"100%",background:STRAND_TYPES[type]?.color,
                  borderRadius:3,transition:"width 0.8s ease"}}>
                  <animate attributeName="width" from="0%" to={`${count/total*100}%`} dur="1s" fill="freeze"/>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{background:"#16161e",borderRadius:10,padding:14,border:"1px solid rgba(167,139,250,0.2)"}}>
        <p style={{color:"#a78bfa",fontSize:10,fontFamily:"'DM Mono',monospace",margin:"0 0 10px",letterSpacing:1}}>💡 INSIGHTS</p>
        {insights.map((ins,i)=>(
          <div key={i} style={{display:"flex",gap:8,marginBottom:i<insights.length-1?8:0}}>
            <span style={{color:"#a78bfa",flexShrink:0}}>→</span>
            <span style={{color:"#c4c4d4",fontSize:12,fontFamily:"'DM Mono',monospace",lineHeight:1.4}}>{ins}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function PromptDNA() {
  const [strands, setStrands] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [paletteSearch, setPaletteSearch] = useState("");
  const [activeTab, setActiveTab] = useState("canvas"); // canvas | evolve | genomes | compare | stats
  const [savedGenomes, setSavedGenomes] = useState(SAVED_GENOMES);
  const [notification, setNotification] = useState(null);

  const notify = useCallback((msg, color="#4ade80") => {
    setNotification({ msg, color });
    setTimeout(() => setNotification(null), 2500);
  }, []);

  const addStrand = useCallback((type, content) => {
    setStrands(prev => [...prev, { id: uid(), type, content }]);
    notify(`${STRAND_TYPES[type].icon} ${type} strand added`);
  }, [notify]);

  const selectedStrand = useMemo(()=>strands.find(s=>s.id===selectedId)||null,[strands,selectedId]);

  const updateStrand = useCallback((updated) => {
    setStrands(prev=>prev.map(s=>s.id===updated.id?updated:s));
  }, []);

  const deleteStrand = useCallback((id) => {
    setStrands(prev=>prev.filter(s=>s.id!==id));
    setSelectedId(p=>p===id?null:p);
  }, []);

  const mutateStrand = useCallback((id) => {
    setStrands(prev=>prev.map(s=>{
      if (s.id!==id) return s;
      const vars = MUTATION_VARIANTS[s.type]||[];
      const next = vars[Math.floor(Math.random()*vars.length)]||s.content;
      return {...s, content:next};
    }));
    notify("⚡ Strand mutated");
  }, [notify]);

  const moveStrand = useCallback((index, dir) => {
    setStrands(prev=>{
      const arr=[...prev];
      const target=index+dir;
      if(target<0||target>=arr.length) return arr;
      [arr[index],arr[target]]=[arr[target],arr[index]];
      return arr;
    });
  }, []);

  const saveGenome = useCallback((name) => {
    if (!strands.length) return notify("Add strands first","#ef4444");
    setSavedGenomes(prev=>[...prev,{id:uid(),name,strands:[...strands]}]);
    notify("💾 Genome saved");
  }, [strands, notify]);

  const loadGenome = useCallback((strandList) => {
    setStrands(strandList.map(s=>({...s,id:uid()})));
    setSelectedId(null);
    setActiveTab("canvas");
    notify("📂 Genome loaded");
  }, [notify]);

  const TABS = [
    { id:"canvas",  label:"🧬 Canvas" },
    { id:"evolve",  label:"⚡ Evolve" },
    { id:"genomes", label:"💾 Genomes" },
    { id:"compare", label:"📊 Compare" },
    { id:"stats",   label:"📈 Stats" },
  ];

  return (
    <div style={{
      minHeight:"100vh",
      background:"#0e0e16",
      color:"white",
      fontFamily:"'DM Mono',monospace",
      display:"flex",
      flexDirection:"column",
    }}>
      {/* Notification toast */}
      {notification && (
        <div style={{
          position:"fixed",bottom:24,right:24,zIndex:999,
          background:"#16161e",border:`1px solid ${notification.color}55`,
          borderRadius:10,padding:"10px 18px",
          color:notification.color,fontFamily:"'DM Mono',monospace",fontSize:13,
          boxShadow:`0 4px 24px ${notification.color}22`,
          animation:"slideUp 0.25s ease",
        }}>
          {notification.msg}
        </div>
      )}

      <HeroHeader/>

      {/* DNA VISUALIZER */}
      <div style={{padding:"16px 20px 0"}}>
        <DNAVisualizer strands={strands} selectedId={selectedId} onSelect={setSelectedId}/>
      </div>

      {/* MAIN WORKSPACE */}
      <div style={{display:"flex",flex:1,gap:0,minHeight:0,overflow:"hidden"}}>

        {/* LEFT: Palette */}
        <div style={{
          width:240,
          flexShrink:0,
          borderRight:"1px solid rgba(255,255,255,0.07)",
          display:"flex",
          flexDirection:"column",
          overflowY:"auto",
          background:"#0e0e16",
        }}>
          <StrandPalette onAddStrand={addStrand} searchQuery={paletteSearch} setSearchQuery={setPaletteSearch}/>
        </div>

        {/* CENTER: Tabs + Content */}
        <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0}}>
          {/* Tab bar */}
          <div style={{display:"flex",borderBottom:"1px solid rgba(255,255,255,0.07)",background:"#0e0e16",padding:"0 16px",gap:2,flexShrink:0}}>
            {TABS.map(t=>(
              <button key={t.id} onClick={()=>setActiveTab(t.id)}
                style={{
                  background:"none",border:"none",padding:"12px 16px",
                  color: activeTab===t.id?"white":"#6e7191",
                  borderBottom: activeTab===t.id?"2px solid #a78bfa":"2px solid transparent",
                  fontFamily:"'DM Mono',monospace",fontSize:12,cursor:"pointer",
                  transition:"color 0.15s",whiteSpace:"nowrap",
                }}>
                {t.label}
              </button>
            ))}
            <div style={{flex:1}}/>
            <div style={{display:"flex",alignItems:"center",gap:8,padding:"0 8px"}}>
              <span style={{color:"#6e7191",fontSize:11}}>{strands.length} strand{strands.length!==1?"s":""}</span>
              <button onClick={()=>setStrands([])}
                style={{background:"#ef444418",border:"1px solid #ef444433",color:"#ef4444",borderRadius:5,
                  padding:"4px 10px",fontSize:11,fontFamily:"'DM Mono',monospace",cursor:"pointer"}}>
                Clear All
              </button>
            </div>
          </div>

          {/* Tab content */}
          <div style={{flex:1,overflowY:"auto"}}>
            {activeTab==="canvas" && (
              <AssemblyCanvas strands={strands} selectedId={selectedId}
                onSelect={setSelectedId} onDelete={deleteStrand}
                onMutate={mutateStrand}
                onMoveUp={(i)=>moveStrand(i,-1)}
                onMoveDown={(i)=>moveStrand(i,1)}/>
            )}
            {activeTab==="evolve" && (
              <EvolutionEngine strands={strands} onApply={(s)=>{setStrands(s.map(x=>({...x,id:uid()})));setActiveTab("canvas");notify("🧬 Variant applied");}}/>
            )}
            {activeTab==="genomes" && (
              <GenomeLibrary strands={strands} savedGenomes={savedGenomes} onLoad={loadGenome} onSave={saveGenome}/>
            )}
            {activeTab==="compare" && (
              <DiffViewer savedGenomes={savedGenomes}/>
            )}
            {activeTab==="stats" && (
              <AnalyticsTab strands={strands} savedGenomes={savedGenomes}/>
            )}
          </div>
        </div>

        {/* RIGHT: Inspector */}
        <div style={{
          width:260,
          flexShrink:0,
          borderLeft:"1px solid rgba(255,255,255,0.07)",
          display:"flex",
          flexDirection:"column",
          background:"#0e0e16",
        }}>
          <div style={{padding:"12px 14px 8px",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
            <span style={{color:"#6e7191",fontSize:10,fontFamily:"'DM Mono',monospace",letterSpacing:1}}>STRAND INSPECTOR</span>
          </div>
          <StrandInspector
            strand={selectedStrand}
            onUpdate={updateStrand}
            onSave={()=>{
              if(!selectedStrand) return;
              notify("✨ Custom strand saved to palette");
            }}
          />
        </div>
      </div>

      {/* BOTTOM: Live Preview */}
      <LivePreview strands={strands}/>

      {/* Global animation keyframe */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(16px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: #0e0e16; }
        ::-webkit-scrollbar-thumb { background: #2d2d42; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #a78bfa55; }
        input[type=range] { height: 4px; border-radius: 2px; }
      `}</style>
    </div>
  );
}
