import { useState } from 'react';
import { useStore } from '../data/store';
import { PLATFORMS } from '../data/constants';
import { PlatformIcon } from '../components/PlatformBadge';
import { useToast } from '../components/Toast';
import EmptyState from '../components/EmptyState';
import { sound } from '../lib/soundEngine';
import { PromptOptimizer } from '../components/library/PromptOptimizer';
import { classifyPrompt } from '../lib/smartRouter';

// --- Preset Templates ---
const TEMPLATES = [
  {
    label: 'Dark Mode SaaS App',
    icon: '🌙',
    text: 'Build a beautiful {{appName}} dashboard using a premium dark slate color theme. Integrate responsive charts, analytics metrics widgets, and a sidebar navigation.'
  },
  {
    label: 'Mobile Responsive Web',
    icon: '📱',
    text: 'Create a mobile responsive landing page for {{appName}} with adaptive layouts, touch targets, and a flexible grid. Theme color should be {{themeColor}}.'
  },
  {
    label: 'Secure JWT Server Node',
    icon: '🛡️',
    text: 'Generate secure Express.js auth routes for {{appName}} with bcrypt hashing, custom rate-limit caps, and strict CORS headers.'
  },
  {
    label: 'Clean TypeScript Helper',
    icon: '🔷',
    text: 'Fix all TypeScript type-casting warnings on {{appName}} components, replace explicit "any" with custom strict interfaces.'
  }
];

// --- Dynamic Strength labels ---
function getStrengthLabel(wordCount) {
  if (wordCount === 0) return { label: 'Empty', color: 'var(--muted)' };
  if (wordCount < 6) return { label: 'Weak', color: 'var(--red)' };
  if (wordCount < 15) return { label: 'Good', color: 'var(--gold)' };
  return { label: 'Optimal Strength', color: 'var(--teal)' };
}

