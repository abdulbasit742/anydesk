"use client";
import { BookOpen, Edit, Eye, FolderOpen, Globe, Plus, Search, ThumbsUp, Trash2 } from "lucide-react";
import { useState } from "react";

interface Article {
  id: string;
  title: string;
  category: string;
  status: "draft" | "published" | "archived";
  views: number;
  helpfulYes: number;
  helpfulNo: number;
  updatedAt: string;
}

const mockArticles: Article[] = [
  { id: "a1", title: "Getting Started with RemoteDesk", category: "Getting Started", status: "published", views: 1250, helpfulYes: 89, helpfulNo: 5, updatedAt: "2024-01-10" },
  { id: "a2", title: "How to Set Up Unattended Access", category: "Remote Desktop", status: "published", views: 890, helpfulYes: 67, helpfulNo: 8, updatedAt: "2024-01-12" },
  { id: "a3", title: "Troubleshooting Connection Issues", category: "Troubleshooting", status: "published", views: 2100, helpfulYes: 156, helpfulNo: 12, updatedAt: "2024-01-14" },
  { id: "a4", title: "Managing Your Subscription", category: "Account & Billing", status: "published", views: 450, helpfulYes: 34, helpfulNo: 3, updatedAt: "2024-01-08" },
  { id: "a5", title: "Security Best Practices", category: "Security", status: "draft", views: 0, helpfulYes: 0, helpfulNo: 0, updatedAt: "2024-01-15" },
  { id: "a6", title: "REST API Documentation", category: "API & Integrations", status: "published", views: 320, helpfulYes: 28, helpfulNo: 2, updatedAt: "2024-01-11" },
];

const categories = ["Getting Started", "Remote Desktop", "Troubleshooting", "Account & Billing", "Security", "API & Integrations"];

export default function KnowledgeBasePage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = mockArticles.filter((a) => {
    if (categoryFilter !== "all" && a.category !== categoryFilter) return false;
    if (statusFilter !== "all" && a.status !== statusFilter) return false;
    if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Knowledge Base</h1>
            <p className="text-slate-500 mt-1">Manage help articles and documentation</p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" /> New Article
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg"><BookOpen className="w-5 h-5 text-blue-600" /></div>
              <div><p className="text-2xl font-bold text-slate-900">{mockArticles.length}</p><p className="text-xs text-slate-500">Total Articles</p></div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg"><Eye className="w-5 h-5 text-green-600" /></div>
              <div><p className="text-2xl font-bold text-slate-900">{mockArticles.reduce((s, a) => s + a.views, 0).toLocaleString()}</p><p className="text-xs text-slate-500">Total Views</p></div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg"><ThumbsUp className="w-5 h-5 text-purple-600" /></div>
              <div><p className="text-2xl font-bold text-slate-900">94%</p><p className="text-xs text-slate-500">Helpfulness</p></div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-lg"><Globe className="w-5 h-5 text-orange-600" /></div>
              <div><p className="text-2xl font-bold text-slate-900">5</p><p className="text-xs text-slate-500">Languages</p></div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search articles..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm">
              <option value="all">All Categories</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm">
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Articles List */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="divide-y divide-slate-100">
            {filtered.map((article) => (
              <div key={article.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-slate-900">{article.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${article.status === "published" ? "bg-green-100 text-green-700" : article.status === "draft" ? "bg-yellow-100 text-yellow-700" : "bg-slate-100 text-slate-700"}`}>
                      {article.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-slate-500 flex items-center gap-1"><FolderOpen className="w-3 h-3" /> {article.category}</span>
                    <span className="text-xs text-slate-500 flex items-center gap-1"><Eye className="w-3 h-3" /> {article.views} views</span>
                    <span className="text-xs text-slate-500 flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {article.helpfulYes}</span>
                    <span className="text-xs text-slate-500">Updated {article.updatedAt}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"><Edit className="w-4 h-4" /></button>
                  <button className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
