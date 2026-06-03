import { useState } from 'react';



const MOCK_FILES = [
  { name: 'index.html', type: 'html', size: 12400, modified: '2026-05-30 14:22', icon: '🌐' },
  { name: 'app.js', type: 'js', size: 84300, modified: '2026-06-01 09:15', icon: '📜' },
  { name: 'styles.css', type: 'css', size: 32100, modified: '2026-05-28 17:00', icon: '🎨' },
  { name: 'logo.png', type: 'png', size: 210000, modified: '2026-04-12 11:30', icon: '🖼' },
  { name: 'data.json', type: 'json', size: 5600, modified: '2026-06-02 08:00', icon: '{}' },
  { name: 'README.md', type: 'md', size: 3200, modified: '2026-05-20 16:45', icon: '📄' },
  { name: 'config.yaml', type: 'yaml', size: 1800, modified: '2026-05-25 10:00', icon: '⚙' },
  { name: 'archive.tar.gz', type: 'gz', size: 1200000, modified: '2026-03-10 09:22', icon: '📦' },
  { name: 'server.py', type: 'py', size: 45000, modified: '2026-06-01 22:30', icon: '🐍' },
  { name: 'Dockerfile', type: 'docker', size: 2100, modified: '2026-05-15 14:00', icon: '🐳' },
  { name: 'docker-compose.yml', type: 'yaml', size: 3300, modified: '2026-05-15 14:05', icon: '🐳' },
  { name: 'tests', type: 'dir', size: null, modified: '2026-05-29 11:00', icon: '📁' },
];

const formatSize = (bytes) => {
  if (!bytes) return '--';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1024 / 1024).toFixed(1) + ' MB';
};

