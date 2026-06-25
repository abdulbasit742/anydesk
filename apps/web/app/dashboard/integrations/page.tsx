"use client";
import { Check, ExternalLink, Link2, Plus, Settings, Unplug, Webhook, X } from "lucide-react";
import { useState } from "react";

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  status: "active" | "inactive" | "pending";
  icon: string;
  lastSync: string | null;
}

const mockIntegrations: Integration[] = [
  { id: "int-slack", name: "Slack", description: "Send notifications and create tickets from Slack", category: "Communication", status: "active", icon: "S", lastSync: "2 min ago" },
  { id: "int-jira", name: "Jira", description: "Sync tickets with Jira issues bidirectionally", category: "Project Management", status: "active", icon: "J", lastSync: "5 min ago" },
  { id: "int-salesforce", name: "Salesforce", description: "Sync customer data with Salesforce CRM", category: "CRM", status: "inactive", icon: "SF", lastSync: null },
  { id: "int-hubspot", name: "HubSpot", description: "CRM integration with HubSpot", category: "CRM", status: "inactive", icon: "H", lastSync: null },
  { id: "int-zapier", name: "Zapier", description: "Connect to 5000+ apps via Zapier webhooks", category: "Automation", status: "active", icon: "Z", lastSync: "1 hour ago" },
  { id: "int-make", name: "Make (Integromat)", description: "Advanced automation with Make scenarios", category: "Automation", status: "inactive", icon: "M", lastSync: null },
  { id: "int-github", name: "GitHub", description: "Link tickets to GitHub issues and PRs", category: "Development", status: "inactive", icon: "GH", lastSync: null },
  { id: "int-intercom", name: "Intercom", description: "Import conversations from Intercom", category: "Communication", status: "inactive", icon: "I", lastSync: null },
];

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState(mockIntegrations);
  const [filter, setFilter] = useState("all");

  const categories = [...new Set(integrations.map((i) => i.category))];
  const filtered = integrations.filter((i) => {
    if (filter === "active") return i.status === "active";
    if (filter === "inactive") return i.status === "inactive";
    return true;
  });

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Integrations</h1>
            <p className="text-slate-500 mt-1">Connect your favorite tools and services</p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Webhook className="w-4 h-4" /> Manage Webhooks
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Connected</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{integrations.filter((i) => i.status === "active").length}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Available</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{integrations.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Webhooks Active</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">3</p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 mb-6">
          {["all", "active", "inactive"].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${filter === f ? "bg-blue-600 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}>
              {f}
            </button>
          ))}
        </div>

        {/* Integration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((integration) => (
            <div key={integration.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${integration.status === "active" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"}`}>
                    {integration.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{integration.name}</h3>
                    <p className="text-xs text-slate-500">{integration.category}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${integration.status === "active" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                  {integration.status === "active" ? "Connected" : "Not Connected"}
                </span>
              </div>
              <p className="text-sm text-slate-600 mb-4">{integration.description}</p>
              <div className="flex items-center justify-between">
                {integration.lastSync && <span className="text-xs text-slate-400">Last sync: {integration.lastSync}</span>}
                {!integration.lastSync && <span />}
                <button className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${integration.status === "active" ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
                  {integration.status === "active" ? "Disconnect" : "Connect"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
