"use client";
import { Hash, Lock, MessageSquare, Plus, Search, Send, Users } from "lucide-react";
import { useState } from "react";

interface Channel {
  id: string;
  name: string;
  type: "public" | "private" | "direct";
  unread: number;
  lastMessage: string | null;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  time: string;
  reactions: Record<string, number>;
}

const mockChannels: Channel[] = [
  { id: "ch-general", name: "general", type: "public", unread: 3, lastMessage: "Hey team, quick update..." },
  { id: "ch-support", name: "support-team", type: "public", unread: 0, lastMessage: "Ticket #1005 resolved" },
  { id: "ch-escalations", name: "escalations", type: "private", unread: 1, lastMessage: "Need help with VIP client" },
  { id: "ch-announcements", name: "announcements", type: "public", unread: 0, lastMessage: "New feature release!" },
  { id: "ch-random", name: "random", type: "public", unread: 5, lastMessage: "Anyone up for lunch?" },
];

const mockMessages: Message[] = [
  { id: "m1", sender: "Sarah Johnson", content: "Good morning team! Quick update on the VIP escalation from yesterday - it's been resolved.", time: "9:00 AM", reactions: { "👍": 3, "🎉": 2 } },
  { id: "m2", sender: "Mike Chen", content: "Great news! Also, I've updated the KB article on connection timeouts. Can someone review it?", time: "9:05 AM", reactions: { "👀": 1 } },
  { id: "m3", sender: "Emily Davis", content: "@mike I'll take a look at it after my current chat session.", time: "9:08 AM", reactions: {} },
  { id: "m4", sender: "Alex Kumar", content: "Heads up everyone - we have a scheduled maintenance window tonight from 10 PM to 12 AM. Please inform any active customers.", time: "9:15 AM", reactions: { "👍": 4 } },
  { id: "m5", sender: "Lisa Park", content: "Got it! I'll update the status page and send notifications to affected customers.", time: "9:18 AM", reactions: { "❤️": 1 } },
  { id: "m6", sender: "Sarah Johnson", content: "Perfect. Also, reminder that our weekly standup is at 2 PM today. Please have your metrics ready.", time: "9:22 AM", reactions: {} },
];

export default function TeamChatPage() {
  const [selectedChannel, setSelectedChannel] = useState("ch-general");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-slate-800 text-white flex flex-col">
          <div className="p-4 border-b border-slate-700">
            <h2 className="text-sm font-bold">RemoteDesk Team</h2>
            <p className="text-xs text-slate-400 mt-0.5">8 members online</p>
          </div>
          <div className="p-3">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
              <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-7 pr-3 py-1.5 bg-slate-700 border-0 rounded text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-500" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-2">
            <div className="mb-4">
              <div className="flex items-center justify-between px-2 py-1">
                <span className="text-xs font-medium text-slate-400 uppercase">Channels</span>
                <button className="text-slate-400 hover:text-white"><Plus className="w-3 h-3" /></button>
              </div>
              {mockChannels.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => setSelectedChannel(ch.id)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm ${selectedChannel === ch.id ? "bg-slate-700 text-white" : "text-slate-300 hover:bg-slate-700/50"}`}
                >
                  {ch.type === "private" ? <Lock className="w-3 h-3" /> : <Hash className="w-3 h-3" />}
                  <span className="flex-1 text-left truncate">{ch.name}</span>
                  {ch.unread > 0 && <span className="px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">{ch.unread}</span>}
                </button>
              ))}
            </div>
            <div>
              <div className="flex items-center justify-between px-2 py-1">
                <span className="text-xs font-medium text-slate-400 uppercase">Direct Messages</span>
              </div>
              {["Sarah Johnson", "Mike Chen", "Emily Davis"].map((name) => (
                <button key={name} className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm text-slate-300 hover:bg-slate-700/50">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="truncate">{name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Channel Header */}
          <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-slate-400" />
              <h3 className="text-sm font-semibold text-slate-900">general</h3>
              <span className="text-xs text-slate-500">General discussion</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50"><Users className="w-4 h-4" /></button>
              <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50"><Search className="w-4 h-4" /></button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {mockMessages.map((msg) => (
              <div key={msg.id} className="flex gap-3 group">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                  {msg.sender.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">{msg.sender}</span>
                    <span className="text-xs text-slate-400">{msg.time}</span>
                  </div>
                  <p className="text-sm text-slate-700 mt-0.5">{msg.content}</p>
                  {Object.keys(msg.reactions).length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {Object.entries(msg.reactions).map(([emoji, count]) => (
                        <span key={emoji} className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded-full text-xs cursor-pointer hover:bg-slate-200">
                          {emoji} {count}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="bg-white border-t border-slate-200 p-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Message #general"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
