// Sidebar.jsx — Main navigation sidebar with platform icons
const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '◈' },
  { id: 'accounts', label: 'Accounts', icon: '⚡' },
  { id: 'broadcast', label: 'Broadcast', icon: '📡' },
  { id: 'workflows', label: 'Workflows', icon: '⟳' },
  { id: 'projects', label: 'Projects', icon: '📁' },
  { id: 'library', label: 'Library', icon: '📚' },
  { id: 'analytics', label: 'Analytics', icon: '📊' },
  { id: 'security', label: 'Security', icon: '🔒' },
  { id: 'settings', label: 'Settings', icon: '⚙' },
];

export function Sidebar({ collapsed, activePage, onNavigate }) {
  const w = collapsed ? 56 : 200;

  return (
    <aside style={{ width: w, background: '#0a0e1a', borderRight: '1px solid #1e2340', transition: 'width 0.2s', overflow: 'hidden', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      <div style={{ padding: collapsed ? '20px 0' : '20px 16px', borderBottom: '1px solid #1e2340' }}>
        {!collapsed && (
          <div style={{ fontFamily: 'monospace' }}>
            <div style={{ color: '#00FFAA', fontWeight: 'bold', fontSize: 14 }}>BOLT STUDIO</div>
            <div style={{ color: '#333', fontSize: 10 }}>PRO v2.0</div>
          </div>
        )}
        {collapsed && <div style={{ color: '#00FFAA', textAlign: 'center', fontSize: 18 }}>⚡</div>}
      </div>

      <nav style={{ flex: 1, padding: '12px 0' }}>
        {NAV_ITEMS.map(item => (
          <button key={item.id} onClick={() => onNavigate(item.id)} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            width: '100%', padding: collapsed ? '10px 0' : '10px 16px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            background: activePage === item.id ? '#0d1020' : 'transparent',
            border: 'none', borderLeft: `3px solid ${activePage === item.id ? '#00FFAA' : 'transparent'}`,
            color: activePage === item.id ? '#00FFAA' : '#555',
            fontSize: 13, cursor: 'pointer', fontFamily: 'monospace',
            transition: 'all 0.15s',
          }}>
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            {!collapsed && item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
