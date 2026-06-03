// SharedPrompts.jsx — Community shared templates panel
const COMMUNITY_PROMPTS = [
  { id: 'c1', name: 'Full-Stack SaaS Boilerplate', author: '@devhero', likes: 234, template: 'Build a complete SaaS application with Next.js 14, Prisma, Stripe, and Tailwind CSS...' },
  { id: 'c2', name: 'AI Chatbot with Memory', author: '@aiwizard', likes: 189, template: 'Create a GPT-4 powered chatbot with persistent conversation memory using Redis...' },
  { id: 'c3', name: 'Real-time Dashboard', author: '@rtmaster', likes: 142, template: 'Build a real-time analytics dashboard with WebSockets, D3.js, and React...' },
];

export function SharedPrompts({ onUse }) {
  return (
    <div style={{ fontFamily: 'monospace' }}>
      <div style={{ color: '#555', fontSize: 12, marginBottom: 12 }}>COMMUNITY TEMPLATES</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {COMMUNITY_PROMPTS.map(p => (
          <div key={p.id} style={{ background: '#080c14', border: '1px solid #1e2340', borderRadius: 10, padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: '#ccc', fontSize: 13 }}>{p.name}</span>
              <span style={{ color: '#FF4D8F', fontSize: 12 }}>♥ {p.likes}</span>
            </div>
            <div style={{ color: '#555', fontSize: 11, marginBottom: 10 }}>by {p.author}</div>
            <button onClick={() => onUse?.(p)} style={{ background: '#00FFAA22', border: '1px solid #00FFAA44', borderRadius: 6, color: '#00FFAA', fontSize: 11, padding: '4px 12px', cursor: 'pointer' }}>Use Template</button>
          </div>
        ))}
      </div>
    </div>
  );
}
