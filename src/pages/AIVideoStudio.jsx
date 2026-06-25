import { useState, useEffect, useRef, useMemo } from 'react';

// ─── CSS Variables ──────────────────────────────────────────────────────────
const V = {
  gold: '#f5b731',
  teal: '#22d3ee',
  purple: '#a78bfa',
  surface: '#0e0e16',
  surface2: '#16161e',
  surface3: '#1d1d28',
  border: 'rgba(255,255,255,0.07)',
  muted: '#6e7191',
  red: '#ef4444',
  green: '#22c55e',
  white: '#f1f5f9',
  text: '#c8cde8',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const pill = (color, label) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '2px 10px',
  borderRadius: 99,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.04em',
  background: color + '22',
  color,
  border: `1px solid ${color}44`,
  label,
});

// ─── Mock data ────────────────────────────────────────────────────────────────
const STYLES = ['Cinematic', 'Animated', 'Documentary', 'Product Demo', 'Tutorial'];
const DURATIONS = ['15s', '30s', '60s', '120s'];
const RESOLUTIONS = ['720p', '1080p', '4K'];
const GEN_STEPS = ['Parsing Script', 'Generating Frames', 'Adding Audio', 'Rendering'];

const VOICE_OPTIONS = [
  { id: 'aria', name: 'Aria', accent: 'US English', gender: 'F' },
  { id: 'nova', name: 'Nova', accent: 'UK English', gender: 'F' },
  { id: 'echo', name: 'Echo', accent: 'AU English', gender: 'M' },
  { id: 'onyx', name: 'Onyx', accent: 'US English', gender: 'M' },
  { id: 'shimmer', name: 'Shimmer', accent: 'CA English', gender: 'F' },
  { id: 'fable', name: 'Fable', accent: 'IE English', gender: 'M' },
];

const EFFECTS = [
  { name: 'Fade In', color: '#a78bfa' },
  { name: 'Zoom Out', color: '#22d3ee' },
  { name: 'Pan Right', color: '#f5b731' },
  { name: 'Ken Burns', color: '#22c55e' },
  { name: 'Vignette', color: '#ef4444' },
  { name: 'Color Grade', color: '#f97316' },
  { name: 'Film Grain', color: '#94a3b8' },
  { name: 'Glitch', color: '#ec4899' },
  { name: 'Bokeh', color: '#22d3ee' },
  { name: 'Slow Motion', color: '#a78bfa' },
  { name: 'Time Lapse', color: '#f5b731' },
  { name: 'Color Splash', color: '#22c55e' },
];

const EXPORT_PRESETS = [
  { name: 'Social Media', ratio: '9:16', res: '1080p', size: '~45 MB', bitrate: '8 Mbps', color: V.purple },
  { name: 'YouTube', ratio: '16:9', res: '4K', size: '~180 MB', bitrate: '35 Mbps', color: V.red },
  { name: 'LinkedIn', ratio: '1:1', res: '1080p', size: '~60 MB', bitrate: '10 Mbps', color: V.teal },
  { name: 'TikTok', ratio: '9:16', res: '720p', size: '~25 MB', bitrate: '4 Mbps', color: V.gold },
  { name: 'Presentation', ratio: '16:9', res: '1080p', size: '~95 MB', bitrate: '16 Mbps', color: '#22c55e' },
  { name: 'Archive', ratio: '16:9', res: '4K RAW', size: '~2.1 GB', bitrate: '120 Mbps', color: '#f97316' },
];

const MOOD_COLORS = { Calm: V.teal, Energetic: V.gold, Dramatic: V.red, Neutral: V.muted };

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, value, color }) {
  return (
    <div style={{
      flex: 1, minWidth: 120, background: V.surface2, border: `1px solid ${V.border}`,
      borderRadius: 12, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 6,
    }}>
      <span style={{ fontSize: 12, color: V.muted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
      <span style={{ fontSize: 24, fontWeight: 800, color: color || V.white, fontFamily: 'DM Mono, monospace' }}>{value}</span>
    </div>
  );
}

function SectionTitle({ icon, title, subtitle }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
      <span style={{ fontSize: 22 }}>{icon}</span>
      <div>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: V.white }}>{title}</h2>
        {subtitle && <p style={{ margin: 0, fontSize: 12, color: V.muted }}>{subtitle}</p>}
      </div>
    </div>
  );
}

