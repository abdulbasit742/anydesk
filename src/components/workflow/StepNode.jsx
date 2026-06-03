// StepNode.jsx — Individual workflow step node component
const TYPE_COLORS = { transform: '#6699FF', broadcast: '#00FFAA', auth: '#FFB800', delay: '#FF8800', audit: '#FF4D4D', persist: '#88FF00', migration: '#00BFFF', deployment: '#9B59B6', build: '#E67E22' };

export function StepNode({ node, index }) {
  const color = TYPE_COLORS[node.type] || '#555';

  return (
    <div style={{ position: 'absolute', left: node.x, top: node.y, width: node.width, height: node.height, background: '#080c14', border: `2px solid ${color}44`, borderRadius: 10, padding: '8px 12px', fontFamily: 'monospace', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
        <span style={{ fontSize: 14 }}>{node.icon || '◈'}</span>
        <span style={{ color: '#ccc', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{node.name}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ background: `${color}22`, color, borderRadius: 4, padding: '1px 6px', fontSize: 10 }}>{node.type}</span>
        <span style={{ color: '#333', fontSize: 10 }}>step {index + 1}</span>
      </div>
    </div>
  );
}
