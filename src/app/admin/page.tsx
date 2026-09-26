import React from "react";
import { db } from "@/lib/db";
import { Activity, ShieldCheck, Database, Bot, Users } from "lucide-react";

export default async function AdminDashboardPage() {
  const health = await db.healthCheck();
  const properties = await db.properties.findMany();
  const leads = await db.leads.findMany();
  const auditLogs = await db.auditLogs.findMany();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            Phase 0 Base Architecture
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Platform Administration & Health
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Server-side state overview, RBAC permissions, and operational health metrics.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl p-5 bg-[#121218] border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-mono uppercase">System Health</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 capitalize">{health.status}</div>
          <span className="text-xs text-zinc-500 mt-1 block">PostgreSQL schema operational</span>
        </div>

        <div className="rounded-2xl p-5 bg-[#121218] border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-mono uppercase">Active Listings</span>
            <Database className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white">{properties.length}</div>
          <span className="text-xs text-zinc-500 mt-1 block">Verified Kolkata inventory</span>
        </div>

        <div className="rounded-2xl p-5 bg-[#121218] border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-mono uppercase">Total Leads</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">{leads.length}</div>
          <span className="text-xs text-zinc-500 mt-1 block">High-intent AI qualifications</span>
        </div>

        <div className="rounded-2xl p-5 bg-[#121218] border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-mono uppercase">AI Engine</span>
            <Bot className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-400">Online</div>
          <span className="text-xs text-zinc-500 mt-1 block">Gemini 2.0 Flash tool-caller</span>
        </div>
      </div>

      {/* Property Inventory & Verification Table */}
      <div className="rounded-2xl bg-[#121218] border border-zinc-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          <span>Properties in System ({properties.length})</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="border-b border-zinc-800 text-zinc-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="py-3 px-4">Title & Locality</th>
                <th className="py-3 px-4">BHK</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Verification</th>
                <th className="py-3 px-4">RERA ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {properties.map((p) => (
                <tr key={p.id} className="hover:bg-zinc-800/30">
                  <td className="py-3.5 px-4 font-medium text-white">
                    {p.title}
                    <div className="text-[11px] text-zinc-500">{p.locality}</div>
                  </td>
                  <td className="py-3.5 px-4">{p.bhk > 0 ? `${p.bhk} BHK` : "Commercial"}</td>
                  <td className="py-3.5 px-4 font-mono text-cyan-300">
                    ₹{(p.price / 100000).toFixed(2)} L
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {p.verificationStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-zinc-400">{p.reraId || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Log Stream */}
      <div className="rounded-2xl bg-[#121218] border border-zinc-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Audit Event Trail ({auditLogs.length})
        </h2>
        <div className="space-y-3">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-xs"
            >
              <div>
                <span className="font-mono text-cyan-400 font-semibold mr-2">{log.action}</span>
                <span className="text-zinc-400">{log.entity}: {log.entityId}</span>
              </div>
              <span className="font-mono text-[10px] text-zinc-500">{log.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
