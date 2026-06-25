"use client";
import { AlertCircle, Clock, Filter, Plus, Search, Tag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Ticket {
  id: string;
  number: number;
  subject: string;
  status: string;
  priority: string;
  channel: string;
  assigneeName: string | null;
  requesterName: string;
  createdAt: string;
  updatedAt: string;
}

const mockTickets: Ticket[] = [
  { id: "t1", number: 1001, subject: "Cannot connect to remote desktop", status: "open", priority: "high", channel: "live_chat", assigneeName: "Sarah Johnson", requesterName: "John Smith", createdAt: "2024-01-15T10:30:00Z", updatedAt: "2024-01-15T11:00:00Z" },
  { id: "t2", number: 1002, subject: "Billing discrepancy on invoice", status: "pending", priority: "medium", channel: "email", assigneeName: "Emily Davis", requesterName: "Jane Doe", createdAt: "2024-01-15T09:00:00Z", updatedAt: "2024-01-15T10:30:00Z" },
  { id: "t3", number: 1003, subject: "File transfer failing with large files", status: "in_progress", priority: "high", channel: "phone", assigneeName: "Mike Chen", requesterName: "Bob Wilson", createdAt: "2024-01-14T14:00:00Z", updatedAt: "2024-01-15T08:00:00Z" },
  { id: "t4", number: 1004, subject: "Feature request: multi-monitor support", status: "open", priority: "low", channel: "web_form", assigneeName: null, requesterName: "Alice Brown", createdAt: "2024-01-14T12:00:00Z", updatedAt: "2024-01-14T12:00:00Z" },
  { id: "t5", number: 1005, subject: "Performance issues after update", status: "in_progress", priority: "critical", channel: "whatsapp", assigneeName: "Alex Kumar", requesterName: "Charlie Davis", createdAt: "2024-01-15T07:00:00Z", updatedAt: "2024-01-15T11:30:00Z" },
  { id: "t6", number: 1006, subject: "Two-factor authentication not working", status: "resolved", priority: "high", channel: "telegram", assigneeName: "Sarah Johnson", requesterName: "Diana Prince", createdAt: "2024-01-13T16:00:00Z", updatedAt: "2024-01-14T10:00:00Z" },
  { id: "t7", number: 1007, subject: "Need help with API integration", status: "open", priority: "medium", channel: "email", assigneeName: null, requesterName: "Eve Thompson", createdAt: "2024-01-15T11:00:00Z", updatedAt: "2024-01-15T11:00:00Z" },
];

const priorityColors: Record<string, string> = {
  critical: "bg-red-100 text-red-700",
  high: "bg-orange-100 text-orange-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-slate-100 text-slate-700",
};

const statusColors: Record<string, string> = {
  open: "bg-blue-100 text-blue-700",
  pending: "bg-yellow-100 text-yellow-700",
  in_progress: "bg-purple-100 text-purple-700",
  waiting_on_customer: "bg-orange-100 text-orange-700",
  resolved: "bg-green-100 text-green-700",
  closed: "bg-slate-100 text-slate-700",
};

export default function TicketListPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const filtered = mockTickets.filter((t) => {
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
    if (search && !t.subject.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Tickets</h1>
            <p className="text-slate-500 mt-1">{mockTickets.length} total tickets</p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" /> New Ticket
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priority</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Ticket Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">#</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Subject</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Priority</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Channel</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Assignee</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-50 cursor-pointer transition-colors">
                  <td className="px-4 py-3 text-sm font-mono text-slate-500">#{ticket.number}</td>
                  <td className="px-4 py-3">
                    <Link href={`/dashboard/tickets/${ticket.id}`} className="text-sm font-medium text-slate-900 hover:text-blue-600">
                      {ticket.subject}
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5">{ticket.requesterName}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[ticket.status] || "bg-slate-100 text-slate-700"}`}>
                      {ticket.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[ticket.priority] || "bg-slate-100 text-slate-700"}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{ticket.channel.replace(/_/g, " ")}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{ticket.assigneeName || <span className="text-slate-400 italic">Unassigned</span>}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{new Date(ticket.updatedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
