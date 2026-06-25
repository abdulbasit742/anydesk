"use client";
import { Activity, GitBranch, Pause, Play, Plus, Settings, Trash2, Zap } from "lucide-react";
import { useState } from "react";

interface WorkflowRule {
  id: string;
  name: string;
  description: string;
  type: "trigger" | "schedule" | "condition";
  enabled: boolean;
  triggerCount: number;
  lastTriggered: string | null;
  conditions: string[];
  actions: string[];
}

const mockRules: WorkflowRule[] = [
  { id: "r1", name: "Auto-assign high priority tickets", description: "Route critical/high priority tickets to senior agents", type: "trigger", enabled: true, triggerCount: 156, lastTriggered: "2024-01-15T11:30:00Z", conditions: ["Priority is High or Critical", "Status is Open"], actions: ["Assign to Team: Senior Support", "Add tag: escalated", "Send Slack notification"] },
  { id: "r2", name: "SLA breach warning", description: "Notify manager 30 minutes before SLA breach", type: "trigger", enabled: true, triggerCount: 45, lastTriggered: "2024-01-15T10:00:00Z", conditions: ["SLA remaining < 30 minutes", "Status is not Resolved"], actions: ["Send email to manager", "Add internal note", "Increase priority"] },
  { id: "r3", name: "Auto-close resolved tickets", description: "Close tickets that have been resolved for 48 hours", type: "schedule", enabled: true, triggerCount: 89, lastTriggered: "2024-01-15T00:00:00Z", conditions: ["Status is Resolved", "Last update > 48 hours ago"], actions: ["Change status to Closed", "Send satisfaction survey"] },
  { id: "r4", name: "Welcome message for new chats", description: "Send automated greeting when customer starts chat", type: "trigger", enabled: true, triggerCount: 320, lastTriggered: "2024-01-15T11:45:00Z", conditions: ["Channel is Live Chat", "New conversation started"], actions: ["Send welcome message", "Collect customer info", "Route to available agent"] },
  { id: "r5", name: "After-hours auto-reply", description: "Send auto-reply outside business hours", type: "condition", enabled: false, triggerCount: 67, lastTriggered: "2024-01-14T22:00:00Z", conditions: ["Current time is outside business hours", "Channel is Email or Chat"], actions: ["Send auto-reply", "Create ticket", "Set priority to Low"] },
  { id: "r6", name: "VIP customer routing", description: "Route VIP customers to dedicated support team", type: "trigger", enabled: true, triggerCount: 28, lastTriggered: "2024-01-15T09:30:00Z", conditions: ["Customer tag contains VIP", "Any new ticket or chat"], actions: ["Assign to VIP team", "Set priority to High", "Send Slack alert to VIP channel"] },
];

export default function AutomationPage() {
  const [rules, setRules] = useState(mockRules);
  const [search, setSearch] = useState("");

  const filtered = rules.filter((r) => search ? r.name.toLowerCase().includes(search.toLowerCase()) : true);

  const toggleRule = (id: string) => {
    setRules(rules.map((r) => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Automation & Workflows</h1>
            <p className="text-slate-500 mt-1">Automate repetitive tasks and create smart routing rules</p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" /> New Rule
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg"><Zap className="w-5 h-5 text-blue-600" /></div>
              <div><p className="text-2xl font-bold text-slate-900">{rules.length}</p><p className="text-xs text-slate-500">Total Rules</p></div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg"><Activity className="w-5 h-5 text-green-600" /></div>
              <div><p className="text-2xl font-bold text-slate-900">{rules.filter((r) => r.enabled).length}</p><p className="text-xs text-slate-500">Active</p></div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg"><GitBranch className="w-5 h-5 text-purple-600" /></div>
              <div><p className="text-2xl font-bold text-slate-900">{rules.reduce((s, r) => s + r.triggerCount, 0)}</p><p className="text-xs text-slate-500">Total Triggers</p></div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-lg"><Settings className="w-5 h-5 text-orange-600" /></div>
              <div><p className="text-2xl font-bold text-slate-900">12h</p><p className="text-xs text-slate-500">Time Saved/Day</p></div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input type="text" placeholder="Search automation rules..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        {/* Rules List */}
        <div className="space-y-3">
          {filtered.map((rule) => (
            <div key={rule.id} className={`bg-white rounded-xl border ${rule.enabled ? "border-slate-200" : "border-slate-100 opacity-70"} p-5 transition-all`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg ${rule.type === "trigger" ? "bg-blue-50" : rule.type === "schedule" ? "bg-purple-50" : "bg-orange-50"}`}>
                      <Zap className={`w-4 h-4 ${rule.type === "trigger" ? "text-blue-600" : rule.type === "schedule" ? "text-purple-600" : "text-orange-600"}`} />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900">{rule.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${rule.enabled ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                      {rule.enabled ? "Active" : "Paused"}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1 ml-10">{rule.description}</p>
                  <div className="mt-3 ml-10 flex flex-wrap gap-4">
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Conditions</p>
                      <div className="flex flex-wrap gap-1">
                        {rule.conditions.map((c, i) => (
                          <span key={i} className="px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-600">{c}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Actions</p>
                      <div className="flex flex-wrap gap-1">
                        {rule.actions.map((a, i) => (
                          <span key={i} className="px-2 py-0.5 bg-blue-50 border border-blue-200 rounded text-xs text-blue-600">{a}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 ml-10 flex items-center gap-4 text-xs text-slate-400">
                    <span>Triggered {rule.triggerCount} times</span>
                    {rule.lastTriggered && <span>Last: {new Date(rule.lastTriggered).toLocaleString()}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleRule(rule.id)} className={`p-2 rounded-lg ${rule.enabled ? "text-green-600 hover:bg-green-50" : "text-slate-400 hover:bg-slate-50"}`}>
                    {rule.enabled ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
