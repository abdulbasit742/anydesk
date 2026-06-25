/**
 * Agent Status Tray Component
 * Shows agent status, active conversations, and quick actions in the desktop client
 */

import { useEffect, useState } from 'react';
import { notificationService, type UCNotification } from './notificationService';

type AgentStatus = 'available' | 'busy' | 'break' | 'offline';

interface ActiveConversation {
  id: string;
  customerName: string;
  channel: string;
  lastMessage: string;
  unread: number;
  waitingTime: number;
}

const statusConfig: Record<AgentStatus, { color: string; label: string }> = {
  available: { color: '#22c55e', label: 'Available' },
  busy: { color: '#ef4444', label: 'Busy' },
  break: { color: '#eab308', label: 'On Break' },
  offline: { color: '#94a3b8', label: 'Offline' },
};

export function AgentStatusTray() {
  const [status, setStatus] = useState<AgentStatus>('available');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<UCNotification[]>([]);
  const [conversations] = useState<ActiveConversation[]>([
    { id: 'c1', customerName: 'John Smith', channel: 'Live Chat', lastMessage: 'Can you help me connect?', unread: 2, waitingTime: 45 },
    { id: 'c2', customerName: 'Jane Doe', channel: 'WhatsApp', lastMessage: 'Thanks for the help!', unread: 0, waitingTime: 0 },
    { id: 'c3', customerName: 'Bob Wilson', channel: 'Email', lastMessage: 'When will this be fixed?', unread: 1, waitingTime: 120 },
  ]);

  useEffect(() => {
    const unsub = notificationService.subscribe(setNotifications);
    return unsub;
  }, []);

  const unreadCount = notificationService.getUnreadCount();

  return (
    <div className="fixed top-0 right-0 z-50 flex items-center gap-2 p-2 bg-slate-800 border-b border-slate-700">
      {/* Status Indicator */}
      <div className="relative">
        <button
          onClick={() => { setShowDropdown(!showDropdown); setShowNotifications(false); }}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
        >
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: statusConfig[status].color }} />
          <span className="text-xs text-white font-medium">{statusConfig[status].label}</span>
          <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showDropdown && (
          <div className="absolute top-full right-0 mt-1 w-48 bg-slate-700 rounded-lg shadow-xl border border-slate-600 overflow-hidden">
            {(Object.keys(statusConfig) as AgentStatus[]).map((s) => (
              <button
                key={s}
                onClick={() => { setStatus(s); setShowDropdown(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-xs text-white hover:bg-slate-600 ${status === s ? 'bg-slate-600' : ''}`}
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: statusConfig[s].color }} />
                {statusConfig[s].label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Active Conversations Counter */}
      <div className="flex items-center gap-1 px-2 py-1 bg-slate-700 rounded-lg">
        <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span className="text-xs text-white font-medium">{conversations.filter(c => c.unread > 0).length}</span>
      </div>

      {/* Notifications Bell */}
      <div className="relative">
        <button
          onClick={() => { setShowNotifications(!showNotifications); setShowDropdown(false); }}
          className="relative p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
        >
          <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {showNotifications && (
          <div className="absolute top-full right-0 mt-1 w-80 bg-slate-700 rounded-lg shadow-xl border border-slate-600 max-h-96 overflow-y-auto">
            <div className="p-3 border-b border-slate-600 flex items-center justify-between">
              <span className="text-xs font-medium text-white">Notifications</span>
              <button onClick={() => notificationService.markAllRead()} className="text-[10px] text-blue-400 hover:text-blue-300">
                Mark all read
              </button>
            </div>
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">No notifications</div>
            ) : (
              notifications.slice(0, 10).map((n) => (
                <div key={n.id} className={`p-3 border-b border-slate-600/50 hover:bg-slate-600/50 cursor-pointer ${!n.read ? 'bg-slate-600/30' : ''}`} onClick={() => notificationService.markRead(n.id)}>
                  <div className="flex items-start gap-2">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.priority === 'urgent' ? 'bg-red-500' : n.priority === 'high' ? 'bg-orange-500' : 'bg-blue-500'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate">{n.title}</p>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">{n.body}</p>
                      <p className="text-[10px] text-slate-500 mt-1">{new Date(n.timestamp).toLocaleTimeString()}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Quick Connect Button */}
      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        Quick Connect
      </button>
    </div>
  );
}
