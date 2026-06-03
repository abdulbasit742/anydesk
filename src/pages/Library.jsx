import { useState, useMemo, useEffect } from 'react';
import { useStore } from '../data/store';
import { PROMPT_CATEGORIES, CAT_COLORS, QUICK_PROMPTS, PLATFORMS } from '../data/constants';
import { useToast } from '../components/Toast';
import EmptyState from '../components/EmptyState';

const CAT_ICONS = {
  'Web Design': '🎨', 'Mobile App': '📱', 'API/Backend': '⚙️',
  'Dashboard': '📊', 'E-commerce': '🛒', 'Landing Page': '🚀',
  'Component': '🧩', 'General': '💡', 'optimized': '✨',
  'Advanced Coding': '💻',
  'Technical Writing': '📝',
  'Enterprise Marketing': '📈',
  'Advanced UX/UI Design': '✨',
  'Deep Learning & NLP': '🧠',
  'Cloud Architecture & SRE': '☁️',
  'Advanced Cryptography & Web3': '🔐',
  'Financial Analysis & Strategy': '💵',
  'Scientific Research': '🔬',
  'Executive Productivity': '⚡',
  'Quantum Computing': '⚛️',
  'Bioinformatics': '🧬',
  'Game Development': '🎮',
  'Web3 & Solidity': '🔗',
  'Data Engineering': '🗄️',
  'Cybersecurity & Pen Testing': '🛡️',
  'Embedded Systems & IoT': '📟',
  'AI Agents & LangChain': '🤖',
  'Advanced DevOps & SRE': '⚙️',
  'Creative Design Systems': '🎨',
};

