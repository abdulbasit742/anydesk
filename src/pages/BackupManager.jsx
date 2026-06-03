import { useState } from 'react';

const BACKUP_JOBS = [
  { id: 1, name: 'PostgreSQL Full', schedule: '0 2 * * *', lastRun: '2026-06-02 02:00:11', size: '4.2 GB', status: 'SUCCESS', offsite: true },
  { id: 2, name: 'Redis Snapshot', schedule: '*/30 * * * *', lastRun: '2026-06-02 07:30:00', size: '210 MB', status: 'SUCCESS', offsite: false },
  { id: 3, name: 'User Uploads S3', schedule: '0 4 * * 0', lastRun: '2026-06-01 04:00:22', size: '18.7 GB', status: 'SUCCESS', offsite: true },
  { id: 4, name: 'Config Vault', schedule: '0 1 * * *', lastRun: '2026-06-02 01:00:07', size: '3.1 MB', status: 'FAILED', offsite: false },
  { id: 5, name: 'MongoDB Atlas', schedule: '0 3 * * *', lastRun: '2026-06-02 03:00:44', size: '9.8 GB', status: 'SUCCESS', offsite: true },
];
const RESTORE_POINTS = ['2026-06-02 02:00', '2026-06-01 02:00', '2026-05-31 02:00', '2026-05-30 02:00', '2026-05-28 02:00'];

function StorageGauge({ used, total }) {
  const pct = used / total;
  const color = pct > 0.8 ? '#ef4444' : pct > 0.6 ? '#f5b731' : '#22d3ee';
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
        <span style={{ color: '#6e7191' }}>Storage Used</span>
        <span style={{ color, fontWeight: 700 }}>{used} TB / {total} TB</span>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 8, height: 16, overflow: 'hidden' }}>
        <div style={{ width: `${pct * 100}%`, height: '100%', background: `linear-gradient(90deg, ${color}, ${color}88)`, borderRadius: 8, transition: 'width 0.5s' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: '#6e7191' }}>
        <span>{(pct * 100).toFixed(1)}% used</span>
        <span>{total - used} TB free</span>
      </div>
    </div>
  );
}

