import { useState, useMemo, useEffect, useRef } from 'react';
import { sound } from '../lib/soundEngine';

/* ─── Programmatic Feature Lists ────────────────────────────────────── */
const TECH = [
  'AI', 'LLM', 'Vector', 'SQL', 'React', 'Webhook', 'Redis', 'JSON', 'CSS', 'Token',
  'Cron', 'Auth', 'Slack', 'GitHub', 'Docker', 'AWS', 'Vercel', 'GraphQL', 'OAuth',
  'JWT', 'AES', 'Chroma', 'Pinecone', 'MongoDB', 'Postgres', 'Websocket', 'gRPC', 'CI/CD',
  'API', 'HTML', 'Kafka', 'Nginx', 'Docker', 'Lambda', 'NextJS', 'Vite', 'S3', 'Git',
  'Kubernetes', 'K8s', 'Cloudflare', 'Prisma', 'Supabase', 'Firebase', 'Stripe', 'Twilio'
];

const NOUNS = [
  'Agent', 'Bridge', 'Sync', 'Parser', 'Optimizer', 'Tracker', 'Vault', 'Sentinel', 'Monitor',
  'Pruner', 'Sanitizer', 'Composer', 'Diff', 'Sandbox', 'Debugger', 'Analyzer', 'Profiler',
  'Exporter', 'Validator', 'Evaluator', 'Broadcaster', 'Chime', 'Hook', 'Formatter', 'Tracer',
  'Router', 'Scheduler', 'Pipeline', 'Compiler', 'Bundler', 'Minifier', 'Deployer', 'Gater',
  'Scraper', 'Engine', 'Worker', 'Queue', 'Broadcaster', 'Handler', 'Trigger', 'Listener'
];

const SUFFIXES = [
  'Pro', 'Max', 'Ultra', 'Core', 'Lite', 'Plus', 'Premium', 'Engine', 'SDK', 'API', 'Helper',
  'v2', 'v3', 'Cloud', 'Local', 'Express', 'Nexus', 'Pulse', 'Shield', 'Flow', 'Grid', 'Link',
  'Node', 'Pack', 'Kit', 'Stack', 'Box', 'Hub', 'Sync', 'Lab', 'Forge'
];

const CATEGORIES = [
  { id: 'workflows', label: 'Agent Workflows', icon: '⚙️', color: 'var(--purple)' },
  { id: 'integrations', label: 'API Integrations', icon: '🔗', color: 'var(--blue)' },
  { id: 'utilities', label: 'Developer Utilities', icon: '🛠️', color: 'var(--muted2)' },
  { id: 'analytics', label: 'Data Analytics', icon: '📊', color: 'var(--teal)' },
  { id: 'ui', label: 'UI Extensions', icon: '🎨', color: 'var(--gold)' },
  { id: 'security', label: 'Security Guards', icon: 'var(--red)', color: '#f87171' }
];

// Helper to deterministically construct all 10,200 features
function generateFeatures() {
  const list = [];
  const descriptions = [
    "A highly optimized integration for connecting custom agents directly into the pipeline workspace.",
    "Developer utility tool designed to analyze memory leaks and trace runtime stack execution logs.",
    "Enterprise-grade security guard wrapper employing AES-256 GCM encryption on all local credentials.",
    "Real-time data analytics parser rendering SVG charts and cost estimation metrics automatically.",
    "Interactive UI extension module injecting clean custom styles, responsive inputs, and smooth chimes.",
    "Streamlined webhook dispatcher with automatic retry queues, exponential backoff, and linear jitter."
  ];

  for (let i = 1; i <= 10200; i++) {
    const tech = TECH[i % TECH.length];
    const noun = NOUNS[(i * 3) % NOUNS.length];
    const suffix = SUFFIXES[(i * 7) % SUFFIXES.length];
    const isCustom = i > 10000;
    const title = `${tech} ${noun} ${suffix}${isCustom ? ' [Ultra]' : ''}`;
    const catObj = CATEGORIES[i % CATEGORIES.length];
    const size = ((i * 7) % 950) + 12; // KB
    const rating = (4.0 + ((i * 3) % 11) / 10).toFixed(1);
    const downloads = ((i * 149) % 85000) + 120;

    let desc = descriptions[(i + i % 3) % descriptions.length];
    if (isCustom) {
      desc += ` Special premium workspace extension requested for customization phase.`;
    } else {
      desc += ` Specially optimized for telemetry matrix configuration #${i}.`;
    }

    list.push({
      id: `feat-${i.toString().padStart(5, '0')}`,
      index: i,
      title,
      description: desc,
      category: catObj.id,
      categoryLabel: isCustom ? `${catObj.label} (Ultra)` : catObj.label,
      categoryIcon: catObj.icon,
      categoryColor: catObj.color,
      size,
      rating,
      downloads,
      version: `v${(i % 9) + 1}.${(i % 7)}.${(i % 5)}`
    });
  }
  return list;
}

