// IntegrationSettings.jsx — Webhook endpoints and third-party connections
import React from 'react';
import { WebhookTrigger } from '../../lib/emulator/WebhookTrigger.js';

const wh = new WebhookTrigger();

export function IntegrationSettings({ integrations = {}, onChange }) {
  const [newUrl, setNewUrl] = React.useState('');
  const [testResult, setTestResult] = React.useState(null);
  const [endpoints, setEndpoints] = React.useState(integrations.webhooks || []);

  const addEndpoint = () => {
    if (!newUrl.startsWith('http')) return;
    const ep = { url: newUrl, id: Date.now(), addedAt: Date.now() };
    wh.addEndpoint(newUrl);
    const next = [...endpoints, ep];
    setEndpoints(next);
    onChange?.({ ...integrations, webhooks: next });
    setNewUrl('');
  };

  const removeEndpoint = (id) => {
    const next = endpoints.filter(e => e.id !== id);
    setEndpoints(next);
    onChange?.({ ...integrations, webhooks: next });
  };

  const testWebhook = async () => {
    setTestResult('testing');
    const r = await wh.trigger('test', { message: 'BSP test ping', ts: Date.now() });
    setTestResult(r.results?.[0]?.success ? 'success' : 'failed');
    setTimeout(() => setTestResult(null), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: 'monospace' }}>
      <div>
        <div style={{ color: '#888', fontSize: 11, marginBottom: 10 }}>WEBHOOK ENDPOINTS</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="https://your-server.com/webhook"
            style={{ flex: 1, background: '#080c14', border: '1px solid #1e2340', borderRadius: 7, color: '#ccc', fontSize: 12, padding: '7px 10px' }} />
          <button onClick={addEndpoint} style={{ background: '#00FFAA22', border: '1px solid #00FFAA44', borderRadius: 7, color: '#00FFAA', fontSize: 11, padding: '7px 14px', cursor: 'pointer' }}>Add</button>
        </div>
        {endpoints.length === 0 ? (
          <div style={{ color: '#555', fontSize: 12 }}>No webhooks configured.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {endpoints.map(ep => (
              <div key={ep.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#080c14', border: '1px solid #1e2340', borderRadius: 7, padding: '8px 12px' }}>
                <span style={{ color: '#aaa', fontSize: 12, wordBreak: 'break-all' }}>{ep.url}</span>
                <button onClick={() => removeEndpoint(ep.id)} style={{ background: 'none', border: 'none', color: '#FF4D4D', cursor: 'pointer', fontSize: 13, marginLeft: 8 }}>×</button>
              </div>
            ))}
          </div>
        )}
        {endpoints.length > 0 && (
          <button onClick={testWebhook} style={{ marginTop: 10, background: 'none', border: '1px solid #1e2340', borderRadius: 6, color: testResult === 'success' ? '#00FFAA' : testResult === 'failed' ? '#FF4D4D' : '#888', fontSize: 11, padding: '6px 14px', cursor: 'pointer' }}>
            {testResult === 'testing' ? 'Testing...' : testResult === 'success' ? '✓ Success' : testResult === 'failed' ? '✕ Failed' : 'Test Webhook'}
          </button>
        )}
      </div>

      <div>
        <div style={{ color: '#888', fontSize: 11, marginBottom: 10 }}>GOOGLE AUTH</div>
        <button style={{ background: '#fff', border: 'none', borderRadius: 7, color: '#333', fontSize: 12, padding: '8px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>G</span> Connect Google Account
        </button>
      </div>
    </div>
  );
}
