"use client";
import { ArrowLeft, Clock, MessageSquare, Monitor, Paperclip, Send, Tag, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function TicketDetailPage() {
  const [replyText, setReplyText] = useState("");
  const [isInternal, setIsInternal] = useState(false);

  const ticket = {
    id: "t1", number: 1001, subject: "Cannot connect to remote desktop",
    description: "I've been trying to connect to my work computer from home but keep getting a 'Connection timed out' error. I've checked my internet and it's working fine. This started happening after the latest update.",
    status: "in_progress", priority: "high", channel: "live_chat",
    assigneeName: "Sarah Johnson", requesterName: "John Smith", requesterEmail: "john@acme.com",
    tags: ["connection", "timeout", "update-related"],
    createdAt: "2024-01-15T10:30:00Z", updatedAt: "2024-01-15T11:00:00Z",
    slaBreachAt: "2024-01-15T14:30:00Z",
  };

  const replies = [
    { id: "r1", author: "John Smith", role: "customer", body: "I've been trying to connect to my work computer from home but keep getting a 'Connection timed out' error.", time: "10:30 AM", isInternal: false },
    { id: "r2", author: "Sarah Johnson", role: "agent", body: "Hi John! I'm sorry to hear you're having trouble connecting. Let me look into this for you. Can you tell me what version of RemoteDesk you're running?", time: "10:35 AM", isInternal: false },
    { id: "r3", author: "John Smith", role: "customer", body: "I'm on version 4.2.1, updated yesterday.", time: "10:38 AM", isInternal: false },
    { id: "r4", author: "Sarah Johnson", role: "agent", body: "Checking if there's a known issue with 4.2.1 and connection timeouts.", time: "10:40 AM", isInternal: true },
    { id: "r5", author: "Sarah Johnson", role: "agent", body: "Thanks John. There's a known issue with 4.2.1 affecting some users. I'd like to start a remote session to help fix this. Would you be okay with that?", time: "10:42 AM", isInternal: false },
  ];

  const customerInfo = {
    name: "John Smith", email: "john@acme.com", company: "Acme Corp",
    devices: [{ name: "Work Desktop", os: "Windows 11", status: "online" }, { name: "Home Laptop", os: "macOS 14", status: "online" }],
    totalTickets: 12, avgSatisfaction: 4.5, lastSession: "2024-01-14",
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard/tickets" className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <span className="text-sm font-mono text-slate-500">#{ticket.number}</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">{ticket.status.replace(/_/g, " ")}</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">{ticket.priority}</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1">{ticket.subject}</h1>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Monitor className="w-4 h-4" /> Start Remote Session
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversation */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Conversation</h2>
              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {replies.map((reply) => (
                  <div key={reply.id} className={`flex gap-3 ${reply.isInternal ? "bg-yellow-50 -mx-2 px-2 py-2 rounded-lg border border-yellow-200" : ""}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${reply.role === "agent" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-700"}`}>
                      {reply.author.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-900">{reply.author}</span>
                        <span className="text-xs text-slate-400">{reply.time}</span>
                        {reply.isInternal && <span className="text-xs px-1.5 py-0.5 bg-yellow-200 text-yellow-800 rounded">Internal Note</span>}
                      </div>
                      <p className="text-sm text-slate-700 mt-1">{reply.body}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Box */}
              <div className="mt-6 border-t border-slate-200 pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <button
                    onClick={() => setIsInternal(false)}
                    className={`px-3 py-1 text-xs rounded-full ${!isInternal ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}
                  >
                    Reply
                  </button>
                  <button
                    onClick={() => setIsInternal(true)}
                    className={`px-3 py-1 text-xs rounded-full ${isInternal ? "bg-yellow-100 text-yellow-700" : "bg-slate-100 text-slate-600"}`}
                  >
                    Internal Note
                  </button>
                </div>
                <div className="flex gap-2">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={isInternal ? "Add internal note..." : "Type your reply..."}
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <button className="p-2 text-slate-400 hover:text-slate-600">
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center gap-2">
                    <Send className="w-4 h-4" /> {isInternal ? "Add Note" : "Send Reply"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Customer Info */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Customer 360</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-700">{customerInfo.name}</span>
                </div>
                <p className="text-xs text-slate-500 ml-6">{customerInfo.email}</p>
                <p className="text-xs text-slate-500 ml-6">{customerInfo.company}</p>
                <div className="pt-2 border-t border-slate-100 mt-2">
                  <p className="text-xs text-slate-500">Devices:</p>
                  {customerInfo.devices.map((d) => (
                    <div key={d.name} className="flex items-center gap-2 mt-1">
                      <div className={`w-2 h-2 rounded-full ${d.status === "online" ? "bg-green-500" : "bg-slate-300"}`} />
                      <span className="text-xs text-slate-600">{d.name} ({d.os})</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-slate-100 mt-2 grid grid-cols-2 gap-2">
                  <div><p className="text-xs text-slate-500">Tickets</p><p className="text-sm font-medium">{customerInfo.totalTickets}</p></div>
                  <div><p className="text-xs text-slate-500">CSAT</p><p className="text-sm font-medium">{customerInfo.avgSatisfaction}/5</p></div>
                </div>
              </div>
            </div>

            {/* Ticket Details */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Details</h3>
              <div className="space-y-3">
                <div><p className="text-xs text-slate-500">Assignee</p><p className="text-sm text-slate-700">{ticket.assigneeName}</p></div>
                <div><p className="text-xs text-slate-500">Channel</p><p className="text-sm text-slate-700">{ticket.channel.replace(/_/g, " ")}</p></div>
                <div><p className="text-xs text-slate-500">Created</p><p className="text-sm text-slate-700">{new Date(ticket.createdAt).toLocaleString()}</p></div>
                <div>
                  <p className="text-xs text-slate-500">Tags</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {ticket.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">{tag}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500">SLA Breach</p>
                  <p className="text-sm text-orange-600 flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(ticket.slaBreachAt).toLocaleTimeString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
