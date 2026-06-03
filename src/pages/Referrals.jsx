import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { sound } from '../lib/soundEngine';

const V = {
  gold: '#f5b731',
  teal: '#22d3ee',
  purple: '#a78bfa',
  surface: '#0e0e16',
  surface2: '#16161e',
  surface3: '#1d1d28',
  border: 'rgba(255,255,255,0.07)',
  muted: '#6e7191',
  red: '#ef4444',
  blue: '#60a5fa',
  green: '#22c55e',
};

const Card = ({ children, style = {}, ...props }) => (
  <div style={{
    background: '#16161e',
    border: `1px solid ${V.border}`,
    borderRadius: 12,
    padding: '20px 22px',
    boxSizing: 'border-box',
    ...style
  }} {...props}>
    {children}
  </div>
);

const SectionTitle = ({ children, color = '#22d3ee' }) => (
  <h2 style={{
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: 13,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color,
    margin: '0 0 16px 0',
  }}>{children}</h2>
);

export default function Referrals() {
  const [currentUser, setCurrentUser] = useState(null);
  const [referredUsers, setReferredUsers] = useState([]);
  const [copiedLink, setCopiedLink] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState([]);

  const loadReferredUsers = (refCode) => {
    supabase.from('users').select().eq('referred_by', refCode).execute().then(({ data }) => {
      if (data) {
        setReferredUsers(data);
      }
    });
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: sessionData }) => {
      if (sessionData?.session?.user) {
        setCurrentUser(sessionData.session.user);
        if (sessionData.session.user.referral_code) {
          loadReferredUsers(sessionData.session.user.referral_code);
        }
      }
    });
  }, []);

  const referralLink = currentUser?.referral_code 
    ? `https://agentflow.sh/?ref=${currentUser.referral_code}`
    : 'https://agentflow.sh/?ref=pending_auth';

  const handleCopyLink = () => {
    sound.play('success');
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSimulateSignup = async () => {
    if (simulating || !currentUser) return;
    setSimulating(true);
    sound.play('dispatch');
    setSimulationLogs(['Initializing simulated referral visit...', 'Setting client cookie ref parameter...']);

    // Delay steps for realistic UI experience
    await new Promise(r => setTimeout(r, 600));
    setSimulationLogs(prev => [...prev, 'Navigating to registration portal with referral payload...']);
    
    await new Promise(r => setTimeout(r, 600));
    const randomSuffix = Math.random().toString(36).slice(2, 6);
    const mockEmail = `ref_user_${randomSuffix}@gmail.com`;
    setSimulationLogs(prev => [...prev, `Submitting credentials verification payload for: ${mockEmail}`]);

    await new Promise(r => setTimeout(r, 800));
    
    // Register the user under the mock supabase db using referred_by option
    try {
      const { data, error } = await supabase.auth.signUp({
        email: mockEmail,
        password: 'mockReferralPassword123!',
        options: {
          data: {
            plan: Math.random() > 0.4 ? 'pro' : 'starter',
            referred_by: currentUser.referral_code
          }
        }
      });

      if (error) throw error;

      setSimulationLogs(prev => [...prev, `✅ Simulated user successfully signed up! ID: ${data?.user?.id}`]);
      sound.play('success');
      
      // Reload referrals
      loadReferredUsers(currentUser.referral_code);
    } catch (err) {
      console.error(err);
      setSimulationLogs(prev => [...prev, `❌ Error during registration simulation: ${err.message}`]);
      sound.play('hover');
    } finally {
      setSimulating(false);
    }
  };

  // Mask email helper
  const maskEmail = (email) => {
    if (!email) return 'hidden@user.com';
    const [name, domain] = email.split('@');
    if (name.length <= 2) return `${name}***@${domain}`;
    return `${name.slice(0, 2)}***${name.slice(-1)}@${domain}`;
  };

  // Calculate free months earned
  const activeReferralsCount = referredUsers.filter(u => u.plan && u.plan !== 'trial').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ─── Hero Header ─── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(167,139,250,0.06) 0%, rgba(34,211,238,0.03) 100%)',
        border: '1px solid rgba(167,139,250,0.15)', borderRadius: 16, padding: '24px 32px'
      }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, margin: 0 }}>
          SaaS Referral System & Rewards
        </h1>
        <p style={{ margin: '4px 0 0', color: V.muted, fontSize: 13 }}>
          Invite your developer network to AgentFlow. For every user that registers and upgrades to a paid subscription, you receive <strong>one free month</strong> of Pro tier credentials.
        </p>
      </div>

      {/* ─── KPI Metrics ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Total Referrals', value: `${referredUsers.length} users`, sub: 'Signed up via link', color: V.teal },
          { label: 'Upgraded Referrals', value: `${activeReferralsCount} converted`, sub: 'Active billing loops', color: V.purple },
          { label: 'Free Months Earned', value: `${activeReferralsCount} months`, sub: 'Applied directly to billing', color: V.gold },
          { label: 'Total Value Earned', value: `$${activeReferralsCount * 49}`, sub: 'Based on Pro tier value', color: V.green }
        ].map(kpi => (
          <Card key={kpi.label} style={{ borderTop: `2.5px solid ${kpi.color}` }}>
            <span style={{ fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', color: V.muted, letterSpacing: '0.04em' }}>{kpi.label}</span>
            <div style={{ fontSize: 22, fontWeight: 800, color: kpi.color, marginTop: 4 }}>{kpi.value}</div>
            <div style={{ fontSize: 9.5, color: V.muted, marginTop: 4 }}>{kpi.sub}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* ─── Share Your Referral Link ─── */}
          <Card>
            <SectionTitle color="var(--teal)">Your Shareable Referral Link</SectionTitle>
            <p style={{ fontSize: 12.5, color: V.muted, margin: '0 0 16px', lineHeight: 1.45 }}>
              Share this unique link on social media, blogs, or emails. Users clicking it will auto-associate with your profile ID during registration.
            </p>

            <div style={{ display: 'flex', gap: 12 }}>
              <input
                type="text"
                readOnly
                value={referralLink}
                style={{
                  flex: 1, padding: '10px 14px', fontSize: 13, background: V.surface3,
                  color: V.teal, border: `1px solid ${V.border}`, borderRadius: 8,
                  fontFamily: 'DM Mono, monospace', outline: 'none'
                }}
              />
              <button
                onClick={handleCopyLink}
                style={{
                  padding: '0 20px', borderRadius: 8, border: 'none',
                  background: copiedLink ? V.green : V.teal, color: '#0e0e16',
                  fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: "'Syne', sans-serif",
                  transition: 'background 0.2s', minWidth: 110
                }}
              >
                {copiedLink ? "✓ Copied!" : "Copy Link"}
              </button>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 14, fontSize: 11, color: V.muted }}>
              <span>🔑 Referral Code: <strong style={{ color: V.gold, fontFamily: 'DM Mono' }}>{currentUser?.referral_code || 'Loading...'}</strong></span>
            </div>
          </Card>

          {/* ─── Referrals Log Table ─── */}
          <Card style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <SectionTitle color="var(--purple)">Referral Registrations Log</SectionTitle>
            {referredUsers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px 0', color: V.muted, fontSize: 13 }}>
                <span style={{ fontSize: 32, display: 'block', marginBottom: 10 }}>📡</span>
                No referral signups detected yet. Send your referral link to get started!
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 12.5 }}>
                  <thead>
                    <tr style={{ background: '#0a0a0f', borderBottom: `1px solid ${V.border}` }}>
                      <th style={{ padding: '10px 14px', color: V.muted }}>REGISTERED USER</th>
                      <th style={{ padding: '10px 14px', color: V.muted }}>SIGNUP DATE</th>
                      <th style={{ padding: '10px 14px', color: V.muted }}>SUBSCRIPTION PLAN</th>
                      <th style={{ padding: '10px 14px', color: V.muted }}>REWARD STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referredUsers.map((refUser, i) => {
                      const isPaid = refUser.plan && refUser.plan !== 'trial';
                      return (
                        <tr key={i} style={{ borderBottom: `1px solid ${V.border}` }}>
                          <td style={{ padding: '10px 14px', fontWeight: 600 }}>{maskEmail(refUser.email)}</td>
                          <td style={{ padding: '10px 14px' }}>
                            {refUser.created_at ? new Date(refUser.created_at).toLocaleDateString() : 'N/A'}
                          </td>
                          <td style={{ padding: '10px 14px' }}>
                            <span style={{
                              fontSize: 10, padding: '2px 8px', borderRadius: 4, fontWeight: 700,
                              background: isPaid ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.05)',
                              color: isPaid ? V.green : V.muted
                            }}>
                              {refUser.plan ? refUser.plan.toUpperCase() : 'TRIAL'}
                            </span>
                          </td>
                          <td style={{ padding: '10px 14px' }}>
                            <span style={{
                              fontSize: 11, fontWeight: 700,
                              color: isPaid ? V.gold : V.muted
                            }}>
                              {isPaid ? '🎁 +1 Free Month Earned' : '⏳ Waiting for Upgrade'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* ─── Simulation Panel ─── */}
          <Card>
            <SectionTitle color="var(--gold)">Referral Simulator Swarm</SectionTitle>
            <p style={{ fontSize: 12.5, color: V.muted, margin: '0 0 16px', lineHeight: 1.45 }}>
              Use this admin simulator tool to test the onboarding logic. Clicking below registers a mock referral user session synced to your credentials.
            </p>

            <button
              onClick={handleSimulateSignup}
              disabled={simulating || !currentUser}
              style={{
                width: '100%', padding: '10px 0', border: 'none', background: V.gold,
                color: '#0e0e16', fontWeight: 700, borderRadius: 6, fontSize: 12.5,
                cursor: (simulating || !currentUser) ? 'not-allowed' : 'pointer',
                fontFamily: "'Syne', sans-serif"
              }}
            >
              {simulating ? 'Simulating referral registration...' : '🚀 Simulate Referred Signup'}
            </button>

            {simulationLogs.length > 0 && (
              <div style={{
                background: '#040407', border: `1px solid ${V.border}`, borderRadius: 8,
                padding: '10px 12px', height: 120, overflowY: 'auto', marginTop: 12,
                fontFamily: 'DM Mono, monospace', fontSize: 11, color: V.teal,
                display: 'flex', flexDirection: 'column', gap: 4
              }}>
                {simulationLogs.map((log, idx) => (
                  <div key={idx}>{log}</div>
                ))}
              </div>
            )}
          </Card>

          {/* ─── Milestones Card ─── */}
          <Card>
            <SectionTitle color="var(--purple)">Milestone Bonus Packs</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { title: 'Bronze Referral Hook', desc: 'Reaching 3 paid signups unlocks customized white-label report builders.' },
                { title: 'Silver Swarm Booster', desc: 'Reaching 10 paid signups increases concurrent scheduler run size to 50 active instances.' },
                { title: 'Gold Enterprise Ring', desc: 'Reaching 25 paid signups updates billing to lifetime Agency Tier access with 0 charge.' }
              ].map((m, i) => (
                <div key={i} style={{ borderLeft: `2.5px solid ${V.purple}`, paddingLeft: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{m.title}</div>
                  <div style={{ fontSize: 10.5, color: V.muted, marginTop: 2, lineHeight: 1.45 }}>{m.desc}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
