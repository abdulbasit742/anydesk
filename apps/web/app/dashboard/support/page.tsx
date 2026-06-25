"use client";
import { Activity, Clock, Headphones, MessageSquare, Phone, TrendingUp, Users, Zap } from "lucide-react";
import { useEffect, useState } from "react";

interface RealTimeMetrics {
  activeConversations: number;
  queueSize: number;
  avgWaitTime: number;
  onlineAgents: number;
  busyAgents: number;
}

interface AgentStatusSummary {
  available: number;
  busy: number;
  break: number;
  offline: number;
  agents: { id: string; name: string; status: string; activeChats: number }[];
}

export default function SupportDashboardPage() {
  const [metrics, setMetrics] = useState<RealTimeMetrics | null>(null);
  const [agentStatus, setAgentStatus] = useState<AgentStatusSummary | null>(null);
  const [ticketStats, setTicketStats] = useState<Record<string, number>>({});

  useEffect(() => {
    // Simulated data load
    setMetrics({ activeConversations: 12, queueSize: 5, avgWaitTime: 2.3, onlineAgents: 8, busyAgents: 5 });
    setAgentStatus({
      available: 3, busy: 5, break: 1, offline: 2,
      agents: [
        { id: "1", name: "Sarah Johnson", status: "available", activeChats: 2 },
        { id: "2", name: "Mike Chen", status: "available", activeChats: 1 },
        { id: "3", name: "Emily Davis", status: "busy", activeChats: 4 },
        { id: "4", name: "Alex Kumar", status: "available", activeChats: 0 },
        { id: "5", name: "Lisa Park", status: "break", activeChats: 0 },
      ],
    });
    setTicketStats({ total: 342, open: 45, pending: 23, inProgress: 67, resolved: 180, closed: 27 });
  }, []);

  const statCards = [
    { label: "Active Conversations", value: metrics?.activeConversations || 0, icon: MessageSquare, color: "text-blue-600 bg-blue-50" },
    { label: "Queue Size", value: metrics?.queueSize || 0, icon: Users, color: "text-orange-600 bg-orange-50" },
    { label: "Avg Wait Time", value: `${metrics?.avgWaitTime || 0}m`, icon: Clock, color: "text-purple-600 bg-purple-50" },
    { label: "Online Agents", value: metrics?.onlineAgents || 0, icon: Headphones, color: "text-green-600 bg-green-50" },
  ];

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Support Dashboard</h1>
            <p className="text-slate-500 mt-1">Real-time overview of your support operations</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
              <Activity className="w-3 h-3" /> Live
            </span>
          </div>
        </div>

        {/* Real-time Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ticket Overview */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Ticket Overview</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-2xl font-bold text-red-600">{ticketStats.open || 0}</p>
                <p className="text-sm text-red-700">Open</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">{ticketStats.pending || 0}</p>
                <p className="text-sm text-yellow-700">Pending</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{ticketStats.inProgress || 0}</p>
                <p className="text-sm text-blue-700">In Progress</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{ticketStats.resolved || 0}</p>
                <p className="text-sm text-green-700">Resolved</p>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <p className="text-2xl font-bold text-slate-600">{ticketStats.closed || 0}</p>
                <p className="text-sm text-slate-700">Closed</p>
              </div>
              <div className="text-center p-4 bg-indigo-50 rounded-lg">
                <p className="text-2xl font-bold text-indigo-600">{ticketStats.total || 0}</p>
                <p className="text-sm text-indigo-700">Total</p>
              </div>
            </div>
          </div>

          {/* Agent Status */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Agent Status</h2>
            <div className="space-y-3">
              {agentStatus?.agents.map((agent) => (
                <div key={agent.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${agent.status === "available" ? "bg-green-500" : agent.status === "busy" ? "bg-red-500" : "bg-yellow-500"}`} />
                    <span className="text-sm font-medium text-slate-700">{agent.name}</span>
                  </div>
                  <span className="text-xs text-slate-500">{agent.activeChats} chats</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-4 gap-2 text-center">
              <div><p className="text-lg font-bold text-green-600">{agentStatus?.available}</p><p className="text-xs text-slate-500">Available</p></div>
              <div><p className="text-lg font-bold text-red-600">{agentStatus?.busy}</p><p className="text-xs text-slate-500">Busy</p></div>
              <div><p className="text-lg font-bold text-yellow-600">{agentStatus?.break}</p><p className="text-xs text-slate-500">Break</p></div>
              <div><p className="text-lg font-bold text-slate-400">{agentStatus?.offline}</p><p className="text-xs text-slate-500">Offline</p></div>
            </div>
          </div>
        </div>

        {/* Channel Activity */}
        <div className="mt-6 bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Channel Activity</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {[
              { name: "Live Chat", count: 125, icon: MessageSquare },
              { name: "Email", count: 89, icon: MessageSquare },
              { name: "Phone", count: 45, icon: Phone },
              { name: "WhatsApp", count: 38, icon: MessageSquare },
              { name: "Telegram", count: 15, icon: MessageSquare },
              { name: "Twitter", count: 12, icon: MessageSquare },
              { name: "Facebook", count: 10, icon: MessageSquare },
              { name: "SMS", count: 8, icon: MessageSquare },
            ].map((ch) => (
              <div key={ch.name} className="text-center p-3 bg-slate-50 rounded-lg">
                <p className="text-lg font-bold text-slate-700">{ch.count}</p>
                <p className="text-xs text-slate-500 truncate">{ch.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
