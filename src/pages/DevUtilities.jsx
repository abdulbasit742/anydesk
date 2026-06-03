import { useState, useCallback, useRef, useEffect } from 'react';

// ─── CSS Variables (inline fallback map) ────────────────────────────────────
const V = {
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
  text:     '#e2e8f0',
  textDim:  '#94a3b8',
};

// ─── Utility helpers ─────────────────────────────────────────────────────────

// Uint8Array → hex string
const bufToHex = (buf) =>
  Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

async function sha(algo, text) {
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest(algo, enc.encode(text));
  return bufToHex(buf);
}

// Simple djb2-based "MD5-like" (not cryptographic)
function pseudoMD5(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0').repeat(4);
}

// HEX ↔ RGB ↔ HSL ↔ HSV ↔ CMYK conversions
function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
function rgbToHsl({ r, g, b }) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      default: h = ((r - g) / d + 4) / 6;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}
function rgbToHsv({ r, g, b }) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  if (d !== 0) {
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      default: h = ((r - g) / d + 4) / 6;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(max * 100) };
}
function rgbToCmyk({ r, g, b }) {
  r /= 255; g /= 255; b /= 255;
  const k = 1 - Math.max(r, g, b);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  return {
    c: Math.round(((1 - r - k) / (1 - k)) * 100),
    m: Math.round(((1 - g - k) / (1 - k)) * 100),
    y: Math.round(((1 - b - k) / (1 - k)) * 100),
    k: Math.round(k * 100),
  };
}
function luminance({ r, g, b }) {
  const sRGB = [r, g, b].map(c => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
}
function contrastRatio(hex1, hex2) {
  const l1 = luminance(hexToRgb(hex1));
  const l2 = luminance(hexToRgb(hex2));
  const lighter = Math.max(l1, l2), darker = Math.min(l1, l2);
  return ((lighter + 0.05) / (darker + 0.05)).toFixed(2);
}
function generateShades(hex) {
  const { r, g, b } = hexToRgb(hex);
  const { h, s } = rgbToHsl({ r, g, b });
  const shades = [];
  for (let i = 9; i >= 1; i--) {
    const l = Math.round((i / 10) * 95);
    shades.push(`hsl(${h},${s}%,${l}%)`);
  }
  return shades;
}

// Simple line-by-line diff
function computeDiff(a, b) {
  const aLines = a.split('\n');
  const bLines = b.split('\n');
  const result = [];
  const maxLen = Math.max(aLines.length, bLines.length);
  let added = 0, removed = 0;
  for (let i = 0; i < maxLen; i++) {
    const al = aLines[i];
    const bl = bLines[i];
    if (al === undefined) { result.push({ type: 'added', text: bl }); added++; }
    else if (bl === undefined) { result.push({ type: 'removed', text: al }); removed++; }
    else if (al === bl) { result.push({ type: 'same', text: al }); }
    else { result.push({ type: 'removed', text: al }, { type: 'added', text: bl }); removed++; added++; }
  }
  return { result, added, removed };
}

// JSON → YAML (simple)
function jsonToYaml(obj, indent = 0) {
  const pad = '  '.repeat(indent);
  if (Array.isArray(obj)) {
    return obj.map(v => `${pad}- ${typeof v === 'object' ? '\n' + jsonToYaml(v, indent + 1) : v}`).join('\n');
  }
  if (typeof obj === 'object' && obj !== null) {
    return Object.entries(obj)
      .map(([k, v]) => {
        if (typeof v === 'object' && v !== null)
          return `${pad}${k}:\n${jsonToYaml(v, indent + 1)}`;
        return `${pad}${k}: ${v}`;
      })
      .join('\n');
  }
  return `${pad}${obj}`;
}

function sortKeysDeep(obj) {
  if (Array.isArray(obj)) return obj.map(sortKeysDeep);
  if (typeof obj === 'object' && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => [k, sortKeysDeep(v)])
    );
  }
  return obj;
}

// Case converters
const toCamel = s => s.toLowerCase().replace(/[^a-z0-9]+(.)/g, (_, c) => c.toUpperCase());
const toSnake = s => s.replace(/\s+/g, '_').replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
const toPascal = s => toCamel(s).replace(/^./, c => c.toUpperCase());
const toTitle = s => s.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());

// Basic code formatter
function formatCode(code, lang) {
  if (lang === 'json') {
    try { return JSON.stringify(JSON.parse(code), null, 2); } catch { return code; }
  }
  if (lang === 'html') {
    let depth = 0;
    return code
      .replace(/>\s*</g, '>\n<')
      .split('\n')
      .map(line => {
        line = line.trim();
        if (!line) return '';
        if (line.match(/^<\//) || line.match(/^<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)/i)) {
          if (line.match(/^<\//)) depth = Math.max(0, depth - 1);
          return '  '.repeat(depth) + line;
        }
        const result = '  '.repeat(depth) + line;
        if (!line.match(/<.*\/>/)) depth++;
        return result;
      })
      .join('\n');
  }
  if (lang === 'css') {
    return code
      .replace(/\s*\{\s*/g, ' {\n  ')
      .replace(/;\s*/g, ';\n  ')
      .replace(/\s*\}\s*/g, '\n}\n')
      .trim();
  }
  // JS: basic indent fix
  let depth = 0;
  return code
    .split('\n')
    .map(line => {
      line = line.trim();
      if (!line) return '';
      if (line.startsWith('}') || line.startsWith(')') || line.startsWith(']')) depth = Math.max(0, depth - 1);
      const result = '  '.repeat(depth) + line;
      if (line.endsWith('{') || line.endsWith('(') || line.endsWith('[')) depth++;
      return result;
    })
    .join('\n');
}

// ─── Shared UI primitives ────────────────────────────────────────────────────

const Btn = ({ onClick, children, variant = 'default', style: s = {} }) => {
  const [hov, setHov] = useState(false);
  const base = {
    padding: '8px 18px',
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
    fontFamily: "'DM Mono', monospace",
    fontSize: 13,
    fontWeight: 600,
    transition: 'all 0.18s ease',
    ...s,
  };
  const variants = {
    default: {
      background: hov ? V.surface3 : V.surface2,
      color: V.text,
      border: `1px solid ${hov ? V.teal : V.border}`,
      boxShadow: hov ? `0 0 12px ${V.teal}33` : 'none',
    },
    gold: {
      background: hov ? `${V.gold}22` : `${V.gold}11`,
      color: V.gold,
      border: `1px solid ${hov ? V.gold : `${V.gold}55`}`,
      boxShadow: hov ? `0 0 14px ${V.gold}44` : 'none',
    },
    teal: {
      background: hov ? `${V.teal}22` : `${V.teal}11`,
      color: V.teal,
      border: `1px solid ${hov ? V.teal : `${V.teal}55`}`,
      boxShadow: hov ? `0 0 14px ${V.teal}44` : 'none',
    },
    red: {
      background: hov ? `${V.red}22` : `${V.red}11`,
      color: V.red,
      border: `1px solid ${hov ? V.red : `${V.red}55`}`,
      boxShadow: hov ? `0 0 14px ${V.red}44` : 'none',
    },
    purple: {
      background: hov ? `${V.purple}22` : `${V.purple}11`,
      color: V.purple,
      border: `1px solid ${hov ? V.purple : `${V.purple}55`}`,
      boxShadow: hov ? `0 0 14px ${V.purple}44` : 'none',
    },
  };
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ ...base, ...variants[variant] }}
    >
      {children}
    </button>
  );
};

