import { useState, useEffect } from 'react';
import { useStore } from '../data/store';
import { useToast } from '../components/Toast';
import { PLATFORMS } from '../data/constants';
import { sound } from '../lib/soundEngine';

// ─── Accent colours ───────────────────────────────────────────────────────────
const ACCENT_COLORS = [
  { id: 'gold',   label: 'Gold Swatch',   hex: '#f5b731', glow: 'rgba(245,183,49,0.2)' },
  { id: 'teal',   label: 'Teal Swatch',   hex: '#00d4aa', glow: 'rgba(0,212,170,0.2)' },
  { id: 'purple', label: 'Purple Swatch', hex: '#a78bfa', glow: 'rgba(167,139,250,0.2)' },
  { id: 'blue',   label: 'Blue Swatch',   hex: '#4f8ef7', glow: 'rgba(79,142,247,0.2)' },
  { id: 'red',    label: 'Red Swatch',    hex: '#ff5f5f', glow: 'rgba(255,95,95,0.2)' },
];

const FONT_SIZES  = ['Small', 'Medium', 'Large'];
const PLAN_TYPES  = ['Free', 'Pro', 'Business'];
const BUILD_DATE  = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

// ─── Theme definitions ─────────────────────────────────────────────────────────
const THEMES = [
  { id: 'dark',      name: 'Dark',      desc: 'Default dark mode',  colors: { '--gold': '#f5b731', '--teal': '#5eead4', '--purple': '#a78bfa', '--surface': '#0e0e16', '--surface2': '#16161f', '--surface3': '#1f1f2e' } },
  { id: 'midnight',  name: 'Midnight',  desc: 'Deep space theme',   colors: { '--gold': '#818cf8', '--teal': '#38bdf8', '--purple': '#c084fc', '--surface': '#020617', '--surface2': '#0f172a', '--surface3': '#1e293b' } },
  { id: 'cyberpunk', name: 'Cyberpunk', desc: 'Neon future',        colors: { '--gold': '#facc15', '--teal': '#f0abfc', '--purple': '#86efac', '--surface': '#09090b', '--surface2': '#18181b', '--surface3': '#27272a' } },
  { id: 'ocean',     name: 'Ocean',     desc: 'Deep blue calm',     colors: { '--gold': '#34d399', '--teal': '#60a5fa', '--purple': '#a78bfa', '--surface': '#0c1a2e', '--surface2': '#0d2137', '--surface3': '#122847' } },
  { id: 'forest',    name: 'Forest',    desc: 'Natural green',      colors: { '--gold': '#86efac', '--teal': '#6ee7b7', '--purple': '#fbbf24', '--surface': '#0f1a0f', '--surface2': '#162116', '--surface3': '#1e2f1e' } },
  { id: 'sunset',    name: 'Sunset',    desc: 'Warm amber glow',    colors: { '--gold': '#fb923c', '--teal': '#f87171', '--purple': '#e879f9', '--surface': '#1c0a0a', '--surface2': '#27100f', '--surface3': '#351816' } },
];

const DEFAULT_THEME_COLORS = THEMES[0].colors;

function applyThemeColors(colors) {
  Object.entries(colors).forEach(([prop, val]) => {
    document.documentElement.style.setProperty(prop, val);
  });
}

// ─── Tiny helpers ─────────────────────────────────────────────────────────────
function SectionCard({ title, children }) {
  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <div className="card-hdr">
        <div className="card-title">{title}</div>
      </div>
      <div style={{ padding: '20px 24px' }}>{children}</div>
    </div>
  );
}

function FormRow({ label, hint, children }) {
  return (
    <div className="form-row" style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18 }}>
      {label && <label style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600, letterSpacing: '0.03em' }}>{label}</label>}
      {children}
      {hint && <span style={{ fontSize: 11, color: 'var(--muted2)' }}>{hint}</span>}
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: 44, height: 24, borderRadius: 12, cursor: 'pointer',
        background: checked ? 'var(--teal)' : 'var(--surface3)',
        position: 'relative', transition: 'background 0.2s',
        boxShadow: checked ? '0 0 8px var(--teal-glow)' : 'none',
        flexShrink: 0,
      }}
    >
      <div style={{
        position: 'absolute', top: 3, left: checked ? 23 : 3,
        width: 18, height: 18, borderRadius: '50%',
        background: '#fff', transition: 'left 0.2s',
        boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
      }} />
    </div>
  );
}

function Pill({ label, active, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 16px', borderRadius: 20, border: 'none', cursor: 'pointer',
        fontSize: 13, fontWeight: 600, transition: 'all 0.15s',
        background: active
          ? (danger ? 'var(--red)' : 'var(--gold)')
          : 'var(--surface3)',
        color: active ? (danger ? '#fff' : '#0a0a0a') : 'var(--muted)',
        boxShadow: active ? (danger ? '0 0 8px rgba(255,95,95,0.4)' : '0 0 8px var(--gold-glow)') : 'none',
      }}
    >
      {label}
    </button>
  );
}