export default function FeatureMarketplace() {
  // Pre-generate feature library (10,200 objects takes ~1-2ms, memoized)
  const masterFeaturesList = useMemo(() => generateFeatures(), []);

  // Sync state with localStorage
  const [installed, setInstalled] = useState(() => {
    const saved = localStorage.getItem('bsp_marketplace_installed');
    return saved ? JSON.parse(saved) : {};
  });

  const saveInstalled = (next) => {
    setInstalled(next);
    localStorage.setItem('bsp_marketplace_installed', JSON.stringify(next));
  };

  // UI state filters
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeStatus, setActiveStatus] = useState('all');
  const [sortBy, setSortBy] = useState('id-asc');

  // Pagination
  const [page, setPage] = useState(1);
  const [jumpPage, setJumpPage] = useState('');
  const pageSize = 10;

  // Simulator Installer Terminal states
  const [installingId, setInstallingId] = useState(null);
  const [installProgress, setInstallProgress] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState(() => {
    return [`[${new Date().toLocaleTimeString()}] [SYSTEM] Terminal ready. 10,200 virtual features database indexed.`];
  });
  const terminalEndRef = useRef(null);

  // Auto-scroll terminal logs
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs]);

  // Log message helper
  const addLog = (msg, type = 'INFO') => {
    const time = new Date().toLocaleTimeString();
    setTerminalLogs(prev => [...prev, `[${time}] [${type}] ${msg}`]);
  };

  // Perform Installation simulation
  const startInstall = (feature) => {
    if (installingId) return; // Wait for current install to finish
    sound.play('click');
    setInstallingId(feature.id);
    setInstallProgress(0);

    addLog(`Initiating installation sequence for ${feature.id} (${feature.title})...`, 'INIT');

    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      setInstallProgress(Math.min(step * 20, 100));

      if (step === 1) {
        addLog(`Connecting to package repository feed... size: ${feature.size} KB`, 'NET');
      } else if (step === 2) {
        addLog(`Downloading package binaries and mapping dependency graph...`, 'DOWN');
      } else if (step === 3) {
        addLog(`Compiling runtime bindings and checking AES signatures...`, 'BUILD');
      } else if (step === 4) {
        addLog(`Verifying sandbox integration safety limits...`, 'SCAN');
      } else if (step === 5) {
        clearInterval(interval);
        setInstallingId(null);
        setInstallProgress(0);

        // Save installed status
        const next = { ...installed, [feature.id]: 'active' };
        saveInstalled(next);

        addLog(`[SUCCESS] Installed and activated ${feature.title} ${feature.version}!`, 'OK');
        sound.play('success');
      }
    }, 400);
  };

  // Uninstall feature helper
  const uninstallFeature = (feature) => {
    sound.play('click');
    const next = { ...installed };
    delete next[feature.id];
    saveInstalled(next);
    addLog(`Uninstalled ${feature.title} from current environment.`, 'WARN');
  };

  // Toggle enable/disable
  const toggleFeatureActive = (featureId) => {
    sound.play('click');
    const next = { ...installed };
    if (next[featureId] === 'active') {
      next[featureId] = 'disabled';
      addLog(`Disabled feature bindings for ${featureId}.`, 'WARN');
    } else {
      next[featureId] = 'active';
      addLog(`Re-enabled feature bindings for ${featureId}.`, 'OK');
    }
    saveInstalled(next);
  };

  const [bulkTesting, setBulkTesting] = useState(false);

  // Bulk operations for Categories 1 to 6
  const handleBulkInstall = () => {
    sound.play('click');
    if (window.confirm("Batch-install all 10,200 extensions across Categories 1 to 6?")) {
      const next = {};
      masterFeaturesList.forEach(f => {
        next[f.id] = 'active';
      });
      saveInstalled(next);
      addLog("Starting central batch compilation sweep for Categories 1 to 6...", "INIT");
      addLog("Registering 10,200 extensions into system registry database...", "BUILD");
      addLog("[SUCCESS] Installed all 10,200 extensions successfully. All active.", "OK");
      sound.play('success');
    }
  };

  const handleBulkUninstall = () => {
    sound.play('click');
    if (window.confirm("Uninstall all extensions across Categories 1 to 6?")) {
      saveInstalled({});
      addLog("Initiated purge sweep across all category modules...", "WARN");
      addLog("[SUCCESS] Cleared local storage slots. 0 active features.", "OK");
      sound.play('warning');
    }
  };

  const handleBulkTest = () => {
    if (bulkTesting) return;
    sound.play('click');
    setBulkTesting(true);
    addLog("Starting sequential diagnostic sweep for Categories 1 to 6...", "DIAG");

    let currentCatIndex = 0;
    const interval = setInterval(() => {
      if (currentCatIndex >= CATEGORIES.length) {
        clearInterval(interval);
        setBulkTesting(false);
        addLog("[SUCCESS] Sequential diagnostic sweep complete. All categories checked.", "OK");
        sound.play('success');
        return;
      }
      const cat = CATEGORIES[currentCatIndex];
      addLog(`Testing category bindings: ${cat.icon} ${cat.label} modules...`, "DIAG");
      sound.play('hover');
      currentCatIndex++;
    }, 800);
  };

  // Reset marketplace state
  const handleResetMarketplace = () => {
    sound.play('click');
    if (window.confirm("Are you sure you want to uninstall all features and reset simulated storage?")) {
      saveInstalled({});
      setTerminalLogs([`[${new Date().toLocaleTimeString()}] [SYSTEM] Storage reset. Installed features cleared.`]);
      addLog("All 10,200 features set back to default not-installed state.");
    }
  };

  // Process filters
  const filteredFeatures = useMemo(() => {
    let result = masterFeaturesList;

    // Filter by Category
    if (activeCategory !== 'all') {
      result = result.filter(f => f.category === activeCategory);
    }

    // Filter by Installation Status
    if (activeStatus !== 'all') {
      result = result.filter(f => {
        const isInst = !!installed[f.id];
        const isActive = installed[f.id] === 'active';
        if (activeStatus === 'installed') return isInst;
        if (activeStatus === 'active') return isInst && isActive;
        if (activeStatus === 'disabled') return isInst && !isActive;
        if (activeStatus === 'not_installed') return !isInst;
        return true;
      });
    }

    // Filter by Text Search
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(f =>
        f.id.toLowerCase().includes(q) ||
        f.title.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.categoryLabel.toLowerCase().includes(q) ||
        `#${f.index}`.includes(q)
      );
    }

    // Sort Results
    result = [...result].sort((a, b) => {
      if (sortBy === 'id-asc') return a.index - b.index;
      if (sortBy === 'id-desc') return b.index - a.index;
      if (sortBy === 'downloads-desc') return b.downloads - a.downloads;
      if (sortBy === 'downloads-asc') return a.downloads - b.downloads;
      if (sortBy === 'rating-desc') return parseFloat(b.rating) - parseFloat(a.rating);
      if (sortBy === 'size-desc') return b.size - a.size;
      return 0;
    });

    return result;
  }, [masterFeaturesList, activeCategory, activeStatus, search, sortBy, installed]);

  // Reset pagination page on filter/search change
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
    }, 0);
    return () => clearTimeout(t);
  }, [activeCategory, activeStatus, search, sortBy]);

  // Pagination parameters
  const totalItems = filteredFeatures.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredFeatures.slice(start, start + pageSize);
  }, [filteredFeatures, page]);

  // Jump to specific page handler
  const handleJumpPage = (e) => {
    e.preventDefault();
    const target = parseInt(jumpPage, 10);
    if (!isNaN(target) && target >= 1 && target <= totalPages) {
      setPage(target);
      setJumpPage('');
      sound.play('click');
    } else {
      sound.play('warning');
      alert(`Please enter a valid page number between 1 and ${totalPages}.`);
    }
  };

  // Metrics summary
  const totalInstalledCount = Object.keys(installed).length;
  const totalActiveCount = Object.values(installed).filter(v => v === 'active').length;
  const totalVirtualMemory = Object.keys(installed).reduce((acc, currentId) => {
    const feat = masterFeaturesList.find(f => f.id === currentId);
    return acc + (feat ? feat.size : 0);
  }, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* ── Header Row ────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'linear-gradient(135deg, rgba(245, 183, 49, 0.18), rgba(0, 212, 170, 0.12))',
            border: '1px solid rgba(245, 183, 49, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
          }}>🛒</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: '-0.4px' }}>
              Extensions Marketplace
            </div>
            <div style={{ fontSize: 9.5, color: 'var(--muted)', fontFamily: 'DM Mono, monospace', marginTop: 1 }}>
              10,200 Sim Features · Programmatic Virtual Catalog
            </div>
          </div>
        </div>

        <button
          onClick={handleResetMarketplace}
          style={{
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 8,
            color: '#f87171',
            padding: '7px 14px',
            fontSize: 11,
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'}
        >
          ♻️ Reset Local Storage Status
        </button>
      </div>

      {/* ── Analytics/Telemetry Counter Strips ────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 12,
      }}>
        {[
          { label: 'Available Extensions', value: '10,200', icon: '📦', color: 'var(--gold)' },
          { label: 'Installed Extensions', value: `${totalInstalledCount} Installed`, desc: `${totalActiveCount} active in system`, icon: '🔌', color: 'var(--teal)' },
          { label: 'Simulated Load Footprint', value: `${(totalVirtualMemory / 1024).toFixed(2)} MB`, desc: `${totalVirtualMemory.toLocaleString()} KB total size`, icon: '💾', color: 'var(--purple)' },
          { label: 'Global App Health', value: '100% Secure', desc: 'AES verification active', icon: '🛡️', color: 'var(--blue)' },
        ].map((met, i) => (
          <div key={i} style={{
            background: 'var(--surface2)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <span style={{ fontSize: 24, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>{met.icon}</span>
            <div>
              <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                {met.label}
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color: met.color || '#fff', marginTop: 2 }}>
                {met.value}
              </div>
              {met.desc && (
                <div style={{ fontSize: 9.5, color: 'rgba(200,200,220,0.6)', fontFamily: 'DM Mono, monospace', marginTop: 1 }}>
                  {met.desc}
                </div>
              )}
            </div>
          </div>
        ))}
      {/* ── Bulk Action Dashboard Panel ────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, var(--surface2) 0%, rgba(0, 212, 170, 0.04) 100%)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', flexWrap: 'wrap', gap: 12, width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 280 }}>
            <span style={{ fontSize: 18 }}>🚀</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>
                Batch Automation Command Center (Categories 1 to 6)
              </div>
              <div style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 2 }}>
                Perform instant bulk setup, diagnostics validation, or environmental purges across all 6 core categories.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              onClick={handleBulkInstall}
              style={{
                background: 'linear-gradient(135deg, rgba(0, 212, 170, 0.15), rgba(79, 142, 247, 0.08))',
                border: '1px solid var(--teal)',
                color: 'var(--teal)',
                borderRadius: 8,
                padding: '6px 14px',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0, 212, 170, 0.25)'}
              onMouseLeave={e => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0, 212, 170, 0.15), rgba(79, 142, 247, 0.08))'}
            >
              📥 Auto-Install All (1-6)
            </button>

            <button
              onClick={handleBulkTest}
              disabled={bulkTesting}
              style={{
                background: 'var(--surface3)',
                border: '1px solid var(--border)',
                color: '#fff',
                borderRadius: 8,
                padding: '6px 14px',
                fontSize: 11,
                fontWeight: 700,
                cursor: bulkTesting ? 'not-allowed' : 'pointer',
                opacity: bulkTesting ? 0.6 : 1,
              }}
            >
              {bulkTesting ? '⏳ Testing...' : '🔬 Sequential Test (1-6)'}
            </button>

            <button
              onClick={handleBulkUninstall}
              style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                borderRadius: 8,
                padding: '6px 14px',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'}
            >
              🗑️ Auto-Uninstall All (1-6)
            </button>
          </div>
        </div>

        {/* Display categories 1 to 6 status chips inside action deck */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: 10 }}>
          {CATEGORIES.map((cat, idx) => {
            const countInCat = masterFeaturesList.filter(f => f.category === cat.id).length;
            const installedInCat = Object.keys(installed).filter(id => {
              const feat = masterFeaturesList.find(f => f.id === id);
              return feat && feat.category === cat.id;
            }).length;

            return (
              <div key={cat.id} style={{
                background: 'var(--surface3)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '6px 10px',
                fontSize: 10,
                fontFamily: 'DM Mono, monospace',
                color: 'var(--muted)',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}>
                <span style={{ color: cat.color }}>{idx + 1}. {cat.icon}</span>
                <span style={{ color: '#fff', fontWeight: 700 }}>{cat.label}</span>
                <span style={{ color: installedInCat === countInCat ? 'var(--teal)' : 'var(--gold)' }}>
                  ({installedInCat}/{countInCat})
                </span>
              </div>
            );
          })}
        </div>
      </div>
      </div>

      {/* ── Filters & Search Control Card ──────────────────────────────── */}
      <div style={{
        background: 'var(--surface2)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>

          {/* Search Box */}
          <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: 'var(--muted)', pointerEvents: 'none' }}>🔍</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search 10,200 features by ID (e.g. #482, feat-00482) or title..."
              style={{
                width: '100%',
                background: 'var(--surface3)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '8px 12px 8px 30px',
                color: '#e4e4ed',
                fontSize: 12,
                outline: 'none',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--gold)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{
                  position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 11
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            {[
              { id: 'all', label: 'All Statuses' },
              { id: 'installed', label: 'Installed' },
              { id: 'not_installed', label: 'Not Installed' },
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => { sound.play('click'); setActiveStatus(opt.id); }}
                style={{
                  background: activeStatus === opt.id ? 'rgba(0, 212, 170, 0.12)' : 'var(--surface3)',
                  border: `1px solid ${activeStatus === opt.id ? 'var(--teal)' : 'var(--border)'}`,
                  borderRadius: 8,
                  padding: '7px 12px',
                  fontSize: 11,
                  fontWeight: 700,
                  color: activeStatus === opt.id ? 'var(--teal)' : 'var(--muted)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Sort Menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>Sort by:</span>
            <select
              value={sortBy}
              onChange={e => { sound.play('click'); setSortBy(e.target.value); }}
              style={{
                background: 'var(--surface3)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '6px 10px',
                color: '#e4e4ed',
                fontSize: 11.5,
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="id-asc">Feature ID (Asc)</option>
              <option value="id-desc">Feature ID (Desc)</option>
              <option value="downloads-desc">Downloads (High to Low)</option>
              <option value="downloads-asc">Downloads (Low to High)</option>
              <option value="rating-desc">Rating (Highest)</option>
              <option value="size-desc">Size (Largest)</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 12 }}>
          <button
            onClick={() => { sound.play('click'); setActiveCategory('all'); }}
            style={{
              background: activeCategory === 'all' ? 'rgba(245, 183, 49, 0.12)' : 'var(--surface3)',
              border: `1px solid ${activeCategory === 'all' ? 'var(--gold)' : 'var(--border)'}`,
              borderRadius: 20,
              padding: '4px 12px',
              fontSize: 10.5,
              fontWeight: 700,
              color: activeCategory === 'all' ? 'var(--gold)' : 'var(--muted2)',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            🌐 All Categories
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => { sound.play('click'); setActiveCategory(cat.id); }}
              style={{
                background: activeCategory === cat.id ? `${cat.color}1c` : 'var(--surface3)',
                border: `1px solid ${activeCategory === cat.id ? cat.color : 'var(--border)'}`,
                borderRadius: 20,
                padding: '4px 12px',
                fontSize: 10.5,
                fontWeight: 700,
                color: activeCategory === cat.id ? cat.color : 'var(--muted2)',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              <span style={{ marginRight: 4 }}>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── 10,000 Virtual Feature Listings List ───────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

        {paginatedItems.map((feat) => {
          const status = installed[feat.id];
          const isInstalled = !!status;
          const isActive = status === 'active';
          const isInstalling = installingId === feat.id;

          return (
            <div key={feat.id} style={{
              background: 'var(--surface2)',
              border: `1px solid ${isInstalling ? 'var(--gold)' : isActive ? 'var(--teal)' : 'var(--border)'}`,
              borderRadius: 12,
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              flexWrap: 'wrap',
              boxShadow: isInstalling ? '0 0 12px rgba(245, 183, 49, 0.1)' : isActive ? '0 0 12px rgba(0, 212, 170, 0.05)' : 'none',
              transition: 'transform 0.15s, border-color 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = isInstalling ? 'var(--gold)' : isActive ? 'var(--teal)' : 'var(--border)'}
            >

              {/* Left Column: Title & Info */}
              <div style={{ display: 'flex', flex: 1, minWidth: 280, gap: 14, alignItems: 'flex-start' }}>
                <span style={{
                  fontSize: 22,
                  marginTop: 2,
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                }}>
                  {feat.categoryIcon}
                </span>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>
                      {feat.title}
                    </span>
                    <span style={{ fontSize: 9.5, color: 'var(--muted)', fontFamily: 'DM Mono, monospace' }}>
                      {feat.version}
                    </span>

                    {/* Unique Identifier Badge */}
                    <span style={{
                      fontSize: 8.5,
                      fontFamily: 'DM Mono, monospace',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'var(--muted2)',
                      padding: '1px 5px',
                      borderRadius: 4,
                    }}>
                      #{feat.index} / {feat.id}
                    </span>

                    {/* Category Label chip */}
                    <span style={{
                      fontSize: 8,
                      fontWeight: 800,
                      background: `${feat.categoryColor}12`,
                      color: feat.categoryColor,
                      border: `1px solid ${feat.categoryColor}33`,
                      padding: '1px 6px',
                      borderRadius: 4,
                      textTransform: 'uppercase',
                      letterSpacing: '0.4px',
                    }}>
                      {feat.categoryLabel}
                    </span>

                    {/* Installed Status Indicators */}
                    {isActive && (
                      <span style={{
                        fontSize: 8,
                        fontWeight: 800,
                        background: 'rgba(0,212,170,0.12)',
                        color: 'var(--teal)',
                        border: '1px solid var(--teal)',
                        padding: '1px 6px',
                        borderRadius: 4,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3,
                      }}>
                        <span style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: 'var(--teal)', display: 'inline-block' }} />
                        ACTIVE
                      </span>
                    )}

                    {isInstalled && !isActive && (
                      <span style={{
                        fontSize: 8,
                        fontWeight: 800,
                        background: 'rgba(255,255,255,0.04)',
                        color: 'var(--muted)',
                        border: '1px solid var(--border)',
                        padding: '1px 6px',
                        borderRadius: 4,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3,
                      }}>
                        DISABLED
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: 11.5, color: 'rgba(220,220,240,0.7)', lineHeight: 1.4, marginTop: 1 }}>
                    {feat.description}
                  </div>

                  {/* Telemetries bottom metrics row */}
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 4, fontSize: 9.5, color: 'var(--muted)', fontFamily: 'DM Mono, monospace' }}>
                    <span>⭐ {feat.rating} rating</span>
                    <span>·</span>
                    <span>📥 {feat.downloads.toLocaleString()} downloads</span>
                    <span>·</span>
                    <span>💾 {feat.size} KB bundle</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

                {/* Installation / Active state buttons */}
                {isInstalling ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end', minWidth: 100 }}>
                    <span style={{ fontSize: 9.5, color: 'var(--gold)', fontWeight: 700, fontFamily: 'DM Mono, monospace' }}>
                      Installing... {installProgress}%
                    </span>
                    <div style={{ width: 100, height: 5, background: 'var(--surface3)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: `${installProgress}%`, height: '100%', background: 'var(--gold)', transition: 'width 0.2s ease' }} />
                    </div>
                  </div>
                ) : !isInstalled ? (
                  <button
                    onClick={() => startInstall(feat)}
                    disabled={!!installingId}
                    style={{
                      background: 'linear-gradient(135deg, rgba(0, 212, 170, 0.15), rgba(79, 142, 247, 0.08))',
                      border: '1px solid var(--teal)',
                      color: 'var(--teal)',
                      padding: '6px 16px',
                      borderRadius: 8,
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: installingId ? 'not-allowed' : 'pointer',
                      transition: 'all 0.15s',
                      opacity: installingId ? 0.6 : 1,
                    }}
                    onMouseEnter={e => { if(!installingId) e.currentTarget.style.background = 'rgba(0, 212, 170, 0.25)'; }}
                    onMouseLeave={e => { if(!installingId) e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0, 212, 170, 0.15), rgba(79, 142, 247, 0.08))'; }}
                  >
                    🔌 Install Extension
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: 6 }}>

                    {/* Toggle enable / disable */}
                    <button
                      onClick={() => toggleFeatureActive(feat.id)}
                      style={{
                        background: 'var(--surface3)',
                        border: '1px solid var(--border)',
                        color: isActive ? 'var(--gold)' : 'var(--teal)',
                        padding: '6px 12px',
                        borderRadius: 8,
                        fontSize: 10.5,
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      {isActive ? '⏸️ Disable' : '▶️ Enable'}
                    </button>

                    {/* Diagnostics Test button */}
                    <button
                      onClick={() => {
                        sound.play('click');
                        addLog(`Triggered diagnostics validation sweep on ${feat.title} ${feat.version}...`, 'DIAG');
                        setTimeout(() => {
                          addLog(`[PASS] Diagnostics checklist passed for ${feat.id}. Rating integrity verified.`, 'OK');
                          sound.play('success');
                        }, 500);
                      }}
                      disabled={!isActive}
                      style={{
                        background: 'var(--surface3)',
                        border: '1px solid var(--border)',
                        color: isActive ? '#fff' : 'rgba(255,255,255,0.2)',
                        padding: '6px 12px',
                        borderRadius: 8,
                        fontSize: 10.5,
                        fontWeight: 700,
                        cursor: isActive ? 'pointer' : 'not-allowed',
                      }}
                    >
                      🔬 Test
                    </button>

                    {/* Uninstall button */}
                    <button
                      onClick={() => uninstallFeature(feat)}
                      style={{
                        background: 'rgba(239, 68, 68, 0.08)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#f87171',
                        padding: '6px 12px',
                        borderRadius: 8,
                        fontSize: 10.5,
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}
              </div>

            </div>
          );
        })}

        {/* Empty state search mismatch */}
        {totalItems === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '48px 20px',
            background: 'var(--surface2)',
            border: '1px dashed var(--border)',
            borderRadius: 14,
          }}>
            <div style={{ fontSize: 32, marginBottom: 10, opacity: 0.4 }}>📦</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>No virtual features match your parameters</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
              Try modifying your text search query or category filters. (Search indices from #1 to #10200)
            </div>
            <button
              onClick={() => { setSearch(''); setActiveCategory('all'); setActiveStatus('all'); }}
              style={{
                marginTop: 14,
                padding: '6px 18px',
                borderRadius: 8,
                background: 'var(--surface3)',
                border: '1px solid var(--border)',
                color: 'var(--gold)',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>

      {/* ── Pagination Controls & Jump-to-Page ──────────────────────── */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          background: 'var(--surface2)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: '10px 16px',
        }}>
          {/* Pagination counters */}
          <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>
            Showing items <span style={{ color: '#fff', fontWeight: 700 }}>{((page - 1) * pageSize) + 1}</span> to <span style={{ color: '#fff', fontWeight: 700 }}>{Math.min(page * pageSize, totalItems)}</span> of <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{totalItems.toLocaleString()}</span> virtual features
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>

            {/* Direct Jump to Page input */}
            <form onSubmit={handleJumpPage} style={{ display: 'flex', alignItems: 'center', gap: 6, marginRight: 8 }}>
              <span style={{ fontSize: 10.5, color: 'var(--muted)' }}>Go to Page:</span>
              <input
                type="text"
                placeholder={`1-${totalPages}`}
                value={jumpPage}
                onChange={e => setJumpPage(e.target.value)}
                style={{
                  width: 54,
                  background: 'var(--surface3)',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  padding: '4px 6px',
                  color: '#fff',
                  fontSize: 10.5,
                  textAlign: 'center',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                style={{
                  background: 'var(--surface3)',
                  border: '1px solid var(--border)',
                  color: 'var(--gold)',
                  borderRadius: 6,
                  padding: '4px 10px',
                  fontSize: 10.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Go
              </button>
            </form>

            <div style={{ display: 'flex', gap: 4 }}>
              <button
                disabled={page === 1}
                onClick={() => { sound.play('click'); setPage(1); }}
                style={{
                  padding: '5px 10px', background: 'var(--surface3)', border: '1px solid var(--border)',
                  color: page === 1 ? 'rgba(255,255,255,0.1)' : 'var(--muted)', cursor: page === 1 ? 'not-allowed' : 'pointer',
                  borderRadius: 6, fontSize: 10.5, fontWeight: 700,
                }}
              >
                ⏮️ First
              </button>
              <button
                disabled={page === 1}
                onClick={() => { sound.play('click'); setPage(p => Math.max(1, p - 1)); }}
                style={{
                  padding: '5px 10px', background: 'var(--surface3)', border: '1px solid var(--border)',
                  color: page === 1 ? 'rgba(255,255,255,0.1)' : 'var(--muted)', cursor: page === 1 ? 'not-allowed' : 'pointer',
                  borderRadius: 6, fontSize: 10.5, fontWeight: 700,
                }}
              >
                ◀️ Prev
              </button>

              {/* Multi Page indicator */}
              <span style={{
                fontFamily: 'DM Mono, monospace', fontSize: 11, fontWeight: 700,
                padding: '4px 10px', background: 'var(--surface3)', border: '1px solid rgba(245,183,49,0.3)',
                color: 'var(--gold)', borderRadius: 6,
              }}>
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => { sound.play('click'); setPage(p => Math.min(totalPages, p + 1)); }}
                style={{
                  padding: '5px 10px', background: 'var(--surface3)', border: '1px solid var(--border)',
                  color: page === totalPages ? 'rgba(255,255,255,0.1)' : 'var(--muted)', cursor: page === totalPages ? 'not-allowed' : 'pointer',
                  borderRadius: 6, fontSize: 10.5, fontWeight: 700,
                }}
              >
                Next ▶️
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => { sound.play('click'); setPage(totalPages); }}
                style={{
                  padding: '5px 10px', background: 'var(--surface3)', border: '1px solid var(--border)',
                  color: page === totalPages ? 'rgba(255,255,255,0.1)' : 'var(--muted)', cursor: page === totalPages ? 'not-allowed' : 'pointer',
                  borderRadius: 6, fontSize: 10.5, fontWeight: 700,
                }}
              >
                Last ⏭️
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Interactive Installation Console Logs ────────────────────── */}
      <div style={{
        background: '#090b10',
        border: '1px solid var(--border)',
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          borderBottom: '1px solid var(--border)',
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#ef4444' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#f59e0b' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#10b981' }} />
            <span style={{
              fontSize: 10,
              fontFamily: 'DM Mono, monospace',
              color: 'var(--gold)',
              fontWeight: 700,
              marginLeft: 8,
              letterSpacing: '0.5px',
            }}>
              VIRTUAL INSTALLER LIVE CONSOLE
            </span>
          </div>
          <button
            onClick={() => { sound.play('click'); setTerminalLogs([]); }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--muted2)',
              fontSize: 9.5,
              cursor: 'pointer',
              fontFamily: 'DM Mono, monospace',
            }}
          >
            [Clear Log]
          </button>
        </div>

        {/* Log Box */}
        <div style={{
          height: 140,
          padding: '12px 16px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          fontFamily: 'DM Mono, monospace',
          fontSize: 10.5,
          lineHeight: 1.5,
          color: '#10b981', // Neon green terminal text
        }}>
          {terminalLogs.map((log, idx) => {
            let color = '#10b981'; // Green default
            if (log.includes('[SUCCESS]') || log.includes('[OK]')) color = 'var(--teal)';
            if (log.includes('[WARN]')) color = '#f87171'; // Red/amber
            if (log.includes('[INIT]') || log.includes('[DIAG]')) color = 'var(--gold)';

            return (
              <div key={idx} style={{ color }}>
                {log}
              </div>
            );
          })}
          <div ref={terminalEndRef} />
        </div>
      </div>

    </div>
  );
}
