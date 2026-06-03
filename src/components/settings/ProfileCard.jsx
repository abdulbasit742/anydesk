import React from 'react';

export function ProfileCard({ profile = {}, onChange }) {
  const [editing, setEditing] = React.useState(false);
  const [name, setName] = React.useState(profile.displayName || '');
  const [email, setEmail] = React.useState(profile.email || '');

  const initials = (profile.displayName || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const handleSave = () => {
    onChange?.({ ...profile, displayName: name, email });
    setEditing(false);
  };

  return (
    <div style={{ fontFamily: 'monospace' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%', background: '#00FFAA22',
          border: '2px solid #00FFAA44', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#00FFAA', fontSize: 20, fontWeight: 600,
        }}>{initials}</div>
        <div>
          <div style={{ color: '#eee', fontSize: 15, fontWeight: 600 }}>{profile.displayName || 'Anonymous User'}</div>
          <div style={{ color: '#555', fontSize: 12 }}>{profile.email || 'No email set'}</div>
        </div>
        <button onClick={() => setEditing(!editing)} style={{
          marginLeft: 'auto', background: 'none', border: '1px solid #1e2340', borderRadius: 6,
          color: '#888', fontSize: 11, padding: '5px 12px', cursor: 'pointer',
        }}>{editing ? 'Cancel' : 'Edit'}</button>
      </div>

      {editing && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, background: '#080c14', border: '1px solid #1e2340', borderRadius: 8, padding: 16 }}>
          <div>
            <label style={{ color: '#888', fontSize: 11, display: 'block', marginBottom: 5 }}>DISPLAY NAME</label>
            <input value={name} onChange={e => setName(e.target.value)}
              style={{ width: '100%', background: '#0d1117', border: '1px solid #1e2340', borderRadius: 6, color: '#ccc', fontSize: 13, padding: '7px 10px', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ color: '#888', fontSize: 11, display: 'block', marginBottom: 5 }}>EMAIL</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email"
              style={{ width: '100%', background: '#0d1117', border: '1px solid #1e2340', borderRadius: 6, color: '#ccc', fontSize: 13, padding: '7px 10px', boxSizing: 'border-box' }} />
          </div>
          <button onClick={handleSave} style={{ background: '#00FFAA', border: 'none', borderRadius: 6, color: '#000', fontSize: 12, padding: '8px 0', cursor: 'pointer', fontWeight: 600 }}>Save Profile</button>
        </div>
      )}

      <div style={{ marginTop: 16, color: '#888', fontSize: 11 }}>PLAN</div>
      <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ background: '#00FFAA22', border: '1px solid #00FFAA44', borderRadius: 4, color: '#00FFAA', fontSize: 11, padding: '2px 10px' }}>PRO</span>
        <span style={{ color: '#555', fontSize: 12 }}>Unlimited platforms · Priority support</span>
      </div>
    </div>
  );
}