const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest First' },
  { id: 'oldest', label: 'Oldest First' },
  { id: 'most-used', label: 'Most Used' },
  { id: 'az', label: 'A → Z' },
  { id: 'za', label: 'Z → A' },
];

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateTime(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function truncate(str, len = 140) {
  return str.length > len ? str.slice(0, len) + '…' : str;
}

// ── Line-by-line diff computation ─────────────────────────────────────────────
function computeDiff(oldText, newText) {
  const oldLines = (oldText || '').split('\n');
  const newLines = (newText || '').split('\n');
  const result = [];
  const maxLen = Math.max(oldLines.length, newLines.length);
  for (let i = 0; i < maxLen; i++) {
    const o = oldLines[i];
    const n = newLines[i];
    if (o === undefined) {
      result.push({ type: 'add', text: n });
    } else if (n === undefined) {
      result.push({ type: 'remove', text: o });
    } else if (o === n) {
      result.push({ type: 'same', text: o });
    } else {
      result.push({ type: 'remove', text: o });
      result.push({ type: 'add', text: n });
    }
  }
  return result;
}

// Highly sophisticated local prompt optimizer generator
function getToneRewrittenPrompt(promptText, tone, enhancements) {
  let baseText = promptText;
  
  // Strip previous enhancements/tech blocks if any
  baseText = baseText.replace(/\n\n--- Tech Stack Requirements ---\n[\s\S]*/, "");
  baseText = baseText.replace(/^Act as[\s\S]*?\n\nOriginal Request:\n/, "");

  let rewritten;
  switch(tone) {
    case 'Pro':
      rewritten = `Act as an expert, senior software engineering consultant. Analyze the request and build an enterprise-ready, robust solution.\n\nOriginal Request:\n${baseText}\n\nKey Architecture:\n1. Adhere to rigid Clean Code principles, solid separation of concerns, and robust architectural boundaries.\n2. Ensure standard high-performance optimizations, defensive programming patterns, and full production resilience.`;
      break;
    case 'Creative':
      rewritten = `Act as a cutting-edge visual designer and creative UI/UX architect.\n\nOriginal Request:\n${baseText}\n\nDesign Concept:\n1. Transform this into an ultra-modern, jaw-dropping visual layout with dynamic micro-interactions.\n2. Incorporate vibrant dark-mode gradients, sleek glassmorphism, responsive masonry structures, and custom fluid animations to wow the user.`;
      break;
    case 'Concise':
      rewritten = `Act as an efficiency-focused engineer. Deliver the most compact, clean, and direct implementation.\n\nTask: ${baseText}\n\nConstraints: Pure vanilla solutions, minimal overhead, zero dependencies, lightning fast rendering.`;
      break;
    case 'Details':
      rewritten = `Act as a meticulous principal instructor. Break down the task into comprehensive, step-by-step modular units.\n\nGoal: ${baseText}\n\nDetailed Roadmap:\n1. Setup phase: Outline directory organization and clear variable interfaces.\n2. Implementation phase: Step-by-step commented code with inline unit explanations.\n3. Verification phase: Rigorous edge-case verification instructions.`;
      break;
    default:
      rewritten = baseText;
  }

  // Appending active selected checkboxes
  let techRequirements = [];
  if (enhancements.mobile) {
    techRequirements.push("- Ensure 100% responsive fluid mobile layouts using adaptive media queries and touch-friendly interaction targets.");
  }
  if (enhancements.typescript) {
    techRequirements.push("- Implement strict TypeScript contracts, strong interface definitions, explicit type declarations, and compile-safe interfaces.");
  }
  if (enhancements.aria) {
    techRequirements.push("- Meet strict WCAG standards, aria-label configurations, full screen-reader semantic trees, and keyboard-navigable index tabs.");
  }
  if (enhancements.animations) {
    techRequirements.push("- Integrate dynamic, GPU-accelerated micro-animations, slide-in entry frames, and springy CSS transitions.");
  }

  if (techRequirements.length > 0) {
    rewritten += `\n\n--- Tech Stack Requirements ---\n${techRequirements.join("\n")}`;
  }

  return rewritten;
}

export default function Library() {
  const { prompts, addPrompt, updatePrompt, deletePrompt, projects, accounts, addBroadcast, setState } = useStore();
  const toast = useToast();

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: '', category: 'General', prompt: '' });
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [showImport, setShowImport] = useState(false);

  // Bulk selection
  const [selected, setSelected] = useState(new Set());
  const [showBulkMoveDropdown, setShowBulkMoveDropdown] = useState(false);

  // Prompt Lab active selection state
  const [activePrompt, setActivePrompt] = useState(null);
  const [selectedTone, setSelectedTone] = useState('Original'); // 'Original' | 'Pro' | 'Creative' | 'Concise' | 'Details'
  const [enhancements, setEnhancements] = useState({
    mobile: false,
    typescript: false,
    aria: false,
    animations: false,
  });

  // Typewriter stream state
  const [typedPrompt, setTypedPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Selection targets for deployment
  const [selectedDeployType, setSelectedDeployType] = useState('account'); // 'account' | 'project'
  const [targetDeployId, setTargetDeployId] = useState('');

  // Keep target selections in sync when projects or accounts load
  useEffect(() => {
    const t = setTimeout(() => {
      if (selectedDeployType === 'account' && accounts?.length > 0) {
        setTargetDeployId(accounts[0].id);
      } else if (selectedDeployType === 'project' && projects?.length > 0) {
        setTargetDeployId(projects[0].id);
      } else {
        setTargetDeployId('');
      }
    }, 0);
    return () => clearTimeout(t);
  }, [selectedDeployType, accounts, projects]);

  const categoryCounts = useMemo(() => {
    const counts = { All: prompts.length };
    PROMPT_CATEGORIES.forEach(cat => {
      counts[cat] = prompts.filter(p => p.category === cat).length;
    });
    return counts;
  }, [prompts]);

  const filtered = useMemo(() => {
    let list = [...prompts];
    if (filterCat === 'starred') {
      list = list.filter(p => p.starred);
    } else if (filterCat !== 'All') {
      list = list.filter(p => p.category === filterCat);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => p.title.toLowerCase().includes(q) || p.prompt.toLowerCase().includes(q));
    }
    switch (sortBy) {
      case 'oldest': list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); break;
      case 'most-used': list.sort((a, b) => (b.useCount || 0) - (a.useCount || 0)); break;
      case 'az': list.sort((a, b) => a.title.localeCompare(b.title)); break;
      case 'za': list.sort((a, b) => b.title.localeCompare(a.title)); break;
      default: list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return list;
  }, [prompts, filterCat, search, sortBy]);

  const openAdd = () => {
    setEditId(null);
    setForm({ title: '', category: 'General', prompt: '' });
    setShowModal(true);
  };

  const openEdit = (p, e) => {
    e.stopPropagation();
    setEditId(p.id);
    setForm({ title: p.title, category: p.category || 'General', prompt: p.prompt });
    setShowModal(true);
  };

  const handleSave = (formData, id) => {
    if (!formData.title.trim() || !formData.prompt.trim()) {
      toast.error('Title and prompt are required');
      return;
    }
    if (id) {
      // Create a new version entry
      const existing = prompts.find(p => p.id === id);
      const now = new Date().toISOString();
      const versions = existing?.versions || [];
      const newVersion = {
        versionNum: versions.length + 1,
        text: formData.prompt,
        title: formData.title,
        category: formData.category,
        savedAt: now,
      };
      updatePrompt(id, { ...formData, versions: [...versions, newVersion] });
      toast.success('Prompt updated — v' + newVersion.versionNum + ' saved');
      if (activePrompt && activePrompt.id === id) {
        setActivePrompt(prev => ({ ...prev, ...formData }));
      }
    } else {
      addPrompt(formData);
      toast.bolt('Prompt saved to library!');
    }
    setShowModal(false);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    deletePrompt(id);
    toast.success('Prompt deleted');
    if (activePrompt && activePrompt.id === id) {
      setActivePrompt(null);
    }
    setSelected(prev => { const n = new Set(prev); n.delete(id); return n; });
  };

  const handleCopy = (text, e) => {
    e?.stopPropagation();
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const handleStar = (p, e) => {
    e.stopPropagation();
    updatePrompt(p.id, { starred: !p.starred });
    toast.success(p.starred ? 'Removed from starred' : '⭐ Starred!');
    if (activePrompt && activePrompt.id === p.id) {
      setActivePrompt(prev => ({ ...prev, starred: !prev.starred }));
    }
  };

  const handleImportQuick = () => {
    let imported = 0;
    QUICK_PROMPTS.forEach(qp => {
      const exists = prompts.some(p => p.prompt === qp);
      if (!exists) {
        addPrompt({ title: qp.slice(0, 50), category: 'General', prompt: qp });
        imported++;
      }
    });
    toast.bolt(`Imported ${imported} quick prompts!`);
    setShowImport(false);
  };

  // ── Bulk actions ──────────────────────────────────────────────────────────
  const toggleSelect = (id, e) => {
    e.stopPropagation();
    setSelected(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const selectAll = () => setSelected(new Set(filtered.map(p => p.id)));
  const clearSelection = () => setSelected(new Set());

  const handleBulkDelete = () => {
    if (selected.size === 0) return;
    setState(prev => ({ ...prev, prompts: prev.prompts.filter(p => !selected.has(p.id)) }));
    toast.success(`Deleted ${selected.size} prompt${selected.size > 1 ? 's' : ''}`);
    if (activePrompt && selected.has(activePrompt.id)) setActivePrompt(null);
    setSelected(new Set());
  };

  const handleBulkExport = () => {
    if (selected.size === 0) return;
    const exportPrompts = prompts.filter(p => selected.has(p.id));
    const blob = new Blob([JSON.stringify(exportPrompts, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompts-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.bolt(`Exported ${selected.size} prompts`);
  };

  const handleBulkMove = (category) => {
    if (selected.size === 0) return;
    setState(prev => ({
      ...prev,
      prompts: prev.prompts.map(p => selected.has(p.id) ? { ...p, category } : p),
    }));
    toast.success(`Moved ${selected.size} prompts to ${category}`);
    setSelected(new Set());
    setShowBulkMoveDropdown(false);
  };

  // Trigger workbench sliding drawer
  const handleSelectPromptForLab = (p) => {
    setActivePrompt(p);
    setSelectedTone('Original');
    setEnhancements({
      mobile: false,
      typescript: false,
      aria: false,
      animations: false,
    });
    setTypedPrompt(p.prompt);
  };

  // Handle Swapping Prompt Tones
  const handleToneChange = (tone) => {
    if (isTyping) return;
    setSelectedTone(tone);
    const resultText = getToneRewrittenPrompt(activePrompt.prompt, tone, enhancements);
    triggerTypewriter(resultText);
  };

  // Toggle checklist parameters
  const toggleEnhancement = (key) => {
    if (isTyping) return;
    const nextEnhancements = { ...enhancements, [key]: !enhancements[key] };
    setEnhancements(nextEnhancements);
    const resultText = getToneRewrittenPrompt(activePrompt.prompt, selectedTone, nextEnhancements);
    triggerTypewriter(resultText);
  };

  // Typewriter streaming writer
  const triggerTypewriter = (targetText) => {
    setIsTyping(true);
    let index = 0;
    setTypedPrompt('');
    
    const textLen = targetText.length;
    const intervalTime = 12; 
    
    const interval = setInterval(() => {
      if (index < textLen) {
        const chunkSize = Math.max(4, Math.ceil(textLen / 35));
        const nextSlice = targetText.slice(0, index + chunkSize);
        setTypedPrompt(nextSlice);
        index += chunkSize;
      } else {
        clearInterval(interval);
        setTypedPrompt(targetText);
        setIsTyping(false);
      }
    }, intervalTime);
  };

  // Diagnostics Rating Score Generator
  const score = useMemo(() => {
    if (!activePrompt) return 0;
    let totalScore = 45;

    const words = activePrompt.prompt.split(/\s+/).filter(Boolean).length;
    if (words > 40) totalScore += 15;
    else if (words > 15) totalScore += 8;

    const lowerText = activePrompt.prompt.toLowerCase();
    if (lowerText.includes('act as') || lowerText.includes('role') || lowerText.includes('identity')) totalScore += 15;
    if (lowerText.includes('constraints') || lowerText.includes('requirements') || lowerText.includes('rules')) totalScore += 15;

    Object.values(enhancements).forEach(val => {
      if (val) totalScore += 5;
    });

    if (selectedTone !== 'Original') totalScore += 10;

    return Math.min(100, totalScore);
  }, [activePrompt, selectedTone, enhancements]);

  // Deployment action
  const handleDeployPrompt = () => {
    if (!activePrompt) return;
    
    updatePrompt(activePrompt.id, { useCount: (activePrompt.useCount || 0) + 1 });
    navigator.clipboard.writeText(typedPrompt);

    if (selectedDeployType === 'account') {
      const targetAcc = accounts.find(a => a.id === targetDeployId);
      if (!targetAcc) {
        toast.error('Selected account not found');
        return;
      }
      addBroadcast({
        prompt: typedPrompt,
        targetIds: [targetAcc.id],
        successCount: 1,
        failureCount: 0,
      });
      toast.bolt(`📡 Transmitted to ${targetAcc.name}! (Copied to Clipboard)`);
    } else {
      const targetProj = projects.find(p => p.id === targetDeployId);
      if (!targetProj) {
        toast.error('Selected project not found');
        return;
      }
      const targetAccounts = accounts.filter(a => a.platform === targetProj.platform);
      addBroadcast({
        prompt: typedPrompt,
        targetIds: targetAccounts.map(a => a.id),
        successCount: Math.max(1, targetAccounts.length),
        failureCount: 0,
      });
      toast.bolt(`🚀 Broadcasted payload to channels in ${targetProj.name}!`);
    }
  };

  const emptyStateWrapper = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <EmptyState
        icon="📚"
        title="Prompt Library is empty"
        description="Save your best prompts for quick reuse across all your AI coding accounts."
      />
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <button className="btn btn-gold" onClick={openAdd}>+ New Prompt</button>
        <button className="btn btn-ghost" onClick={handleImportQuick}>⚡ Import Starter Pack</button>
      </div>

      <div className="card" style={{ padding: 20 }}>
        <div className="card-hdr" style={{ marginBottom: 12 }}>
          <span className="card-title">💡 Quick Start Templates</span>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>Click any to add to library</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
          {QUICK_PROMPTS.map((qp, i) => (
            <button
              key={i}
              onClick={() => { addPrompt({ title: qp.slice(0, 50), category: 'General', prompt: qp }); toast.bolt('Added!'); }}
              style={{
                padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface2)',
                color: 'var(--muted2)', cursor: 'pointer', textAlign: 'left', fontSize: 12, lineHeight: 1.5,
                transition: 'all 0.15s', fontFamily: '"Syne", sans-serif',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; e.currentTarget.style.background = 'var(--gold-glow)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted2)'; e.currentTarget.style.background = 'var(--surface2)'; }}
            >
              {qp}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if (!prompts.length) {
    return (
      <>
        {emptyStateWrapper()}
        {showModal && <PromptModal form={form} setForm={setForm} editId={editId} onSave={handleSave} onClose={() => setShowModal(false)} prompt={null} />}
      </>
    );
  }

  return (
    <div className={activePrompt ? "pw-container" : ""}>
      {/* LEFT SECTION (Main List) */}
      <div className="pw-main-content">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>📚 Prompt Library</span>
              <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, background: 'var(--gold-glow)', color: 'var(--gold)', border: '1px solid rgba(245,183,49,0.2)', fontWeight: 700 }}>
                {prompts.length} saved
              </span>
              {prompts.filter(p => p.starred).length > 0 && (
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, background: 'rgba(245,183,49,0.08)', color: '#f5b731', fontWeight: 700 }}>
                  ⭐ {prompts.filter(p => p.starred).length}
                </span>
              )}
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
              Click any prompt card to open the AI Laboratory &amp; Workbench Drawer
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {/* View mode toggle */}
            <div style={{ display: 'flex', background: 'var(--surface2)', borderRadius: 8, border: '1px solid var(--border)', overflow: 'hidden' }}>
              {['grid', 'list'].map(m => (
                <button
                  key={m}
                  onClick={() => setViewMode(m)}
                  style={{
                    padding: '5px 10px', border: 'none', cursor: 'pointer',
                    background: viewMode === m ? 'var(--gold-glow)' : 'transparent',
                    color: viewMode === m ? 'var(--gold)' : 'var(--muted)',
                    fontFamily: '"Syne",sans-serif', fontSize: 13, transition: 'all 0.2s',
                  }}
                >
                  {m === 'grid' ? '▦' : '☰'}
                </button>
              ))}
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => setShowImport(true)}>⚡ Import</button>
            <button className="btn btn-gold btn-sm" onClick={openAdd}>+ New Prompt</button>
          </div>
        </div>

        {/* Search + Filter row */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: 280 }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', pointerEvents: 'none', fontSize: 13 }}>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search prompts..."
              style={{ paddingLeft: 30, width: '100%' }}
            />
          </div>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface2)', color: '#e4e4ed', fontSize: 12, cursor: 'pointer' }}
          >
            {SORT_OPTIONS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
          {/* Select all toggle */}
          <button
            className="btn btn-ghost btn-sm"
            onClick={selected.size === filtered.length && filtered.length > 0 ? clearSelection : selectAll}
            style={{ fontSize: 11 }}
          >
            {selected.size === filtered.length && filtered.length > 0 ? '✕ Deselect All' : '☐ Select All'}
          </button>
        </div>

        {/* ── BULK ACTIONS BAR (slides in when items are selected) ────────────── */}
        <div style={{
          overflow: 'hidden',
          maxHeight: selected.size > 0 ? 56 : 0,
          opacity: selected.size > 0 ? 1 : 0,
          transition: 'max-height 0.25s ease, opacity 0.2s ease',
          marginBottom: selected.size > 0 ? 12 : 0,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px',
            background: 'rgba(245,183,49,0.06)', borderRadius: 10,
            border: '1px solid rgba(245,183,49,0.2)', flexWrap: 'wrap',
          }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold)', marginRight: 4 }}>
              {selected.size} selected
            </span>
            <button className="btn btn-danger btn-xs" onClick={handleBulkDelete} style={{ fontSize: 11 }}>
              🗑 Delete Selected
            </button>
            <button className="btn btn-ghost btn-xs" onClick={handleBulkExport} style={{ fontSize: 11 }}>
              📤 Export Selected
            </button>
            <div style={{ position: 'relative' }}>
              <button
                className="btn btn-ghost btn-xs"
                onClick={() => setShowBulkMoveDropdown(v => !v)}
                style={{ fontSize: 11 }}
              >
                📁 Move to Category ▾
              </button>
              {showBulkMoveDropdown && (
                <div style={{
                  position: 'absolute', top: '110%', left: 0, zIndex: 100,
                  background: 'var(--surface2)', border: '1px solid var(--border)',
                  borderRadius: 10, padding: 8, minWidth: 200,
                  maxHeight: 240, overflowY: 'auto',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                }}>
                  {PROMPT_CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => handleBulkMove(cat)}
                      style={{
                        display: 'block', width: '100%', textAlign: 'left',
                        padding: '6px 10px', background: 'none', border: 'none',
                        color: 'var(--muted2)', fontSize: 11, cursor: 'pointer', borderRadius: 6,
                        fontFamily: '"Syne", sans-serif',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface3)'; e.currentTarget.style.color = '#fff'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--muted2)'; }}
                    >
                      {CAT_ICONS[cat] || '📌'} {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              className="btn btn-ghost btn-xs"
              onClick={clearSelection}
              style={{ fontSize: 11, marginLeft: 'auto' }}
            >
              ✕ Clear
            </button>
          </div>
        </div>

        {/* Category pills */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
          {/* Feature 35: Starred/Favorite prompt template badge filter */}
          <button
            onClick={() => setFilterCat(filterCat === 'starred' ? 'All' : 'starred')}
            style={{
              padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600, cursor: 'pointer',
              border: `1px solid ${filterCat === 'starred' ? '#f5b731' : 'var(--border)'}`,
              background: filterCat === 'starred' ? 'rgba(245,183,49,0.15)' : 'transparent',
              color: filterCat === 'starred' ? '#f5b731' : 'var(--muted)',
              transition: 'all 0.15s',
            }}
          >
            ⭐ Starred Only ({prompts.filter(p => p.starred).length})
          </button>
          {['All', ...PROMPT_CATEGORIES].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              style={{
                padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                border: `1px solid ${filterCat === cat ? (CAT_COLORS[cat] || 'var(--gold)') : 'var(--border)'}`,
                background: filterCat === cat ? `${(CAT_COLORS[cat] || '#f5b731')}18` : 'transparent',
                color: filterCat === cat ? (CAT_COLORS[cat] || 'var(--gold)') : 'var(--muted)',
                transition: 'all 0.15s',
              }}
            >
              {CAT_ICONS[cat] || '📌'} {cat}
              {categoryCounts[cat] > 0 && (
                <span style={{ marginLeft: 4, opacity: 0.7 }}>({categoryCounts[cat]})</span>
              )}
            </button>
          ))}
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--muted)', fontSize: 13 }}>
            <div style={{ fontSize: 32, marginBottom: 8, opacity: 0.3 }}>🔍</div>
            No prompts match your search.
          </div>
        ) : viewMode === 'grid' ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 12,
            transition: 'all 0.2s ease',
          }}>
            {filtered.map(p => {
              const catColor = CAT_COLORS[p.category] || '#6b7280';
              const isActive = activePrompt && activePrompt.id === p.id;
              const isSelected = selected.has(p.id);
              return (
                <div
                  key={p.id}
                  onClick={() => handleSelectPromptForLab(p)}
                  style={{
                    background: 'var(--surface2)', borderRadius: 12, padding: 0, overflow: 'hidden',
                    border: `1px solid ${isSelected ? 'var(--teal)' : isActive ? 'var(--gold)' : 'var(--border)'}`,
                    cursor: 'pointer', transition: 'all 0.2s',
                    boxShadow: isSelected
                      ? '0 0 16px rgba(0,212,170,0.12)'
                      : isActive
                        ? '0 0 20px rgba(245, 183, 49, 0.15)'
                        : 'none',
                  }}
                  onMouseEnter={e => { if (!isActive && !isSelected) e.currentTarget.style.borderColor = catColor + '55'; }}
                  onMouseLeave={e => { if (!isActive && !isSelected) e.currentTarget.style.borderColor = 'var(--border)'; }}
                >
                  {/* Color stripe */}
                  <div style={{ height: 3, background: isSelected ? 'var(--teal)' : catColor }} />

                  <div style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      {/* Checkbox */}
                      <div
                        onClick={e => toggleSelect(p.id, e)}
                        style={{
                          width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                          border: `2px solid ${isSelected ? 'var(--teal)' : 'var(--border)'}`,
                          background: isSelected ? 'var(--teal)' : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          marginRight: 8, cursor: 'pointer', transition: 'all 0.15s',
                          fontSize: 9, color: '#000',
                        }}
                      >
                        {isSelected && '✓'}
                      </div>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: '#e4e4ed', lineHeight: 1.4, flex: 1, marginRight: 8 }}>
                        {p.title}
                      </div>
                      <button
                        onClick={e => handleStar(p, e)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, padding: 0, flexShrink: 0, color: p.starred ? '#f5b731' : 'var(--muted)' }}
                      >
                        {p.starred ? '⭐' : '☆'}
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 9.5, padding: '2px 7px', borderRadius: 999, fontWeight: 700, background: catColor + '18', color: catColor }}>
                        {CAT_ICONS[p.category] || '📌'} {p.category || 'General'}
                      </span>
                      {(p.useCount || 0) > 0 && (
                        <span style={{ fontSize: 9.5, padding: '2px 7px', borderRadius: 999, background: 'var(--teal-glow)', color: 'var(--teal)', fontWeight: 700 }}>
                          {p.useCount}× Used
                        </span>
                      )}
                      {p.versions?.length > 0 && (
                        <span style={{ fontSize: 9.5, padding: '2px 7px', borderRadius: 999, background: 'rgba(167,139,250,0.1)', color: '#a78bfa', fontWeight: 700 }}>
                          v{p.versions.length}
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: 11, color: 'var(--muted2)', lineHeight: 1.5, minHeight: 50 }}>
                      {truncate(p.prompt, 90)}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
                      <div style={{ fontSize: 9.5, color: 'var(--muted)' }}>{formatDate(p.createdAt)}</div>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-ghost btn-xs" style={{ padding: '2px 4px' }} onClick={e => openEdit(p, e)}>✏</button>
                        <button className="btn btn-danger btn-xs" style={{ padding: '2px 4px' }} onClick={e => handleDelete(p.id, e)}>🗑</button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* LIST VIEW */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, transition: 'all 0.2s ease' }}>
            {filtered.map(p => {
              const catColor = CAT_COLORS[p.category] || '#6b7280';
              const isActive = activePrompt && activePrompt.id === p.id;
              const isSelected = selected.has(p.id);
              return (
                <div
                  key={p.id}
                  onClick={() => handleSelectPromptForLab(p)}
                  style={{
                    background: 'var(--surface2)', borderRadius: 10, padding: '10px 14px',
                    border: `1px solid ${isSelected ? 'var(--teal)' : isActive ? 'var(--gold)' : 'var(--border)'}`,
                    display: 'flex', alignItems: 'center', gap: 10,
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { if (!isActive && !isSelected) e.currentTarget.style.borderColor = catColor + '44'; }}
                  onMouseLeave={e => { if (!isActive && !isSelected) e.currentTarget.style.borderColor = 'var(--border)'; }}
                >
                  {/* Checkbox */}
                  <div
                    onClick={e => toggleSelect(p.id, e)}
                    style={{
                      width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                      border: `2px solid ${isSelected ? 'var(--teal)' : 'var(--border)'}`,
                      background: isSelected ? 'var(--teal)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', transition: 'all 0.15s', fontSize: 9, color: '#000',
                    }}
                  >
                    {isSelected && '✓'}
                  </div>
                  <div style={{ width: 4, height: 32, borderRadius: 2, background: catColor, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#e4e4ed', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.starred && '⭐ '}{p.title}
                      {p.versions?.length > 0 && (
                        <span style={{ marginLeft: 6, fontSize: 10, padding: '1px 5px', borderRadius: 4, background: 'rgba(167,139,250,0.12)', color: '#a78bfa' }}>
                          v{p.versions.length}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>
                      {p.prompt}
                    </div>
                  </div>
                  <span style={{ fontSize: 9.5, padding: '2px 7px', borderRadius: 999, background: catColor + '18', color: catColor, fontWeight: 700, flexShrink: 0 }}>
                    {CAT_ICONS[p.category] || '📌'} {p.category}
                  </span>
                  <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                    <button className="btn btn-ghost btn-xs" onClick={e => openEdit(p, e)}>✏</button>
                    <button className="btn btn-danger btn-xs" onClick={e => handleDelete(p.id, e)}>🗑</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* RIGHT SPLIT-SCREEN WORKBENCH DRAWER */}
      {activePrompt && (
        <div className="pw-drawer">
          {/* Drawer Header */}
          <div className="pw-drawer-hdr">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="pw-drawer-title">🔬 Prompt Workbench</span>
                <span style={{ fontSize: 10, background: 'var(--gold-glow)', color: 'var(--gold)', border: '1px solid rgba(245,183,49,0.2)', padding: '1px 6px', borderRadius: 4, fontWeight: 600 }}>Lab</span>
              </div>
              <div className="pw-drawer-subtitle">{activePrompt.title} · Saved {formatDate(activePrompt.createdAt)}</div>
            </div>
            <button className="pw-close-btn" onClick={() => setActivePrompt(null)}>✕</button>
          </div>

          {/* Prompt Diagnostics Area */}
          <div className="pw-diagnostics">
            <div className="pw-radial-gauge">
              <svg className="pw-radial-svg" viewBox="0 0 56 56">
                <circle className="pw-radial-bg" cx="28" cy="28" r="24" />
                <circle
                  className="pw-radial-fill"
                  cx="28"
                  cy="28"
                  r="24"
                  stroke={score > 80 ? 'var(--teal)' : score > 60 ? 'var(--gold)' : 'var(--red)'}
                  strokeDasharray="150.8"
                  strokeDashoffset={150.8 - (score / 100) * 150.8}
                />
              </svg>
              <div className="pw-radial-text">{score}%</div>
            </div>
            <div className="pw-diag-details">
              <div className="pw-diag-title">AI Clarity &amp; Complexity Score</div>
              <div className="pw-diag-item">
                <span style={{ color: activePrompt.prompt.split(/\s+/).length > 25 ? 'var(--teal)' : 'var(--muted)' }}>✓</span>
                <span>Prompt Breadth ({activePrompt.prompt.split(/\s+/).length} words)</span>
              </div>
              <div className="pw-diag-item">
                <span style={{ color: (activePrompt.prompt.toLowerCase().includes('act as') || activePrompt.prompt.toLowerCase().includes('role')) ? 'var(--teal)' : 'var(--muted)' }}>✓</span>
                <span>Role Playing Identity</span>
              </div>
              <div className="pw-diag-item">
                <span style={{ color: selectedTone !== 'Original' ? 'var(--teal)' : 'var(--muted)' }}>✓</span>
                <span>AI Structure Modifier ({selectedTone})</span>
              </div>
            </div>
          </div>

          {/* Tone Swapper Selector */}
          <div>
            <div className="sec-lbl" style={{ marginBottom: 6 }}>Select Optimizer Tone</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {[
                { id: 'Original', label: 'Original' },
                { id: 'Pro', label: '💼 Pro' },
                { id: 'Creative', label: '🎨 Creative' },
                { id: 'Concise', label: '⚡ Concise' },
                { id: 'Details', label: '📋 Details' },
              ].map(t => (
                <button
                  key={t.id}
                  className={`pw-tone-pill ${selectedTone === t.id ? 'active' : ''}`}
                  onClick={() => handleToneChange(t.id)}
                  disabled={isTyping}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Side-by-Side Monospace Diffs */}
          <div className="pw-editor-grid">
            {/* Original Panel */}
            <div className="pw-diff-box">
              <div className="pw-diff-hdr">
                <span className="pw-diff-lbl">Original Prompt</span>
                <button className="btn btn-ghost btn-xs" style={{ padding: '2px 6px' }} onClick={() => handleCopy(activePrompt.prompt)}>Copy</button>
              </div>
              <div className="pw-diff-body">{activePrompt.prompt}</div>
            </div>

            {/* AI-Optimized Panel */}
            <div className="pw-diff-box enhanced">
              <div className="pw-diff-hdr">
                <span className="pw-diff-lbl teal-txt">AI-Optimized Prompt</span>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button className="btn btn-ghost btn-xs" style={{ padding: '2px 6px' }} onClick={() => handleCopy(typedPrompt)}>Copy</button>
                </div>
              </div>
              <div className="pw-diff-body" style={{ borderColor: 'var(--teal)' }}>
                {typedPrompt}
                {isTyping && <span className="pw-cursor" />}
              </div>
            </div>
          </div>

          {/* Interactive Checkbox Additions */}
          <div>
            <div className="sec-lbl" style={{ marginBottom: 6 }}>Inject Tech Constraints</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {[
                { id: 'mobile', label: '📱 Mobile Responsive' },
                { id: 'typescript', label: '🔒 Strict TypeScript' },
                { id: 'aria', label: '♿ Semantic WCAG ARIA' },
                { id: 'animations', label: '⏳ Premium CSS Animations' },
              ].map(item => (
                <label key={item.id} className="pw-chk-label" onClick={() => toggleEnhancement(item.id)}>
                  <div className={`pw-chk-box ${enhancements[item.id] ? 'active' : ''}`}>✓</div>
                  {item.label}
                </label>
              ))}
            </div>
          </div>

          {/* Direct Workspace Deployment / Transmitter */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <div className="sec-lbl" style={{ marginBottom: 4 }}>Direct Workspace Broadcast</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <select
                  value={selectedDeployType}
                  onChange={e => setSelectedDeployType(e.target.value)}
                  style={{ width: 120, padding: '6px 8px', fontSize: 11, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, color: '#fff', cursor: 'pointer' }}
                >
                  <option value="account">To Channel</option>
                  <option value="project">To Project</option>
                </select>

                <select
                  value={targetDeployId}
                  onChange={e => setTargetDeployId(e.target.value)}
                  style={{ flex: 1, padding: '6px 8px', fontSize: 11, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, color: '#fff', cursor: 'pointer' }}
                  disabled={selectedDeployType === 'account' ? !accounts?.length : !projects?.length}
                >
                  {selectedDeployType === 'account' ? (
                    accounts?.length ? accounts.map(a => (
                      <option key={a.id} value={a.id}>{a.name} ({PLATFORMS.find(p => p.id === a.platform)?.name || a.platform})</option>
                    )) : <option value="">No accounts connected</option>
                  ) : (
                    projects?.length ? projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.platform})</option>
                    )) : <option value="">No projects active</option>
                  )}
                </select>
              </div>
            </div>

            <button
              className="btn btn-teal"
              style={{ width: '100%', justifyContent: 'center', fontWeight: 'bold' }}
              onClick={handleDeployPrompt}
              disabled={isTyping || !targetDeployId}
            >
              🚀 Deploy Polished Prompt Payload
            </button>
          </div>
        </div>
      )}

      {/* Starter Pack Import Modal */}
      {showImport && (
        <div className="overlay" onClick={() => setShowImport(false)}>
          <div className="modal" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
            <div className="modal-title">⚡ Import Starter Pack</div>
            <p style={{ fontSize: 12.5, color: 'var(--muted2)', lineHeight: 1.6, marginBottom: 16 }}>
              Import starter prompts to jumpstart your library. Already-imported prompts will be skipped automatically.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 240, overflowY: 'auto', marginBottom: 16 }}>
              {QUICK_PROMPTS.map((qp, i) => (
                <div key={i} style={{ fontSize: 12, color: 'var(--muted2)', padding: '6px 10px', background: 'var(--surface)', borderRadius: 6, border: '1px solid var(--border)' }}>
                  {qp}
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost btn-sm" onClick={() => setShowImport(false)}>Cancel</button>
              <button className="btn btn-gold btn-sm" onClick={handleImportQuick}>⚡ Import All</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <PromptModal
          form={form}
          setForm={setForm}
          editId={editId}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
          prompt={editId ? prompts.find(p => p.id === editId) : null}
        />
      )}
    </div>
  );
}

// ── PromptModal with Version History tab ──────────────────────────────────────
function PromptModal({ form, setForm, editId, onSave, onClose, prompt }) {
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'history'
  const [diffVersion, setDiffVersion] = useState(null); // version object being previewed

  const versions = prompt?.versions || [];

  // Restore a version
  const handleRestore = (v) => {
    setForm({ title: v.title || form.title, category: v.category || form.category, prompt: v.text });
    setActiveTab('editor');
    setDiffVersion(null);
  };

  // Compute diff lines for preview
  const diffLines = diffVersion
    ? computeDiff(
        versions.find(v => v.versionNum === diffVersion - 1)?.text || '',
        versions.find(v => v.versionNum === diffVersion)?.text || ''
      )
    : [];

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 620 }} onClick={e => e.stopPropagation()}>
        <div className="modal-title">{editId ? '✏ Edit Prompt' : '+ New Prompt'}</div>

        {/* Tab bar — only show when editing an existing prompt */}
        {editId && (
          <div style={{ display: 'flex', gap: 2, marginBottom: 16, borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
            {[
              { id: 'editor', label: '✏ Editor' },
              { id: 'history', label: `🕘 Version History${versions.length > 0 ? ` (${versions.length})` : ''}` },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setDiffVersion(null); }}
                style={{
                  padding: '7px 14px', border: 'none', background: 'none', cursor: 'pointer',
                  fontFamily: '"Syne", sans-serif', fontSize: 12, fontWeight: 700,
                  color: activeTab === tab.id ? 'var(--gold)' : 'var(--muted)',
                  borderBottom: `2px solid ${activeTab === tab.id ? 'var(--gold)' : 'transparent'}`,
                  transition: 'all 0.15s', marginBottom: -1,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* ── EDITOR TAB ────────────────────────────────────────────── */}
        {activeTab === 'editor' && (
          <>
            <div className="form-row">
              <label>Title *</label>
              <input
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="e.g. SaaS Landing Page"
                autoFocus
              />
            </div>

            <div className="form-row">
              <label>Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {PROMPT_CATEGORIES.map(cat => <option key={cat} value={cat}>{CAT_ICONS[cat] || '📌'} {cat}</option>)}
              </select>
            </div>

            <div className="form-row">
              <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Prompt *</span>
                <span style={{ fontWeight: 400, fontSize: 10, color: 'var(--muted)' }}>
                  {form.prompt.split(/\s+/).filter(Boolean).length} words
                </span>
              </label>
              <textarea
                value={form.prompt}
                onChange={e => setForm(f => ({ ...f, prompt: e.target.value }))}
                placeholder="Enter your reusable prompt here..."
                style={{ minHeight: 140 }}
              />
            </div>

            <div className="modal-footer">
              <button className="btn btn-ghost btn-sm" onClick={onClose}>Cancel</button>
              <button className="btn btn-gold btn-sm" onClick={() => onSave(form, editId)}>
                {editId ? '✓ Save Changes' : '+ Save Prompt'}
              </button>
            </div>
          </>
        )}

        {/* ── VERSION HISTORY TAB ───────────────────────────────────── */}
        {activeTab === 'history' && (
          <div>
            {versions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--muted)', fontSize: 13 }}>
                <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.3 }}>🕘</div>
                No saved versions yet. Save changes to create the first version.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* Version list on left / diff on right */}
                <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 12, minHeight: 280 }}>
                  {/* Version list */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, overflowY: 'auto', maxHeight: 320 }}>
                    {[...versions].reverse().map(v => (
                      <div
                        key={v.versionNum}
                        onClick={() => setDiffVersion(v.versionNum)}
                        style={{
                          padding: '8px 10px', borderRadius: 8, cursor: 'pointer',
                          border: `1px solid ${diffVersion === v.versionNum ? 'var(--gold)' : 'var(--border)'}`,
                          background: diffVersion === v.versionNum ? 'var(--gold-glow)' : 'var(--surface2)',
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { if (diffVersion !== v.versionNum) e.currentTarget.style.borderColor = 'var(--border)'; }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                          <span style={{
                            fontSize: 10, fontWeight: 800,
                            color: diffVersion === v.versionNum ? 'var(--gold)' : '#a78bfa',
                            background: diffVersion === v.versionNum ? 'rgba(245,183,49,0.15)' : 'rgba(167,139,250,0.1)',
                            padding: '1px 6px', borderRadius: 4,
                          }}>v{v.versionNum}</span>
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--muted)', lineHeight: 1.4 }}>
                          {formatDateTime(v.savedAt)}
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--muted2)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {(v.text || '').slice(0, 40)}…
                        </div>
                        <button
                          className="btn btn-ghost btn-xs"
                          style={{ marginTop: 6, fontSize: 10, padding: '2px 6px', width: '100%', justifyContent: 'center' }}
                          onClick={e => { e.stopPropagation(); handleRestore(v); }}
                        >
                          ↩ Restore
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Diff panel */}
                  <div style={{
                    background: 'var(--surface)', borderRadius: 8, border: '1px solid var(--border)',
                    padding: 12, overflowY: 'auto', maxHeight: 320,
                    fontFamily: '"Fira Code", "Courier New", monospace', fontSize: 11, lineHeight: 1.6,
                  }}>
                    {diffVersion == null ? (
                      <div style={{ color: 'var(--muted)', textAlign: 'center', marginTop: 40, fontSize: 12 }}>
                        ← Select a version to view diff
                      </div>
                    ) : (
                      <>
                        <div style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 8, fontFamily: '"Syne", sans-serif' }}>
                          Diff: v{diffVersion - 1 > 0 ? diffVersion - 1 : '(original)'} → v{diffVersion}
                        </div>
                        {diffLines.map((line, i) => (
                          <div
                            key={i}
                            style={{
                              padding: '1px 6px', borderRadius: 3, marginBottom: 1,
                              background: line.type === 'add' ? 'rgba(0,212,170,0.08)' : line.type === 'remove' ? 'rgba(255,95,95,0.08)' : 'transparent',
                              color: line.type === 'add' ? '#00d4aa' : line.type === 'remove' ? '#ff7070' : 'var(--muted2)',
                              textDecoration: line.type === 'remove' ? 'line-through' : 'none',
                              opacity: line.type === 'same' ? 0.5 : 1,
                            }}
                          >
                            <span style={{ userSelect: 'none', marginRight: 8, opacity: 0.5 }}>
                              {line.type === 'add' ? '+' : line.type === 'remove' ? '−' : ' '}
                            </span>
                            {line.text || <span style={{ opacity: 0.3 }}>(empty line)</span>}
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>

                <div className="modal-footer" style={{ borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 4 }}>
                  <button className="btn btn-ghost btn-sm" onClick={onClose}>Close</button>
                  <button className="btn btn-gold btn-sm" onClick={() => setActiveTab('editor')}>← Back to Editor</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