export default function BackupManager() {
  const [jobs, setJobs] = useState(BACKUP_JOBS);
  const [showRestore, setShowRestore] = useState(false);
  const [restorePoint, setRestorePoint] = useState(RESTORE_POINTS[0]);
  const [restoreTarget, setRestoreTarget] = useState('');
  const [running, setRunning] = useState({});
  const [retention, setRetention] = useState({ daily: 7, weekly: 4, monthly: 6 });
  const [verifying, setVerifying] = useState({});

  const runBackup = (id) => {
    setRunning(r => ({ ...r, [id]: true }));
    setTimeout(() => {
      setRunning(r => { const n = { ...r }; delete n[id]; return n; });
      setJobs(prev => prev.map(j => j.id === id ? { ...j, status: 'SUCCESS', lastRun: new Date().toISOString().replace('T', ' ').slice(0, 16) } : j));
    }, 3000);
  };

  const verifyBackup = (id) => {
    setVerifying(r => ({ ...r, [id]: 'running' }));
    setTimeout(() => setVerifying(r => ({ ...r, [id]: 'verified' })), 2500);
  };

  const s = {
    page: { minHeight: '100vh', background: '#0e0e16', color: '#e2e8f0', fontFamily: 'Inter, sans-serif' },
    hero: { background: 'linear-gradient(135deg, #0e0e16 0%, #0a1a14 60%, #0e0e16 100%)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '48px 40px 36px' },
    heroTitle: { fontSize: 36, fontWeight: 800, background: 'linear-gradient(90deg, #22d3ee, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 },
    body: { padding: '32px 40px' },
    card: { background: '#16161e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 24, marginBottom: 24 },
    cardTitle: { fontSize: 14, fontWeight: 700, color: '#6e7191', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 },
    statBadge: (c) => ({ background: c + '18', border: `1px solid ${c}33`, borderRadius: 12, padding: '12px 20px', textAlign: 'center', flex: 1, minWidth: 120 }),
    btn: (c = '#22d3ee') => ({ background: c + '22', border: `1px solid ${c}44`, color: c, borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontWeight: 600, fontSize: 13 }),
    jobRow: { display: 'flex', alignItems: 'center', gap: 16, padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' },
    statusBadge: (s) => ({ background: s === 'SUCCESS' ? '#22d3ee22' : '#ef444422', color: s === 'SUCCESS' ? '#22d3ee' : '#ef4444', border: `1px solid ${s === 'SUCCESS' ? '#22d3ee' : '#ef4444'}44`, borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 700 }),
    modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 },
    modalBox: { background: '#16161e', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: 36, minWidth: 440 },
    input: { background: '#1d1d28', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0', borderRadius: 8, padding: '8px 12px', fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box', marginTop: 6 },
    select: { background: '#1d1d28', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0', borderRadius: 8, padding: '8px 12px', fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box', marginTop: 6 },
    retInput: { background: '#1d1d28', border: '1px solid rgba(255,255,255,0.1)', color: '#22d3ee', borderRadius: 6, padding: '4px 8px', width: 48, fontSize: 13, outline: 'none', textAlign: 'center' },
  };

  return (
    <div style={s.page}>
      <div style={s.hero}>
        <h1 style={s.heroTitle}>Backup Manager</h1>
        <p style={{ color: '#6e7191', marginTop: 8, fontSize: 15 }}>Data backup, restore and replication management</p>
        <div style={{ display: 'flex', gap: 16, marginTop: 24, flexWrap: 'wrap' }}>
          <div style={s.statBadge('#22d3ee')}><div style={{ fontSize: 22, fontWeight: 800, color: '#22d3ee' }}>{jobs.length}</div><div style={{ fontSize: 11, color: '#6e7191' }}>Backup Jobs</div></div>
          <div style={s.statBadge('#ef4444')}><div style={{ fontSize: 22, fontWeight: 800, color: '#ef4444' }}>{jobs.filter(j => j.status === 'FAILED').length}</div><div style={{ fontSize: 11, color: '#6e7191' }}>Failed Jobs</div></div>
          <div style={s.statBadge('#f5b731')}><div style={{ fontSize: 22, fontWeight: 800, color: '#f5b731' }}>32.9 GB</div><div style={{ fontSize: 11, color: '#6e7191' }}>Total Backed Up</div></div>
          <div style={s.statBadge('#a78bfa')}><div style={{ fontSize: 22, fontWeight: 800, color: '#a78bfa' }}>{jobs.filter(j => j.offsite).length}</div><div style={{ fontSize: 11, color: '#6e7191' }}>Offsite Replicated</div></div>
          <button style={{ ...s.btn('#22d3ee'), marginLeft: 'auto', alignSelf: 'flex-start' }} onClick={() => setShowRestore(true)}>🔄 Restore Backup</button>
        </div>
      </div>

      <div style={s.body}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
          <div>
            <div style={s.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={s.cardTitle}>Backup Jobs</span>
                <button style={s.btn('#22d3ee')} onClick={() => jobs.forEach(j => runBackup(j.id))}>▶ Run All Now</button>
              </div>
              {jobs.map(job => (
                <div key={job.id} style={s.jobRow}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{job.name}</div>
                    <div style={{ fontSize: 12, color: '#6e7191', fontFamily: 'monospace' }}>cron: {job.schedule}</div>
                    <div style={{ fontSize: 12, color: '#6e7191', marginTop: 2 }}>Last: {job.lastRun} · {job.size}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                    <span style={s.statusBadge(running[job.id] ? 'RUNNING' : job.status)}>{running[job.id] ? '⏳ RUNNING' : job.status}</span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <span style={{ fontSize: 11, color: job.offsite ? '#22d3ee' : '#6e7191' }}>{job.offsite ? '☁ Offsite' : '○ Local'}</span>
                      <button style={{ ...s.btn('#f5b731'), padding: '4px 10px', fontSize: 11 }} onClick={() => runBackup(job.id)} disabled={!!running[job.id]}>Run</button>
                      <button style={{ ...s.btn('#a78bfa'), padding: '4px 10px', fontSize: 11 }} onClick={() => verifyBackup(job.id)}>
                        {verifying[job.id] === 'running' ? '⏳ Verifying' : verifying[job.id] === 'verified' ? '✅ OK' : 'Verify'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={s.card}>
              <div style={s.cardTitle}>Storage Usage</div>
              <StorageGauge used={2.3} total={5} />
            </div>
            <div style={s.card}>
              <div style={s.cardTitle}>Retention Policy</div>
              {[['Daily Backups', 'daily', 'days'], ['Weekly Backups', 'weekly', 'weeks'], ['Monthly Backups', 'monthly', 'months']].map(([label, key, unit]) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <span style={{ fontSize: 13, color: '#9ca3af' }}>{label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input type="number" style={s.retInput} value={retention[key]} onChange={e => setRetention(r => ({ ...r, [key]: +e.target.value }))} min={1} max={365} />
                    <span style={{ fontSize: 12, color: '#6e7191' }}>{unit}</span>
                  </div>
                </div>
              ))}
              <button style={{ ...s.btn('#22d3ee'), width: '100%', marginTop: 8 }}>Save Policy</button>
            </div>
            <div style={s.card}>
              <div style={s.cardTitle}>Offsite Replication</div>
              {jobs.map(j => (
                <div key={j.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 13, color: '#9ca3af' }}>{j.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: j.offsite ? '#22d3ee' : '#6e7191' }}>{j.offsite ? '✓ Replicated' : '— Local only'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showRestore && (
        <div style={s.modal} onClick={() => setShowRestore(false)}>
          <div style={s.modalBox} onClick={e => e.stopPropagation()}>
            <h3 style={{ color: '#22d3ee', marginTop: 0, marginBottom: 24 }}>Restore from Backup</h3>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: '#6e7191', display: 'block' }}>Restore Point (Point-in-Time)</label>
              <select style={s.select} value={restorePoint} onChange={e => setRestorePoint(e.target.value)}>
                {RESTORE_POINTS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: '#6e7191', display: 'block' }}>Target Environment</label>
              <input style={s.input} placeholder="e.g. staging-db" value={restoreTarget} onChange={e => setRestoreTarget(e.target.value)} />
            </div>
            <div style={{ background: '#f5b73118', border: '1px solid #f5b73133', borderRadius: 8, padding: 12, marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: '#f5b731', fontWeight: 600 }}>⚠ Warning: This will overwrite the target environment data</div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button style={s.btn('#ef4444')} onClick={() => setShowRestore(false)}>Start Restore</button>
              <button style={s.btn('#6e7191')} onClick={() => setShowRestore(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