const Textarea = ({ value, onChange, placeholder, rows = 8, error = false, style: s = {}, readOnly = false }) => (
  <textarea
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    readOnly={readOnly}
    rows={rows}
    style={{
      width: '100%',
      background: V.surface,
      border: `1px solid ${error ? V.red : V.border}`,
      borderRadius: 10,
      color: error ? V.red : V.text,
      fontFamily: "'DM Mono', monospace",
      fontSize: 13,
      padding: '12px 14px',
      resize: 'vertical',
      outline: 'none',
      boxSizing: 'border-box',
      lineHeight: 1.6,
      boxShadow: error ? `0 0 10px ${V.red}22` : 'none',
      ...s,
    }}
  />
);

const Input = ({ value, onChange, placeholder, style: s = {}, type = 'text' }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    style={{
      background: V.surface,
      border: `1px solid ${V.border}`,
      borderRadius: 8,
      color: V.text,
      fontFamily: "'DM Mono', monospace",
      fontSize: 13,
      padding: '9px 13px',
      outline: 'none',
      boxSizing: 'border-box',
      ...s,
    }}
  />
);

const Label = ({ children, style: s = {} }) => (
  <div style={{ fontSize: 11, color: V.muted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 6, ...s }}>
    {children}
  </div>
);

const CopyBtn = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <Btn onClick={copy} variant="teal" style={{ fontSize: 12, padding: '6px 14px' }}>
      {copied ? '✓ Copied' : '⎘ Copy'}
    </Btn>
  );
};

const Card = ({ children, style: s = {} }) => (
  <div style={{
    background: V.surface2,
    border: `1px solid ${V.border}`,
    borderRadius: 14,
    padding: 24,
    ...s,
  }}>
    {children}
  </div>
);

const SectionTitle = ({ children, accent = V.gold }) => (
  <h3 style={{
    fontFamily: "'Syne', sans-serif",
    fontSize: 16,
    fontWeight: 700,
    color: accent,
    margin: '0 0 18px 0',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  }}>
    {children}
  </h3>
);

// ─── TABS ────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'json',    label: '{ } JSON Tools' },
  { id: 'encode',  label: '⇄ Encoding' },
  { id: 'hash',    label: '# Hash & Crypto' },
  { id: 'diff',    label: '⊕ Diff & Compare' },
  { id: 'color',   label: '🎨 Color Tools' },
  { id: 'text',    label: '✎ Text Tools' },
  { id: 'regex',   label: '.*  Regex Tester' },
  { id: 'format',  label: '</> Code Format' },
];

