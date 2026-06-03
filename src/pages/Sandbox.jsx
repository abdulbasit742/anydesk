import { useState, useEffect, useRef } from 'react';
import { PLATFORMS } from '../data/constants';

const MODELS = [
  { id: 'claude-3-5-sonnet', label: 'Claude 3.5 Sonnet', platform: 'claude', tokens: 200000 },
  { id: 'gpt-4o',            label: 'GPT-4o',            platform: 'cursor', tokens: 128000 },
  { id: 'gemini-2-flash',    label: 'Gemini 2 Flash',    platform: 'bolt',   tokens: 100000 },
  { id: 'qwen-2',            label: 'Qwen 2.5 Coder',    platform: 'manus',  tokens: 131072 },
];

const SAMPLE_PROMPTS = [
  'Create a responsive navbar with dark mode toggle',
  'Write a React hook for debouncing values',
  'Build a CSS-only animated loading spinner',
  'Create a TypeScript interface for a user object',
  'Write unit tests for a sum function',
];

function TypewriterText({ text, speed = 12 }) {
  const [displayed, setDisplayed] = useState('');
  const idx = useRef(0);

  useEffect(() => {
    setTimeout(() => setDisplayed(''), 0);
    idx.current = 0;
    if (!text) return;
    const iv = setInterval(() => {
      if (idx.current < text.length) {
        setDisplayed(prev => prev + text[idx.current]);
        idx.current++;
      } else {
        clearInterval(iv);
      }
    }, speed);
    return () => clearInterval(iv);
  }, [text, speed]);

  return displayed;
}

function generateResponse(prompt, model, temp) {
  const p = PLATFORMS.find(pl => pl.id === model.platform);
  const creativity = temp > 0.7 ? 'creative and exploratory' : temp > 0.3 ? 'balanced' : 'precise and deterministic';
  return `// Response from ${model.label} (${p?.name}) — temp: ${temp}
// Creativity mode: ${creativity}

${prompt.toLowerCase().includes('react') || prompt.toLowerCase().includes('hook') ? `import { useState, useEffect } from 'react';

export function useCustomHook(value, delay = 300) {
  const [state, setState] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => setState(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return state;
}` : prompt.toLowerCase().includes('css') || prompt.toLowerCase().includes('spinner') ? `.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255,255,255,0.1);
  border-top-color: #f5b731;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}` : `// Generated solution for: "${prompt}"
function solution(input) {
  // ${creativity} approach
  const result = processInput(input);
  return {
    success: true,
    data: result,
    timestamp: Date.now(),
  };
}

function processInput(input) {
  if (!input) throw new Error('Input required');
  return input.toString().trim();
}

export default solution;`}

// ✓ Generated in ${(Math.random() * 1.5 + 0.3).toFixed(2)}s
// Tokens used: ~${Math.floor(prompt.length * 0.35 + 180)}`;
}

