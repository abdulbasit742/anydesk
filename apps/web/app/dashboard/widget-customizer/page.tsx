"use client";
import { Check, Code, Copy, Eye, MessageSquare, Palette } from "lucide-react";
import { useState } from "react";

export default function WidgetCustomizerPage() {
  const [config, setConfig] = useState({
    primaryColor: "#2563eb",
    textColor: "#ffffff",
    position: "bottom-right",
    title: "Support Chat",
    subtitle: "We typically reply within minutes",
    welcomeMessage: "Hi there! How can we help you today?",
    borderRadius: 12,
    showBranding: false,
    preChatEnabled: true,
    autoOpen: false,
    autoOpenDelay: 30,
  });

  const [copied, setCopied] = useState(false);
  const installCode = `<script src="https://cdn.remotedesk.io/widget.js" data-widget-id="widget-default" data-color="${config.primaryColor}"></script>`;

  const copyCode = () => {
    navigator.clipboard.writeText(installCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Widget Customizer</h1>
          <p className="text-slate-500 mt-1">Customize your live chat widget appearance and behavior</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Settings Panel */}
          <div className="space-y-6">
            {/* Appearance */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2"><Palette className="w-5 h-5" /> Appearance</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Primary Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={config.primaryColor} onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })} className="w-10 h-10 rounded cursor-pointer" />
                    <input type="text" value={config.primaryColor} onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })} className="px-3 py-2 border border-slate-200 rounded-lg text-sm w-28" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Position</label>
                  <select value={config.position} onChange={(e) => setConfig({ ...config, position: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
                    <option value="bottom-right">Bottom Right</option>
                    <option value="bottom-left">Bottom Left</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Border Radius</label>
                  <input type="range" min="0" max="24" value={config.borderRadius} onChange={(e) => setConfig({ ...config, borderRadius: parseInt(e.target.value) })} className="w-full" />
                  <span className="text-xs text-slate-500">{config.borderRadius}px</span>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Title</label>
                  <input type="text" value={config.title} onChange={(e) => setConfig({ ...config, title: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Subtitle</label>
                  <input type="text" value={config.subtitle} onChange={(e) => setConfig({ ...config, subtitle: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Welcome Message</label>
                  <textarea value={config.welcomeMessage} onChange={(e) => setConfig({ ...config, welcomeMessage: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm h-20 resize-none" />
                </div>
              </div>
            </div>

            {/* Behavior */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Behavior</h2>
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">Pre-chat form</span>
                  <input type="checkbox" checked={config.preChatEnabled} onChange={(e) => setConfig({ ...config, preChatEnabled: e.target.checked })} className="w-4 h-4 rounded border-slate-300" />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">Auto-open widget</span>
                  <input type="checkbox" checked={config.autoOpen} onChange={(e) => setConfig({ ...config, autoOpen: e.target.checked })} className="w-4 h-4 rounded border-slate-300" />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">Show branding</span>
                  <input type="checkbox" checked={config.showBranding} onChange={(e) => setConfig({ ...config, showBranding: e.target.checked })} className="w-4 h-4 rounded border-slate-300" />
                </label>
              </div>
            </div>

            {/* Install Code */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2"><Code className="w-5 h-5" /> Install Code</h2>
              <div className="relative">
                <pre className="bg-slate-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto">{installCode}</pre>
                <button onClick={copyCode} className="absolute top-2 right-2 p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-slate-300" />}
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-2">Add this code before the closing &lt;/body&gt; tag on your website.</p>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:sticky lg:top-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2"><Eye className="w-5 h-5" /> Preview</h2>
              <div className="relative bg-slate-100 rounded-lg h-[600px] flex items-end justify-end p-4">
                {/* Widget Preview */}
                <div className="w-80">
                  {/* Chat Window */}
                  <div className="bg-white shadow-xl border border-slate-200 mb-4" style={{ borderRadius: `${config.borderRadius}px` }}>
                    {/* Header */}
                    <div className="p-4" style={{ backgroundColor: config.primaryColor, borderRadius: `${config.borderRadius}px ${config.borderRadius}px 0 0` }}>
                      <h3 className="text-white font-semibold text-sm">{config.title}</h3>
                      <p className="text-white/80 text-xs mt-0.5">{config.subtitle}</p>
                    </div>
                    {/* Messages */}
                    <div className="p-4 h-48 flex flex-col justify-end">
                      <div className="bg-slate-100 rounded-lg p-3 max-w-[80%]">
                        <p className="text-xs text-slate-700">{config.welcomeMessage}</p>
                        <p className="text-[10px] text-slate-400 mt-1">Just now</p>
                      </div>
                    </div>
                    {/* Input */}
                    <div className="border-t border-slate-200 p-3">
                      <div className="flex items-center gap-2">
                        <input type="text" placeholder="Type a message..." className="flex-1 px-3 py-2 bg-slate-50 rounded-lg text-xs border-0 focus:outline-none" disabled />
                        <button className="p-2 rounded-lg" style={{ backgroundColor: config.primaryColor }}>
                          <MessageSquare className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Launcher Button */}
                  <div className="flex justify-end">
                    <button className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center" style={{ backgroundColor: config.primaryColor }}>
                      <MessageSquare className="w-6 h-6 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
