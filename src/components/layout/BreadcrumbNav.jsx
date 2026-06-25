// BreadcrumbNav.jsx — Breadcrumb navigation component
export function BreadcrumbNav({ items = [], onNavigate }) {
  return (
    <nav style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'monospace', fontSize: 12, padding: '8px 0' }}>
      {items.map((item, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {i > 0 && <span style={{ color: '#333' }}>/</span>}
          {item.onClick || onNavigate ? (
            <button onClick={() => item.onClick?.() || onNavigate?.(item.id)} style={{ background: 'transparent', border: 'none', color: i === items.length - 1 ? '#e0e0e0' : '#555', cursor: i === items.length - 1 ? 'default' : 'pointer', fontSize: 12, fontFamily: 'monospace', padding: 0 }}>
              {item.label}
            </button>
          ) : (
            <span style={{ color: i === items.length - 1 ? '#e0e0e0' : '#555' }}>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
