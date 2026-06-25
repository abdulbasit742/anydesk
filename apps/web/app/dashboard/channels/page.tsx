"use client";
import { Check, Mail, MessageCircle, MessageSquare, Phone, Plus, Settings, Smartphone, Twitter } from "lucide-react";
import { useState } from "react";

interface Channel {
  id: string;
  name: string;
  type: string;
  icon: any;
  status: "active" | "inactive" | "pending";
  messagesTotal: number;
  lastActivity: string;
  config: Record<string, string>;
}

const mockChannels: Channel[] = [
  { id: "ch1", name: "Live Chat", type: "live_chat", icon: MessageSquare, status: "active", messagesTotal: 12500, lastActivity: "2 min ago", config: { widget: "Enabled", autoAssign: "Yes" } },
  { id: "ch2", name: "Email", type: "email", icon: Mail, status: "active", messagesTotal: 8900, lastActivity: "5 min ago", config: { address: "support@remotedesk.io", autoReply: "Yes" } },
  { id: "ch3", name: "Phone / VoIP", type: "phone", icon: Phone, status: "active", messagesTotal: 4500, lastActivity: "10 min ago", config: { number: "+1-800-REMOTE", ivr: "Enabled" } },
  { id: "ch4", name: "WhatsApp", type: "whatsapp", icon: Smartphone, status: "active", messagesTotal: 3800, lastActivity: "3 min ago", config: { number: "+1-555-0123", businessAPI: "Connected" } },
  { id: "ch5", name: "Telegram", type: "telegram", icon: MessageCircle, status: "active", messagesTotal: 1500, lastActivity: "15 min ago", config: { botName: "@RemoteDeskBot", webhook: "Active" } },
  { id: "ch6", name: "Twitter/X", type: "twitter", icon: Twitter, status: "inactive", messagesTotal: 890, lastActivity: "1 hour ago", config: { handle: "@RemoteDeskSupport", dm: "Enabled" } },
  { id: "ch7", name: "Facebook Messenger", type: "facebook", icon: MessageCircle, status: "pending", messagesTotal: 650, lastActivity: "30 min ago", config: { page: "RemoteDesk", status: "Pending Approval" } },
  { id: "ch8", name: "SMS", type: "sms", icon: Smartphone, status: "active", messagesTotal: 2100, lastActivity: "8 min ago", config: { provider: "Twilio", number: "+1-555-0456" } },
];

export default function ChannelsPage() {
  const [channels] = useState(mockChannels);

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Channel Configuration</h1>
            <p className="text-slate-500 mt-1">Manage your omnichannel communication channels</p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" /> Add Channel
          </button>
        </div>

        {/* Channel Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Active Channels</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{channels.filter((c) => c.status === "active").length}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Total Messages</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{channels.reduce((s, c) => s + c.messagesTotal, 0).toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Avg Response Time</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">2.3 min</p>
          </div>
        </div>

        {/* Channel Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {channels.map((channel) => (
            <div key={channel.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg ${channel.status === "active" ? "bg-blue-50" : "bg-slate-50"}`}>
                    <channel.icon className={`w-5 h-5 ${channel.status === "active" ? "text-blue-600" : "text-slate-400"}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{channel.name}</h3>
                    <p className="text-xs text-slate-500">{channel.lastActivity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${channel.status === "active" ? "bg-green-100 text-green-700" : channel.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-slate-100 text-slate-500"}`}>
                    {channel.status}
                  </span>
                  <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">{channel.messagesTotal.toLocaleString()} messages</span>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(channel.config).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-xs text-slate-400 capitalize">{key.replace(/([A-Z])/g, " $1")}</p>
                      <p className="text-xs text-slate-700 font-medium">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