// ─── Backup & Restore Section ─────────────────────────────────────────────────
function BackupRestoreSection({ store, toast, settings }) {
  const [importJson, setImportJson] = useState('');
  const [importError, setImportError] = useState('');
  const [autoBackup, setAutoBackup] = useState(() => localStorage.getItem('bsp_auto_backup') === 'true');
  const [backupFreq, setBackupFreq] = useState(() => localStorage.getItem('bsp_backup_freq') || 'daily');
  const [lastBackup, setLastBackup] = useState(() => localStorage.getItem('bsp_last_backup') || null);
  const [resetModal, setResetModal] = useState(false);
  const [resetConfirmText, setResetConfirmText] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  function handleExportJson() {
    setIsExporting(true);
    setTimeout(() => {
      const snapshot = {
        version: '2.0.0',
        exportedAt: new Date().toISOString(),
        settings,
        accounts: store.accounts || [],
        prompts: store.prompts || [],
        workflows: store.workflows || [],
        broadcasts: (store.broadcasts || []).slice(0, 50), // cap for size
      };
      const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bsp-settings-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      const ts = new Date().toLocaleString();
      setLastBackup(ts);
      localStorage.setItem('bsp_last_backup', ts);
      toast.bolt('✓ Settings backup downloaded!');
      sound.play('success');
      setIsExporting(false);
    }, 800);
  }

  function handleImport() {
    setImportError('');
    try {
      const parsed = JSON.parse(importJson.trim());
      if (!parsed.version || !parsed.settings) {
        setImportError('Invalid backup file — missing version or settings.');
        return;
      }
      store.updateSettings?.(parsed.settings);
      if (parsed.prompts) store.setState(prev => ({ ...prev, prompts: parsed.prompts }));
      toast.bolt('✓ Settings restored from backup!');
      sound.play('success');
      setImportJson('');
    } catch {
      setImportError('Failed to parse JSON — check your backup file.');
    }
  }

  function handleAutoBackupToggle(v) {
    setAutoBackup(v);
    localStorage.setItem('bsp_auto_backup', String(v));
    toast.info(v ? `Auto-backup enabled (${backupFreq})` : 'Auto-backup disabled');
  }

  function handleFreqChange(f) {
    setBackupFreq(f);
    localStorage.setItem('bsp_backup_freq', f);
  }

  function handleFactoryReset() {
    if (resetConfirmText !== 'RESET') return;
    store.setState({
      accounts: [], projects: [], workflows: [], prompts: [],
      broadcasts: [], optimizations: [], settings: { delay: 300 },
    });
    ['bsp_display_name', 'bsp_theme', 'bsp_accent', 'bsp_font_size', 'bsp_auto_backup', 'bsp_backup_freq', 'bsp_last_backup'].forEach(k => localStorage.removeItem(k));
    toast.error('⚠ Factory reset complete — all data erased.');
    setResetModal(false);
    setResetConfirmText('');
  }

  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <div className="card-hdr">
        <div className="card-title">💾 Backup &amp; Restore</div>
      </div>
      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Export + Last Backup */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div style={{ background: 'var(--surface2)', borderRadius: 12, padding: '16px 18px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Export Settings</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.5 }}>Download your full workspace snapshot as JSON — settings, accounts, prompts, and recent history.</div>
            {lastBackup && (
              <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'DM Mono, monospace' }}>Last backup: {lastBackup}</div>
            )}
            <button
              className="btn btn-gold btn-sm"
              onClick={handleExportJson}
              disabled={isExporting}
              style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              {isExporting ? (
                <>
                  <span className="spinner" style={{ width: 10, height: 10, borderWidth: 1.5 }} />
                  Preparing…
                </>
              ) : '⬇ Export JSON Backup'}
            </button>
          </div>

          <div style={{ background: 'var(--surface2)', borderRadius: 12, padding: '16px 18px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Import / Restore</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.5 }}>Paste a previously exported JSON backup to restore your settings and data.</div>
            <textarea
              value={importJson}
              onChange={e => { setImportJson(e.target.value); setImportError(''); }}
              placeholder={`Paste JSON backup here…\n{\n  "version": "2.0.0",\n  "settings": {...}\n}`}
              style={{
                width: '100%', height: 80, padding: '8px 10px', fontSize: 10.5,
                fontFamily: 'DM Mono, monospace', background: 'var(--surface)',
                border: `1px solid ${importError ? 'var(--red)' : 'var(--border)'}`,
                borderRadius: 8, color: '#c0c8d8', resize: 'vertical', outline: 'none',
                lineHeight: 1.5, boxSizing: 'border-box',
              }}
            />
            {importError && <div style={{ fontSize: 10.5, color: 'var(--red)', fontWeight: 600 }}>{importError}</div>}
            <button
              className="btn btn-ghost btn-sm"
              onClick={handleImport}
              disabled={!importJson.trim()}
            >
              ↑ Apply Backup
            </button>
          </div>
        </div>

        {/* Auto-Backup */}
        <div style={{ background: 'var(--surface2)', borderRadius: 12, padding: '14px 18px', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#e0e0f0' }}>Auto-Backup Schedule</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>Automatically remind you to backup on a schedule</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Toggle checked={autoBackup} onChange={handleAutoBackupToggle} />
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>{autoBackup ? 'On' : 'Off'}</span>
            </div>
          </div>
          {autoBackup && (
            <div style={{ display: 'flex', gap: 8, animation: 'fadeIn 0.2s ease' }}>
              {['daily', 'weekly', 'monthly'].map(f => (
                <button
                  key={f}
                  onClick={() => handleFreqChange(f)}
                  style={{
                    padding: '5px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
                    fontSize: 11, fontWeight: 600, transition: 'all 0.15s',
                    background: backupFreq === f ? 'var(--gold)' : 'var(--surface3)',
                    color: backupFreq === f ? '#0a0a0a' : 'var(--muted)',
                    boxShadow: backupFreq === f ? '0 0 8px var(--gold-glow)' : 'none',
                  }}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Factory Reset */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--red)' }}>Factory Reset</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>Permanently erase all data and restore defaults</div>
          </div>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => setResetModal(true)}
          >
            ⚠ Factory Reset
          </button>
        </div>
      </div>

      {/* Factory Reset Modal */}
      {resetModal && (
        <div className="overlay" onClick={() => { setResetModal(false); setResetConfirmText(''); }}>
          <div className="modal" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontSize: 20, textAlign: 'center' }}>⚠️</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--red)', textAlign: 'center' }}>Factory Reset</div>
              <div style={{ fontSize: 12.5, color: 'var(--muted)', textAlign: 'center', lineHeight: 1.7 }}>
                This will permanently delete <strong>all accounts, broadcasts, prompts, and workflows</strong>. This cannot be undone.
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Type <strong style={{ color: 'var(--red)' }}>RESET</strong> to confirm:</label>
                <input
                  className="input"
                  value={resetConfirmText}
                  onChange={e => setResetConfirmText(e.target.value)}
                  placeholder="RESET"
                  autoFocus
                  style={{ borderColor: resetConfirmText === 'RESET' ? 'var(--red)' : undefined }}
                />
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button className="btn btn-ghost btn-sm" onClick={() => { setResetModal(false); setResetConfirmText(''); }}>Cancel</button>
                <button
                  className="btn btn-danger btn-sm"
                  disabled={resetConfirmText !== 'RESET'}
                  onClick={handleFactoryReset}
                  style={{ opacity: resetConfirmText !== 'RESET' ? 0.5 : 1 }}
                >
                  Confirm Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Settings() {
  const toast   = useToast();
  const store   = useStore();
  const { accounts = [], broadcasts = [], prompts = [], workflows = [], exportData, updateSettings, settings } = store;

  // ── Profile
  const [displayName, setDisplayName]   = useState(() => localStorage.getItem('bsp_display_name') || 'Studio User');
  const [email]                          = useState('user@boltstudio.pro');
  const initials = displayName.trim().split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() || 'BS';

  // ── Theme Builder
  const [activeTheme, setActiveTheme]   = useState(() => localStorage.getItem('bsp_theme') || 'dark');
  const [customPrimary, setCustomPrimary]   = useState('#f5b731');
  const [customAccent,  setCustomAccent]    = useState('#5eead4');
  const [customSurface, setCustomSurface]   = useState('#0e0e16');

  // Re-apply saved theme on mount
  useEffect(() => {
    const savedId = localStorage.getItem('bsp_theme') || 'dark';
    const saved = THEMES.find(t => t.id === savedId);
    if (saved) applyThemeColors(saved.colors);
  }, []);

  function handleApplyTheme(theme) {
    setActiveTheme(theme.id);
    localStorage.setItem('bsp_theme', theme.id);
    applyThemeColors(theme.colors);
    toast.bolt(`✨ Theme "${theme.name}" applied!`);
    sound.play('success');
  }

  function handleApplyCustom() {
    const colors = {
      '--gold':     customPrimary,
      '--teal':     customAccent,
      '--purple':   customAccent,
      '--surface':  customSurface,
      '--surface2': customSurface + 'cc',
      '--surface3': customSurface + '99',
    };
    applyThemeColors(colors);
    setActiveTheme('custom');
    localStorage.setItem('bsp_theme', 'custom');
    toast.bolt('🎨 Custom theme applied!');
    sound.play('success');
  }

  function handleResetTheme() {
    applyThemeColors(DEFAULT_THEME_COLORS);
    setActiveTheme('dark');
    localStorage.setItem('bsp_theme', 'dark');
    toast.info('Theme reset to default.');
    sound.play('click');
  }

  // ── Appearance
  const [accentColor, setAccentColor]   = useState(() => localStorage.getItem('bsp_accent') || 'gold');
  const [fontSize, setFontSize]         = useState(() => localStorage.getItem('bsp_font_size') || 'Medium');

  // ── Broadcast settings
  const [delay, setDelay]               = useState(() => settings?.broadcastDelay ?? 500);
  const [autoRetry, setAutoRetry]       = useState(() => settings?.autoRetry ?? true);
  const [maxRetries, setMaxRetries]     = useState(() => settings?.maxRetries ?? 3);
  const [showSuccessToast, setShowSuccessToast] = useState(() => settings?.showSuccessToast ?? true);

  // ── Account defaults
  const [defaultPlan, setDefaultPlan]   = useState(() => settings?.defaultPlan || 'Pro');
  const [creditLimit, setCreditLimit]   = useState(() => settings?.creditLimit ?? 1000);
  const [autoSync, setAutoSync]         = useState(() => settings?.autoSync ?? false);

  // ── Data management confirmations
  const [clearConfirm, setClearConfirm] = useState(false);
  const [resetStep, setResetStep]       = useState(0); // 0, 1, 2

  // ─── Telemetry Console Log State
  const [consoleLogs, setConsoleLogs] = useState([
    "[SYS] Telemetry terminal logger online.",
    "[SYS] Mapped active LocalStorage index table.",
    "[SYS] Standby frame. Ready for handshake check.",
  ]);
  const [pingLoading, setPingLoading] = useState(false);

  // ─── Estimator panel state
  const [estWords, setEstWords] = useState(250);
  const [estPlatform, setEstPlatform] = useState('lovable');

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const handleCSVParse = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const lines = text.split(/\r?\n/).filter(line => line.trim());
        if (lines.length <= 1) {
          toast.error("CSV file is empty or missing data headers.");
          return;
        }

        const parseCSVRow = (rowText) => {
          const result = [];
          let current = '';
          let inQuotes = false;
          for (let i = 0; i < rowText.length; i++) {
            const char = rowText[i];
            if (char === '"') {
              if (inQuotes && rowText[i + 1] === '"') {
                current += '"';
                i++;
              } else {
                inQuotes = !inQuotes;
              }
            } else if (char === ',' && !inQuotes) {
              result.push(current);
              current = '';
            } else {
              current += char;
            }
          }
          result.push(current);
          return result;
        };

        const headers = parseCSVRow(lines[0]).map(h => h.trim().toLowerCase());
        const projNameIdx = headers.indexOf("project name");
        const taskTitleIdx = headers.indexOf("task title");
        const taskDescIdx = headers.indexOf("task description");
        const laneIdx = headers.indexOf("lane");
        const priorityIdx = headers.indexOf("priority");
        const assignedIdx = headers.indexOf("assigned account");
        const subtasksIdx = headers.indexOf("subtask list");

        if (projNameIdx === -1 || taskTitleIdx === -1) {
          toast.error("Invalid CSV headers. Expected at least 'Project Name' and 'Task Title'.");
          return;
        }

        const projectsMap = {};

        for (let i = 1; i < lines.length; i++) {
          const rowValues = parseCSVRow(lines[i]);
          if (rowValues.length <= Math.max(projNameIdx, taskTitleIdx)) continue;

          const projName = rowValues[projNameIdx]?.trim();
          if (!projName) continue;

          if (!projectsMap[projName]) {
            projectsMap[projName] = [];
          }

          const taskTitle = rowValues[taskTitleIdx]?.trim();
          if (taskTitle) {
            const taskDesc = taskDescIdx !== -1 ? rowValues[taskDescIdx]?.trim() : '';
            const status = laneIdx !== -1 ? (rowValues[laneIdx]?.trim() || 'todo') : 'todo';
            const priority = priorityIdx !== -1 ? (rowValues[priorityIdx]?.trim() || 'medium') : 'medium';
            const assignedEmail = assignedIdx !== -1 ? rowValues[assignedIdx]?.trim() : '';
            const subtasksRaw = subtasksIdx !== -1 ? rowValues[subtasksIdx]?.trim() : '';

            const matchAcc = accounts?.find(a => a.email?.trim().toLowerCase() === assignedEmail.toLowerCase());
            const accountId = matchAcc ? matchAcc.id : (accounts?.[0]?.id || '');

            const subtasks = subtasksRaw
              ? subtasksRaw.split(';').filter(Boolean).map((title, sIdx) => ({
                  id: `sub-${Math.random().toString(36).slice(2, 6)}-${sIdx}`,
                  title: title.replace(/\\;/g, ';').trim(),
                  done: false
                }))
              : [];

            projectsMap[projName].push({
              id: `t-${Math.random().toString(36).slice(2, 8)}`,
              title: taskTitle,
              desc: taskDesc,
              status: ['backlog', 'todo', 'progress', 'done'].includes(status.toLowerCase()) ? status.toLowerCase() : 'todo',
              priority: ['high', 'medium', 'low'].includes(priority.toLowerCase()) ? priority.toLowerCase() : 'medium',
              accountId,
              subtasks
            });
          }
        }

        const projectNames = Object.keys(projectsMap);
        if (projectNames.length === 0) {
          toast.error("No valid records found in the CSV file.");
          return;
        }

        store.setState(prev => {
          const updatedProjects = [...(prev.projects || [])];
          projectNames.forEach(pName => {
            const parsedTasks = projectsMap[pName];
            const existingIdx = updatedProjects.findIndex(p => p.name.trim().toLowerCase() === pName.trim().toLowerCase());

            if (existingIdx !== -1) {
              const existingProj = updatedProjects[existingIdx];
              updatedProjects[existingIdx] = {
                ...existingProj,
                tasks: [...(existingProj.tasks || []), ...parsedTasks]
              };
            } else {
              updatedProjects.push({
                id: `p-${Math.random().toString(36).slice(2, 10)}`,
                name: pName,
                desc: `Imported via CSV on ${new Date().toLocaleDateString()}`,
                status: 'active',
                createdAt: new Date().toISOString(),
                accountIds: parsedTasks.map(t => t.accountId).filter(Boolean),
                tasks: parsedTasks
              });
            }
          });

          return {
            ...prev,
            projects: updatedProjects
          };
        });

        toast.bolt(`✓ Successfully imported projects database! Mounted ${projectNames.length} project board grids.`);
      } catch (err) {
        toast.error("Failed to parse CSV file: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  function handleSaveProfile() {
    localStorage.setItem('bsp_display_name', displayName.trim());
    toast.success('Profile saved!');
    sound.play('success');
  }

  function handleAccent(colorId) {
    setAccentColor(colorId);
    localStorage.setItem('bsp_accent', colorId);
    const hex = ACCENT_COLORS.find(c => c.id === colorId)?.hex;
    if (hex) document.documentElement.style.setProperty('--gold', hex);
    toast.info(`Accent changed to ${colorId}`);
  }

  function handleFontSize(size) {
    setFontSize(size);
    localStorage.setItem('bsp_font_size', size);
    const map = { Small: '13px', Medium: '15px', Large: '17px' };
    document.documentElement.style.setProperty('--base-font-size', map[size]);
    toast.info(`Font size set to ${size}`);
  }

  function handleSaveBroadcast() {
    updateSettings({ broadcastDelay: delay, autoRetry, maxRetries, showSuccessToast });
    toast.success('Broadcast settings saved!');
    sound.play('success');
  }

  function handleSaveAccountDefaults() {
    updateSettings({ defaultPlan, creditLimit, autoSync });
    toast.success('Account defaults saved!');
    sound.play('success');
  }

  function handleClearHistory() {
    if (!clearConfirm) { setClearConfirm(true); return; }
    store.setState(prev => ({ ...prev, broadcasts: [] }));
    setClearConfirm(false);
    toast.success('Broadcast history cleared.');
  }

  function handleResetApp() {
    if (resetStep === 0) { setResetStep(1); return; }
    if (resetStep === 1) { setResetStep(2); return; }
    store.setState({
      accounts: [], projects: [], workflows: [], prompts: [],
      broadcasts: [], optimizations: [], settings: { delay: 300 },
    });
    setResetStep(0);
    toast.error('All app data has been reset.');
  }

  // Telemetry Console Ping Handshake
  const handlePingHandshake = async () => {
    if (pingLoading) return;
    setPingLoading(true);
    setConsoleLogs(prev => [...prev, "> INITIALIZING TELEMETRY CONNECTIONS PING..."]);

    await new Promise(r => setTimeout(r, 400));
    setConsoleLogs(prev => [...prev, "> [AUTH] Requesting handshake authorization on connected slots..."]);

    await new Promise(r => setTimeout(r, 300));
    const activePlats = accounts.map(a => a.platform);
    const uniquePlats = [...new Set(activePlats)];

    if (uniquePlats.length === 0) {
      setConsoleLogs(prev => [...prev, "> [HTTP] ✕ No active accounts linked in connection stack.", "> [SYS] Telemetry ping checked completed with Warnings."]);
    } else {
      uniquePlats.forEach(pId => {
        const pl = PLATFORMS.find(p => p.id === pId);
        setConsoleLogs(prev => [...prev, `> [HTTP] Handshake to ${pl?.name || pId}: OK (200)`]);
      });
      setConsoleLogs(prev => [...prev, `> [SYS] Handshake resolved: ${uniquePlats.length} platforms verified (100% operational).`]);
    }
    setPingLoading(false);
  };

  const storageBytes = JSON.stringify(store).length;
  const storageKB    = (storageBytes / 1024).toFixed(1);

  // Estimations calculation
  const estCredits = Math.ceil(estWords * 1.35);
  const estDelay = (Math.round((estWords / 18) * 10) / 10).toFixed(1);
  const plEst = PLATFORMS.find(p => p.id === estPlatform) || PLATFORMS[0];

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '4px 0 40px' }}>

      {/* ── 0. Theme Builder ─────────────────────────────────────────────── */}
      <SectionCard title="Theme Builder">
        {/* Preset grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
          {THEMES.map(theme => {
            const isActive = activeTheme === theme.id;
            const swatchVars = ['--gold', '--teal', '--purple'];
            return (
              <div
                key={theme.id}
                style={{
                  background: 'var(--surface2)',
                  border: `1.5px solid ${isActive ? theme.colors['--gold'] : 'var(--border)'}`,
                  borderRadius: 12,
                  padding: '14px 14px 12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: isActive ? `0 0 16px ${theme.colors['--gold']}44` : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onClick={() => handleApplyTheme(theme)}
              >
                {/* Active badge */}
                {isActive && (
                  <div style={{
                    position: 'absolute', top: 8, right: 8,
                    fontSize: 9, fontWeight: 800, letterSpacing: '0.06em',
                    color: '#0a0a0a', background: theme.colors['--gold'],
                    borderRadius: 6, padding: '2px 6px', textTransform: 'uppercase',
                  }}>Active</div>
                )}

                {/* Theme mini preview strip */}
                <div style={{
                  height: 6, borderRadius: 4, marginBottom: 2,
                  background: `linear-gradient(90deg, ${theme.colors['--gold']}, ${theme.colors['--teal']}, ${theme.colors['--purple']})`,
                }} />

                <div style={{ fontWeight: 700, fontSize: 13, color: '#f0f0f0' }}>{theme.name}</div>
                <div style={{ fontSize: 11, color: 'var(--muted2)', marginTop: -4 }}>{theme.desc}</div>

                {/* Color swatches */}
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  {swatchVars.map(v => (
                    <div
                      key={v}
                      title={v}
                      style={{
                        width: 16, height: 16, borderRadius: '50%',
                        background: theme.colors[v],
                        border: '1.5px solid rgba(255,255,255,0.12)',
                        flexShrink: 0,
                        boxShadow: `0 0 6px ${theme.colors[v]}88`,
                      }}
                    />
                  ))}
                </div>

                <button
                  className={isActive ? 'btn btn-gold btn-sm' : 'btn btn-ghost btn-sm'}
                  style={{ marginTop: 4, fontSize: 11 }}
                  onClick={(e) => { e.stopPropagation(); handleApplyTheme(theme); }}
                >
                  {isActive ? '✓ Applied' : 'Apply'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Custom color pickers */}
        <div style={{
          background: 'var(--surface2)', border: '1px solid var(--border)',
          borderRadius: 12, padding: '16px 18px', marginBottom: 14,
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 14 }}>Custom Colors</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
            {[
              { label: 'Primary (--gold)',   value: customPrimary,  setter: setCustomPrimary },
              { label: 'Accent (--teal)',    value: customAccent,   setter: setCustomAccent },
              { label: 'Surface (--surface)',value: customSurface,  setter: setCustomSurface },
            ].map(({ label, value, setter }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600 }}>{label}</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="color"
                    value={value}
                    onChange={e => setter(e.target.value)}
                    style={{
                      width: 36, height: 36, border: 'none', borderRadius: 8,
                      cursor: 'pointer', background: 'transparent', padding: 0,
                    }}
                  />
                  <span style={{ fontSize: 11, color: 'var(--muted2)', fontFamily: 'monospace' }}>{value}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="btn btn-gold btn-sm" onClick={handleApplyCustom}>
            🎨 Apply Custom Theme
          </button>
        </div>

        {/* Reset */}
        <button className="btn btn-ghost btn-sm" onClick={handleResetTheme} style={{ color: 'var(--muted)' }}>
          ↺ Reset to Default
        </button>
      </SectionCard>

      {/* ── 1. Profile ─────────────────────────────────────────────────────── */}
      <SectionCard title="Profile">
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, var(--gold), var(--teal))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, fontWeight: 700, color: '#0a0a0a',
            boxShadow: '0 0 16px var(--gold-glow)',
          }}>
            {initials}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--fg, #f0f0f0)' }}>{displayName}</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>{email}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <FormRow label="Display Name">
            <input
              className="input"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="Your display name"
            />
          </FormRow>
          <FormRow label="Email">
            <input className="input" value={email} readOnly style={{ opacity: 0.5 }} />
          </FormRow>
        </div>

        <button className="btn btn-gold" onClick={handleSaveProfile}>Save Profile</button>
      </SectionCard>

      {/* ── 2. Appearance ──────────────────────────────────────────────────── */}
      <SectionCard title="Appearance">
        <FormRow label="Theme Mode">
          <div style={{ display: 'flex', gap: 8 }}>
            <Pill label="🌙 Dark Mode" active />
            <Pill label="☀ Light Mode" active={false} />
          </div>
        </FormRow>

        <FormRow label="Visual Accent Theme" hint="Toggle a preview layout to apply global styling accents">
          <div className="set-theme-grid">
            {ACCENT_COLORS.map(c => {
              const isActive = accentColor === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => handleAccent(c.id)}
                  className={`set-theme-preview ${isActive ? 'active' : ''}`}
                >
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: isActive ? '#fff' : 'var(--muted2)' }}>{c.label}</div>
                  <div className="set-theme-layout-mock">
                    {/* Mock header bar */}
                    <div className="set-theme-bar-mock" style={{ background: c.hex }} />
                    <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 1 }} />
                    <div style={{ display: 'flex', gap: 4, marginTop: 'auto' }}>
                      <div className="set-theme-btn-mock" style={{ background: c.hex, width: 24 }} />
                      <div style={{ height: 10, background: 'rgba(255,255,255,0.1)', borderRadius: 2, flex: 1 }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </FormRow>

        <FormRow label="Font Size Hierarchy">
          <div style={{ display: 'flex', gap: 8 }}>
            {FONT_SIZES.map(s => (
              <Pill key={s} label={s} active={fontSize === s} onClick={() => handleFontSize(s)} />
            ))}
          </div>
        </FormRow>
      </SectionCard>

      {/* ── 3. Interactive Telemetry Console Terminal ──────────────────────── */}
      <SectionCard title="Developer Telemetry Console Logger">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="set-terminal">
            {consoleLogs.map((log, idx) => (
              <div key={idx} style={{ opacity: idx === consoleLogs.length - 1 ? 1 : 0.65 }}>
                {log}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handlePingHandshake}
              disabled={pingLoading}
              className="btn btn-gold btn-sm btn-pulse"
            >
              🔌 Initialize Connection Ping
            </button>
            <button
              onClick={() => setConsoleLogs(["[SYS] Terminal log index reset."])}
              className="btn btn-ghost btn-sm"
            >
              ✕ Clear Logs
            </button>
          </div>
        </div>
      </SectionCard>

      {/* ── 4. Interactive Credit Consumption Estimator ─────────────────────── */}
      <SectionCard title="Payload Dispatch Credit Estimator">
        <div className="set-estimator">
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 14 }}>
            {/* Word count slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>
                <span>Prompt Payload Length</span>
                <strong style={{ color: 'var(--gold)' }}>{estWords} words</strong>
              </div>
              <input
                type="range" min={50} max={1000} step={25}
                value={estWords}
                onChange={e => setEstWords(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--gold)', cursor: 'pointer' }}
              />
            </div>

            {/* Target platform selection */}
            <div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>Connected Slot Platform</div>
              <select
                value={estPlatform}
                onChange={e => setEstPlatform(e.target.value)}
                style={{ width: '100%', padding: '6px 8px', fontSize: 11, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, color: '#fff', cursor: 'pointer' }}
              >
                {PLATFORMS.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
            <div>
              <div style={{ fontSize: 9.5, color: 'var(--muted2)' }}>Platform Target</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: plEst.color, marginTop: 2 }}>{plEst.name}</div>
            </div>
            <div>
              <div style={{ fontSize: 9.5, color: 'var(--muted2)' }}>Estimated Tokens Cost</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: estCredits > 500 ? 'var(--red)' : 'var(--teal)', marginTop: 2 }}>{estCredits} credits</div>
            </div>
            <div>
              <div style={{ fontSize: 9.5, color: 'var(--muted2)' }}>Estimated Delivery Delay</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginTop: 2 }}>{estDelay} seconds</div>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* ── 5. Broadcast Settings ──────────────────────────────────────────── */}
      <SectionCard title="Broadcast Settings">
        <FormRow label={`Default Delay: ${delay}ms`} hint="Delay between broadcast messages">
          <input
            type="range" min={0} max={5000} step={50}
            value={delay}
            onChange={e => setDelay(Number(e.target.value))}
            style={{ accentColor: 'var(--gold)', cursor: 'pointer', width: '100%' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted2)', marginTop: 2 }}>
            <span>0ms</span><span>2500ms</span><span>5000ms</span>
          </div>
        </FormRow>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <FormRow label="Auto-Retry on Failure">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 36 }}>
              <Toggle checked={autoRetry} onChange={setAutoRetry} />
              <span style={{ fontSize: 13, color: 'var(--muted)' }}>{autoRetry ? 'Enabled' : 'Disabled'}</span>
            </div>
          </FormRow>
          <FormRow label="Max Retries (1–5)">
            <input
              className="input" type="number" min={1} max={5}
              value={maxRetries}
              onChange={e => setMaxRetries(Math.min(5, Math.max(1, Number(e.target.value))))}
              style={{ width: 100 }}
            />
          </FormRow>
        </div>

        <FormRow label="Show Success Toast">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 36 }}>
            <Toggle checked={showSuccessToast} onChange={setShowSuccessToast} />
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>{showSuccessToast ? 'On' : 'Off'}</span>
          </div>
        </FormRow>

        <button className="btn btn-gold" onClick={handleSaveBroadcast}>Save Broadcast Settings</button>
      </SectionCard>

      {/* ── 6. Account Defaults ────────────────────────────────────────────── */}
      <SectionCard title="Account Defaults">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <FormRow label="Default Plan Type">
            <select
              className="input"
              value={defaultPlan}
              onChange={e => setDefaultPlan(e.target.value)}
            >
              {PLAN_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </FormRow>
          <FormRow label="Default Credit Limit">
            <input
              className="input" type="number" min={0}
              value={creditLimit}
              onChange={e => setCreditLimit(Number(e.target.value))}
            />
          </FormRow>
        </div>

        <FormRow label="Auto-Sync on Connect">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 36 }}>
            <Toggle checked={autoSync} onChange={setAutoSync} />
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>{autoSync ? 'Enabled — accounts sync automatically' : 'Manual sync'}</span>
          </div>
        </FormRow>

        <button className="btn btn-gold" onClick={handleSaveAccountDefaults}>Save Account Defaults</button>
      </SectionCard>

      {/* ── 7. Data Management & Storage metrics ────────────────────────────── */}
      <SectionCard title="Data Management">
        {/* Storage stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Accounts',   count: accounts.length },
            { label: 'Broadcasts', count: broadcasts.length },
            { label: 'Prompts',    count: prompts.length },
            { label: 'Workflows',  count: workflows.length },
          ].map(({ label, count }) => (
            <div key={label} style={{
              background: 'var(--surface2)', borderRadius: 10, padding: '14px 16px',
              border: '1px solid var(--border)', textAlign: 'center',
            }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--gold)' }}>{count}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Browser Quota metrics analyzer */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>
            <span>Browser Quota consumption</span>
            <span>{storageKB} KB / 5120 KB</span>
          </div>
          <div className="progress" style={{ height: 4, marginBottom: 0 }}>
            <div className="progress-fill" style={{ width: `${(storageBytes / 5242880 * 100).toFixed(3)}%` }} />
          </div>
        </div>

        {/* Action triggers */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
          <button className="btn btn-gold" onClick={() => { exportData(); toast.bolt('Exporting data…'); }}>
            ↓ Export All Data
          </button>

          <button
            className="btn btn-danger"
            onClick={handleClearHistory}
            style={{ background: clearConfirm ? 'var(--red)' : undefined }}
          >
            {clearConfirm ? '⚠ Confirm Clear History' : 'Clear Broadcast History'}
          </button>
          {clearConfirm && (
            <button className="btn" onClick={() => setClearConfirm(false)} style={{ color: 'var(--muted)' }}>
              Cancel
            </button>
          )}
        </div>

        {/* 2-step reset */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginTop: 4 }}>
          {resetStep === 0 && (
            <button className="btn btn-danger" onClick={handleResetApp}>Reset App Data</button>
          )}
          {resetStep === 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, color: 'var(--muted)' }}>Are you sure? This cannot be undone.</span>
              <button className="btn btn-danger" onClick={handleResetApp}>Yes, Continue</button>
              <button className="btn" onClick={() => setResetStep(0)} style={{ color: 'var(--muted)' }}>Cancel</button>
            </div>
          )}
          {resetStep === 2 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, color: 'var(--red)', fontWeight: 700 }}>
                ⚠ FINAL WARNING — All data will be permanently deleted.
              </span>
              <button
                className="btn btn-danger"
                onClick={handleResetApp}
                style={{ boxShadow: '0 0 16px rgba(255,95,95,0.5)' }}
              >
                Erase Everything
              </button>
              <button className="btn" onClick={() => setResetStep(0)} style={{ color: 'var(--muted)' }}>Cancel</button>
            </div>
          )}
        </div>
      </SectionCard>

      {/* ── 7.5. Kanban Project CSV Workspace ────────────────────────────── */}
      <SectionCard title="Kanban Project CSV Workspace">
        <div style={{ fontSize: 13, color: 'var(--muted2)', lineHeight: 1.5, marginBottom: 16 }}>
          Export your current Kanban boards, tasks, checklists, and platform assignments to a standard CSV file, or drag in a CSV payload to immediately populate new workspace grids.
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 16 }}>
          {/* Export card sub-area */}
          <div style={{ background: 'var(--surface2)', padding: 16, borderRadius: 10, border: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Export Engine</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 12 }}>
                Compile and download local database snapshots of your active project workspaces.
              </div>
            </div>

            <div style={{ marginTop: 'auto' }}>
              <select
                id="export-proj-select"
                style={{ width: '100%', padding: '6px 10px', fontSize: 11, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, color: '#fff', marginBottom: 10, cursor: 'pointer' }}
              >
                <option value="all">Export All Projects ({store.projects?.length || 0})</option>
                {store.projects?.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>

              <button
                className="btn btn-gold btn-sm"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => {
                  const sel = document.getElementById('export-proj-select')?.value;
                  const targets = sel === 'all' ? store.projects : store.projects.filter(p => p.id === sel);
                  if (!targets || targets.length === 0) {
                    toast.error('No projects available for export.');
                    return;
                  }

                  // Construct CSV
                  let csvContent = "Project Name,Task Title,Task Description,Lane,Priority,Assigned Account,Subtask List\n";
                  targets.forEach(p => {
                    const pTasks = p.tasks || [];
                    if (pTasks.length === 0) {
                      csvContent += `"${p.name.replace(/"/g, '""')}",,,,,\n`;
                    } else {
                      pTasks.forEach(t => {
                        const assignedAcc = store.accounts?.find(a => a.id === t.accountId);
                        const assignedEmail = assignedAcc ? assignedAcc.email : '';
                        const subtasksStr = (t.subtasks || []).map(s => s.title.replace(/;/g, '\\;')).join(';');

                        csvContent += `"${p.name.replace(/"/g, '""')}",` +
                                      `"${t.title.replace(/"/g, '""')}",` +
                                      `"${(t.desc || '').replace(/"/g, '""')}",` +
                                      `"${t.status}",` +
                                      `"${t.priority}",` +
                                      `"${assignedEmail}",` +
                                      `"${subtasksStr.replace(/"/g, '""')}"\n`;
                      });
                    }
                  });

                  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `bolt-studio-projects-${new Date().toISOString().slice(0,10)}.csv`;
                  a.click();
                  URL.revokeObjectURL(url);
                  toast.bolt("✓ Project boards exported successfully!");
                }}
              >
                📥 Export Projects to CSV
              </button>
            </div>
          </div>

          {/* Import card sub-area */}
          <div style={{ background: 'var(--surface2)', padding: 16, borderRadius: 10, border: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Import Loader</div>

            {/* Drag & Drop zone */}
            <div
              id="csv-drag-zone"
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = 'var(--gold)';
                e.currentTarget.style.background = 'var(--gold-glow)';
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.background = 'var(--surface)';
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.background = 'var(--surface)';
                const file = e.dataTransfer.files[0];
                if (file) handleCSVParse(file);
              }}
              onClick={() => document.getElementById('csv-file-picker')?.click()}
              style={{
                flex: 1, border: '1px dashed var(--border)', background: 'var(--surface)',
                borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', padding: '16px 10px', textAlign: 'center', cursor: 'pointer',
                transition: 'all 0.2s ease', minHeight: 90
              }}
            >
              <span style={{ fontSize: 18, marginBottom: 4 }}>📄</span>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: '#e4e4ed' }}>Drag CSV here or browse</span>
              <span style={{ fontSize: 8.5, color: 'var(--muted)', marginTop: 2 }}>Supports project tasks & subtasks</span>

              <input
                id="csv-file-picker"
                type="file"
                accept=".csv"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleCSVParse(file);
                }}
                style={{ display: 'none' }}
              />
            </div>
          </div>
        </div>
      </SectionCard>

      {/* ── 8.5. Backup & Restore ────────────────────────────────────────────── */}
      <BackupRestoreSection store={store} toast={toast} settings={settings} />

      {/* ── 8. About ───────────────────────────────────────────────────────── */}
      <SectionCard title="About">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14, flexShrink: 0,
            background: 'linear-gradient(135deg, var(--gold), #ff9800)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, boxShadow: '0 0 20px var(--gold-glow)',
          }}>⚡</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--fg, #f0f0f0)' }}>Bolt Studio Pro</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>Multi-Platform Broadcast Suite</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          {[
            { k: 'Version',    v: '2.0.0' },
            { k: 'Build Date', v: BUILD_DATE },
            { k: 'Runtime',    v: 'Vite + React' },
            { k: 'License',    v: 'Proprietary' },
          ].map(({ k, v }) => (
            <div key={k} style={{
              background: 'var(--surface2)', borderRadius: 8, padding: '10px 14px',
              border: '1px solid var(--border)',
            }}>
              <div style={{ fontSize: 11, color: 'var(--muted2)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--muted)' }}>{v}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="btn"
            style={{ textDecoration: 'none', fontSize: 13, color: 'var(--muted)' }}
          >
            ↗ GitHub
          </a>
          <a
            href="mailto:support@boltstudio.pro"
            className="btn"
            style={{ textDecoration: 'none', fontSize: 13, color: 'var(--muted)' }}
          >
            ✉ Support
          </a>
          <a
            href="https://boltstudio.pro/docs"
            target="_blank"
            rel="noreferrer"
            className="btn"
            style={{ textDecoration: 'none', fontSize: 13, color: 'var(--muted)' }}
          >
            📖 Docs
          </a>
        </div>

        <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)', fontSize: 11, color: 'var(--muted2)' }}>
          © 2026 Bolt Studio Pro. Built with ⚡ and a lot of caffeine.
        </div>
      </SectionCard>

    </div>
  );
}
