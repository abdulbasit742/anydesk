"use client";
import { BarChart3, Clock, MessageSquare, Star, TrendingDown, TrendingUp, Users } from "lucide-react";
import { useState } from "react";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d");

  const metrics = {
    totalTickets: 342,
    avgResponseTime: "2.3 min",
    avgResolutionTime: "4.2 hrs",
    csat: 4.6,
    firstContactResolution: "78%",
    ticketVolumeTrend: "+12%",
    responseTimeTrend: "-8%",
    csatTrend: "+0.3",
  };

  const channelBreakdown = [
    { channel: "Live Chat", tickets: 125, percentage: 36, avgResponse: "45s" },
    { channel: "Email", tickets: 89, percentage: 26, avgResponse: "12m" },
    { channel: "Phone", tickets: 45, percentage: 13, avgResponse: "30s" },
    { channel: "WhatsApp", tickets: 38, percentage: 11, avgResponse: "2m" },
    { channel: "Social Media", tickets: 25, percentage: 7, avgResponse: "5m" },
    { channel: "Web Form", tickets: 20, percentage: 6, avgResponse: "15m" },
  ];

  const agentPerformance = [
    { name: "Sarah Johnson", resolved: 45, avgTime: "3.1 hrs", csat: 4.8, fcr: "82%" },
    { name: "Mike Chen", resolved: 38, avgTime: "3.8 hrs", csat: 4.7, fcr: "79%" },
    { name: "Emily Davis", resolved: 42, avgTime: "3.5 hrs", csat: 4.5, fcr: "75%" },
    { name: "Alex Kumar", resolved: 35, avgTime: "4.0 hrs", csat: 4.6, fcr: "80%" },
    { name: "Lisa Park", resolved: 30, avgTime: "4.5 hrs", csat: 4.4, fcr: "72%" },
  ];

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Analytics & Reporting</h1>
            <p className="text-slate-500 mt-1">Performance insights and metrics</p>
          </div>
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white">
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Tickets</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{metrics.totalTickets}</p>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {metrics.ticketVolumeTrend}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg"><BarChart3 className="w-5 h-5 text-blue-600" /></div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Avg Response Time</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{metrics.avgResponseTime}</p>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><TrendingDown className="w-3 h-3" /> {metrics.responseTimeTrend}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg"><Clock className="w-5 h-5 text-purple-600" /></div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">CSAT Score</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{metrics.csat}/5</p>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {metrics.csatTrend}</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg"><Star className="w-5 h-5 text-yellow-600" /></div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">First Contact Resolution</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{metrics.firstContactResolution}</p>
                <p className="text-xs text-slate-500 mt-1">Industry avg: 72%</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg"><Users className="w-5 h-5 text-green-600" /></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Channel Breakdown */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Channel Breakdown</h2>
            <div className="space-y-3">
              {channelBreakdown.map((ch) => (
                <div key={ch.channel} className="flex items-center gap-4">
                  <div className="w-24 text-sm text-slate-700">{ch.channel}</div>
                  <div className="flex-1">
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${ch.percentage}%` }} />
                    </div>
                  </div>
                  <div className="w-12 text-right text-sm font-medium text-slate-700">{ch.tickets}</div>
                  <div className="w-16 text-right text-xs text-slate-500">{ch.avgResponse}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Agent Performance */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Agent Performance</h2>
            <table className="w-full">
              <thead>
                <tr className="text-xs text-slate-500 border-b border-slate-100">
                  <th className="text-left pb-2">Agent</th>
                  <th className="text-right pb-2">Resolved</th>
                  <th className="text-right pb-2">Avg Time</th>
                  <th className="text-right pb-2">CSAT</th>
                  <th className="text-right pb-2">FCR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {agentPerformance.map((agent) => (
                  <tr key={agent.name} className="text-sm">
                    <td className="py-2 text-slate-700">{agent.name}</td>
                    <td className="py-2 text-right font-medium text-slate-900">{agent.resolved}</td>
                    <td className="py-2 text-right text-slate-600">{agent.avgTime}</td>
                    <td className="py-2 text-right text-slate-600">{agent.csat}</td>
                    <td className="py-2 text-right text-slate-600">{agent.fcr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SLA Compliance */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">SLA Compliance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-green-500 mb-2">
                <span className="text-2xl font-bold text-green-600">95%</span>
              </div>
              <p className="text-sm text-slate-600">First Response SLA</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-blue-500 mb-2">
                <span className="text-2xl font-bold text-blue-600">88%</span>
              </div>
              <p className="text-sm text-slate-600">Resolution SLA</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-purple-500 mb-2">
                <span className="text-2xl font-bold text-purple-600">92%</span>
              </div>
              <p className="text-sm text-slate-600">Overall SLA</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