function VideoThumbnailSVG({ color, title }) {
  return (
    <svg viewBox="0 0 280 158" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <linearGradient id={`g-${title}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color + '55'} />
          <stop offset="100%" stopColor={V.surface} />
        </linearGradient>
      </defs>
      <rect width="280" height="158" fill={`url(#g-${title})`} />
      <rect width="280" height="158" fill="none" stroke={color + '33'} strokeWidth="1" />
      {[40, 80, 120, 160, 200].map((x, i) => (
        <rect key={i} x={x} y={60 + (i % 3) * 10} width="30" height={20 + (i % 2) * 15}
          fill={color + '22'} rx="2" />
      ))}
      <circle cx="140" cy="79" r="22" fill="rgba(0,0,0,0.6)" />
      <polygon points="134,70 134,88 154,79" fill={V.white} />
    </svg>
  );
}

function SceneThumbnailSVG({ color }) {
  return (
    <svg viewBox="0 0 80 48" style={{ width: 80, height: 48, display: 'block', borderRadius: 4, flexShrink: 0 }}>
      <rect width="80" height="48" fill={color + '33'} />
      <circle cx="20" cy="24" r="10" fill={color + '44'} />
      <rect x="38" y="14" width="30" height="4" rx="2" fill={color + '66'} />
      <rect x="38" y="22" width="20" height="4" rx="2" fill={color + '44'} />
      <rect x="38" y="30" width="25" height="4" rx="2" fill={color + '33'} />
    </svg>
  );
}

function ProgressBar({ pct, color, animated }) {
  return (
    <div style={{ background: V.surface3, borderRadius: 99, height: 6, overflow: 'hidden', width: '100%' }}>
      <div style={{
        height: '100%', width: `${pct}%`, borderRadius: 99,
        background: `linear-gradient(90deg, ${color}, ${color}bb)`,
        transition: animated ? 'width 0.4s ease' : 'none',
      }} />
    </div>
  );
}

function WaveformSVG({ active, bars }) {
  return (
    <svg viewBox={`0 0 ${bars.length * 6} 40`} style={{ width: '100%', height: 48 }}>
      {bars.map((h, i) => (
        <rect
          key={i}
          x={i * 6 + 1}
          y={(40 - h) / 2}
          width={4}
          height={h}
          rx={2}
          fill={active ? V.teal : V.muted}
          opacity={active ? 0.9 : 0.4}
        />
      ))}
    </svg>
  );
}

function DonutSVG() {
  const data = [
    { pct: 55, color: V.teal, label: 'MP4' },
    { pct: 25, color: V.gold, label: 'WebM' },
    { pct: 20, color: V.purple, label: 'MOV' },
  ];
  const r = 38, cx = 50, stroke = 12;
  let offset = 0;
  const circumference = 2 * Math.PI * r;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <svg viewBox="0 0 100 100" style={{ width: 90, height: 90, flexShrink: 0 }}>
        <circle cx={cx} cy={50} r={r} fill="none" stroke={V.surface3} strokeWidth={stroke} />
        {data.map((seg, i) => {
          const len = (seg.pct / 100) * circumference;
          const gap = circumference - len;
          const el = (
            <circle key={i} cx={cx} cy={50} r={r} fill="none"
              stroke={seg.color} strokeWidth={stroke}
              strokeDasharray={`${len} ${gap}`}
              strokeDashoffset={-offset * circumference / 100}
              style={{ transform: 'rotate(-90deg)', transformOrigin: '50px 50px' }}
            />
          );
          offset += seg.pct;
          return el;
        })}
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {data.map(d => (
          <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: d.color }} />
            <span style={{ color: V.muted }}>{d.label}</span>
            <span style={{ color: V.white, fontFamily: 'DM Mono, monospace', marginLeft: 'auto' }}>{d.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BarChartSVG({ bars }) {
  const max = Math.max(...bars);
  const W = 180, H = 70, n = bars.length, gap = 4, bw = (W - gap * (n - 1)) / n;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 70 }}>
      {bars.map((v, i) => {
        const bh = (v / max) * (H - 10);
        return (
          <g key={i}>
            <rect x={i * (bw + gap)} y={H - bh - 5} width={bw} height={bh}
              fill={V.teal + '99'} rx={2} />
            <rect x={i * (bw + gap)} y={H - bh - 5} width={bw} height={2}
              fill={V.teal} rx={1} />
          </g>
        );
      })}
    </svg>
  );
}

function LineSVG({ points }) {
  const W = 180, H = 70;
  const max = Math.max(...points);
  const coords = points.map((v, i) => {
    const x = (i / (points.length - 1)) * W;
    const y = H - 10 - ((v / max) * (H - 20));
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 70 }}>
      <polyline points={coords} fill="none" stroke={V.gold} strokeWidth={2} strokeLinejoin="round" />
      {points.map((v, i) => {
        const x = (i / (points.length - 1)) * W;
        const y = H - 10 - ((v / max) * (H - 20));
        return <circle key={i} cx={x} cy={y} r={3} fill={V.gold} />;
      })}
    </svg>
  );
}

function GaugeSVG({ pct }) {
  const r = 40, cx = 55;
  const arcLen = Math.PI * r;
  const filled = (pct / 100) * arcLen;
  return (
    <svg viewBox="0 0 110 65" style={{ width: 110, height: 65 }}>
      <path d={`M 15 55 A 40 40 0 0 1 95 55`} fill="none" stroke={V.surface3} strokeWidth={12} strokeLinecap="round" />
      <path d={`M 15 55 A 40 40 0 0 1 95 55`} fill="none" stroke={V.purple} strokeWidth={12}
        strokeLinecap="round" strokeDasharray={`${filled} ${arcLen}`} />
      <text x={cx} y={52} textAnchor="middle" fill={V.white} fontSize={14} fontWeight="bold"
        fontFamily="DM Mono, monospace">{pct}%</text>
      <text x={cx} y={63} textAnchor="middle" fill={V.muted} fontSize={8}>Storage</text>
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AIVideoStudio() {
  // Generation form state
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('Cinematic');
  const [selectedDuration, setSelectedDuration] = useState('30s');
  const [selectedRes, setSelectedRes] = useState('1080p');
  const [voiceOver, setVoiceOver] = useState(false);
  const [genStep, setGenStep] = useState(-1); // -1 = idle
  const [genDone, setGenDone] = useState(false);
  const genTimer = useRef(null);

  // Video library
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Timeline
  const [timelineZoom, setTimelineZoom] = useState(1);
  const [tlPlaying, setTlPlaying] = useState(false);
  const [playheadPct, setPlayheadPct] = useState(50);
  const tlTimer = useRef(null);

  // Scene detector
  const [sceneAnalyzing, setSceneAnalyzing] = useState(false);
  const [scenesDetected, setScenesDetected] = useState(false);

  // Voiceover studio
  const [voText, setVoText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('aria');
  const [voSpeed, setVoSpeed] = useState(1);
  const [voPitch, setVoPitch] = useState(0);
  const [voGenerating, setVoGenerating] = useState(false);
  const [voReady, setVoReady] = useState(false);
  const [waveActive, setWaveActive] = useState(false);
  const [waveBars, setWaveBars] = useState(() => {
    const base = [8, 12, 20, 30, 25, 18, 35, 28, 16, 22, 38, 30, 20, 14, 26, 32, 24, 18, 36, 28,
      22, 16, 30, 38, 26, 20, 14, 24, 32, 28, 18, 36, 22, 16, 28, 34, 20, 14, 26, 30];
    return base;
  });

  // Render queue progress
  const [queueProgress, setQueueProgress] = useState([78, 45, 100, 100]);
  const qTimer = useRef(null);

  // Effects
  const [activeEffects, setActiveEffects] = useState(new Set(['Fade In', 'Color Grade']));

  // Export preset
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [exportingPreset, setExportingPreset] = useState(null);

  // Analytics data (stable)
  const analyticsData = useMemo(() => ({
    dailyBars: [12, 19, 8, 24, 17, 31, 22],
    renderTimes: [4.2, 3.8, 5.1, 3.2, 4.7, 3.9, 4.1],
  }), []);

  // Video library data (stable)
  const videoLibrary = useMemo(() => {
    const colors = [V.teal, V.gold, V.purple, '#22c55e', V.red, '#f97316', '#ec4899', V.teal, V.gold];
    const statuses = ['Ready', 'Ready', 'Rendering', 'Ready', 'Failed', 'Ready', 'Ready', 'Rendering', 'Ready'];
    const titles = [
      'Product Launch Hero', 'Brand Story 2024', 'Tutorial Series Ep3',
      'Social Campaign Q2', 'Team Introduction', 'Demo Reel Cinematic',
      'Client Testimonial', 'Event Highlights', 'Annual Report Film',
    ];
    const durations = ['0:30', '1:45', '2:10', '0:15', '0:45', '2:30', '1:20', '3:00', '0:60'];
    const resolutions = ['4K', '1080p', '1080p', '720p', '1080p', '4K', '1080p', '4K', '1080p'];
    const dates = ['Jun 1', 'May 30', 'May 29', 'May 28', 'May 27', 'May 26', 'May 25', 'May 24', 'May 23'];
    return titles.map((title, i) => ({
      id: i, title, color: colors[i], status: statuses[i],
      duration: durations[i], resolution: resolutions[i], date: dates[i],
    }));
  }, []);

  // Scene detector data (stable)
  const detectedScenes = useMemo(() => [
    { id: 1, ts: '0:00', desc: 'Opening establishing shot — wide landscape pan', mood: 'Calm', color: V.teal },
    { id: 2, ts: '0:12', desc: 'Fast-cut montage sequence with music sync', mood: 'Energetic', color: V.gold },
    { id: 3, ts: '0:28', desc: 'Close-up interview with subject lighting', mood: 'Neutral', color: V.muted },
    { id: 4, ts: '0:45', desc: 'Climax action sequence with quick edits', mood: 'Dramatic', color: V.red },
    { id: 5, ts: '1:02', desc: 'Slow motion b-roll cutaway footage', mood: 'Calm', color: V.teal },
    { id: 6, ts: '1:18', desc: 'Call to action outro with logo reveal', mood: 'Energetic', color: V.gold },
  ], []);

  // Render queue data (stable)
  const renderQueue = useMemo(() => [
    { name: 'Brand Campaign Hero.mp4', res: '4K', eta: '2m 15s', status: 'Rendering' },
    { name: 'Tutorial Ep4 Final.mp4', res: '1080p', eta: '5m 48s', status: 'Rendering' },
    { name: 'Product Demo v3.mp4', res: '1080p', eta: '—', status: 'Done' },
    { name: 'Social Reel Cut.mp4', res: '720p', eta: '—', status: 'Done' },
  ], []);

  // Waveform animation
  useEffect(() => {
    if (!waveActive) return;
    const interval = setInterval(() => {
      setWaveBars(prev => prev.map(b => {
        const delta = (Math.floor(Date.now() / 100 + b) % 5) - 2;
        return Math.max(6, Math.min(38, b + delta));
      }));
    }, 120);
    return () => clearInterval(interval);
  }, [waveActive]);

  // Render queue animation
  useEffect(() => {
    qTimer.current = setInterval(() => {
      setQueueProgress(prev => prev.map((p, i) => {
        if (i >= 2) return p;
        return Math.min(100, p + (i === 0 ? 0.4 : 0.6));
      }));
    }, 300);
    return () => clearInterval(qTimer.current);
  }, []);

  // Timeline playback
  useEffect(() => {
    if (tlPlaying) {
      tlTimer.current = setInterval(() => {
        setPlayheadPct(prev => {
          if (prev >= 100) { setTlPlaying(false); return 0; }
          return prev + 0.2;
        });
      }, 50);
    } else {
      clearInterval(tlTimer.current);
    }
    return () => clearInterval(tlTimer.current);
  }, [tlPlaying]);

  // Generation sequence
  const handleGenerate = () => {
    if (genStep >= 0) return;
    setGenDone(false);
    setGenStep(0);
    let step = 0;
    const advance = () => {
      step++;
      if (step < GEN_STEPS.length) {
        setGenStep(step);
        genTimer.current = setTimeout(advance, 1800);
      } else {
        setGenStep(GEN_STEPS.length);
        setGenDone(true);
      }
    };
    genTimer.current = setTimeout(advance, 1800);
  };

  useEffect(() => () => clearTimeout(genTimer.current), []);

  const handleSceneAnalyze = () => {
    setSceneAnalyzing(true);
    setScenesDetected(false);
    setTimeout(() => { setSceneAnalyzing(false); setScenesDetected(true); }, 2400);
  };

  const handleVoiceGenerate = () => {
    setVoGenerating(true);
    setVoReady(false);
    setWaveActive(false);
    setTimeout(() => {
      setVoGenerating(false);
      setVoReady(true);
      setWaveActive(true);
    }, 2200);
  };

  const handleExport = (preset) => {
    setExportingPreset(preset.name);
    setTimeout(() => setExportingPreset(null), 2000);
  };

  const toggleEffect = (name) => {
    setActiveEffects(prev => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const statusColor = (s) => s === 'Ready' ? V.green : s === 'Rendering' ? V.gold : V.red;

  // Timeline track data (stable)
  const tlTracks = useMemo(() => [
    { name: 'Video', color: V.teal, clips: [{ left: 2, width: 30 }, { left: 35, width: 25 }, { left: 63, width: 32 }] },
    { name: 'Audio', color: V.gold, clips: [{ left: 0, width: 55 }, { left: 58, width: 40 }] },
    { name: 'Effects', color: V.purple, clips: [{ left: 10, width: 15 }, { left: 40, width: 20 }, { left: 70, width: 18 }] },
    { name: 'Captions', color: '#22c55e', clips: [{ left: 5, width: 45 }, { left: 55, width: 40 }] },
  ], []);

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: '100vh', background: V.surface, color: V.text,
      fontFamily: 'Syne, DM Mono, system-ui, sans-serif', padding: '32px 28px',
      boxSizing: 'border-box',
    }}>

      {/* ── 1. HERO HEADER ─────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: `linear-gradient(135deg, ${V.purple}, ${V.teal})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
              }}>🎬</div>
              <h1 style={{ margin: 0, fontSize: 32, fontWeight: 900, color: V.white, letterSpacing: '-0.02em' }}>
                AI Video Studio
              </h1>
            </div>
            <p style={{ margin: 0, fontSize: 14, color: V.muted, maxWidth: 480 }}>
              Generate, edit, and render AI-powered videos at scale
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{
              padding: '9px 20px', borderRadius: 8, border: `1px solid ${V.border}`,
              background: V.surface2, color: V.text, fontSize: 13, cursor: 'pointer',
            }}>Import Footage</button>
            <button style={{
              padding: '9px 20px', borderRadius: 8, border: 'none',
              background: `linear-gradient(135deg, ${V.purple}, ${V.teal})`,
              color: V.white, fontSize: 13, fontWeight: 700, cursor: 'pointer',
            }}>+ New Project</button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <StatCard label="Videos Created" value="1,247" color={V.teal} />
          <StatCard label="Hours Rendered" value="384h" color={V.gold} />
          <StatCard label="Storage Used" value="2.4 TB" color={V.purple} />
          <StatCard label="Active Jobs" value="3" color={V.green} />
        </div>
      </div>

      {/* ── 2. VIDEO GENERATION PANEL ──────────────────────────────────────── */}
      <div style={{
        background: V.surface2, border: `1px solid ${V.border}`, borderRadius: 16,
        padding: 28, marginBottom: 28,
      }}>
        <SectionTitle icon="✨" title="Video Generation" subtitle="Describe your scene and let AI do the rest" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, color: V.muted, display: 'block', marginBottom: 6 }}>Script / Prompt</label>
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="Describe your video scene..."
                rows={5}
                style={{
                  width: '100%', background: V.surface3, border: `1px solid ${V.border}`,
                  borderRadius: 10, color: V.white, padding: '12px 14px', fontSize: 13,
                  resize: 'vertical', fontFamily: 'DM Mono, monospace', outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, color: V.muted, display: 'block', marginBottom: 6 }}>Duration</label>
                <div style={{ display: 'flex', gap: 6 }}>
                  {DURATIONS.map(d => (
                    <button key={d} onClick={() => setSelectedDuration(d)} style={{
                      flex: 1, padding: '7px 0', borderRadius: 7,
                      border: `1px solid ${selectedDuration === d ? V.teal : V.border}`,
                      background: selectedDuration === d ? V.teal + '22' : V.surface3,
                      color: selectedDuration === d ? V.teal : V.muted,
                      fontSize: 11, fontWeight: 600, cursor: 'pointer',
                    }}>{d}</button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, color: V.muted, display: 'block', marginBottom: 6 }}>Resolution</label>
                <div style={{ display: 'flex', gap: 6 }}>
                  {RESOLUTIONS.map(r => (
                    <button key={r} onClick={() => setSelectedRes(r)} style={{
                      flex: 1, padding: '7px 0', borderRadius: 7,
                      border: `1px solid ${selectedRes === r ? V.gold : V.border}`,
                      background: selectedRes === r ? V.gold + '22' : V.surface3,
                      color: selectedRes === r ? V.gold : V.muted,
                      fontSize: 11, fontWeight: 600, cursor: 'pointer',
                    }}>{r}</button>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: V.text }}>Voice-over</span>
              <div
                onClick={() => setVoiceOver(v => !v)}
                style={{
                  width: 44, height: 24, borderRadius: 12, cursor: 'pointer', transition: 'background 0.3s',
                  background: voiceOver ? V.teal : V.surface3,
                  border: `1px solid ${voiceOver ? V.teal : V.border}`,
                  position: 'relative',
                }}
              >
                <div style={{
                  position: 'absolute', top: 3, left: voiceOver ? 22 : 3,
                  width: 16, height: 16, borderRadius: '50%',
                  background: V.white, transition: 'left 0.3s',
                }} />
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, color: V.muted, display: 'block', marginBottom: 8 }}>Style</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {STYLES.map(st => (
                  <button key={st} onClick={() => setSelectedStyle(st)} style={{
                    padding: '10px 14px', borderRadius: 8, textAlign: 'left',
                    border: `1px solid ${selectedStyle === st ? V.purple : V.border}`,
                    background: selectedStyle === st ? V.purple + '18' : V.surface3,
                    color: selectedStyle === st ? V.purple : V.text,
                    fontSize: 13, cursor: 'pointer', fontWeight: selectedStyle === st ? 600 : 400,
                  }}>{st}</button>
                ))}
              </div>
            </div>
            <div style={{
              background: V.surface3, borderRadius: 10, padding: '12px 16px',
              border: `1px solid ${V.border}`, fontSize: 12,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: V.muted }}>Est. Time</span>
                <span style={{ color: V.white, fontFamily: 'DM Mono, monospace' }}>
                  {selectedRes === '4K' ? '~8 min' : selectedRes === '1080p' ? '~4 min' : '~2 min'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: V.muted }}>Token Cost</span>
                <span style={{ color: V.gold, fontFamily: 'DM Mono, monospace' }}>
                  {selectedRes === '4K' ? '~1,200' : selectedRes === '1080p' ? '~640' : '~320'} tokens
                </span>
              </div>
            </div>
            <button
              onClick={handleGenerate}
              disabled={genStep >= 0 && !genDone}
              style={{
                padding: '14px', borderRadius: 10, border: 'none',
                background: genDone
                  ? V.green + 'cc'
                  : genStep >= 0
                    ? V.surface3
                    : `linear-gradient(135deg, ${V.purple}, ${V.teal})`,
                color: V.white, fontSize: 14, fontWeight: 700, cursor: genStep >= 0 && !genDone ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
              }}
            >
              {genDone ? '✓ Video Ready!' : genStep >= 0 ? `${GEN_STEPS[Math.min(genStep, GEN_STEPS.length - 1)]}…` : '⚡ Generate Video'}
            </button>
            {genStep >= 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {GEN_STEPS.map((step, i) => (
                  <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12 }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                      background: i < genStep ? V.green + '33' : i === genStep ? V.teal + '33' : V.surface3,
                      border: `1.5px solid ${i < genStep ? V.green : i === genStep ? V.teal : V.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: i < genStep ? V.green : i === genStep ? V.teal : V.muted,
                      fontSize: 10,
                    }}>
                      {i < genStep ? '✓' : i === genStep ? '●' : ''}
                    </div>
                    <span style={{ color: i <= genStep ? V.white : V.muted }}>{step}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── 3. VIDEO LIBRARY GRID ──────────────────────────────────────────── */}
      <div style={{
        background: V.surface2, border: `1px solid ${V.border}`, borderRadius: 16,
        padding: 28, marginBottom: 28,
      }}>
        <SectionTitle icon="🎞" title="Video Library" subtitle="9 videos · sorted by date" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {videoLibrary.map(vid => (
            <div
              key={vid.id}
              onClick={() => setSelectedVideo(vid)}
              style={{
                background: V.surface3, borderRadius: 12,
                border: `1px solid ${V.border}`, cursor: 'pointer', overflow: 'hidden',
                transition: 'border-color 0.2s, transform 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = vid.color + '66'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = V.border; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ height: 140, overflow: 'hidden' }}>
                <VideoThumbnailSVG color={vid.color} title={`v${vid.id}`} />
              </div>
              <div style={{ padding: '12px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: V.white, lineHeight: 1.3, maxWidth: '70%' }}>{vid.title}</span>
                  <span style={{
                    ...pill(statusColor(vid.status), vid.status),
                    fontSize: 10, padding: '2px 7px',
                  }}>{vid.status}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 8, fontSize: 11, color: V.muted }}>
                    <span>⏱ {vid.duration}</span>
                    <span style={{ color: vid.color, fontWeight: 600 }}>{vid.resolution}</span>
                    <span>{vid.date}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                  {['Preview', 'Download', 'Share'].map(a => (
                    <button
                      key={a}
                      onClick={e => e.stopPropagation()}
                      style={{
                        flex: 1, padding: '5px 0', fontSize: 10, borderRadius: 6,
                        border: `1px solid ${V.border}`, background: V.surface2,
                        color: V.muted, cursor: 'pointer',
                      }}
                    >{a}</button>
                  ))}
                  <button
                    onClick={e => e.stopPropagation()}
                    style={{
                      padding: '5px 8px', fontSize: 10, borderRadius: 6,
                      border: `1px solid ${V.red}33`, background: V.red + '11',
                      color: V.red, cursor: 'pointer',
                    }}
                  >🗑</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3b. VIDEO PREVIEW MODAL ─────────────────────────────────────────── */}
      {selectedVideo && (
        <div
          onClick={() => setSelectedVideo(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
            zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: V.surface2, borderRadius: 20, padding: 32, maxWidth: 600, width: '90%',
              border: `1px solid ${selectedVideo.color}55`,
            }}
          >
            <div style={{ height: 280, marginBottom: 20, borderRadius: 12, overflow: 'hidden' }}>
              <VideoThumbnailSVG color={selectedVideo.color} title={`modal-${selectedVideo.id}`} />
            </div>
            <h2 style={{ margin: '0 0 8px', color: V.white }}>{selectedVideo.title}</h2>
            <div style={{ display: 'flex', gap: 16, fontSize: 13, color: V.muted, marginBottom: 20 }}>
              <span>Duration: <b style={{ color: V.white }}>{selectedVideo.duration}</b></span>
              <span>Resolution: <b style={{ color: selectedVideo.color }}>{selectedVideo.resolution}</b></span>
              <span>Created: <b style={{ color: V.white }}>{selectedVideo.date}</b></span>
              <span style={{ ...pill(statusColor(selectedVideo.status)) }}>{selectedVideo.status}</span>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button style={{
                flex: 1, padding: '12px', borderRadius: 10, border: 'none',
                background: `linear-gradient(135deg, ${selectedVideo.color}, ${selectedVideo.color}88)`,
                color: V.surface, fontSize: 13, fontWeight: 700, cursor: 'pointer',
              }}>⬇ Download</button>
              <button onClick={() => setSelectedVideo(null)} style={{
                padding: '12px 20px', borderRadius: 10, border: `1px solid ${V.border}`,
                background: V.surface3, color: V.text, fontSize: 13, cursor: 'pointer',
              }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── 4. TIMELINE EDITOR ─────────────────────────────────────────────── */}
      <div style={{
        background: V.surface2, border: `1px solid ${V.border}`, borderRadius: 16,
        padding: 28, marginBottom: 28,
      }}>
        <SectionTitle icon="🎚" title="Timeline Editor" subtitle="Drag and arrange clips on the timeline" />
        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => { setTlPlaying(false); setPlayheadPct(0); }} style={{
              width: 34, height: 34, borderRadius: 8, border: `1px solid ${V.border}`,
              background: V.surface3, color: V.muted, fontSize: 14, cursor: 'pointer',
            }}>■</button>
            <button onClick={() => setTlPlaying(p => !p)} style={{
              width: 34, height: 34, borderRadius: 8, border: `1px solid ${V.teal}55`,
              background: V.teal + '22', color: V.teal, fontSize: 14, cursor: 'pointer',
            }}>{tlPlaying ? '⏸' : '▶'}</button>
          </div>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: V.muted }}>
            {Math.floor(playheadPct * 1.2).toString().padStart(2, '0')}:{Math.floor((playheadPct * 1.2 % 1) * 60).toString().padStart(2, '0')}
            &nbsp;/&nbsp;2:00
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
            <span style={{ fontSize: 12, color: V.muted }}>Zoom</span>
            <input type="range" min={0.5} max={4} step={0.1} value={timelineZoom}
              onChange={e => setTimelineZoom(Number(e.target.value))}
              style={{ width: 100, accentColor: V.teal }} />
            <span style={{ fontSize: 12, color: V.teal, fontFamily: 'DM Mono, monospace', width: 30 }}>
              {timelineZoom.toFixed(1)}x
            </span>
          </div>
        </div>
        {/* Scrubber */}
        <div style={{
          position: 'relative', height: 24, background: V.surface3, borderRadius: 6,
          marginBottom: 12, overflow: 'hidden', cursor: 'pointer',
        }}
          onClick={e => {
            const rect = e.currentTarget.getBoundingClientRect();
            setPlayheadPct(((e.clientX - rect.left) / rect.width) * 100);
          }}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute', left: `${(i / 11) * 100}%`, top: 0,
              width: 1, height: 12, background: V.border,
            }} />
          ))}
          <div style={{
            position: 'absolute', left: `${playheadPct}%`, top: 0, bottom: 0,
            width: 2, background: V.gold, transform: 'translateX(-1px)',
          }}>
            <div style={{ width: 10, height: 10, background: V.gold, borderRadius: 2, marginLeft: -4 }} />
          </div>
        </div>
        {/* Tracks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {tlTracks.map(track => (
            <div key={track.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 60, fontSize: 11, color: V.muted, flexShrink: 0 }}>{track.name}</span>
              <div style={{
                flex: 1, height: 32, background: V.surface3, borderRadius: 6,
                position: 'relative', overflow: 'hidden',
                minWidth: 0,
              }}>
                {track.clips.map((clip, ci) => (
                  <div key={ci} style={{
                    position: 'absolute', top: 4, bottom: 4,
                    left: `${clip.left * timelineZoom > 100 ? 100 : clip.left}%`,
                    width: `${clip.width}%`,
                    background: track.color + '33', border: `1px solid ${track.color}66`,
                    borderRadius: 4, cursor: 'grab', userSelect: 'none',
                    display: 'flex', alignItems: 'center', paddingLeft: 6,
                    fontSize: 10, color: track.color, overflow: 'hidden', whiteSpace: 'nowrap',
                  }}>
                    {track.name}
                  </div>
                ))}
                {/* Playhead overlay */}
                <div style={{
                  position: 'absolute', top: 0, bottom: 0,
                  left: `${playheadPct}%`, width: 1.5, background: V.gold + '88',
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. AI SCENE DETECTOR ──────────────────────────────────────────── */}
      <div style={{
        background: V.surface2, border: `1px solid ${V.border}`, borderRadius: 16,
        padding: 28, marginBottom: 28,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <SectionTitle icon="🔍" title="AI Scene Detector" subtitle="Automatically detect scene boundaries and mood" />
          <button
            onClick={handleSceneAnalyze}
            disabled={sceneAnalyzing}
            style={{
              padding: '10px 22px', borderRadius: 9, border: 'none',
              background: sceneAnalyzing ? V.surface3 : `linear-gradient(135deg, ${V.gold}, ${V.red})`,
              color: sceneAnalyzing ? V.muted : V.surface, fontSize: 13, fontWeight: 700,
              cursor: sceneAnalyzing ? 'not-allowed' : 'pointer',
            }}
          >
            {sceneAnalyzing ? '⟳ Analyzing…' : '⚡ Analyze Video'}
          </button>
        </div>
        {sceneAnalyzing && (
          <div style={{ textAlign: 'center', padding: '32px 0', color: V.muted, fontSize: 14 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🎬</div>
            Scanning frames and detecting scene boundaries…
            <div style={{ marginTop: 16, height: 4, background: V.surface3, borderRadius: 99, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: '60%', background: `linear-gradient(90deg, ${V.gold}, ${V.red})`,
                borderRadius: 99, animation: 'none',
              }} />
            </div>
          </div>
        )}
        {scenesDetected && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
            {detectedScenes.map(scene => (
              <div key={scene.id} style={{
                background: V.surface3, borderRadius: 10, padding: '14px 16px',
                border: `1px solid ${V.border}`, display: 'flex', gap: 14, alignItems: 'flex-start',
              }}>
                <SceneThumbnailSVG color={scene.color} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: V.muted, fontFamily: 'DM Mono, monospace' }}>
                      Scene {scene.id} · {scene.ts}
                    </span>
                    <span style={{
                      ...pill(MOOD_COLORS[scene.mood] || V.muted),
                      fontSize: 10, padding: '1px 7px',
                    }}>{scene.mood}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 12, color: V.text, lineHeight: 1.5 }}>{scene.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {!sceneAnalyzing && !scenesDetected && (
          <div style={{
            border: `2px dashed ${V.border}`, borderRadius: 12, padding: '40px 0',
            textAlign: 'center', color: V.muted, fontSize: 13,
          }}>
            Click "Analyze Video" to detect scene boundaries automatically
          </div>
        )}
      </div>

      {/* ── 6. VOICEOVER STUDIO ───────────────────────────────────────────── */}
      <div style={{
        background: V.surface2, border: `1px solid ${V.border}`, borderRadius: 16,
        padding: 28, marginBottom: 28,
      }}>
        <SectionTitle icon="🎙" title="Voiceover Studio" subtitle="Text-to-speech with customizable voices" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, color: V.muted, display: 'block', marginBottom: 6 }}>Script Text</label>
              <textarea
                value={voText}
                onChange={e => setVoText(e.target.value)}
                placeholder="Enter the text to convert to speech..."
                rows={4}
                style={{
                  width: '100%', background: V.surface3, border: `1px solid ${V.border}`,
                  borderRadius: 10, color: V.white, padding: '12px 14px', fontSize: 13,
                  resize: 'vertical', fontFamily: 'DM Mono, monospace', outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <label style={{ fontSize: 12, color: V.muted }}>Speed</label>
                  <span style={{ fontSize: 12, color: V.teal, fontFamily: 'DM Mono, monospace' }}>{voSpeed.toFixed(1)}x</span>
                </div>
                <input type="range" min={0.5} max={2} step={0.1} value={voSpeed}
                  onChange={e => setVoSpeed(Number(e.target.value))}
                  style={{ width: '100%', accentColor: V.teal }} />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <label style={{ fontSize: 12, color: V.muted }}>Pitch</label>
                  <span style={{ fontSize: 12, color: V.gold, fontFamily: 'DM Mono, monospace' }}>
                    {voPitch >= 0 ? '+' : ''}{voPitch}
                  </span>
                </div>
                <input type="range" min={-5} max={5} step={1} value={voPitch}
                  onChange={e => setVoPitch(Number(e.target.value))}
                  style={{ width: '100%', accentColor: V.gold }} />
              </div>
            </div>
            <button
              onClick={handleVoiceGenerate}
              disabled={voGenerating}
              style={{
                padding: '13px', borderRadius: 10, border: 'none',
                background: voGenerating ? V.surface3 : `linear-gradient(135deg, ${V.purple}, ${V.gold})`,
                color: voGenerating ? V.muted : V.surface, fontSize: 13, fontWeight: 700,
                cursor: voGenerating ? 'not-allowed' : 'pointer',
              }}
            >
              {voGenerating ? '⟳ Generating…' : voReady ? '✓ Regenerate' : '🎙 Generate Voiceover'}
            </button>
            {voReady && (
              <div style={{ background: V.surface3, borderRadius: 10, padding: '12px 14px', border: `1px solid ${V.teal}33` }}>
                <WaveformSVG active={waveActive} bars={waveBars} />
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button onClick={() => setWaveActive(a => !a)} style={{
                    flex: 1, padding: '7px', borderRadius: 7, border: `1px solid ${V.teal}55`,
                    background: V.teal + '22', color: V.teal, fontSize: 12, cursor: 'pointer',
                  }}>{waveActive ? '⏸ Pause' : '▶ Play'}</button>
                  <button style={{
                    flex: 1, padding: '7px', borderRadius: 7, border: `1px solid ${V.border}`,
                    background: V.surface2, color: V.muted, fontSize: 12, cursor: 'pointer',
                  }}>⬇ Download</button>
                </div>
              </div>
            )}
          </div>
          <div>
            <label style={{ fontSize: 12, color: V.muted, display: 'block', marginBottom: 10 }}>Select Voice</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {VOICE_OPTIONS.map(v => (
                <div
                  key={v.id}
                  onClick={() => setSelectedVoice(v.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px',
                    borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s',
                    border: `1px solid ${selectedVoice === v.id ? V.purple : V.border}`,
                    background: selectedVoice === v.id ? V.purple + '18' : V.surface3,
                  }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                    background: selectedVoice === v.id ? V.purple + '44' : V.surface2,
                    border: `1.5px solid ${selectedVoice === v.id ? V.purple : V.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, color: selectedVoice === v.id ? V.purple : V.muted,
                  }}>
                    {v.gender === 'F' ? '♀' : '♂'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: selectedVoice === v.id ? V.white : V.text }}>
                      {v.name}
                    </div>
                    <div style={{ fontSize: 11, color: V.muted }}>{v.accent}</div>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); setWaveActive(true); }}
                    style={{
                      width: 28, height: 28, borderRadius: '50%',
                      border: `1px solid ${V.border}`, background: V.surface2,
                      color: V.muted, fontSize: 12, cursor: 'pointer', flexShrink: 0,
                    }}
                  >▶</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 7. RENDER QUEUE ───────────────────────────────────────────────── */}
      <div style={{
        background: V.surface2, border: `1px solid ${V.border}`, borderRadius: 16,
        padding: 28, marginBottom: 28,
      }}>
        <SectionTitle icon="⚙️" title="Render Queue" subtitle="4 jobs · 2 active" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {renderQueue.map((job, i) => {
            const pct = queueProgress[i];
            const isDone = job.status === 'Done';
            return (
              <div key={i} style={{
                background: V.surface3, borderRadius: 12, padding: '16px 20px',
                border: `1px solid ${isDone ? V.green + '33' : V.border}`,
                display: 'flex', alignItems: 'center', gap: 16,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                  background: isDone ? V.green + '22' : V.gold + '22',
                  border: `1px solid ${isDone ? V.green + '44' : V.gold + '44'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18,
                }}>{isDone ? '✓' : '⟳'}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: V.white, fontWeight: 500 }}>{job.name}</span>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: V.muted, fontFamily: 'DM Mono, monospace' }}>{job.res}</span>
                      <span style={{
                        ...pill(isDone ? V.green : V.gold),
                        fontSize: 10, padding: '1px 8px',
                      }}>{isDone ? 'Done' : 'Rendering'}</span>
                    </div>
                  </div>
                  <ProgressBar pct={pct} color={isDone ? V.green : V.gold} animated={!isDone} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                    <span style={{ fontSize: 11, color: V.muted }}>
                      {isDone ? '100%' : `${pct.toFixed(1)}%`}
                    </span>
                    <span style={{ fontSize: 11, color: V.muted }}>
                      {isDone ? 'Completed' : `ETA: ${job.eta}`}
                    </span>
                  </div>
                </div>
                {isDone && (
                  <button style={{
                    padding: '8px 16px', borderRadius: 8, border: `1px solid ${V.green}44`,
                    background: V.green + '22', color: V.green, fontSize: 12, cursor: 'pointer', flexShrink: 0,
                  }}>⬇ Download</button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 8. ANALYTICS PANEL ────────────────────────────────────────────── */}
      <div style={{
        background: V.surface2, border: `1px solid ${V.border}`, borderRadius: 16,
        padding: 28, marginBottom: 28,
      }}>
        <SectionTitle icon="📊" title="Analytics" subtitle="Last 7 days production overview" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            {
              title: 'Videos per Day', sub: 'Last 7 days',
              chart: <BarChartSVG bars={analyticsData.dailyBars} />,
            },
            {
              title: 'Format Distribution', sub: 'By container',
              chart: <DonutSVG />,
            },
            {
              title: 'Avg Render Time', sub: 'Minutes per job',
              chart: <LineSVG points={analyticsData.renderTimes} />,
            },
            {
              title: 'Storage Usage', sub: '2.4 TB of 3.5 TB',
              chart: <GaugeSVG pct={68} />,
            },
          ].map(card => (
            <div key={card.title} style={{
              background: V.surface3, borderRadius: 12, padding: '16px 18px',
              border: `1px solid ${V.border}`,
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: V.white, marginBottom: 2 }}>{card.title}</div>
              <div style={{ fontSize: 11, color: V.muted, marginBottom: 14 }}>{card.sub}</div>
              {card.chart}
            </div>
          ))}
        </div>
      </div>

      {/* ── 9. CLIP EFFECTS GALLERY ───────────────────────────────────────── */}
      <div style={{
        background: V.surface2, border: `1px solid ${V.border}`, borderRadius: 16,
        padding: 28, marginBottom: 28,
      }}>
        <SectionTitle icon="✨" title="Clip Effects Gallery" subtitle="Toggle effects to apply to selected clips" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
          {EFFECTS.map(fx => {
            const active = activeEffects.has(fx.name);
            return (
              <div
                key={fx.name}
                onClick={() => toggleEffect(fx.name)}
                style={{
                  background: V.surface3, borderRadius: 10, padding: '14px 10px',
                  border: `1.5px solid ${active ? V.gold : V.border}`,
                  cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
                  boxShadow: active ? `0 0 12px ${V.gold}33` : 'none',
                }}
              >
                <svg viewBox="0 0 60 40" style={{ width: 60, height: 40, display: 'block', margin: '0 auto 8px' }}>
                  <rect width="60" height="40" rx="4" fill={fx.color + '22'} />
                  <rect x="8" y="8" width="44" height="24" rx="3" fill={fx.color + '33'}
                    stroke={fx.color + '66'} strokeWidth="1" />
                  <circle cx="30" cy="20" r="8" fill={fx.color + '55'} />
                  {active && <circle cx="30" cy="20" r="4" fill={fx.color} />}
                </svg>
                <div style={{ fontSize: 11, color: active ? V.gold : V.text, fontWeight: active ? 700 : 400 }}>
                  {fx.name}
                </div>
                {active && (
                  <div style={{ fontSize: 9, color: V.gold, marginTop: 3 }}>● Active</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 10. EXPORT PRESETS ───────────────────────────────────────────── */}
      <div style={{
        background: V.surface2, border: `1px solid ${V.border}`, borderRadius: 16,
        padding: 28, marginBottom: 28,
      }}>
        <SectionTitle icon="📤" title="Export Presets" subtitle="Choose a platform-optimized export configuration" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {EXPORT_PRESETS.map(preset => {
            const selected = selectedPreset === preset.name;
            const exporting = exportingPreset === preset.name;
            const [rw, rh] = preset.ratio.split(':').map(Number);
            const pw = 40, ph = Math.round((rh / rw) * pw);
            return (
              <div key={preset.name} style={{
                background: V.surface3, borderRadius: 12, padding: '20px',
                border: `1.5px solid ${selected ? preset.color : V.border}`,
                transition: 'all 0.2s',
                boxShadow: selected ? `0 0 20px ${preset.color}33` : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                  <div style={{
                    width: pw, height: Math.max(ph, 24), borderRadius: 4,
                    border: `2px solid ${preset.color}88`,
                    background: preset.color + '22', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 8, color: preset.color, fontWeight: 700,
                  }}>
                    {preset.ratio}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: V.white }}>{preset.name}</div>
                    <div style={{ fontSize: 11, color: preset.color, fontWeight: 600 }}>{preset.res}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: V.muted }}>Est. Size</span>
                    <span style={{ color: V.white, fontFamily: 'DM Mono, monospace' }}>{preset.size}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: V.muted }}>Bitrate</span>
                    <span style={{ color: V.white, fontFamily: 'DM Mono, monospace' }}>{preset.bitrate}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: V.muted }}>Aspect</span>
                    <span style={{ color: preset.color, fontFamily: 'DM Mono, monospace' }}>{preset.ratio}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => setSelectedPreset(preset.name)}
                    style={{
                      flex: 1, padding: '8px', borderRadius: 8,
                      border: `1px solid ${selected ? preset.color : V.border}`,
                      background: selected ? preset.color + '22' : V.surface2,
                      color: selected ? preset.color : V.muted,
                      fontSize: 12, cursor: 'pointer', fontWeight: selected ? 700 : 400,
                    }}
                  >{selected ? '✓ Selected' : 'Select'}</button>
                  <button
                    onClick={() => handleExport(preset)}
                    disabled={!!exportingPreset}
                    style={{
                      flex: 1, padding: '8px', borderRadius: 8, border: 'none',
                      background: exporting ? V.green + 'aa' : preset.color,
                      color: V.surface, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    }}
                  >{exporting ? '⟳ Exporting…' : '📤 Export'}</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '20px 0', fontSize: 12, color: V.muted }}>
        AI Video Studio · Bolt Studio Pro · {new Date().getFullYear()}
      </div>
    </div>
  );
}
