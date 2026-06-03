// AppShell.jsx — Main app shell wrapper with sidebar and topbar
import { useState } from 'react';
import { Sidebar } from './Sidebar.jsx';
import { TopBar } from './TopBar.jsx';
import { StatusBar } from './StatusBar.jsx';
import { NotificationCenter } from './NotificationCenter.jsx';

export function AppShell({ children, activePage, onNavigate }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#080c14', overflow: 'hidden' }}>
      <TopBar onToggleSidebar={() => setSidebarCollapsed(c => !c)} onToggleNotif={() => setNotifOpen(o => !o)} activePage={activePage} />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar collapsed={sidebarCollapsed} activePage={activePage} onNavigate={onNavigate} />
        <main style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
          {children}
        </main>
        {notifOpen && <NotificationCenter onClose={() => setNotifOpen(false)} />}
      </div>
      <StatusBar />
    </div>
  );
}
