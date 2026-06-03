// TopPrompts.jsx — Most used prompts list
export function TopPrompts({ prompts = [] }) {
  const demo = prompts.length ? prompts : [
    { text: 'Build a React dashboard with dark theme', uses: 12 },
    { text: 'Add TypeScript strict mode and fix all errors', uses: 8 },
    { text: 'Make the UI fully responsive for mobile', uses: 6 },
  ];

  return (
    <div style={{ fontFamily: 'monospace' }}>
      {demo.slice(0, 10).map((p, i) => (
        <div key={i} style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: '1px solid #111a30', alignItems: 'center' }}>
          <span style={{ color: '#333', fontSize: 14, minWidth: 24, textAlign: 'center' }}>#{i + 1}</span>
          <span style={{ color: '#aaa', fontSize: 12, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.text}</span>
          <span style={{ color: '#00FFAA', fontSize: 12, minWidth: 40, textAlign: 'right', flexShrink: 0 }}>{p.uses}×</span>
        </div>
      ))}
    </div>
  );
}