export default function Sandbox() {
  const [prompt, setPrompt]       = useState('');
  const [output, setOutput]       = useState('');
  const [model, setModel]         = useState(MODELS[0]);
  const [temperature, setTemperature] = useState(0.5);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [typewriterSpeed, setTypewriterSpeed] = useState(8);
  const [running, setRunning]     = useState(false);
  const [history, setHistory]     = useState([]);
  const [historySearch, setHistorySearch] = useState('');
  const [activeHistory, setActiveHistory] = useState(null);
  const textRef = useRef(null);

  const handleRun = async () => {
    if (!prompt.trim() || running) return;
    setRunning(true);
    setOutput('');
    setActiveHistory(null);
    await new Promise(r => setTimeout(r, 600 + Math.random() * 800));
    const result = generateResponse(prompt, model, temperature);
    setOutput(result);
    setHistory(prev => [{
      id: Date.now().toString(),
      prompt: prompt.slice(0, 60) + (prompt.length > 60 ? '…' : ''),
      model: model.label,
      ts: new Date().toISOString(),
      output: result,
    }, ...prev].slice(0, 20));
    setRunning(false);
  };

  const loadHistory = (h) => {
    setPrompt(h.prompt);
    setOutput(h.output);
    setActiveHistory(h.id);
  };

  const autoResize = () => {
    const el = textRef.current;
    if (el) { el.style.height = 'auto'; el.style.height = Math.min(300, el.scrollHeight) + 'px'; }
  };

  const filteredHistory = history.filter(h =>
    h.prompt.toLowerCase().includes(historySearch.toLowerCase()) ||
    h.model.toLowerCase().includes(historySearch.toLowerCase()) ||
    h.output.toLowerCase().includes(historySearch.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, height: '100%' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background: 'linear-gradient(135deg,rgba(167,139,250,.18),rgba(6,182,212,.12))', border: '1px solid rgba(167,139,250,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🧪</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: '-.4px' }}>AI Sandbox</div>
            <div style={{ fontSize: 9.5, color: 'var(--muted)', fontFamily: 'DM Mono,monospace' }}>Prompt playground & output preview</div>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 14, flex: 1, alignItems: 'start' }}>

        {/* Left: Editor + Output */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Config bar */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 12, padding: '10px 14px' }}>
            <div>
              <div style={{ fontSize: 9, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 4 }}>Model</div>
              <select value={model.id} onChange={e => setModel(MODELS.find(m => m.id === e.target.value))}
                style={{ background: 'var(--surface3)', border: '1px solid var(--border)', borderRadius: 7, padding: '4px 8px', color: '#e4e4ed', fontSize: 11, outline: 'none', cursor: 'pointer' }}>
                {MODELS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize: 9, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 4 }}>
                Temperature: <span style={{ color: 'var(--gold)' }}>{temperature}</span>
              </div>
              <input type="range" min="0" max="1" step="0.1" value={temperature}
                onChange={e => setTemperature(parseFloat(e.target.value))}
                style={{ width: 100, accentColor: 'var(--gold)', cursor: 'pointer' }} />
            </div>
            <div>
              <div style={{ fontSize: 9, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 4 }}>
                Max tokens: <span style={{ color: 'var(--teal)' }}>{maxTokens}</span>
              </div>
              <input type="range" min="256" max="8192" step="256" value={maxTokens}
                onChange={e => setMaxTokens(parseInt(e.target.value))}
                style={{ width: 100, accentColor: 'var(--teal)', cursor: 'pointer' }} />
            </div>
            <div>
              <div style={{ fontSize: 9, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 4 }}>
                Type Rate: <span style={{ color: 'var(--purple)' }}>{typewriterSpeed}ms</span>
              </div>
              <input type="range" min="1" max="50" step="1" value={typewriterSpeed}
                onChange={e => setTypewriterSpeed(parseInt(e.target.value))}
                style={{ width: 100, accentColor: 'var(--purple)', cursor: 'pointer' }} />
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => { setPrompt(''); setOutput(''); }} style={{ fontSize: 10 }}>🗑 Clear</button>
              <button className={`btn btn-gold btn-sm ${running ? 'btn-pulse' : ''}`} onClick={handleRun} disabled={running || !prompt.trim()} style={{ fontSize: 11, minWidth: 80 }}>
                {running ? '⟳ Running…' : '▶ Run'}
              </button>
            </div>
          </div>

          {/* Prompt editor */}
          <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '8px 14px', background: 'rgba(0,0,0,0.15)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--muted2)' }}>💬 Prompt</span>
              <span style={{ fontSize: 9, color: 'var(--muted)', fontFamily: 'DM Mono,monospace' }}>~{Math.ceil(prompt.split(/\s+/).filter(Boolean).length * 1.35)} tokens</span>
            </div>
            <textarea ref={textRef} value={prompt} onChange={e => { setPrompt(e.target.value); autoResize(); }}
              onInput={autoResize}
              onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleRun(); }}
              placeholder="Enter your prompt here… (Ctrl+Enter to run)"
              style={{ width: '100%', boxSizing: 'border-box', background: 'transparent', border: 'none', outline: 'none', color: '#dde0f0', fontSize: 12.5, fontFamily: 'DM Mono,monospace', lineHeight: 1.7, resize: 'none', padding: '12px 14px', minHeight: 100 }}
              rows={4}
            />
          </div>

          {/* Quick prompt pills */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {SAMPLE_PROMPTS.map(p => (
              <button key={p} onClick={() => { setPrompt(p); setOutput(''); }}
                style={{ fontSize: 9.5, padding: '4px 10px', borderRadius: 99, border: '1px solid var(--border)', background: 'var(--surface2)', color: 'var(--muted2)', cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted2)'; }}>
                {p.slice(0, 35)}{p.length > 35 ? '…' : ''}
              </button>
            ))}
          </div>

          {/* Output */}
          {(output || running) && (
            <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ padding: '8px 14px', background: 'rgba(0,0,0,0.15)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--teal)' }}>⚡ Output — {model.label}</span>
                  {running && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--teal)', animation: 'pulse 0.8s infinite', display: 'inline-block' }} />}
                </div>
                {output && <button className="btn btn-ghost btn-xs" onClick={() => navigator.clipboard?.writeText(output)} style={{ fontSize: 9.5 }}>📋 Copy</button>}
              </div>
              <pre style={{ margin: 0, padding: '14px 16px', color: '#c8d0e8', fontSize: 11.5, fontFamily: 'DM Mono,monospace', lineHeight: 1.8, whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxHeight: 400, overflowY: 'auto' }}>
                {running ? <span style={{ color: 'var(--muted)' }}>Generating response…<span style={{ animation: 'pulse 1s infinite', display: 'inline-block' }}> ▌</span></span>
                  : <TypewriterText text={output} speed={typewriterSpeed} />}
              </pre>
            </div>
          )}
        </div>

        {/* Right: History */}
        <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', position: 'sticky', top: 0 }}>
          <div style={{ padding: '12px 16px', background: 'rgba(0,0,0,0.15)', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div>
                <div style={{ fontSize: 11.5, fontWeight: 800, color: '#fff' }}>🕐 Run History</div>
                <div style={{ fontSize: 9.5, color: 'var(--muted)', marginTop: 1 }}>{filteredHistory.length} of {history.length} runs</div>
              </div>
            </div>
            <input type="text" placeholder="Search history..." value={historySearch} onChange={e => setHistorySearch(e.target.value)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                background: 'var(--surface3)',
                border: '1px solid var(--border)',
                borderRadius: 6,
                padding: '4px 8px',
                color: '#fff',
                fontSize: 10,
                outline: 'none',
              }}
            />
          </div>
          {filteredHistory.length === 0 ? (
            <div style={{ padding: '30px 16px', textAlign: 'center', color: 'var(--muted)', fontSize: 11 }}>
              {history.length === 0 ? 'Run a prompt to see history' : 'No matching runs found'}
            </div>
          ) : (
            <div style={{ maxHeight: 500, overflowY: 'auto' }}>
              {filteredHistory.map(h => (
                <div key={h.id} onClick={() => loadHistory(h)}
                  style={{
                    padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.03)',
                    cursor: 'pointer', transition: 'background 0.15s',
                    background: activeHistory === h.id ? 'rgba(245,183,49,0.06)' : 'transparent',
                    borderLeft: activeHistory === h.id ? '2px solid var(--gold)' : '2px solid transparent',
                  }}
                  onMouseEnter={e => { if (activeHistory !== h.id) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                  onMouseLeave={e => { if (activeHistory !== h.id) e.currentTarget.style.background = 'transparent'; }}>
                  <div style={{ fontSize: 10.5, color: '#dde0f0', fontWeight: 600, lineHeight: 1.3, marginBottom: 3 }}>{h.prompt}</div>
                  <div style={{ fontSize: 9, color: 'var(--muted)', fontFamily: 'DM Mono,monospace' }}>{h.model} · {new Date(h.ts).toLocaleTimeString()}</div>
                </div>
              ))}
            </div>
          )}
          {history.length > 0 && (
            <div style={{ padding: '8px 14px', borderTop: '1px solid var(--border)' }}>
              <button className="btn btn-ghost btn-xs" onClick={() => setHistory([])} style={{ fontSize: 9.5, width: '100%', justifyContent: 'center' }}>🗑 Clear History</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
