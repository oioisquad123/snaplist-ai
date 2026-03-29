"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Stats {
  totalUsers: number;
  totalGenerations: number;
  totalLeads: number;
  totalSubscribers: number;
  estimatedMRR?: number;
  monthlyCount?: number;
  annualCount?: number;
  todayGenerations: number;
  topIPs: Array<{ ip: string; count: number }>;
  recentLeads: Array<{ email: string; plan: string; status: string; created_at: string }>;
  recentSubscribers: Array<{ email: string; plan: string; status: string; created_at: string }>;
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [testResult, setTestResult] = useState("");

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => {
        if (r.status === 401) throw new Error("Unauthorized");
        return r.json();
      })
      .then(setStats)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const testCheckout = async () => {
    setTestResult("Testing...");
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "monthly", email: "test@test.com" }),
      });
      const data = await res.json();
      if (data.url) {
        setTestResult(`✅ Stripe checkout works! URL: ${data.url.substring(0, 60)}...`);
      } else {
        setTestResult(`❌ Error: ${data.error}`);
      }
    } catch (e) {
      setTestResult(`❌ Network error: ${e}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading stats...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-2">❌ {error}</div>
          <p className="text-gray-400">Pass ?key=snaplist123 to access</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">📊 SnapList AI — Admin</h1>
            <p className="text-gray-400 text-sm">Sprint 7 Dashboard</p>
          </div>
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← Back to app</Link>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Users (IPs)", value: stats?.totalUsers ?? 0, color: "blue" },
            { label: "Total Generations", value: stats?.totalGenerations ?? 0, color: "purple" },
            { label: "Today's Generations", value: stats?.todayGenerations ?? 0, color: "green" },
            { label: "Email Leads", value: stats?.totalLeads ?? 0, color: "yellow" },
          ].map((m) => (
            <div key={m.label} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="text-3xl font-bold text-white mb-1">{m.value}</div>
              <div className="text-gray-400 text-sm">{m.label}</div>
            </div>
          ))}
        </div>

        {/* Revenue MRR card */}
        <div className="bg-gradient-to-r from-green-900 to-green-800 rounded-xl p-6 border border-green-700 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-green-300 text-sm font-medium mb-1">💰 Estimated MRR</div>
              <div className="text-4xl font-bold text-white">${stats?.estimatedMRR?.toFixed(2) ?? "0.00"}</div>
              <div className="text-green-400 text-sm mt-1">
                {stats?.monthlyCount ?? 0} monthly + {stats?.annualCount ?? 0} annual subscribers
              </div>
            </div>
            <div className="text-6xl">💵</div>
          </div>
        </div>

        {/* Active subscribers */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg">💳 Subscribers</h2>
            <div className="text-2xl font-bold text-green-400">{stats?.totalSubscribers ?? 0} active</div>
          </div>
          {stats?.recentSubscribers && stats.recentSubscribers.length > 0 ? (
            <div className="space-y-2">
              {stats.recentSubscribers.map((s, i) => (
                <div key={i} className="flex items-center justify-between text-sm bg-gray-700 rounded-lg px-3 py-2">
                  <span className="text-white">{s.email}</span>
                  <span className="text-green-400 font-medium">{s.plan}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${s.status === "active" ? "bg-green-900 text-green-300" : "bg-gray-600 text-gray-300"}`}>
                    {s.status}
                  </span>
                  <span className="text-gray-400">{new Date(s.created_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No subscribers yet — go get that first one! 🚀</p>
          )}
        </div>

        {/* Email leads */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
          <h2 className="font-bold text-lg mb-4">📧 Email Leads ({stats?.totalLeads ?? 0})</h2>
          {stats?.recentLeads && stats.recentLeads.length > 0 ? (
            <div className="space-y-2">
              {stats.recentLeads.map((l, i) => (
                <div key={i} className="flex items-center justify-between text-sm bg-gray-700 rounded-lg px-3 py-2">
                  <span className="text-white">{l.email}</span>
                  <span className="text-yellow-400 text-xs">{l.plan}</span>
                  <span className="text-gray-400">{new Date(l.created_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No leads yet — post on Twitter to get first users!</p>
          )}
        </div>

        {/* Top power users */}
        {stats?.topIPs && stats.topIPs.length > 0 && (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
            <h2 className="font-bold text-lg mb-4">🔥 Most Active Users (by IP)</h2>
            <div className="space-y-2">
              {stats.topIPs.map((u, i) => (
                <div key={i} className="flex items-center gap-4 text-sm bg-gray-700 rounded-lg px-3 py-2">
                  <span className="text-gray-400 w-6">#{i + 1}</span>
                  <span className="text-white font-mono text-xs">{u.ip.replace(/\d+$/, "***")}</span>
                  <div className="flex-1 bg-gray-600 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, (u.count / (stats.topIPs[0]?.count || 1)) * 100)}%` }} />
                  </div>
                  <span className="text-blue-400 font-bold">{u.count} gen</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* System checks */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
          <h2 className="font-bold text-lg mb-4">🔧 System Health</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-300">Stripe Checkout Flow</span>
              <div className="flex items-center gap-2">
                {testResult && <span className="text-xs text-gray-300 max-w-xs truncate">{testResult}</span>}
                <button
                  onClick={testCheckout}
                  className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-blue-700 transition-colors"
                >
                  Test →
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-300">Live URL</span>
              <a href="https://snaplist-ai-beta.vercel.app" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-xs">
                snaplist-ai-beta.vercel.app ↗
              </a>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-300">Stripe Dashboard</span>
              <a href="https://dashboard.stripe.com/subscriptions" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-xs">
                dashboard.stripe.com ↗
              </a>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-300">Supabase Dashboard</span>
              <a href="https://supabase.com/dashboard/project/bkfjzypmzikmskfeweio/editor" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-xs">
                supabase.com ↗
              </a>
            </div>
          </div>
        </div>

        {/* Quick post templates */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="font-bold text-lg mb-4">📢 Ready-to-Post Tweets</h2>
          <div className="space-y-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-xs text-gray-400 mb-2 font-semibold">TWEET 1 — Launch announcement</p>
              <p className="text-sm text-gray-200 whitespace-pre-line">{`Just shipped SnapList AI — upload 2 photos of any item and AI writes your full eBay listing in 10 seconds 📸⚡

Title, description, price, category, item specifics — all done.

Free: 3 listings/day. Pro: $9.99/mo
👉 snaplist-ai-beta.vercel.app

#eBay #Poshmark #reselling #AItools`}</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-xs text-gray-400 mb-2 font-semibold">TWEET 2 — Pain point</p>
              <p className="text-sm text-gray-200 whitespace-pre-line">{`Writing eBay listings manually takes 20 min per item

10 items = 3+ hours/week of boring copy-paste

Built a fix: upload photos → AI writes everything in 10 sec

FREE to try (no signup): snaplist-ai-beta.vercel.app

#eBay #reseller`}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
