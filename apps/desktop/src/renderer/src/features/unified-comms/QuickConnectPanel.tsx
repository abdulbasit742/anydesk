/**
 * Quick Connect Panel for Desktop Client
 * Allows agents to quickly start remote support sessions from tickets/conversations
 */

import { useState } from 'react';

interface QuickSession {
  id: string;
  customerName: string;
  ticketNumber: number | null;
  sessionCode: string;
  status: 'pending' | 'active' | 'ended';
  startedAt: string | null;
}

export function QuickConnectPanel() {
  const [sessionCode, setSessionCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [recentSessions] = useState<QuickSession[]>([
    { id: 's1', customerName: 'John Smith', ticketNumber: 1001, sessionCode: 'ABC123', status: 'active', startedAt: '10:30 AM' },
    { id: 's2', customerName: 'Jane Doe', ticketNumber: 1002, sessionCode: 'DEF456', status: 'ended', startedAt: '9:15 AM' },
    { id: 's3', customerName: 'Bob Wilson', ticketNumber: null, sessionCode: 'GHI789', status: 'ended', startedAt: 'Yesterday' },
  ]);

  const createSession = () => {
    setIsCreating(true);
    // Simulate session creation
    setTimeout(() => {
      setIsCreating(false);
      setSessionCode('XYZ' + Math.random().toString(36).substring(2, 5).toUpperCase());
    }, 1000);
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 w-80">
      <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
        <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        Quick Remote Support
      </h3>

      {/* Create New Session */}
      <div className="mb-4">
        <button
          onClick={createSession}
          disabled={isCreating}
          className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          {isCreating ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          )}
          {isCreating ? 'Creating...' : 'New Support Session'}
        </button>
      </div>

      {/* Generated Code */}
      {sessionCode && (
        <div className="mb-4 p-3 bg-slate-700 rounded-lg">
          <p className="text-xs text-slate-400 mb-1">Share this code with the customer:</p>
          <div className="flex items-center justify-between">
            <code className="text-lg font-mono font-bold text-blue-400">{sessionCode}</code>
            <button
              onClick={() => navigator.clipboard.writeText(sessionCode)}
              className="p-1.5 text-slate-400 hover:text-white rounded"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Waiting for customer to connect...</p>
        </div>
      )}

      {/* Or Join Existing */}
      <div className="mb-4">
        <p className="text-xs text-slate-400 mb-2">Or join by RemoteDesk ID:</p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter ID or code"
            className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button className="px-3 py-2 bg-slate-600 text-white rounded-lg text-xs hover:bg-slate-500">
            Connect
          </button>
        </div>
      </div>

      {/* Recent Sessions */}
      <div>
        <h4 className="text-xs font-medium text-slate-400 uppercase mb-2">Recent Sessions</h4>
        <div className="space-y-2">
          {recentSessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-2 bg-slate-700/50 rounded-lg">
              <div>
                <p className="text-xs text-white font-medium">{session.customerName}</p>
                <p className="text-[10px] text-slate-400">
                  {session.ticketNumber ? `#${session.ticketNumber} • ` : ''}{session.sessionCode} • {session.startedAt}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${session.status === 'active' ? 'bg-green-500' : 'bg-slate-500'}`} />
                {session.status === 'active' && (
                  <button className="px-2 py-1 bg-green-600 text-white rounded text-[10px]">Rejoin</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