export default function Broadcast() {
  const { accounts, addBroadcast, updateAccount } = useStore();
  const toast = useToast();

  const activeAccounts = accounts.filter(a => a.status === 'active');

  // Broadcast Core states
  const [prompt, setPrompt] = useState('Build a premium dark-themed {{appName}} dashboard with custom {{themeColor}} widgets.');
  const routerAnalysis = classifyPrompt(prompt);
  const [selectedIds, setSelectedIds] = useState(() => activeAccounts.map(a => a.id));
  const [delay, setDelay] = useState(1200);
  const [isSending, setIsSending] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // Variable Interpolation states
  const [variableValues, setVariableValues] = useState({}); // { [accId]: { [varName]: value } }

  // Real-time Regex Variable Scanner (derived state calculated on render)
  const matches = Array.from(prompt.matchAll(/\{\{([a-zA-Z0-9_]+)\}\}/g)).map(m => m[1]);
  const variables = [...new Set(matches)];

  // Helper to resolve variable values with smart defaults
  const getVariableValue = (accId, varName) => {
    const customVal = variableValues[accId]?.[varName];
    if (customVal !== undefined) return customVal;

    // Smart defaults
    if (varName === 'appName') {
      const acc = accounts.find(a => a.id === accId);
      return acc ? acc.name.replace(' Workspace', '').replace(' Account', '') + ' CRM' : '';
    }
    if (varName === 'themeColor') {
      const acc = accounts.find(a => a.id === accId);
      const pl = PLATFORMS.find(p => p.id === acc?.platform);
      return pl ? pl.color : '#00d4aa';
    }
    return '';
  };

  // Hover layout preview states
  const [hoveredPreviewId, setHoveredPreviewId] = useState(null);

  // ── Mission Queue Scheduler ─────────────────────────────────────
  const [queue, setQueue] = useState([
    { id: 'q1', label: 'Dark Mode SaaS', text: 'Build a beautiful {{appName}} dashboard using a premium dark slate color theme. Integrate responsive charts and analytics metrics.', priority: 'high', status: 'pending' },
    { id: 'q2', label: 'Auth Security Patch', text: 'Implement JWT refresh token rotation and add rate limiting middleware to all auth routes.', priority: 'critical', status: 'pending' },
    { id: 'q3', label: 'Mobile Responsive', text: 'Make all pages fully responsive from 320px to 2560px with touch-friendly tap targets.', priority: 'medium', status: 'pending' },
  ]);
  const [queueRunning, setQueueRunning] = useState(false);
  const [activeQueueId, setActiveQueueId] = useState(null);

  const PRIORITY_CONFIG = {
    critical: { color: 'var(--red)',    bg: 'rgba(255,95,95,0.1)',    label: '🔴 Critical' },
    high:     { color: 'var(--gold)',   bg: 'rgba(245,183,49,0.1)',   label: '🟡 High' },
    medium:   { color: 'var(--blue)',   bg: 'rgba(79,142,247,0.1)',   label: '🔵 Medium' },
    low:      { color: 'var(--muted)',  bg: 'rgba(107,107,130,0.1)', label: '⚪ Low' },
  };

  const handleAddToQueue = () => {
    if (!prompt.trim()) { toast.error('Write a prompt first to add to queue'); return; }
    const newItem = {
      id: 'q' + Date.now(),
      label: prompt.trim().slice(0, 28) + (prompt.length > 28 ? '...' : ''),
      text: prompt.trim(),
      priority: 'medium',
      status: 'pending',
    };
    setQueue(prev => [...prev, newItem]);
    toast.success('Prompt added to Mission Queue!');
  };

  const handleMoveQueue = (id, dir) => {
    setQueue(prev => {
      const idx = prev.findIndex(q => q.id === id);
      if (idx === -1) return prev;
      const next = [...prev];
      const targetIdx = idx + dir;
      if (targetIdx < 0 || targetIdx >= next.length) return prev;
      [next[idx], next[targetIdx]] = [next[targetIdx], next[idx]];
      return next;
    });
  };

  const handleRemoveQueue = (id) => {
    setQueue(prev => prev.filter(q => q.id !== id));
  };

  const handleCyclePriority = (id) => {
    const priorities = ['low', 'medium', 'high', 'critical'];
    setQueue(prev => prev.map(q => {
      if (q.id !== id) return q;
      const nextPriority = priorities[(priorities.indexOf(q.priority) + 1) % priorities.length];
      return { ...q, priority: nextPriority };
    }));
  };

  const handleFireQueue = async () => {
    if (selectedIds.length === 0) { toast.error('Select target channels first'); return; }
    const pending = queue.filter(q => q.status === 'pending');
    if (!pending.length) { toast.error('No pending items in queue'); return; }
    setQueueRunning(true);
    for (const item of pending) {
      setActiveQueueId(item.id);
      setQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'running' } : q));
      setPrompt(item.text);
      await new Promise(r => setTimeout(r, 800 + Math.random() * 600));
      setQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'done' } : q));
      await new Promise(r => setTimeout(r, 300));
    }
    setActiveQueueId(null);
    setQueueRunning(false);
    toast.bolt('Mission Queue execution complete!');
  };

  // Variables are calculated dynamically during render

  // Selections
  const toggleSelectAccount = (id) => {
    if (isSending) return;
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const selectAllActive = () => {
    if (isSending) return;
    setSelectedIds(selectedIds.length === activeAccounts.length ? [] : activeAccounts.map(a => a.id));
  };

  const handleClear = () => {
    setPrompt('');
    setSelectedIds([]);
    setResults([]);
    setProgress(0);
    setShowResults(false);
  };

  const handleInsertTemplate = (text) => {
    setPrompt(prev => prev ? prev + '\n\n' + text : text);
    toast.success('Template preloaded');
  };

  const handleInsertVariable = () => {
    setPrompt(prev => prev + ' {{variableName}}');
  };

  const handleValChange = (accId, varName, val) => {
    setVariableValues(prev => ({
      ...prev,
      [accId]: {
        ...prev[accId],
        [varName]: val
      }
    }));
  };

  // Central Transmission Engine
  const handleBroadcastTransmit = async () => {
    if (!prompt.trim() || selectedIds.length === 0) {
      toast.error('Enter prompt and select at least one target account');
      sound.play('warning');
      return;
    }

    sound.play('dispatch');
    setIsSending(true);
    setProgress(0);
    setResults([]);
    setShowResults(true);

    const total = selectedIds.length;
    let successCount = 0;
    let failureCount = 0;
    const finalBroadcastRecords = [];

    for (let i = 0; i < total; i++) {
      const accId = selectedIds[i];
      const acc = accounts.find(a => a.id === accId);
      const pl = PLATFORMS.find(p => p.id === acc?.platform) || PLATFORMS[0];

      // Mark slot active/sending
      setResults(prev => [
        ...prev,
        { id: accId, name: acc?.name || 'Workspace', platform: pl.name, status: 'sending', promptUsed: '' }
      ]);

      // Delay stagger wait
      if (delay > 0) {
        await new Promise(r => setTimeout(r, delay));
      }

      // Interpolate prompt variables specifically for this account context
      let interpolatedPrompt = prompt;
      variables.forEach(v => {
        const val = getVariableValue(accId, v) || `[${v}]`;
        interpolatedPrompt = interpolatedPrompt.replace(new RegExp(`\\{\\{${v}\\}\\}`, 'g'), val);
      });

      const isSuccess = Math.random() < 0.92; // high-fidelity delivery rate

      if (isSuccess) {
        successCount++;
        // Decrement credit balance and increment broadcast count in store
        const currentCredits = acc?.creditBalance || 20;
        updateAccount(accId, {
          broadcastCount: (acc?.broadcastCount || 0) + 1,
          creditBalance: Math.max(0, currentCredits - 1)
        });
      } else {
        failureCount++;
      }

      const finalRecord = {
        id: accId,
        name: acc?.name || 'Workspace',
        platform: pl.name,
        status: isSuccess ? 'success' : 'error',
        promptUsed: interpolatedPrompt,
        message: isSuccess ? 'Delivered successfully' : 'Failed — connection timeout'
      };

      finalBroadcastRecords.push(finalRecord);

      setResults(prev =>
        prev.map(r => r.id === accId && r.status === 'sending' ? finalRecord : r)
      );

      setProgress(Math.round(((i + 1) / total) * 100));
    }

    // Save master broadcast session to store
    addBroadcast({
      prompt: prompt.trim(),
      targetIds: selectedIds,
      successCount,
      failureCount,
      total,
      results: finalBroadcastRecords
    });

    setIsSending(false);
    if (failureCount === 0) {
      toast.success(`✓ Broadcast delivered to all ${successCount} targets!`);
      sound.play('success');
    } else {
      toast.warning(`Broadcast finished. Success: ${successCount}, Failures: ${failureCount}`);
      sound.play('warning');
    }
  };

  if (!accounts.length) {
    return (
      <EmptyState
        icon="📡"
        title="No Accounts Found"
        subtitle="Connect at least one active AI account before broadcasting prompts."
      />
    );
  }

  const wordCount = prompt.trim() ? prompt.trim().split(/\s+/).length : 0;
  const strength = getStrengthLabel(wordCount);
  const canTransmit = !isSending && prompt.trim() && selectedIds.length > 0;

  return (
    <div style={{ animation: 'fadeIn 0.35s ease' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>📡 Broadcast Studio</span>
            <span className="kanban-col-count">{activeAccounts.length} active channels</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
            Central command station to batch-transmit prompt setups concurrently.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface2)', padding: '6px 12px', borderRadius: 8, border: '1px solid var(--border)' }}>
          <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>Select All Active</span>
          <button className={`pill ${selectedIds.length === activeAccounts.length ? 'on' : ''}`} onClick={selectAllActive} disabled={isSending}>
            {selectedIds.length === activeAccounts.length ? '✓ Selected' : '○ Select'}
          </button>
        </div>
      </div>

      {/* SPLIT LAYOUT */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16, alignItems: 'start' }}>
        
        {/* LEFT Compose area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          
          {/* Preset chips */}
          <div style={{ background: 'var(--surface2)', padding: 12, borderRadius: 12, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--muted2)', textTransform: 'uppercase', marginBottom: 8 }}>
              Quick Presets Templates
            </div>
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
              {TEMPLATES.map(tpl => (
                <button
                  key={tpl.label}
                  className="pill"
                  onClick={() => handleInsertTemplate(tpl.text)}
                  disabled={isSending}
                  style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <span>{tpl.icon}</span> {tpl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt composer */}
          <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
            {/* Compose header toolbar */}
            <div style={{ display: 'flex', padding: '10px 14px', background: 'var(--surface3)', borderBottom: '1px solid var(--border)', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn btn-ghost btn-xs" onClick={handleInsertVariable} disabled={isSending}>
                  {"{ }"} Add Variable
                </button>
              </div>
              <button className="btn btn-danger btn-xs" onClick={handleClear} disabled={isSending}>
                ✕ Clear
              </button>
            </div>

            {/* Monospace compose textbox */}
            <textarea
              className="bc-area"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              disabled={isSending}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (canTransmit) {
                    handleBroadcastTransmit();
                  } else if (!prompt.trim()) {
                    toast.error('Write a prompt first to broadcast');
                  } else if (selectedIds.length === 0) {
                    toast.error('Select at least one connected channel to broadcast');
                  }
                }
              }}
              placeholder="Write your prompt sequence here... Press ENTER to broadcast to all connected channels simultaneously. (Shift+Enter for newline)"
              rows={8}
            />

            {/* Compose footer metrics */}
            <div style={{ display: 'flex', padding: '8px 14px', background: 'var(--surface3)', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: strength.color + '15', color: strength.color }}>
                  {strength.label}
                </span>
                <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                  {wordCount} words
                </span>
              </div>
              <span style={{ fontSize: 11, color: prompt.length > 1800 ? 'var(--red)' : 'var(--muted)' }}>
                {prompt.length} / 2000
              </span>
            </div>
          </div>

          <PromptOptimizer
            prompt={{ prompt: prompt, name: 'Current Broadcast Prompt' }}
            onApply={(optimizedText) => {
              setPrompt(optimizedText);
              toast.success('Applied optimized prompt structure!');
            }}
          />

          {/* DYNAMIC BATCH VARIABLE INTERPOLATION TABLE */}
          {variables.length > 0 && selectedIds.length > 0 && (
            <div className="card" style={{ animation: 'fadeIn 0.3s ease' }}>
              <div className="card-hdr" style={{ marginBottom: 10 }}>
                <span className="card-title">📋 Batch Variable Configurations</span>
                <span style={{ fontSize: 10, color: 'var(--gold)', fontWeight: 700 }}>
                  Customize values per selected account
                </span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      <th style={{ padding: '6px 8px', color: 'var(--muted)', textAlign: 'left', fontWeight: 700 }}>Target Account</th>
                      {variables.map(v => (
                        <th key={v} style={{ padding: '6px 8px', color: 'var(--gold)', textAlign: 'left', fontWeight: 700, fontFamily: 'DM Mono, monospace' }}>
                          {"{{"}{v}{"}}"}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedIds.map(accId => {
                      const acc = accounts.find(a => a.id === accId);
                      return (
                        <tr key={accId} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '8px', fontWeight: 700, color: '#e2e2ec', whiteSpace: 'nowrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <PlatformIcon platformId={acc?.platform} size={16} />
                              <span>{acc?.name}</span>
                            </div>
                          </td>
                          {variables.map(v => (
                            <td key={v} style={{ padding: '4px 8px' }}>
                              <input
                                type="text"
                                value={getVariableValue(accId, v)}
                                onChange={e => handleValChange(accId, v, e.target.value)}
                                placeholder="Enter value..."
                                style={{ width: '100%', padding: '4px 8px', fontSize: 11.5, background: 'var(--surface3)' }}
                              />
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* DELAY & TRANSMISSION SETTINGS */}
          <div style={{ background: 'var(--surface2)', padding: '16px 18px', borderRadius: 12, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--muted2)', textTransform: 'uppercase', marginBottom: 12 }}>
              Signal Delay Calibration
            </div>

            <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 160 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 11.5, color: 'var(--muted2)' }}>Transmission Interval</span>
                  <span className="mono" style={{ fontSize: 11.5, color: 'var(--gold)', fontWeight: 700, background: 'var(--gold-glow)', padding: '2px 8px', borderRadius: 6 }}>
                    {delay}ms
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={delay}
                  onChange={e => setDelay(Number(e.target.value))}
                  disabled={isSending}
                  style={{ width: '100%', accentColor: 'var(--gold)', height: 4 }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 10.5, color: 'var(--muted)', fontWeight: 700 }}>Recipient Slots</span>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--surface3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 14 }}>
                  {selectedIds.length}
                </div>
              </div>
            </div>
          </div>

          {/* BIG TRANSMIT TRIGGER BUTTON */}
          <button
            className={`btn ${canTransmit ? 'btn-gold' : 'btn-ghost'} btn-pulse`}
            style={{ width: '100%', padding: '16px 0', fontSize: 15, fontWeight: 800, justifyContent: 'center' }}
            disabled={!canTransmit}
            onClick={handleBroadcastTransmit}
          >
            {isSending ? (
              <>⏳ Discharging Signal Payload ({progress}%)</>
            ) : (
              <>📡 Transmit Command Payload to {selectedIds.length} Channels</>
            )}
          </button>
        </div>

        {/* RIGHT TRANSMISSION NODE MAP SLIDER */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          
          {/* Active node graph maps */}
          <div className="bc-transmission-map">
            <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--muted2)', textTransform: 'uppercase', marginBottom: 12 }}>
              Central Transmission Map
            </div>

            <div className="bc-map-core">
              {/* Studio core hub */}
              <div className="bc-hub-core">
                <span style={{ fontSize: 24 }}>📡</span>
                <span className="bc-hub-label">Central</span>
                <div className="bc-hub-ring" />
              </div>

              {/* Cable connectors and account target nodes */}
              <div className="bc-transmission-cables">
                {selectedIds.map(accId => {
                  const acc = accounts.find(a => a.id === accId);
                  const res = results.find(r => r.id === accId);
                  
                  const isSendingAcc = res?.status === 'sending';
                  const isSuccessAcc = res?.status === 'success';
                  const isErrorAcc = res?.status === 'error';

                  return (
                    <div key={accId} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {/* Connection Cable line */}
                      <div className={`bc-cable-line ${isSendingAcc ? 'active' : isSuccessAcc ? 'done' : ''}`}>
                        {isSendingAcc && <div className="bc-data-particle" />}
                      </div>

                      {/* Targeted slot card */}
                      <div className={`bc-target-slot ${isSendingAcc ? 'active' : isSuccessAcc ? 'success' : isErrorAcc ? 'failed' : ''}`}>
                        <PlatformIcon platformId={acc?.platform} size={18} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: '#e4e4ed', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {acc?.name}
                          </div>
                          
                          {/* Live credit deduction subtraction */}
                          <div className="bc-target-credit-num">
                            {isSuccessAcc ? (
                              <span style={{ color: 'var(--teal)' }}>
                                💳 {Math.max(0, (acc?.creditBalance || 20) - 1)} tokens
                              </span>
                            ) : (
                              <span>💳 {acc?.creditBalance || 20} tokens</span>
                            )}
                          </div>
                        </div>
                        {isSuccessAcc && <span style={{ fontSize: 11, color: 'var(--teal)' }}>✓</span>}
                        {isErrorAcc && <span style={{ fontSize: 11, color: 'var(--red)' }}>✕</span>}
                      </div>
                    </div>
                  );
                })}

                {selectedIds.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--muted)', fontSize: 11.5, border: '1px dashed var(--border)', borderRadius: 8 }}>
                    Cables idle. Select channels to bridge connections.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CHANNEL SELECT TARGET PILLS */}
          <div className="card">
            <div className="card-hdr" style={{ marginBottom: 10 }}>
              <span className="card-title">📺 Select Target Channels ({activeAccounts.length})</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 220, overflowY: 'auto' }}>
              {routerAnalysis.recommendations && routerAnalysis.recommendations.length > 0 && (
                <div style={{ fontSize: 10, color: 'var(--teal)', background: 'rgba(34,211,238,0.05)', padding: '8px 10px', borderRadius: 8, marginBottom: 4, border: '1px dashed rgba(34,211,238,0.18)', lineHeight: 1.4 }}>
                  🤖 Smart Router recommends:<br />
                  <strong style={{ color: '#fff' }}>{routerAnalysis.recommendations[0].name}</strong> ({routerAnalysis.recommendations[0].reason})
                </div>
              )}

              {activeAccounts.map(a => {
                const isSel = selectedIds.includes(a.id);
                const isRecommended = a.platform === routerAnalysis.best;
                return (
                  <div
                    key={a.id}
                    onClick={() => toggleSelectAccount(a.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8,
                      background: isSel ? 'var(--gold-glow)' : 'var(--surface3)',
                      border: isRecommended ? '1px dashed var(--teal)' : `1px solid ${isSel ? 'var(--gold)' : 'var(--border)'}`,
                      cursor: 'pointer', transition: 'all 0.15s',
                    }}
                  >
                    <PlatformIcon platformId={a.platform} size={16} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 11.5, fontWeight: 700, color: isSel ? 'var(--gold)' : '#e2e2ec', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span>{a.name}</span>
                        {isRecommended && (
                          <span style={{ fontSize: 8.5, background: 'rgba(34,211,238,0.15)', color: 'var(--teal)', padding: '1px 4px', borderRadius: 3, border: '1px solid rgba(34,211,238,0.3)', fontWeight: 800 }}>AI Best</span>
                        )}
                      </div>
                      <div style={{ fontSize: 9.5, color: 'var(--muted)' }}>
                        Bal: {a.creditBalance} tokens
                      </div>
                    </div>
                    <span style={{ fontSize: 11, color: isSel ? 'var(--gold)' : 'var(--muted)' }}>
                      {isSel ? '● Connected' : '○ Off'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* MISSION QUEUE SCHEDULER */}
          <div className="card">
            <div className="card-hdr" style={{ marginBottom: 10 }}>
              <span className="card-title">⚡ Mission Queue</span>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn btn-ghost btn-xs" onClick={handleAddToQueue} disabled={queueRunning}>
                  + Queue Current
                </button>
                <button
                  className={`btn btn-xs ${queueRunning ? 'btn-ghost' : 'btn-gold'} ${queueRunning ? 'btn-pulse' : ''}`}
                  onClick={handleFireQueue}
                  disabled={queueRunning}
                  style={{ fontSize: 10 }}
                >
                  {queueRunning ? '⚡ Running...' : '▶ Fire Queue'}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 240, overflowY: 'auto' }}>
              {queue.length === 0 && (
                <div style={{ padding: '20px 10px', textAlign: 'center', color: 'var(--muted)', fontSize: 11, border: '1px dashed var(--border)', borderRadius: 8 }}>
                  Queue empty. Add prompts to schedule batch execution.
                </div>
              )}
              {queue.map((item, idx) => {
                const pc = PRIORITY_CONFIG[item.priority] || PRIORITY_CONFIG.medium;
                const isActive = activeQueueId === item.id;
                const isDone = item.status === 'done';
                return (
                  <div key={item.id} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 10px', borderRadius: 8,
                    background: isActive ? 'rgba(245,183,49,0.08)' : isDone ? 'rgba(0,212,170,0.05)' : 'var(--surface3)',
                    border: `1px solid ${isActive ? 'var(--gold)' : isDone ? 'rgba(0,212,170,0.2)' : 'var(--border)'}`,
                    boxShadow: isActive ? '0 0 10px var(--gold-glow)' : 'none',
                    transition: 'all 0.2s',
                    opacity: isDone ? 0.6 : 1,
                  }}>
                    {/* Priority badge — click to cycle */}
                    <button
                      onClick={() => handleCyclePriority(item.id)}
                      disabled={queueRunning}
                      title="Click to change priority"
                      style={{
                        fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 4,
                        background: pc.bg, color: pc.color, border: `1px solid ${pc.color}40`,
                        cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap',
                      }}
                    >{pc.label}</button>

                    {/* Label */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: isActive ? 'var(--gold)' : isDone ? 'var(--teal)' : '#d0d0e0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {isDone ? '✓ ' : isActive ? '⚡ ' : `${idx + 1}. `}{item.label}
                      </div>
                    </div>

                    {/* Controls */}
                    {!isDone && !queueRunning && (
                      <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
                        <button onClick={() => handleMoveQueue(item.id, -1)} disabled={idx === 0}
                          style={{ padding: '2px 5px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 4, cursor: 'pointer', color: 'var(--muted)', fontSize: 10 }}>↑</button>
                        <button onClick={() => handleMoveQueue(item.id, 1)} disabled={idx === queue.length - 1}
                          style={{ padding: '2px 5px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 4, cursor: 'pointer', color: 'var(--muted)', fontSize: 10 }}>↓</button>
                        <button onClick={() => handleRemoveQueue(item.id)}
                          style={{ padding: '2px 5px', background: 'rgba(255,95,95,0.1)', border: '1px solid rgba(255,95,95,0.2)', borderRadius: 4, cursor: 'pointer', color: 'var(--red)', fontSize: 10 }}>✕</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* RESULTS DISPLAY FEED & HOVER VIEWPORTS PREVIEWS */}
      {showResults && (
        <div className="card" style={{ marginTop: 16 }}>
          <div className="card-hdr" style={{ marginBottom: 10 }}>
            <span className="card-title">📡 Transmission Logs</span>
            <span style={{ fontSize: 10, color: 'var(--muted2)' }}>
              Hover over successful deliveries to preview visual blueprints
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {results.map((res, i) => {
              const isSuccess = res.status === 'success';
              const isSendingAcc = res.status === 'sending';
              const isHovered = hoveredPreviewId === res.id;

              return (
                <div
                  key={i}
                  onMouseEnter={() => isSuccess && setHoveredPreviewId(res.id)}
                  onMouseLeave={() => setHoveredPreviewId(null)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--surface2)', borderRadius: 8,
                    border: `1px solid ${isSuccess ? 'var(--teal-glow)' : isSendingAcc ? 'var(--border)' : 'var(--red-glow)'}`,
                    position: 'relative'
                  }}
                >
                  <span style={{ fontSize: 14 }}>
                    {isSuccess ? '✅' : isSendingAcc ? '⏳' : '✕'}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: '#fff' }}>{res.name}</div>
                    <div style={{ fontSize: 10.5, color: 'var(--muted2)', fontFamily: 'DM Mono, monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>
                      {res.promptUsed || 'Resolving variable structures...'}
                    </div>
                  </div>
                  <span style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700 }}>
                    {res.platform}
                  </span>

                  {/* HOVER VIEWPORT CODE LAYOUT PREVIEW POPUP */}
                  {isHovered && isSuccess && (
                    <div className="layout-preview-popup">
                      <div className="layout-mockup-header">
                        <span className="layout-mockup-dot" style={{ background: 'var(--red)' }} />
                        <span className="layout-mockup-dot" style={{ background: 'var(--gold)' }} />
                        <span className="layout-mockup-dot" style={{ background: 'var(--teal)' }} />
                        <span className="layout-mockup-title">
                          localhost:3000 / {res.name.toLowerCase().replace(' ', '-')}
                        </span>
                      </div>
                      
                      <div className="layout-mockup-body">
                        {/* Render visual blueprints based on prompt keywords */}
                        {(res.promptUsed.toLowerCase().includes('dashboard') || res.promptUsed.toLowerCase().includes('crm')) ? (
                          <>
                            {/* Dashboard mockup */}
                            <div className="layout-mockup-row">
                              <div className="layout-mockup-block" style={{ width: '30%', height: 16 }} />
                              <div className="layout-mockup-block" style={{ width: '40%', height: 16 }} />
                              <div className="layout-mockup-block" style={{ width: '30%', height: 16 }} />
                            </div>
                            <div className="layout-mockup-block" style={{ height: 32, marginTop: 4 }} />
                            <div className="layout-mockup-row" style={{ marginTop: 4 }}>
                              <div className="layout-mockup-block" style={{ width: '50%', height: 20 }} />
                              <div className="layout-mockup-block" style={{ width: '50%', height: 20 }} />
                            </div>
                          </>
                        ) : (res.promptUsed.toLowerCase().includes('landing') || res.promptUsed.toLowerCase().includes('saas')) ? (
                          <>
                            {/* Landing page mockup */}
                            <div className="layout-mockup-block" style={{ height: 24, background: 'rgba(245,183,49,0.06)' }} />
                            <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginTop: 4 }}>
                              <div className="layout-mockup-block" style={{ width: 40, height: 30 }} />
                              <div className="layout-mockup-block" style={{ width: 40, height: 30 }} />
                              <div className="layout-mockup-block" style={{ width: 40, height: 30 }} />
                            </div>
                          </>
                        ) : (
                          <>
                            {/* Code editor mockup */}
                            <div className="layout-mockup-block" style={{ height: 12, width: '70%', background: 'rgba(0, 212, 170, 0.08)' }} />
                            <div className="layout-mockup-block" style={{ height: 12, width: '90%', marginLeft: 10, background: 'rgba(245, 183, 49, 0.08)' }} />
                            <div className="layout-mockup-block" style={{ height: 12, width: '40%', marginLeft: 10 }} />
                            <div className="layout-mockup-block" style={{ height: 12, width: '60%', background: 'rgba(0, 212, 170, 0.08)' }} />
                          </>
                        )}
                      </div>
                      <div style={{ fontSize: 8.5, color: 'var(--teal)', fontWeight: 700, textAlign: 'center', textTransform: 'uppercase' }}>
                        ✓ Mock Blueprint Synced
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
