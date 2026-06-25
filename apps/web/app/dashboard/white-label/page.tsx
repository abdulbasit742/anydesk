"use client";
import { Check, Globe, Mail, Palette, Shield } from "lucide-react";
import { useState } from "react";

export default function WhiteLabelPage() {
  const [config, setConfig] = useState({
    companyName: "RemoteDesk",
    customDomain: "",
    primaryColor: "#2563eb",
    secondaryColor: "#1e40af",
    accentColor: "#3b82f6",
    fontFamily: "Inter",
    borderRadius: 8,
    hideRemoteDeskBranding: true,
    customLoginPage: true,
    customEmailDomain: false,
  });

  const [domainVerified, setDomainVerified] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">White-Label Configuration</h1>
          <p className="text-slate-500 mt-1">Customize branding, domains, and appearance for your organization</p>
        </div>

        <div className="space-y-6">
          {/* Branding */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2"><Palette className="w-5 h-5" /> Branding</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-slate-600 mb-1">Company Name</label>
                <input type="text" value={config.companyName} onChange={(e) => setConfig({ ...config, companyName: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">Font Family</label>
                <select value={config.fontFamily} onChange={(e) => setConfig({ ...config, fontFamily: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Poppins">Poppins</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">Primary Color</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={config.primaryColor} onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })} className="w-10 h-10 rounded cursor-pointer" />
                  <input type="text" value={config.primaryColor} onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })} className="px-3 py-2 border border-slate-200 rounded-lg text-sm w-28" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">Secondary Color</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={config.secondaryColor} onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })} className="w-10 h-10 rounded cursor-pointer" />
                  <input type="text" value={config.secondaryColor} onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })} className="px-3 py-2 border border-slate-200 rounded-lg text-sm w-28" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">Accent Color</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={config.accentColor} onChange={(e) => setConfig({ ...config, accentColor: e.target.value })} className="w-10 h-10 rounded cursor-pointer" />
                  <input type="text" value={config.accentColor} onChange={(e) => setConfig({ ...config, accentColor: e.target.value })} className="px-3 py-2 border border-slate-200 rounded-lg text-sm w-28" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">Border Radius</label>
                <input type="range" min="0" max="24" value={config.borderRadius} onChange={(e) => setConfig({ ...config, borderRadius: parseInt(e.target.value) })} className="w-full" />
                <span className="text-xs text-slate-500">{config.borderRadius}px</span>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-slate-600 mb-2">Logo Upload</label>
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center">
                  <p className="text-sm text-slate-500">Drag and drop your logo here, or click to browse</p>
                  <p className="text-xs text-slate-400 mt-1">SVG, PNG or JPG (max. 2MB)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Custom Domain */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2"><Globe className="w-5 h-5" /> Custom Domain</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-600 mb-1">Support Portal Domain</label>
                <div className="flex items-center gap-2">
                  <input type="text" placeholder="support.yourdomain.com" value={config.customDomain} onChange={(e) => setConfig({ ...config, customDomain: e.target.value })} className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">Verify</button>
                </div>
              </div>
              {config.customDomain && (
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-slate-700 mb-2">DNS Records Required:</p>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">CNAME</span>
                      <span className="text-slate-700">{config.customDomain}</span>
                      <span className="text-slate-400">→</span>
                      <span className="text-blue-600">portal.remotedesk.io</span>
                      {domainVerified ? <Check className="w-3 h-3 text-green-500" /> : <span className="text-yellow-600">Pending</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">TXT</span>
                      <span className="text-slate-700">_verify.{config.customDomain}</span>
                      <span className="text-slate-400">→</span>
                      <span className="text-blue-600">remotedesk-verify=abc123</span>
                      {domainVerified ? <Check className="w-3 h-3 text-green-500" /> : <span className="text-yellow-600">Pending</span>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Email Templates */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2"><Mail className="w-5 h-5" /> Email Templates</h2>
            <div className="space-y-3">
              {["Welcome Email", "New Ticket Notification", "Ticket Reply", "Password Reset", "Satisfaction Survey"].map((template) => (
                <div key={template} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                  <span className="text-sm text-slate-700">{template}</span>
                  <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50">Edit Template</button>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2"><Shield className="w-5 h-5" /> Features</h2>
            <div className="space-y-4">
              <label className="flex items-center justify-between py-2">
                <div><p className="text-sm font-medium text-slate-700">Hide RemoteDesk Branding</p><p className="text-xs text-slate-500">Remove all RemoteDesk branding from customer-facing pages</p></div>
                <input type="checkbox" checked={config.hideRemoteDeskBranding} onChange={(e) => setConfig({ ...config, hideRemoteDeskBranding: e.target.checked })} className="w-4 h-4 rounded border-slate-300" />
              </label>
              <label className="flex items-center justify-between py-2">
                <div><p className="text-sm font-medium text-slate-700">Custom Login Page</p><p className="text-xs text-slate-500">Use your own branded login page</p></div>
                <input type="checkbox" checked={config.customLoginPage} onChange={(e) => setConfig({ ...config, customLoginPage: e.target.checked })} className="w-4 h-4 rounded border-slate-300" />
              </label>
              <label className="flex items-center justify-between py-2">
                <div><p className="text-sm font-medium text-slate-700">Custom Email Domain</p><p className="text-xs text-slate-500">Send emails from your own domain</p></div>
                <input type="checkbox" checked={config.customEmailDomain} onChange={(e) => setConfig({ ...config, customEmailDomain: e.target.checked })} className="w-4 h-4 rounded border-slate-300" />
              </label>
            </div>
          </div>

          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            Save Configuration
          </button>
        </div>
      </div>
    </main>
  );
}
