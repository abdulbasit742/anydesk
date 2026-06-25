"use client";
import { Clock, Headphones, MessageSquare, Plus, Search, Star, UserCheck, UserX } from "lucide-react";
import { useState } from "react";

interface Agent {
  id: string;
  name: string;
  email: string;
  role: string;
  team: string;
  status: "available" | "busy" | "break" | "offline";
  activeChats: number;
  resolvedToday: number;
  avgResponseTime: string;
  csat: number;
  skills: string[];
  avatar: string | null;
}

const mockAgents: Agent[] = [
  { id: "1", name: "Sarah Johnson", email: "sarah@remotedesk.io", role: "Senior Agent", team: "Technical Support", status: "available", activeChats: 2, resolvedToday: 8, avgResponseTime: "1.2m", csat: 4.8, skills: ["Remote Desktop", "Networking", "Windows"], avatar: null },
  { id: "2", name: "Mike Chen", email: "mike@remotedesk.io", role: "Agent", team: "Technical Support", status: "busy", activeChats: 4, resolvedToday: 6, avgResponseTime: "1.8m", csat: 4.7, skills: ["Linux", "API", "Security"], avatar: null },
  { id: "3", name: "Emily Davis", email: "emily@remotedesk.io", role: "Agent", team: "Billing", status: "available", activeChats: 1, resolvedToday: 12, avgResponseTime: "0.8m", csat: 4.9, skills: ["Billing", "Subscriptions", "Refunds"], avatar: null },
  { id: "4", name: "Alex Kumar", email: "alex@remotedesk.io", role: "Team Lead", team: "Escalation", status: "busy", activeChats: 3, resolvedToday: 5, avgResponseTime: "2.1m", csat: 4.6, skills: ["Escalation", "VIP", "Enterprise"], avatar: null },
  { id: "5", name: "Lisa Park", email: "lisa@remotedesk.io", role: "Agent", team: "Technical Support", status: "break", activeChats: 0, resolvedToday: 4, avgResponseTime: "1.5m", csat: 4.5, skills: ["macOS", "Mobile", "File Transfer"], avatar: null },
  { id: "6", name: "David Wilson", email: "david@remotedesk.io", role: "Agent", team: "General", status: "offline", activeChats: 0, resolvedToday: 0, avgResponseTime: "2.0m", csat: 4.3, skills: ["General", "Onboarding"], avatar: null },
];

const statusConfig: Record<string, { color: string; label: string }> = {
  available: { color: "bg-green-500", label: "Available" },
  busy: { color: "bg-red-500", label: "Busy" },
  break: { color: "bg-yellow-500", label: "On Break" },
  offline: { color: "bg-slate-300", label: "Offline" },
};

export default function AgentsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = mockAgents.filter((a) => {
    if (statusFilter !== "all" && a.status !== statusFilter) return false;
    if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Agent Management</h1>
            <p className="text-slate-500 mt-1">Manage support agents, teams, and workload</p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" /> Add Agent
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg"><UserCheck className="w-5 h-5 text-green-600" /></div>
            <div><p className="text-2xl font-bold text-slate-900">{mockAgents.filter((a) => a.status === "available").length}</p><p className="text-xs text-slate-500">Available</p></div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg"><Headphones className="w-5 h-5 text-red-600" /></div>
            <div><p className="text-2xl font-bold text-slate-900">{mockAgents.filter((a) => a.status === "busy").length}</p><p className="text-xs text-slate-500">Busy</p></div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg"><MessageSquare className="w-5 h-5 text-blue-600" /></div>
            <div><p className="text-2xl font-bold text-slate-900">{mockAgents.reduce((s, a) => s + a.activeChats, 0)}</p><p className="text-xs text-slate-500">Active Chats</p></div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg"><Star className="w-5 h-5 text-purple-600" /></div>
            <div><p className="text-2xl font-bold text-slate-900">{(mockAgents.reduce((s, a) => s + a.csat, 0) / mockAgents.length).toFixed(1)}</p><p className="text-xs text-slate-500">Avg CSAT</p></div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search agents..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white">
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="busy">Busy</option>
            <option value="break">On Break</option>
            <option value="offline">Offline</option>
          </select>
        </div>

        {/* Agent Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((agent) => (
            <div key={agent.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-600">
                      {agent.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${statusConfig[agent.status].color}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{agent.name}</h3>
                    <p className="text-xs text-slate-500">{agent.role} • {agent.team}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${agent.status === "available" ? "bg-green-100 text-green-700" : agent.status === "busy" ? "bg-red-100 text-red-700" : agent.status === "break" ? "bg-yellow-100 text-yellow-700" : "bg-slate-100 text-slate-500"}`}>
                  {statusConfig[agent.status].label}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="text-center p-2 bg-slate-50 rounded-lg">
                  <p className="text-sm font-bold text-slate-900">{agent.activeChats}</p>
                  <p className="text-xs text-slate-500">Active</p>
                </div>
                <div className="text-center p-2 bg-slate-50 rounded-lg">
                  <p className="text-sm font-bold text-slate-900">{agent.resolvedToday}</p>
                  <p className="text-xs text-slate-500">Resolved</p>
                </div>
                <div className="text-center p-2 bg-slate-50 rounded-lg">
                  <p className="text-sm font-bold text-slate-900">{agent.csat}</p>
                  <p className="text-xs text-slate-500">CSAT</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {agent.skills.map((skill) => (
                  <span key={skill} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
