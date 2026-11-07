import { useState, useEffect } from 'react';
import dualChromeBridge from '../lib/dualChromeBridge';

export default function DualChromeCloudBridge() {
  const [viewMode, setViewMode] = useState('split'); // 'split' | 'site-1' | 'site-2'
  
  // Site 1 State
  const [site1Email, setSite1Email] = useState('account.alpha@gmail.com');
  const [site1Cloud, setSite1Cloud] = useState('Bolt.new');
  const [site1Task, setSite1Task] = useState('Build authentication gateway & user database schema');
  const [site1Points, setSite1Points] = useState([
    'Configured Supabase JWT session validator',
    'Created user schema with role-based permissions',
    'Exhausted daily free API token limit at 94%'
  ]);
  const [site1Credits, setSite1Credits] = useState(5);

  // Site 2 State
  const [site2Email, setSite2Email] = useState('account.beta@gmail.com');
  const [site2Cloud, setSite2Cloud] = useState('Lovable');
  const [site2ReceivedData, setSite2ReceivedData] = useState([]);
  const [site2Credits, setSite2Credits] = useState(25);

  // Logs
  const [packets, setPackets] = useState([]);
  const [lastHandoff, setLastHandoff] = useState(null);

  useEffect(() => {
    dualChromeBridge.initSite('site-1', site1Email, site1Cloud);

    const unsubscribe = dualChromeBridge.subscribe((packet, isLocal) => {
      setPackets((prev) => [packet, ...prev.slice(0, 19)]);

      if (packet.type === 'CLOUD_HANDOFF') {
        setLastHandoff(packet);
        setSite2ReceivedData((prev) => [
          {
            from: packet.sourceCloud,
            email: packet.sourceSiteId === 'site-1' ? site1Email : 'Cloud A',
            points: packet.mainPoints,
            receivedAt: new Date().toLocaleTimeString(),
            taskContext: packet.taskContext
          },
          ...prev
        ]);
      }
    });

    return () => unsubscribe();
  }, [site1Email, site1Cloud]);

  const handleManualHandoff = () => {
    if (site1Points.length === 0) return;
    
    dualChromeBridge.handoffCloudData({
      sourceSiteId: 'site-1',
      targetSiteId: 'site-2',
      sourceCloud: site1Cloud,
      targetCloud: site2Cloud,
      mainPoints: site1Points,
      taskContext: site1Task,
      metrics: {
        tokensUsed: 1420,
        creditsConsumed: 1
      }
    });

    setSite1Credits((prev) => Math.max(0, prev - 1));
  };

  const handleSimulateExhaustion = () => {
    setSite1Credits(0);
    dualChromeBridge.handoffCloudData({
      sourceSiteId: 'site-1',
      targetSiteId: 'site-2',
      sourceCloud: site1Cloud,
      targetCloud: site2Cloud,
      mainPoints: [
        ...site1Points,
        'CRITICAL: Cloud A exhausted credits - Automated fallback initiated!'
      ],
      taskContext: site1Task + ' (Automated Hand-off)',
      metrics: {
        tokensUsed: 4800,
        creditsConsumed: site1Credits
      }
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-100 shadow-2xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔗</span>
            <h2 className="text-xl font-bold text-white">Dual Chrome Site & Cloud Sync Bridge</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Live P2P Synced
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Connects two Chrome sites with different Gmail accounts to automatically hand off cloud tasks and main points.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-2 bg-slate-800/80 p-1 rounded-lg border border-slate-700">
          <button
            onClick={() => setViewMode('split')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              viewMode === 'split' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Dual View (Side-by-Side)
          </button>
          <button
            onClick={() => setViewMode('site-1')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              viewMode === 'site-1' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Chrome Site 1 Only
          </button>
          <button
            onClick={() => setViewMode('site-2')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              viewMode === 'site-2' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Chrome Site 2 Only
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className={`grid gap-6 mt-6 ${viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        
        {/* SITE 1: Gmail Account 1 & Cloud A */}
        {(viewMode === 'split' || viewMode === 'site-1') && (
          <div className="bg-slate-800/40 border border-indigo-500/30 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-700/60 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse"></span>
                  <span className="font-semibold text-white">Chrome Site 1 (Sender)</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                  {site1Cloud}
                </span>
              </div>

              {/* Profile Config */}
              <div className="space-y-3 mb-4">
                <div>
                  <label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Logged-in Gmail</label>
                  <input
                    type="text"
                    value={site1Email}
                    onChange={(e) => setSite1Email(e.target.value)}
                    className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Active Cloud Platform</label>
                  <select
                    value={site1Cloud}
                    onChange={(e) => setSite1Cloud(e.target.value)}
                    className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200"
                  >
                    <option value="Bolt.new">Bolt.new (WebContainers)</option>
                    <option value="Claude.ai">Claude.ai (Artifacts)</option>
                    <option value="ChatGPT">ChatGPT Plus</option>
                    <option value="Replit">Replit Cloud</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Current Cloud Task</label>
                  <input
                    type="text"
                    value={site1Task}
                    onChange={(e) => setSite1Task(e.target.value)}
                    className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200"
                  />
                </div>
              </div>

              {/* Main Points to Handoff */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Extracted Main Points</label>
                  <span className="text-xs text-indigo-400 font-mono">Credits: {site1Credits} remaining</span>
                </div>
                <div className="bg-slate-900/80 border border-slate-700/60 rounded-lg p-3 space-y-2 max-h-36 overflow-y-auto">
                  {site1Points.map((pt, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <span className="text-indigo-400 mt-0.5">•</span>
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-700/60">
              <button
                onClick={handleManualHandoff}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-2 px-3 rounded-lg transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-1.5"
              >
                <span>🚀 Send Main Points to Cloud 2</span>
              </button>
              <button
                onClick={handleSimulateExhaustion}
                className="bg-amber-600/80 hover:bg-amber-600 text-white text-xs font-semibold py-2 px-3 rounded-lg transition"
                title="Simulates token/credit exhaustion and triggers automatic failover"
              >
                ⚠️ Auto-Handoff on Exhaustion
              </button>
            </div>
          </div>
        )}

        {/* SITE 2: Gmail Account 2 & Cloud B */}
        {(viewMode === 'split' || viewMode === 'site-2') && (
          <div className="bg-slate-800/40 border border-emerald-500/30 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-700/60 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-semibold text-white">Chrome Site 2 (Receiver / Fallback)</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                  {site2Cloud}
                </span>
              </div>

              {/* Profile Config */}
              <div className="space-y-3 mb-4">
                <div>
                  <label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Logged-in Gmail</label>
                  <input
                    type="text"
                    value={site2Email}
                    onChange={(e) => setSite2Email(e.target.value)}
                    className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Target Cloud Platform</label>
                  <select
                    value={site2Cloud}
                    onChange={(e) => setSite2Cloud(e.target.value)}
                    className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200"
                  >
                    <option value="Lovable">Lovable (Frontend Studio)</option>
                    <option value="v0.dev">v0.dev (Generative UI)</option>
                    <option value="Cursor">Cursor AI Editor</option>
                    <option value="Gemini">Gemini Advanced</option>
                  </select>
                </div>
              </div>

              {/* Received Cloud Handoffs */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs text-slate-400 uppercase font-bold tracking-wider">Synchronized Main Points</label>
                  <span className="text-xs text-emerald-400 font-mono">Credits: {site2Credits} available</span>
                </div>
                
                {site2ReceivedData.length === 0 ? (
                  <div className="bg-slate-900/60 border border-dashed border-slate-700 rounded-lg p-6 text-center text-xs text-slate-500">
                    Waiting for handoff from Chrome Site 1...
                  </div>
                ) : (
                  <div className="bg-slate-900/90 border border-emerald-500/40 rounded-lg p-3 space-y-3 max-h-48 overflow-y-auto">
                    {site2ReceivedData.map((item, idx) => (
                      <div key={idx} className="border-b border-slate-800 last:border-b-0 pb-2">
                        <div className="flex items-center justify-between text-xs text-emerald-300 font-semibold mb-1">
                          <span>From: {item.from} ({item.email})</span>
                          <span className="text-slate-500 text-[10px]">{item.receivedAt}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mb-1 italic">Context: {item.taskContext}</div>
                        <ul className="space-y-1">
                          {item.points.map((pt, pIdx) => (
                            <li key={pIdx} className="text-xs text-slate-200 flex items-start gap-1.5">
                              <span className="text-emerald-400">✓</span>
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Status indicator */}
            <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs">
              <span className="text-slate-400">Automatic Resume Status:</span>
              <span className="text-emerald-400 font-medium">Ready to continue task</span>
            </div>
          </div>
        )}
      </div>

      {/* Real-time packet telemetry */}
      <div className="mt-6 pt-4 border-t border-slate-800">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Live Cross-Site Event Telemetry</h4>
        <div className="bg-slate-950 rounded-lg p-2.5 font-mono text-[11px] text-slate-400 max-h-24 overflow-y-auto space-y-1">
          {packets.length === 0 ? (
            <div className="text-slate-600">No events exchanged yet. Broadcast channel ready.</div>
          ) : (
            packets.map((pkt) => (
              <div key={pkt.id} className="flex items-center gap-2">
                <span className="text-indigo-400">[{new Date(pkt.sentAt).toLocaleTimeString()}]</span>
                <span className="text-amber-400">{pkt.type}</span>
                <span className="text-slate-500">ID: {pkt.id}</span>
                {pkt.type === 'CLOUD_HANDOFF' && (
                  <span className="text-emerald-400">
                    Handoff: {pkt.sourceCloud} ➔ {pkt.targetCloud} ({pkt.mainPoints?.length} points transferred)
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