export default function FileManager() {
  const [currentPath, setCurrentPath] = useState(['/', 'home', 'ubuntu']);
  const [files, setFiles] = useState(MOCK_FILES);
  const [selected, setSelected] = useState(new Set());
  const [preview, setPreview] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [storageUsed] = useState(0.68);

  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const sortedFiles = [...filteredFiles].sort((a, b) => sortBy === 'name' ? a.name.localeCompare(b.name) : sortBy === 'size' ? (b.size || 0) - (a.size || 0) : b.modified.localeCompare(a.modified));

  const toggleSelect = (name, e) => {
    const newSel = new Set(selected);
    if (e.shiftKey) { newSel.add(name); }
    else { if (newSel.has(name)) { newSel.clear(); } else { newSel.clear(); newSel.add(name); } }
    setSelected(newSel);
  };

  const createFolder = () => {
    if (newFolderName.trim()) {
      setFiles(f => [{ name: newFolderName, type: 'dir', size: null, modified: new Date().toISOString().slice(0, 16).replace('T', ' '), icon: '📁' }, ...f]);
      setShowNewFolderModal(false); setNewFolderName('');
    }
  };

  const deleteSelected = () => setFiles(f => f.filter(file => !selected.has(file.name)));

  const s = {
    page: { minHeight: '100vh', background: '#0e0e16', color: '#e2e8f0', fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column' },
    hero: { background: 'linear-gradient(135deg, #0e0e16 0%, #16161e 50%, #1e201a 100%)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '24px 40px' },
    heroTitle: { fontSize: 26, fontWeight: 800, background: 'linear-gradient(90deg, #f5b731, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 },
    badge: (c) => ({ background: c + '22', border: `1px solid ${c}44`, color: c, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 600 }),
    layout: { display: 'flex', flex: 1, height: 'calc(100vh - 195px)' },
    sidebar: { width: 220, borderRight: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', background: '#0e0e16' },
    main: { flex: 1, display: 'flex', flexDirection: 'column' },
    previewPanel: { width: 260, borderLeft: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', background: '#0e0e16' },
    toolbar: { display: 'flex', gap: 8, padding: '10px 16px', background: '#16161e', borderBottom: '1px solid rgba(255,255,255,0.07)', alignItems: 'center' },
    searchInput: { flex: 1, background: '#0e0e16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#e2e8f0', padding: '8px 14px', fontSize: 13, outline: 'none' },
    btn: (c) => ({ background: c + '22', border: `1px solid ${c}44`, color: c, borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }),
    breadcrumb: { display: 'flex', alignItems: 'center', padding: '8px 16px', background: '#16161e', borderBottom: '1px solid rgba(255,255,255,0.07)', gap: 4 },
    fileGrid: { flex: 1, padding: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 12, overflow: 'auto', alignContent: 'start' },
    fileCard: (sel) => ({ background: sel ? 'rgba(34,211,238,0.12)' : '#1d1d28', border: `1px solid ${sel ? '#22d3ee55' : 'rgba(255,255,255,0.06)'}`, borderRadius: 10, padding: '14px 10px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s' }),
    fileList: { flex: 1, overflow: 'auto' },
    fileRow: (sel) => ({ display: 'flex', alignItems: 'center', padding: '10px 16px', background: sel ? 'rgba(34,211,238,0.08)' : 'transparent', borderBottom: '1px solid rgba(255,255,255,0.03)', cursor: 'pointer' }),
    sideHead: { padding: '10px 14px', fontSize: 11, fontWeight: 700, color: '#6e7191', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.07)' },
    treeItem: (d) => ({ padding: '8px 14px', paddingLeft: 14 + d * 14, fontSize: 12, cursor: 'pointer', color: '#6e7191' }),
    dropZone: { margin: 16, border: `2px dashed ${isDragging ? '#22d3ee' : 'rgba(255,255,255,0.12)'}`, borderRadius: 10, padding: 20, textAlign: 'center', background: isDragging ? 'rgba(34,211,238,0.05)' : 'transparent', transition: 'all 0.2s' },
    modal: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
    modalBox: { background: '#16161e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: 28, width: 360 },
  };

  return (
    <div style={s.page}>
      <div style={s.hero}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <span style={s.badge('#f5b731')}>📁 File Manager</span>
              <span style={s.badge('#22d3ee')}>SFTP Mode</span>
            </div>
            <h1 style={s.heroTitle}>File Manager</h1>
            <p style={{ color: '#6e7191', margin: '6px 0 0', fontSize: 13 }}>Browse, upload, download and manage remote files</p>
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#6e7191', marginBottom: 6 }}>Storage Used</div>
            <div style={{ width: 200, background: 'rgba(255,255,255,0.07)', borderRadius: 10, height: 10, overflow: 'hidden' }}>
              <div style={{ width: `${storageUsed * 100}%`, background: 'linear-gradient(90deg, #22d3ee, #a78bfa)', height: '100%', borderRadius: 10 }} />
            </div>
            <div style={{ fontSize: 12, color: '#6e7191', marginTop: 4, textAlign: 'right' }}>{(storageUsed * 100).toFixed(0)}% of 50 GB</div>
          </div>
        </div>
      </div>

      <div style={s.toolbar}>
        <input placeholder="Search files..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={s.searchInput} />
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ background: '#0e0e16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#e2e8f0', padding: '7px 10px', fontSize: 12, outline: 'none', cursor: 'pointer' }}>
          {['name', 'size', 'modified'].map(o => <option key={o} value={o}>Sort: {o}</option>)}
        </select>
        <button onClick={() => setViewMode(v => v === 'grid' ? 'list' : 'grid')} style={s.btn('#6e7191')}>{viewMode === 'grid' ? '☰ List' : '⊞ Grid'}</button>
        <button onClick={() => setShowNewFolderModal(true)} style={s.btn('#f5b731')}>+ Folder</button>
        <button style={s.btn('#22d3ee')}>⬆ Upload</button>
        {selected.size > 0 && (
          <>
            <button style={s.btn('#a78bfa')}>⬇ Download ({selected.size})</button>
            <button onClick={deleteSelected} style={s.btn('#ef4444')}>🗑 Delete</button>
          </>
        )}
      </div>

      <div style={s.breadcrumb}>
        {currentPath.map((seg, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span onClick={() => setCurrentPath(currentPath.slice(0, i + 1))} style={{ fontSize: 13, color: i === currentPath.length - 1 ? '#e2e8f0' : '#22d3ee', cursor: 'pointer', fontWeight: i === currentPath.length - 1 ? 700 : 400 }}>{seg}</span>
            {i < currentPath.length - 1 && <span style={{ color: '#6e7191' }}>/</span>}
          </span>
        ))}
      </div>

      <div style={s.layout}>
        <div style={s.sidebar}>
          <div style={s.sideHead}>Folders</div>
          {[['/', 0], ['var/', 1], ['home/', 0], ['ubuntu/', 1], ['etc/', 0], ['.ssh/', 2], ['logs/', 2]].map(([name, depth]) => (
            <div key={name} style={s.treeItem(depth)} onClick={() => setCurrentPath(name === '/' ? ['/'] : ['/', ...name.replace(/\//g, '').split('/')])}>
              📁 {name}
            </div>
          ))}
          <div style={{ marginTop: 'auto' }}>
            <div style={s.dropZone} onDragOver={e => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={() => { setIsDragging(false); }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>⬆</div>
              <div style={{ fontSize: 12, color: '#6e7191' }}>Drop files to upload</div>
            </div>
          </div>
        </div>

        <div style={s.main}>
          {viewMode === 'grid' ? (
            <div style={s.fileGrid}>
              {sortedFiles.map(file => (
                <div key={file.name} style={s.fileCard(selected.has(file.name))} onClick={e => { toggleSelect(file.name, e); setPreview(file); }} onDoubleClick={() => file.type === 'dir' && setCurrentPath([...currentPath, file.name])}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>{file.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</div>
                  <div style={{ fontSize: 10, color: '#6e7191', marginTop: 4 }}>{formatSize(file.size)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={s.fileList}>
              <div style={{ display: 'flex', padding: '8px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', fontSize: 11, fontWeight: 700, color: '#6e7191' }}>
                <span style={{ flex: 3 }}>Name</span><span style={{ flex: 1 }}>Size</span><span style={{ flex: 2 }}>Modified</span><span style={{ flex: 1 }}>Actions</span>
              </div>
              {sortedFiles.map(file => (
                <div key={file.name} style={s.fileRow(selected.has(file.name))} onClick={e => { toggleSelect(file.name, e); setPreview(file); }}>
                  <span style={{ flex: 3, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>{file.icon} {file.name}</span>
                  <span style={{ flex: 1, fontSize: 12, color: '#6e7191', fontFamily: 'monospace' }}>{formatSize(file.size)}</span>
                  <span style={{ flex: 2, fontSize: 12, color: '#6e7191' }}>{file.modified}</span>
                  <span style={{ flex: 1, display: 'flex', gap: 4 }}>
                    <button onClick={e => { e.stopPropagation(); }} style={{ ...s.btn('#a78bfa'), padding: '3px 8px', fontSize: 10 }}>✏</button>
                    <button onClick={e => { e.stopPropagation(); setFiles(f => f.filter(x => x.name !== file.name)); }} style={{ ...s.btn('#ef4444'), padding: '3px 8px', fontSize: 10 }}>🗑</button>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {preview && (
          <div style={s.previewPanel}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>Preview</span>
              <button onClick={() => setPreview(null)} style={{ background: 'none', border: 'none', color: '#6e7191', cursor: 'pointer', fontSize: 16 }}>✕</button>
            </div>
            <div style={{ padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 60, marginBottom: 16 }}>{preview.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8, wordBreak: 'break-all' }}>{preview.name}</div>
              {[['Type', preview.type?.toUpperCase() || 'DIR'], ['Size', formatSize(preview.size)], ['Modified', preview.modified]].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: 12 }}>
                  <span style={{ color: '#6e7191' }}>{k}</span>
                  <span style={{ fontFamily: 'monospace', color: '#22d3ee' }}>{v}</span>
                </div>
              ))}
              <button style={{ ...s.btn('#22d3ee'), marginTop: 16, width: '100%' }}>⬇ Download</button>
              <button style={{ ...s.btn('#f5b731'), marginTop: 8, width: '100%' }}>✏ Rename</button>
            </div>
          </div>
        )}
      </div>

      {showNewFolderModal && (
        <div style={s.modal}>
          <div style={s.modalBox}>
            <h3 style={{ margin: '0 0 18px', fontSize: 16 }}>Create New Folder</h3>
            <input autoFocus value={newFolderName} onChange={e => setNewFolderName(e.target.value)} onKeyDown={e => e.key === 'Enter' && createFolder()} style={{ width: '100%', background: '#0e0e16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#e2e8f0', padding: '10px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 16 }} placeholder="Folder name" />
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowNewFolderModal(false)} style={s.btn('#6e7191')}>Cancel</button>
              <button onClick={createFolder} style={s.btn('#f5b731')}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
