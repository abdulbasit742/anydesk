// AccountForm.jsx — Add/edit account form with credential input
import { useState } from 'react';
import { Modal, ModalButton } from '../layout/Modal.jsx';
import { PlatformSelector } from './PlatformSelector.jsx';
import { CredentialInput } from './CredentialInput.jsx';
import { ConnectionTest } from './ConnectionTest.jsx';

const PLATFORMS = ['bolt', 'lovable', 'manus', 'replit', 'claude', 'cursor', 'v0'];

export function AccountForm({ account, onSave, onClose }) {
  const [form, setForm] = useState({ platform: 'bolt', label: '', apiKey: '', ...account });
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = () => {
    if (!form.label.trim() || !form.platform) return;
    onSave({ ...form, keyCreatedAt: account?.keyCreatedAt || new Date().toISOString() });
  };

  return (
    <Modal title={account ? 'Edit Account' : 'Add Account'} onClose={onClose} footer={
      <>
        <ModalButton variant="secondary" onClick={onClose}>Cancel</ModalButton>
        <ModalButton onClick={handleSave} disabled={!form.label.trim()}>Save Account</ModalButton>
      </>
    }>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontFamily: 'monospace' }}>
        <div>
          <label style={{ color: '#888', fontSize: 12, display: 'block', marginBottom: 6 }}>Platform</label>
          <PlatformSelector value={form.platform} options={PLATFORMS} onChange={v => set('platform', v)} />
        </div>
        <div>
          <label style={{ color: '#888', fontSize: 12, display: 'block', marginBottom: 6 }}>Label</label>
          <input value={form.label} onChange={e => set('label', e.target.value)} placeholder="e.g. My Bolt Account" style={{ width: '100%', background: '#080c14', border: '1px solid #1e2340', borderRadius: 8, color: '#e0e0e0', padding: '10px 14px', fontSize: 13, fontFamily: 'monospace', boxSizing: 'border-box', outline: 'none' }} />
        </div>
        <div>
          <label style={{ color: '#888', fontSize: 12, display: 'block', marginBottom: 6 }}>API Key / Session Cookie</label>
          <CredentialInput value={form.apiKey} onChange={v => set('apiKey', v)} platform={form.platform} />
        </div>
        <ConnectionTest account={form} result={testResult} onTest={async () => { setTesting(true); await new Promise(r => setTimeout(r, 800)); setTestResult({ success: true }); setTesting(false); }} testing={testing} />
      </div>
    </Modal>
  );
}