// ─── JSON TOOLS ──────────────────────────────────────────────────────────────
function JsonTools() {
  const [input, setInput] = useState('{\n  "name": "Bolt Studio",\n  "version": "2.0",\n  "features": ["dark-theme", "AI", "DevTools"],\n  "active": true\n}');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const run = (fn) => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      setOutput(fn(parsed));
    } catch (e) {
      setError(e.message);
      setOutput('');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <Card>
          <SectionTitle accent={V.gold}>⌨ Input JSON</SectionTitle>
          <Textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Paste JSON here..."
            rows={14}
            error={!!error}
          />
          {error && (
            <div style={{ color: V.red, fontSize: 12, marginTop: 8, fontFamily: "'DM Mono', monospace" }}>
              ✕ {error}
            </div>
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
            <Btn onClick={() => run(p => JSON.stringify(p, null, 2))} variant="gold">⎇ Format</Btn>
            <Btn onClick={() => run(p => JSON.stringify(p))} variant="default">⊟ Minify</Btn>
            <Btn onClick={() => { try { JSON.parse(input); setError(''); setOutput('✓ Valid JSON'); } catch(e) { setError(e.message); } }}>✓ Validate</Btn>
            <Btn onClick={() => run(p => JSON.stringify(sortKeysDeep(p), null, 2))} variant="purple">⇅ Sort Keys</Btn>
            <Btn onClick={() => run(p => jsonToYaml(p))} variant="teal">⇌ → YAML</Btn>
          </div>
        </Card>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <SectionTitle accent={V.teal} style={{ margin: 0 }}>⌁ Output</SectionTitle>
            {output && <CopyBtn text={output} />}
          </div>
          <pre style={{
            background: V.surface,
            border: `1px solid ${V.border}`,
            borderRadius: 10,
            padding: '14px',
            color: output === '✓ Valid JSON' ? V.green : V.teal,
            fontFamily: "'DM Mono', monospace",
            fontSize: 13,
            minHeight: 280,
            overflowY: 'auto',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            margin: 0,
            lineHeight: 1.7,
          }}>
            {output || <span style={{ color: V.muted }}>Output will appear here…</span>}
          </pre>
        </Card>
      </div>
    </div>
  );
}

const EncodingBlock = ({ title, input, setInput, output, enc, dec, accent }) => (
  <Card>
    <SectionTitle accent={accent}>{title}</SectionTitle>
    <Label>Input</Label>
    <Textarea value={input} onChange={e => setInput(e.target.value)} rows={4} />
    <div style={{ display: 'flex', gap: 8, marginTop: 10, marginBottom: 10 }}>
      <Btn onClick={enc} variant="gold">↑ Encode</Btn>
      <Btn onClick={dec} variant="default">↓ Decode</Btn>
      {output && <CopyBtn text={output} />}
    </div>
    <Label>Output</Label>
    <pre style={{
      background: V.surface,
      border: `1px solid ${V.border}`,
      borderRadius: 8,
      padding: '10px 14px',
      color: accent,
      fontFamily: "'DM Mono', monospace",
      fontSize: 13,
      minHeight: 60,
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-all',
      margin: 0,
    }}>
      {output || <span style={{ color: V.muted }}>…output</span>}
    </pre>
  </Card>
);

// ─── ENCODING TOOLS ──────────────────────────────────────────────────────────
function EncodingTools() {
  const [b64Input, setB64Input] = useState('Hello, Bolt Studio Pro!');
  const [b64Output, setB64Output] = useState('');
  const [urlInput, setUrlInput] = useState('https://example.com/path?q=hello world&lang=en');
  const [urlOutput, setUrlOutput] = useState('');
  const [htmlInput, setHtmlInput] = useState('<h1>Hello & "World"</h1>');
  const [htmlOutput, setHtmlOutput] = useState('');

  const encodeB64 = () => { try { setB64Output(btoa(unescape(encodeURIComponent(b64Input)))); } catch(e) { setB64Output('Error: ' + e.message); } };
  const decodeB64 = () => { try { setB64Output(decodeURIComponent(escape(atob(b64Input)))); } catch { setB64Output('Error: invalid base64'); } };
  const encodeUrl = () => setUrlOutput(encodeURIComponent(urlInput));
  const decodeUrl = () => { try { setUrlOutput(decodeURIComponent(urlInput)); } catch(e) { setUrlOutput('Error: ' + e.message); } };
  const encodeHtml = () => setHtmlOutput(htmlInput.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;'));
  const decodeHtml = () => {
    const d = document.createElement('div');
    d.innerHTML = htmlInput;
    setHtmlOutput(d.textContent || d.innerText || '');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <EncodingBlock title="⇄ Base64" input={b64Input} setInput={setB64Input} output={b64Output} enc={encodeB64} dec={decodeB64} accent={V.gold} />
      <EncodingBlock title="⇄ URL Encoding" input={urlInput} setInput={setUrlInput} output={urlOutput} enc={encodeUrl} dec={decodeUrl} accent={V.teal} />
      <EncodingBlock title="⇄ HTML Entities" input={htmlInput} setInput={setHtmlInput} output={htmlOutput} enc={encodeHtml} dec={decodeHtml} accent={V.purple} />
    </div>
  );
}

const HashRow = ({ algo, value, accent, loading }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    background: V.surface,
    border: `1px solid ${V.border}`,
    borderRadius: 8,
    padding: '10px 14px',
    marginBottom: 8,
  }}>
    <span style={{ color: accent, fontFamily: "'DM Mono', monospace", fontSize: 11, minWidth: 70, fontWeight: 700 }}>{algo}</span>
    <span style={{ color: V.text, fontFamily: "'DM Mono', monospace", fontSize: 12, flex: 1, wordBreak: 'break-all' }}>
      {loading ? <span style={{ color: V.muted }}>Computing…</span> : value}
    </span>
    {value && <CopyBtn text={value} />}
  </div>
);

