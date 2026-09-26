"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SpotlightNavbar } from "@/components/ui/spotlight-navbar";
import { PerspectiveGrid } from "@/components/ui/perspective-grid";
import { 
  Users, Flame, CalendarCheck, CheckCircle2, 
  ArrowRight, Phone, MessageSquare, Clock, ShieldCheck, Briefcase
} from "lucide-react";
import { formatINR } from "@/lib/utils";
import { LeadRecord } from "@/lib/leads/types";

export default function AgentDashboardPage() {
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        const res = await fetch("/api/leads");
        const data = await res.json();
        if (res.ok && data.leads) {
          setLeads(data.leads);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const highIntentLeads = leads.filter(l => l.intent === "high");
  const visitScheduled = leads.filter(l => l.status === "visit_scheduled");

  return (
    <div className="relative min-h-screen bg-[#09090b] text-zinc-100 flex flex-col justify-between">
      <PerspectiveGrid />
      <SpotlightNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 w-full z-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono mb-2">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Agent Partner Workspace • Kolkata</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Agent Command Center</h1>
            <p className="text-xs sm:text-sm text-zinc-400">
              Assigned leads, AI conversation contexts, task queue, and visit inspections.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/agent/properties"
              className="px-4 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-white transition-colors"
            >
              My Inventory
            </Link>
            <Link
              href="/agent/profile"
              className="px-4 py-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-xs font-semibold text-black transition-colors"
            >
              Territory Profile
            </Link>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl p-5 bg-[#121218] border border-zinc-800">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-mono uppercase">Active Leads</span>
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-white font-mono">{leads.length}</div>
            <span className="text-xs text-zinc-500 mt-1 block">In your assigned Kolkata zones</span>
          </div>

          <div className="rounded-2xl p-5 bg-[#121218] border border-zinc-800">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-mono uppercase">High-Intent Leads</span>
              <Flame className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-400 font-mono">{highIntentLeads.length}</div>
            <span className="text-xs text-zinc-500 mt-1 block">Score &gt;= 75 (Urgent callback)</span>
          </div>

          <div className="rounded-2xl p-5 bg-[#121218] border border-zinc-800">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-mono uppercase">Visits Scheduled</span>
              <CalendarCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400 font-mono">{visitScheduled.length}</div>
            <span className="text-xs text-zinc-500 mt-1 block">Confirmed site inspections</span>
          </div>

          <div className="rounded-2xl p-5 bg-[#121218] border border-zinc-800">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-mono uppercase">Avg Response SLA</span>
              <Clock className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-purple-300 font-mono">&lt; 15 mins</div>
            <span className="text-xs text-zinc-500 mt-1 block">Platform standard met</span>
          </div>
        </div>

        {/* Lead Inbox & Pipeline Stream */}
        <div className="rounded-[24px] bg-[#111116] border border-zinc-800 p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>Lead Inbox & AI Intent Stream</span>
              </h2>
              <p className="text-xs text-zinc-400">Click on any lead to open full AI transcript, requirements, and tasks</p>
            </div>

            <span className="text-xs font-mono text-cyan-400">{leads.length} Leads in Queue</span>
          </div>

          {loading ? (
            <div className="py-16 text-center font-mono text-xs text-zinc-500">Loading leads...</div>
          ) : leads.length === 0 ? (
            <div className="py-12 text-center text-xs text-zinc-500">No leads assigned currently.</div>
          ) : (
            <div className="divide-y divide-zinc-800/60">
              {leads.map((lead) => (
                <Link
                  key={lead.id}
                  href={`/agent/leads/${lead.id}`}
                  className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-zinc-800/30 p-3 rounded-2xl transition-all group"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                        {lead.customerName}
                      </h3>

                      {/* Intent Badge */}
                      <span
                        className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${
                          lead.intent === "high"
                            ? "bg-red-500/10 text-red-400 border-red-500/20 font-bold"
                            : lead.intent === "medium"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : "bg-zinc-800 text-zinc-400 border-zinc-700"
                        }`}
                      >
                        {lead.intent.toUpperCase()} INTENT (Score: {lead.score})
                      </span>

                      {/* Pipeline Stage */}
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 capitalize">
                        {lead.status.replace("_", " ")}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-300 line-clamp-1">
                      {lead.requirementsSummary || "Natural language requirements extracted from AI chat."}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-zinc-400 font-mono">
                      <span>Locality: <strong className="text-zinc-200">{lead.preferredLocality || "Kolkata"}</strong></span>
                      {lead.budgetCap && <span>Budget: <strong className="text-cyan-300">{formatINR(lead.budgetCap)}</strong></span>}
                      {lead.bhkPreference && <span>BHK: <strong className="text-zinc-200">{lead.bhkPreference} BHK</strong></span>}
                    </div>
                  </div>

                  {/* Right side contact & inspect CTA */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right hidden sm:block">
                      <div className="text-[11px] font-mono text-zinc-300 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-cyan-400" />
                        <span>{lead.customerPhone}</span>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-zinc-800 group-hover:bg-cyan-500 group-hover:text-black text-zinc-300 transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="py-8 border-t border-zinc-800/80 text-center text-xs text-zinc-500">
        <p>© 2026 EstateAI Kolkata. Agent Portal & CRM Subsystem.</p>
      </footer>
    </div>
  );
}
