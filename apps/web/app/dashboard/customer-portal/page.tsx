"use client";
import { CreditCard, Globe, Monitor, Settings, Shield, Ticket, Users } from "lucide-react";
import { useState } from "react";

interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  devices: number;
  tickets: number;
  status: "active" | "inactive";
  lastActive: string;
  satisfaction: number;
}

const mockCustomers: Customer[] = [
  { id: "c1", name: "John Smith", email: "john@acme.com", company: "Acme Corp", devices: 3, tickets: 12, status: "active", lastActive: "2 min ago", satisfaction: 4.5 },
  { id: "c2", name: "Jane Doe", email: "jane@startup.io", company: "Startup Inc", devices: 2, tickets: 5, status: "active", lastActive: "1 hour ago", satisfaction: 4.8 },
  { id: "c3", name: "Bob Wilson", email: "bob@enterprise.co", company: "Enterprise Co", devices: 15, tickets: 28, status: "active", lastActive: "5 min ago", satisfaction: 4.2 },
  { id: "c4", name: "Alice Brown", email: "alice@design.studio", company: "Design Studio", devices: 1, tickets: 3, status: "inactive", lastActive: "3 days ago", satisfaction: 4.9 },
  { id: "c5", name: "Charlie Davis", email: "charlie@tech.io", company: "Tech Solutions", devices: 8, tickets: 15, status: "active", lastActive: "30 min ago", satisfaction: 4.1 },
];

export default function CustomerPortalPage() {
  const [activeTab, setActiveTab] = useState<"customers" | "settings">("customers");

  const portalSettings = {
    enabled: true,
    allowTicketCreation: true,
    allowDeviceView: true,
    allowRecordingDownload: true,
    allowInvoiceView: true,
    customDomain: null as string | null,
    companyName: "RemoteDesk",
    primaryColor: "#2563eb",
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Customer Portal</h1>
            <p className="text-slate-500 mt-1">Self-service portal for your customers</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setActiveTab("customers")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "customers" ? "bg-blue-600 text-white" : "bg-white text-slate-600 border border-slate-200"}`}>
              <Users className="w-4 h-4 inline mr-2" />Customers
            </button>
            <button onClick={() => setActiveTab("settings")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "settings" ? "bg-blue-600 text-white" : "bg-white text-slate-600 border border-slate-200"}`}>
              <Settings className="w-4 h-4 inline mr-2" />Portal Settings
            </button>
          </div>
        </div>

        {activeTab === "customers" && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg"><Users className="w-5 h-5 text-blue-600" /></div>
                <div><p className="text-2xl font-bold text-slate-900">{mockCustomers.length}</p><p className="text-xs text-slate-500">Total Customers</p></div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg"><Monitor className="w-5 h-5 text-green-600" /></div>
                <div><p className="text-2xl font-bold text-slate-900">{mockCustomers.reduce((s, c) => s + c.devices, 0)}</p><p className="text-xs text-slate-500">Total Devices</p></div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg"><Ticket className="w-5 h-5 text-purple-600" /></div>
                <div><p className="text-2xl font-bold text-slate-900">{mockCustomers.reduce((s, c) => s + c.tickets, 0)}</p><p className="text-xs text-slate-500">Total Tickets</p></div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
                <div className="p-2 bg-yellow-50 rounded-lg"><CreditCard className="w-5 h-5 text-yellow-600" /></div>
                <div><p className="text-2xl font-bold text-slate-900">$2,450</p><p className="text-xs text-slate-500">Monthly Revenue</p></div>
              </div>
            </div>

            {/* Customer Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Customer</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Company</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 uppercase">Devices</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 uppercase">Tickets</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 uppercase">CSAT</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Last Active</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mockCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-slate-50 cursor-pointer">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-slate-900">{customer.name}</p>
                        <p className="text-xs text-slate-500">{customer.email}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">{customer.company}</td>
                      <td className="px-4 py-3 text-sm text-center text-slate-600">{customer.devices}</td>
                      <td className="px-4 py-3 text-sm text-center text-slate-600">{customer.tickets}</td>
                      <td className="px-4 py-3 text-sm text-center text-slate-600">{customer.satisfaction}/5</td>
                      <td className="px-4 py-3 text-xs text-slate-500">{customer.lastActive}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${customer.status === "active" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                          {customer.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === "settings" && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-2xl">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Portal Configuration</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div><p className="text-sm font-medium text-slate-900">Portal Enabled</p><p className="text-xs text-slate-500">Allow customers to access the self-service portal</p></div>
                <input type="checkbox" defaultChecked={portalSettings.enabled} className="w-4 h-4 rounded border-slate-300" />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div><p className="text-sm font-medium text-slate-900">Ticket Creation</p><p className="text-xs text-slate-500">Allow customers to create new tickets</p></div>
                <input type="checkbox" defaultChecked={portalSettings.allowTicketCreation} className="w-4 h-4 rounded border-slate-300" />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div><p className="text-sm font-medium text-slate-900">Device View</p><p className="text-xs text-slate-500">Allow customers to view their registered devices</p></div>
                <input type="checkbox" defaultChecked={portalSettings.allowDeviceView} className="w-4 h-4 rounded border-slate-300" />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div><p className="text-sm font-medium text-slate-900">Recording Downloads</p><p className="text-xs text-slate-500">Allow customers to download session recordings</p></div>
                <input type="checkbox" defaultChecked={portalSettings.allowRecordingDownload} className="w-4 h-4 rounded border-slate-300" />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div><p className="text-sm font-medium text-slate-900">Invoice View</p><p className="text-xs text-slate-500">Allow customers to view and download invoices</p></div>
                <input type="checkbox" defaultChecked={portalSettings.allowInvoiceView} className="w-4 h-4 rounded border-slate-300" />
              </div>
              <div className="py-3 border-b border-slate-100">
                <p className="text-sm font-medium text-slate-900 mb-2">Custom Domain</p>
                <input type="text" placeholder="support.yourdomain.com" defaultValue={portalSettings.customDomain || ""} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
              </div>
              <div className="py-3">
                <p className="text-sm font-medium text-slate-900 mb-2">Branding</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-500">Company Name</label>
                    <input type="text" defaultValue={portalSettings.companyName} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm mt-1" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Primary Color</label>
                    <input type="color" defaultValue={portalSettings.primaryColor} className="w-full h-10 rounded-lg mt-1 cursor-pointer" />
                  </div>
                </div>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">Save Settings</button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