// ─── HASH & CRYPTO ───────────────────────────────────────────────────────────
function HashTools() {
  const [input, setInput] = useState('Bolt Studio Pro 2025');
  const [hashes, setHashes] = useState({});
  const [loading, setLoading] = useState(false);
  const [verifyHash, setVerifyHash] = useState('');
  const [verifyAlgo, setVerifyAlgo] = useState('SHA-256');
  const [verifyResult, setVerifyResult] = useState(null);
  const fileRef = useRef();
  const [fileHash, setFileHash] = useState('');

  const generate = useCallback(async () => {
    setLoading(true);
    const [sha1, sha256, sha512] = await Promise.all([
      sha('SHA-1', input),
      sha('SHA-256', input),
      sha('SHA-512', input),
    ]);
    const md5like = pseudoMD5(input);
    setHashes({ md5like, sha1, sha256, sha512 });
    setLoading(false);
  }, [input]);

  useEffect(() => {
    let active = true;
    const run = async () => {
      await Promise.resolve();
      if (active) generate();
    };
    run();
    return () => { active = false; };
  }, [generate]);

  const verify = async () => {
    const actual = await sha(verifyAlgo, input);
    setVerifyResult(actual.toLowerCase() === verifyHash.toLowerCase().trim());
  };

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const buf = e.target.result;
      const hashBuf = await crypto.subtle.digest('SHA-256', buf);
      setFileHash(bufToHex(hashBuf));
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Card>
          <SectionTitle accent={V.gold}># Hash Generator</SectionTitle>
          <Label>Input Text</Label>
          <Textarea value={input} onChange={e => setInput(e.target.value)} rows={5} />
          <Btn onClick={generate} variant="gold" style={{ marginTop: 10 }}>⟳ Generate All Hashes</Btn>
          <div style={{ marginTop: 16 }}>
            <HashRow algo="MD5*" value={hashes.md5like} accent={V.gold} loading={loading} />
            <HashRow algo="SHA-1" value={hashes.sha1} accent={V.teal} loading={loading} />
            <HashRow algo="SHA-256" value={hashes.sha256} accent={V.purple} loading={loading} />
            <HashRow algo="SHA-512" value={hashes.sha512} accent="#60a5fa" loading={loading} />
          </div>
          <div style={{ color: V.muted, fontSize: 11, marginTop: 8 }}>* MD5 is a simplified non-cryptographic approximation</div>
        </Card>
        <Card>
          <SectionTitle accent={V.teal}>✓ Verify Hash</SectionTitle>
          <Label>Algorithm</Label>
          <select
            value={verifyAlgo}
            onChange={e => setVerifyAlgo(e.target.value)}
            style={{ background: V.surface, border: `1px solid ${V.border}`, color: V.text, borderRadius: 8, padding: '8px 12px', fontFamily: "'DM Mono', monospace", fontSize: 13, marginBottom: 12, width: '100%' }}
          >
            <option>SHA-1</option>
            <option>SHA-256</option>
            <option>SHA-512</option>
          </select>
          <Label>Expected Hash</Label>
          <Input value={verifyHash} onChange={e => setVerifyHash(e.target.value)} placeholder="Paste expected hash…" style={{ width: '100%', marginBottom: 10 }} />
          <Btn onClick={verify} variant="teal">⇌ Compare</Btn>
          {verifyResult !== null && (
            <div style={{
              marginTop: 12,
              padding: '10px 14px',
              borderRadius: 8,
              background: verifyResult ? `${V.green}11` : `${V.red}11`,
              border: `1px solid ${verifyResult ? V.green : V.red}`,
              color: verifyResult ? V.green : V.red,
              fontFamily: "'DM Mono', monospace",
              fontSize: 13,
            }}>
              {verifyResult ? '✓ MATCH — Hashes are identical' : '✕ MISMATCH — Hashes do not match'}
            </div>
          )}
        </Card>
      </div>
      <Card>
        <SectionTitle accent={V.purple}>📁 File Hash (SHA-256)</SectionTitle>
        <div
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => fileRef.current.click()}
          style={{
            border: `2px dashed ${V.purple}55`,
            borderRadius: 12,
            padding: '40px 20px',
            textAlign: 'center',
            cursor: 'pointer',
            color: V.muted,
            fontSize: 14,
            marginBottom: 16,
            transition: 'border-color 0.2s',
          }}
        >
          <div style={{ fontSize: 36, marginBottom: 8 }}>📂</div>
          <div>Drop a file here, or click to browse</div>
          <div style={{ fontSize: 12, marginTop: 4 }}>Computes SHA-256 hash locally in-browser</div>
          <input ref={fileRef} type="file" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
        </div>
        {fileHash && (
          <>
            <Label>SHA-256 File Hash</Label>
            <div style={{
              background: V.surface,
              border: `1px solid ${V.purple}55`,
              borderRadius: 8,
              padding: '12px 14px',
              color: V.purple,
              fontFamily: "'DM Mono', monospace",
              fontSize: 13,
              wordBreak: 'break-all',
              lineHeight: 1.6,
            }}>
              {fileHash}
            </div>
            <div style={{ marginTop: 10 }}>
              <CopyBtn text={fileHash} />
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

// ─── DIFF & COMPARE ──────────────────────────────────────────────────────────
function DiffTools() {
  const [original, setOriginal] = useState(`function greet(name) {\n  console.log("Hello, " + name);\n  return true;\n}\n\nconst x = 42;`);
  const [modified, setModified] = useState(`function greet(name, greeting = "Hello") {\n  console.log(greeting + ", " + name + "!");\n  return name;\n}\n\nconst x = 100;\nconst y = 200;`);
  const { result, added, removed } = computeDiff(original, modified);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card>
          <SectionTitle accent={V.red}>— Original</SectionTitle>
          <Textarea value={original} onChange={e => setOriginal(e.target.value)} rows={12} placeholder="Original text…" />
        </Card>
        <Card>
          <SectionTitle accent={V.green}>+ Modified</SectionTitle>
          <Textarea value={modified} onChange={e => setModified(e.target.value)} rows={12} placeholder="Modified text…" />
        </Card>
      </div>
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <SectionTitle accent={V.teal}>⊕ Diff Result</SectionTitle>
          <div style={{ display: 'flex', gap: 12, fontSize: 12 }}>
            <span style={{ color: V.green }}>+{added} added</span>
            <span style={{ color: V.red }}>−{removed} removed</span>
            <span style={{ color: V.muted }}>{result.filter(r => r.type === 'same').length} unchanged</span>
          </div>
        </div>
        <div style={{
          background: V.surface,
          border: `1px solid ${V.border}`,
          borderRadius: 10,
          padding: '12px 0',
          fontFamily: "'DM Mono', monospace",
          fontSize: 13,
          lineHeight: 1.7,
          maxHeight: 400,
          overflowY: 'auto',
        }}>
          {result.map((line, i) => (
            <div key={i} style={{
              padding: '2px 16px',
              background: line.type === 'added' ? `${V.green}15` : line.type === 'removed' ? `${V.red}15` : 'transparent',
              color: line.type === 'added' ? V.green : line.type === 'removed' ? V.red : V.textDim,
              borderLeft: `3px solid ${line.type === 'added' ? V.green : line.type === 'removed' ? V.red : 'transparent'}`,
            }}>
              <span style={{ color: V.muted, marginRight: 10, userSelect: 'none', fontSize: 11 }}>
                {line.type === 'added' ? '+' : line.type === 'removed' ? '−' : ' '}
              </span>
              {line.text || <span style={{ color: V.muted }}>&nbsp;</span>}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

const ColorRow = ({ label, value, accent }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
    <span style={{ color: V.muted, fontSize: 11, width: 50 }}>{label}</span>
    <span style={{ color: accent || V.text, fontFamily: "'DM Mono', monospace", fontSize: 13, flex: 1 }}>{value}</span>
    <CopyBtn text={value} />
  </div>
);

// ─── COLOR TOOLS ─────────────────────────────────────────────────────────────
function ColorTools() {
  const [hex, setHex] = useState('#a78bfa');
  const [contrast1, setContrast1] = useState('#a78bfa');
  const [contrast2, setContrast2] = useState('#0e0e16');

  const isValidHex = (h) => /^#[0-9A-Fa-f]{3,6}$/.test(h);
  const rgb = isValidHex(hex) ? hexToRgb(hex) : { r: 0, g: 0, b: 0 };
  const hsl = rgbToHsl(rgb);
  const hsv = rgbToHsv(rgb);
  const cmyk = rgbToCmyk(rgb);
  const shades = isValidHex(hex) ? generateShades(hex) : [];

  const ratio = (() => {
    try { return contrastRatio(contrast1, contrast2); } catch { return null; }
  })();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <Card>
          <SectionTitle accent={V.gold}>🎨 Color Converter</SectionTitle>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <input
              type="color"
              value={isValidHex(hex) ? hex : '#000000'}
              onChange={e => setHex(e.target.value)}
              style={{ width: 52, height: 52, borderRadius: 10, border: 'none', cursor: 'pointer', background: 'none', padding: 0 }}
            />
            <Input
              value={hex}
              onChange={e => setHex(e.target.value)}
              placeholder="#000000"
              style={{ width: 140, fontWeight: 700, fontSize: 15 }}
            />
            {isValidHex(hex) && (
              <div style={{
                width: 52, height: 52, borderRadius: 10,
                background: hex,
                border: `2px solid ${V.border}`,
                boxShadow: `0 0 20px ${hex}66`,
              }} />
            )}
          </div>
          {isValidHex(hex) && (
            <>
              <ColorRow label="HEX" value={hex.toUpperCase()} accent={V.gold} />
              <ColorRow label="RGB" value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} accent={V.teal} />
              <ColorRow label="HSL" value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} accent={V.purple} />
              <ColorRow label="HSV" value={`hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`} accent="#60a5fa" />
              <ColorRow label="CMYK" value={`cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`} accent="#f472b6" />
            </>
          )}
        </Card>
        <Card>
          <SectionTitle accent={V.teal}>◑ Contrast Checker (WCAG)</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
            <div>
              <Label>Foreground</Label>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <input type="color" value={contrast1} onChange={e => setContrast1(e.target.value)} style={{ width: 36, height: 36, borderRadius: 6, border: 'none', cursor: 'pointer', padding: 0 }} />
                <Input value={contrast1} onChange={e => setContrast1(e.target.value)} style={{ flex: 1 }} />
              </div>
            </div>
            <div>
              <Label>Background</Label>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <input type="color" value={contrast2} onChange={e => setContrast2(e.target.value)} style={{ width: 36, height: 36, borderRadius: 6, border: 'none', cursor: 'pointer', padding: 0 }} />
                <Input value={contrast2} onChange={e => setContrast2(e.target.value)} style={{ flex: 1 }} />
              </div>
            </div>
          </div>
          {ratio && (
            <>
              <div style={{
                background: contrast2,
                color: contrast1,
                borderRadius: 10,
                padding: '14px 16px',
                fontFamily: "'Syne', sans-serif",
                fontSize: 16,
                fontWeight: 700,
                textAlign: 'center',
                marginBottom: 14,
                border: `1px solid ${V.border}`,
              }}>
                Aa Preview Text
              </div>
              <div style={{
                background: V.surface,
                border: `1px solid ${V.border}`,
                borderRadius: 10,
                padding: '12px 16px',
              }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 22, fontWeight: 700, color: ratio >= 4.5 ? V.green : ratio >= 3 ? V.gold : V.red, textAlign: 'center', marginBottom: 8 }}>
                  {ratio}:1
                </div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                  {[['AA Normal', 4.5], ['AA Large', 3], ['AAA Normal', 7], ['AAA Large', 4.5]].map(([label, threshold]) => (
                    <div key={label} style={{
                      fontSize: 10,
                      padding: '3px 8px',
                      borderRadius: 6,
                      background: ratio >= threshold ? `${V.green}22` : `${V.red}22`,
                      color: ratio >= threshold ? V.green : V.red,
                      border: `1px solid ${ratio >= threshold ? V.green : V.red}55`,
                      fontFamily: "'DM Mono', monospace",
                    }}>
                      {ratio >= threshold ? '✓' : '✕'} {label}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
      {shades.length > 0 && (
        <Card>
          <SectionTitle accent={V.purple}>◫ Shade Generator</SectionTitle>
          <div style={{ display: 'flex', gap: 6 }}>
            {shades.map((shade, i) => (
              <div
                key={i}
                title={shade}
                onClick={() => navigator.clipboard.writeText(shade)}
                style={{
                  flex: 1,
                  height: 56,
                  borderRadius: 8,
                  background: shade,
                  cursor: 'pointer',
                  border: `1px solid ${V.border}`,
                  transition: 'transform 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scaleY(1.15)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scaleY(1)'}
              />
            ))}
          </div>
          <div style={{ color: V.muted, fontSize: 11, marginTop: 8 }}>Click any swatch to copy its HSL value</div>
        </Card>
      )}
    </div>
  );
}

const StatBadge = ({ label, value }) => (
  <div style={{ background: V.surface, border: `1px solid ${V.border}`, borderRadius: 8, padding: '10px 16px', textAlign: 'center' }}>
    <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 700, color: V.gold }}>{value.toLocaleString()}</div>
    <div style={{ color: V.muted, fontSize: 11 }}>{label}</div>
  </div>
);

// ─── TEXT TOOLS ──────────────────────────────────────────────────────────────
function TextTools() {
  const [text, setText] = useState("The quick brown fox jumps over the lazy dog.\nPack my box with five dozen liquor jugs.\nHow vexingly quick daft zebras jump!");
  const [findStr, setFindStr] = useState('');
  const [replaceStr, setReplaceStr] = useState('');
  const [useRegex, setUseRegex] = useState(false);
  const [regexFlags, setRegexFlags] = useState('gi');
  const [findErr, setFindErr] = useState('');

  const words = text.match(/\b\w+\b/g)?.length || 0;
  const chars = text.length;
  const lines = text.split('\n').length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;

  const applyCase = (fn) => setText(fn(text));
  const removeBlankLines = () => setText(text.split('\n').filter(l => l.trim()).join('\n'));
  const removeDuplicates = () => setText([...new Set(text.split('\n'))].join('\n'));
  const sortLines = () => setText(text.split('\n').sort().join('\n'));
  const reverseText = () => setText(text.split('').reverse().join(''));
  const reverseLines = () => setText(text.split('\n').reverse().join('\n'));

  const doReplace = () => {
    setFindErr('');
    if (!findStr) return;
    try {
      const pattern = useRegex ? new RegExp(findStr, regexFlags) : new RegExp(findStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      setText(text.replace(pattern, replaceStr));
    } catch(e) { setFindErr(e.message); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        <Card>
          <SectionTitle accent={V.gold}>✎ Text Input</SectionTitle>
          <Textarea value={text} onChange={e => setText(e.target.value)} rows={12} placeholder="Enter or paste text…" />
        </Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <StatBadge label="Words" value={words} />
            <StatBadge label="Characters" value={chars} />
            <StatBadge label="Lines" value={lines} />
            <StatBadge label="Sentences" value={sentences} />
          </div>
          <Card style={{ padding: 14 }}>
            <div style={{ color: V.muted, fontSize: 11, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Case</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Btn onClick={() => applyCase(s => s.toUpperCase())} variant="gold" style={{ width: '100%' }}>UPPERCASE</Btn>
              <Btn onClick={() => applyCase(s => s.toLowerCase())} style={{ width: '100%' }}>lowercase</Btn>
              <Btn onClick={() => applyCase(toTitle)} style={{ width: '100%' }}>Title Case</Btn>
              <Btn onClick={() => applyCase(toCamel)} variant="teal" style={{ width: '100%' }}>camelCase</Btn>
              <Btn onClick={() => applyCase(toSnake)} variant="purple" style={{ width: '100%' }}>snake_case</Btn>
              <Btn onClick={() => applyCase(toPascal)} style={{ width: '100%' }}>PascalCase</Btn>
            </div>
          </Card>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <Card>
          <SectionTitle accent={V.teal}>⊞ Line Operations</SectionTitle>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <Btn onClick={removeDuplicates} variant="teal">Remove Duplicates</Btn>
            <Btn onClick={sortLines}>Sort Lines A→Z</Btn>
            <Btn onClick={() => setText(text.split('\n').sort().reverse().join('\n'))}>Sort Z→A</Btn>
            <Btn onClick={removeBlankLines}>Remove Blank Lines</Btn>
            <Btn onClick={reverseLines}>Reverse Lines</Btn>
            <Btn onClick={reverseText} variant="purple">Reverse Text</Btn>
            <Btn onClick={() => setText(text.trim())}>Trim Whitespace</Btn>
            <Btn onClick={() => navigator.clipboard.writeText(text)} variant="gold">⎘ Copy All</Btn>
          </div>
        </Card>
        <Card>
          <SectionTitle accent={V.purple}>⇄ Find & Replace</SectionTitle>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <div style={{ flex: 1 }}>
              <Label>Find</Label>
              <Input value={findStr} onChange={e => setFindStr(e.target.value)} placeholder="Search…" style={{ width: '100%' }} />
            </div>
            <div style={{ flex: 1 }}>
              <Label>Replace with</Label>
              <Input value={replaceStr} onChange={e => setReplaceStr(e.target.value)} placeholder="Replace…" style={{ width: '100%' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: V.muted, fontSize: 12, cursor: 'pointer' }}>
              <input type="checkbox" checked={useRegex} onChange={e => setUseRegex(e.target.checked)} /> Use Regex
            </label>
            {useRegex && (
              <Input value={regexFlags} onChange={e => setRegexFlags(e.target.value)} placeholder="flags" style={{ width: 70 }} />
            )}
            <Btn onClick={doReplace} variant="purple">Replace All</Btn>
          </div>
          {findErr && <div style={{ color: V.red, fontSize: 12, fontFamily: "'DM Mono', monospace" }}>✕ {findErr}</div>}
        </Card>
      </div>
    </div>
  );
}

// ─── REGEX TESTER ────────────────────────────────────────────────────────────
function RegexTester() {
  const [pattern, setPattern] = useState('(\\w+)@(\\w+\\.\\w+)');
  const [flags, setFlags] = useState('gi');
  const [testStr, setTestStr] = useState('Contact us at hello@boltpro.dev or support@antigravity.io for help.\nAnother: admin@example.com');
  const [error, setError] = useState('');

  const getMatches = () => {
    if (!pattern) return { matches: [], highlighted: testStr };
    try {
      const re = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');
      const matches = [];
      let m;
      const re2 = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');
      while ((m = re2.exec(testStr)) !== null) {
        matches.push({ index: m.index, value: m[0], groups: m.slice(1), named: m.groups });
        if (!flags.includes('g')) break;
      }
      setError('');
      return { matches, re };
    } catch(e) {
      setError(e.message);
      return { matches: [], re: null };
    }
  };

  const { matches, re } = getMatches();

  const renderHighlighted = () => {
    if (!re || matches.length === 0) return <span style={{ color: V.text }}>{testStr}</span>;
    const parts = [];
    let last = 0;
    const re2 = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');
    let m;
    while ((m = re2.exec(testStr)) !== null) {
      if (m.index > last) parts.push(<span key={last} style={{ color: V.text }}>{testStr.slice(last, m.index)}</span>);
      parts.push(
        <span key={m.index + 's'} style={{
          background: `${V.gold}33`,
          color: V.gold,
          borderRadius: 3,
          padding: '1px 2px',
          border: `1px solid ${V.gold}55`,
        }}>{m[0]}</span>
      );
      last = m.index + m[0].length;
      if (!flags.includes('g')) break;
    }
    if (last < testStr.length) parts.push(<span key="end" style={{ color: V.text }}>{testStr.slice(last)}</span>);
    return parts;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card>
        <SectionTitle accent={V.gold}>.* Regex Tester</SectionTitle>
        <div style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <Label>Pattern</Label>
            <Input value={pattern} onChange={e => setPattern(e.target.value)} placeholder="Enter regex…" style={{ width: '100%', fontWeight: 700, fontSize: 14 }} />
          </div>
          <div style={{ width: 100 }}>
            <Label>Flags</Label>
            <Input value={flags} onChange={e => setFlags(e.target.value)} placeholder="gi" style={{ width: '100%' }} />
          </div>
          <div style={{
            padding: '8px 14px',
            borderRadius: 8,
            background: error ? `${V.red}15` : `${V.green}15`,
            color: error ? V.red : V.green,
            border: `1px solid ${error ? V.red : V.green}55`,
            fontSize: 12,
            fontFamily: "'DM Mono', monospace",
          }}>
            {error ? '✕ Error' : `✓ ${matches.length} match${matches.length !== 1 ? 'es' : ''}`}
          </div>
        </div>
        {error && <div style={{ color: V.red, fontSize: 12, marginBottom: 10, fontFamily: "'DM Mono', monospace" }}>{error}</div>}
        <Label>Test String</Label>
        <Textarea value={testStr} onChange={e => setTestStr(e.target.value)} rows={5} />
      </Card>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <Card>
          <SectionTitle accent={V.teal}>⬡ Highlighted Matches</SectionTitle>
          <pre style={{
            background: V.surface,
            border: `1px solid ${V.border}`,
            borderRadius: 10,
            padding: '14px',
            fontFamily: "'DM Mono', monospace",
            fontSize: 13,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            lineHeight: 1.7,
            minHeight: 120,
            margin: 0,
          }}>
            {renderHighlighted()}
          </pre>
        </Card>
        <Card>
          <SectionTitle accent={V.purple}>◈ Match Details</SectionTitle>
          {matches.length === 0
            ? <div style={{ color: V.muted, fontSize: 13 }}>No matches found.</div>
            : <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                {matches.map((m, i) => (
                  <div key={i} style={{
                    background: V.surface,
                    border: `1px solid ${V.border}`,
                    borderRadius: 8,
                    padding: '10px 12px',
                    marginBottom: 8,
                  }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ color: V.muted, fontSize: 11 }}>#{i + 1}</span>
                      <span style={{ color: V.gold, fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 700 }}>"{m.value}"</span>
                      <span style={{ color: V.muted, fontSize: 11 }}>@ idx {m.index}</span>
                    </div>
                    {m.groups.length > 0 && (
                      <div style={{ fontSize: 11, color: V.teal, fontFamily: "'DM Mono', monospace" }}>
                        Groups: {m.groups.map((g, gi) => `[${gi + 1}] ${g}`).join('  ')}
                      </div>
                    )}
                    {m.named && Object.keys(m.named).length > 0 && (
                      <div style={{ fontSize: 11, color: V.purple, fontFamily: "'DM Mono', monospace", marginTop: 2 }}>
                        Named: {Object.entries(m.named).map(([k, v]) => `${k}="${v}"`).join('  ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
          }
        </Card>
      </div>
    </div>
  );
}

// ─── CODE FORMATTER ──────────────────────────────────────────────────────────
function CodeFormatter() {
  const [lang, setLang] = useState('javascript');
  const [code, setCode] = useState(`function hello(name){
const greeting='Hello, '+name+'!';
console.log(greeting);
return greeting;
}
const result=hello('World');
console.log(result);`);
  const [formatted, setFormatted] = useState('');

  const format = () => {
    const f = formatCode(code, lang);
    setFormatted(f);
  };

  const lineCount = code.split('\n').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <SectionTitle accent={V.gold}>⎇ Code Formatter</SectionTitle>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <select
              value={lang}
              onChange={e => { setLang(e.target.value); setFormatted(''); }}
              style={{ background: V.surface, border: `1px solid ${V.border}`, color: V.text, borderRadius: 8, padding: '7px 12px', fontFamily: "'DM Mono', monospace", fontSize: 13 }}
            >
              <option value="javascript">JavaScript</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="json">JSON</option>
            </select>
            <Btn onClick={format} variant="gold">⎇ Format</Btn>
            <Btn onClick={() => { setFormatted(''); }} variant="default">✕ Reset</Btn>
            {formatted && <CopyBtn text={formatted} />}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <Label>Input — {lineCount} lines</Label>
            <Textarea value={code} onChange={e => setCode(e.target.value)} rows={20} />
          </div>
          <div>
            <Label>Formatted Output {formatted && `— ${formatted.split('\n').length} lines`}</Label>
            <div style={{ position: 'relative', display: 'flex' }}>
              <div style={{
                background: V.surface3,
                border: `1px solid ${V.border}`,
                borderRight: 'none',
                borderRadius: '10px 0 0 10px',
                padding: '12px 8px',
                fontFamily: "'DM Mono', monospace",
                fontSize: 12,
                color: V.muted,
                textAlign: 'right',
                lineHeight: '1.6',
                userSelect: 'none',
                minWidth: 36,
                overflowY: 'hidden',
              }}>
                {(formatted || code).split('\n').map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              <pre style={{
                flex: 1,
                background: V.surface,
                border: `1px solid ${V.border}`,
                borderLeft: 'none',
                borderRadius: '0 10px 10px 0',
                padding: '12px 14px',
                color: formatted ? V.teal : V.muted,
                fontFamily: "'DM Mono', monospace",
                fontSize: 13,
                margin: 0,
                whiteSpace: 'pre',
                overflowX: 'auto',
                overflowY: 'auto',
                lineHeight: 1.6,
              }}>
                {formatted || <span style={{ color: V.muted }}>Click Format to see output…</span>}
              </pre>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── NETWORK / PLACEHOLDER ───────────────────────────────────────────────────
function NetworkTools() {
  const [url, setUrl] = useState('');
  const [ip, setIp] = useState('');
  const [dns, setDns] = useState('');
  const [pingMs, setPingMs] = useState(null);
  const [loading, setLoading] = useState(false);

  const measureLatency = async (target) => {
    const start = performance.now();
    try {
      await fetch(`https://dns.google/resolve?name=${encodeURIComponent(target)}&type=A`);
      return Math.round(performance.now() - start);
    } catch { return null; }
  };

  const lookup = async () => {
    if (!url) return;
    setLoading(true);
    setPingMs(null);
    setIp('');
    setDns('');
    try {
      const domain = url.replace(/^https?:\/\//, '').split('/')[0];
      const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=A`);
      const data = await res.json();
      const answers = (data.Answer || []).filter(a => a.type === 1);
      setIp(answers.map(a => a.data).join(', ') || 'No A record found');
      setDns(data.Status === 0 ? 'Resolved OK' : `Status: ${data.Status}`);
      const ms = await measureLatency(domain);
      setPingMs(ms);
    } catch(e) {
      setIp('Error: ' + e.message);
    }
    setLoading(false);
  };

  const [enc, setEnc] = useState('');
  const [dec, setDec] = useState('');
  const encUrl = () => setDec(encodeURIComponent(enc));
  const decUrl = () => { try { setDec(decodeURIComponent(enc)); } catch { setDec('Invalid URL encoding'); } };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <Card>
          <SectionTitle accent={V.gold}>🌐 DNS Lookup</SectionTitle>
          <Label>Domain or URL</Label>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="example.com" style={{ flex: 1 }} />
            <Btn onClick={lookup} variant="gold">{loading ? '⟳' : 'Lookup'}</Btn>
          </div>
          {ip && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[['IP Address', ip, V.teal], ['DNS Status', dns, V.green], ['Latency', pingMs !== null ? `${pingMs} ms` : '—', V.gold]].map(([label, val, color]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: V.surface, border: `1px solid ${V.border}`, borderRadius: 8, padding: '9px 14px' }}>
                  <span style={{ color: V.muted, fontSize: 12 }}>{label}</span>
                  <span style={{ color, fontFamily: "'DM Mono', monospace", fontSize: 13 }}>{val}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
        <Card>
          <SectionTitle accent={V.teal}>🔗 URL Encode / Decode</SectionTitle>
          <Label>Input</Label>
          <Textarea value={enc} onChange={e => setEnc(e.target.value)} rows={4} placeholder="Enter URL or encoded string…" />
          <div style={{ display: 'flex', gap: 8, marginTop: 10, marginBottom: 10 }}>
            <Btn onClick={encUrl} variant="gold">↑ Encode</Btn>
            <Btn onClick={decUrl}>↓ Decode</Btn>
            {dec && <CopyBtn text={dec} />}
          </div>
          <Label>Output</Label>
          <pre style={{
            background: V.surface,
            border: `1px solid ${V.border}`,
            borderRadius: 8,
            padding: '10px 14px',
            color: V.teal,
            fontFamily: "'DM Mono', monospace",
            fontSize: 13,
            minHeight: 60,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            margin: 0,
          }}>
            {dec || <span style={{ color: V.muted }}>…output</span>}
          </pre>
        </Card>
      </div>
      <Card>
        <SectionTitle accent={V.purple}>📋 Quick Reference</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {[
            ['HTTP 200', 'OK', V.green],
            ['HTTP 201', 'Created', V.green],
            ['HTTP 301', 'Moved Permanently', V.gold],
            ['HTTP 302', 'Found (Redirect)', V.gold],
            ['HTTP 400', 'Bad Request', V.red],
            ['HTTP 401', 'Unauthorized', V.red],
            ['HTTP 403', 'Forbidden', V.red],
            ['HTTP 404', 'Not Found', V.red],
            ['HTTP 500', 'Internal Server Error', V.red],
            ['HTTP 502', 'Bad Gateway', V.red],
            ['HTTP 503', 'Service Unavailable', V.red],
            ['HTTP 429', 'Too Many Requests', V.gold],
          ].map(([code, desc, color]) => (
            <div key={code} style={{ background: V.surface, border: `1px solid ${color}33`, borderRadius: 8, padding: '8px 12px' }}>
              <div style={{ color, fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 700 }}>{code}</div>
              <div style={{ color: V.muted, fontSize: 11 }}>{desc}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function DevUtilities() {
  const [activeTab, setActiveTab] = useState('json');
  const [visible, setVisible] = useState(true);

  const switchTab = (id) => {
    setVisible(false);
    setTimeout(() => {
      setActiveTab(id);
      setVisible(true);
    }, 120);
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'json':   return <JsonTools />;
      case 'encode': return <EncodingTools />;
      case 'hash':   return <HashTools />;
      case 'diff':   return <DiffTools />;
      case 'color':  return <ColorTools />;
      case 'text':   return <TextTools />;
      case 'regex':  return <RegexTester />;
      case 'format': return <CodeFormatter />;
      default:       return <NetworkTools />;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: V.surface,
      color: V.text,
      fontFamily: "'DM Mono', monospace",
    }}>
      {/* ── HERO HEADER ─────────────────────────────────────────────── */}
      <div style={{
        background: `linear-gradient(135deg, ${V.surface} 0%, #0d0d1a 40%, #0c1628 100%)`,
        borderBottom: `1px solid ${V.border}`,
        padding: '48px 40px 36px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* decorative glows */}
        <div style={{ position: 'absolute', top: -60, right: 80, width: 340, height: 340, borderRadius: '50%', background: `${V.gold}08`, filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, left: 120, width: 280, height: 280, borderRadius: '50%', background: `${V.teal}08`, filter: 'blur(70px)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: `${V.gold}12`,
            border: `1px solid ${V.gold}33`,
            borderRadius: 20,
            padding: '4px 14px',
            marginBottom: 16,
            fontSize: 11,
            color: V.gold,
            fontWeight: 600,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
          }}>
            ⚙ Developer Toolbox
          </div>
          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 44,
            fontWeight: 800,
            margin: '0 0 10px 0',
            lineHeight: 1.1,
            background: `linear-gradient(135deg, ${V.gold} 0%, #fff 60%, ${V.teal} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Developer Utilities
          </h1>
          <p style={{ color: V.muted, fontSize: 16, margin: '0 0 28px 0', lineHeight: 1.5 }}>
            Tools every dev needs, right inside your dashboard — 100% local, zero dependencies.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              { label: '24 Tools', color: V.gold, icon: '⚡' },
              { label: '100% Local', color: V.teal, icon: '🔒' },
              { label: 'Zero Deps', color: V.purple, icon: '✦' },
              { label: 'Real-time', color: '#60a5fa', icon: '⟳' },
            ].map(({ label, color, icon }) => (
              <div key={label} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: `${color}12`,
                border: `1px solid ${color}33`,
                borderRadius: 10,
                padding: '7px 16px',
                color,
                fontSize: 13,
                fontWeight: 600,
              }}>
                <span>{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TAB BAR ─────────────────────────────────────────────────── */}
      <div style={{
        background: V.surface2,
        borderBottom: `1px solid ${V.border}`,
        padding: '0 40px',
        overflowX: 'auto',
      }}>
        <div style={{ display: 'flex', gap: 0, minWidth: 'max-content' }}>
          {TABS.map(tab => {
            const active = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: `2px solid ${active ? V.gold : 'transparent'}`,
                  color: active ? V.gold : V.muted,
                  padding: '14px 20px',
                  cursor: 'pointer',
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 13,
                  fontWeight: active ? 700 : 400,
                  transition: 'all 0.18s ease',
                  whiteSpace: 'nowrap',
                  marginBottom: -1,
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.color = V.text; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.color = V.muted; }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── CONTENT ─────────────────────────────────────────────────── */}
      <div style={{
        padding: '32px 40px 60px',
        maxWidth: 1400,
        margin: '0 auto',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity 0.18s ease, transform 0.18s ease',
      }}>
        {renderTab()}
      </div>
    </div>
  );
}
