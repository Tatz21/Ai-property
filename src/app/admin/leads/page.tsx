"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Users, Shield, ArrowRight, CheckCircle2, Phone, Sparkles } from "lucide-react";
import { LeadRecord, LeadStatus, LeadIntent } from "@/lib/leads/types";
import { formatINR } from "@/lib/utils";

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/leads");
      const data = await res.json();
      if (res.ok && data.leads) {
        setLeads(data.leads);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleReassign = async (leadId: string, agentId: string) => {
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, assignedAgentId: agentId }),
      });
      if (res.ok) {
        setFeedback("Lead territory reassigned successfully");
        fetchLeads();
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            Phase 5 Deliverable
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Lead Oversight & Routing Management
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Monitor incoming AI qualified leads, review intent scores, and override agent territory assignments.
        </p>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Leads Table */}
      <div className="rounded-2xl bg-[#121218] border border-zinc-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="border-b border-zinc-800 bg-zinc-900/60 text-zinc-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Lead & Contact</th>
                <th className="py-3.5 px-4">Target Locality</th>
                <th className="py-3.5 px-4">Intent & Score</th>
                <th className="py-3.5 px-4">Deal Status</th>
                <th className="py-3.5 px-4">Assigned Agent</th>
                <th className="py-3.5 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-zinc-800/30">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white">{lead.customerName}</div>
                    <div className="text-[11px] text-zinc-400 font-mono">{lead.customerPhone}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-zinc-200">{lead.preferredLocality || "Kolkata"}</span>
                    {lead.budgetCap && (
                      <div className="text-[10px] text-cyan-300 font-mono">{formatINR(lead.budgetCap)}</div>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono border ${
                        lead.intent === "high"
                          ? "bg-red-500/10 text-red-400 border-red-500/20 font-bold"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}
                    >
                      {lead.intent.toUpperCase()} ({lead.score}/100)
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700 capitalize">
                      {lead.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <select
                      value={lead.assignedAgentId || "usr-agent-01"}
                      onChange={(e) => handleReassign(lead.id, e.target.value)}
                      className="bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-cyan-300 font-mono focus:outline-none"
                    >
                      <option value="usr-agent-01">Sanjay Bhattacharya (New Town)</option>
                      <option value="usr-agent-02">Debasish Mukherjee (South Kol)</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/agent/leads/${lead.id}`}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 inline-block transition-colors"
                      title="Inspect Full Lead AI Transcript"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
