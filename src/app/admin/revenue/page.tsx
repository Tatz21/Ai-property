"use client";

import React, { useState, useEffect } from "react";
import { DollarSign, Shield, TrendingUp, Check, CheckCircle2 } from "lucide-react";
import { formatINR } from "@/lib/utils";
import { TransactionRecord, RevenueSummary } from "@/lib/revenue/types";

export default function AdminRevenuePage() {
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [summary, setSummary] = useState<RevenueSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/commissions");
      const data = await res.json();
      if (res.ok) {
        setTransactions(data.transactions || []);
        setSummary(data.summary);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateCommissionStatus = async (txnId: string, commissionStatus: "approved" | "disbursed") => {
    try {
      const res = await fetch(`/api/transactions/${txnId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commissionStatus }),
      });

      if (res.ok) {
        setFeedback(`Commission status marked as ${commissionStatus.toUpperCase()}`);
        loadData();
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
            Phase 8 Deliverable
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Platform Revenue & Commission Reconciliation
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Reconcile real estate transaction closures, calculate brokerage distributions, and disburse agent shares.
        </p>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl p-5 bg-[#121218] border border-zinc-800">
            <span className="text-xs font-mono text-zinc-400 uppercase block mb-1">Total Platform GMV</span>
            <div className="text-2xl font-bold text-white font-mono">{formatINR(summary.totalPlatformGMV)}</div>
            <span className="text-xs text-zinc-500 mt-1 block">Gross real estate transacted</span>
          </div>

          <div className="rounded-2xl p-5 bg-[#121218] border border-zinc-800">
            <span className="text-xs font-mono text-zinc-400 uppercase block mb-1">Gross Brokerage</span>
            <div className="text-2xl font-bold text-cyan-300 font-mono">{formatINR(summary.totalBrokerageRevenue)}</div>
            <span className="text-xs text-zinc-500 mt-1 block">Average 2.0% platform brokerage</span>
          </div>

          <div className="rounded-2xl p-5 bg-[#121218] border border-zinc-800">
            <span className="text-xs font-mono text-zinc-400 uppercase block mb-1">Agent Payouts Disbursed</span>
            <div className="text-2xl font-bold text-emerald-400 font-mono">{formatINR(summary.totalAgentPayouts)}</div>
            <span className="text-xs text-zinc-500 mt-1 block">Paid to verified partner agents</span>
          </div>

          <div className="rounded-2xl p-5 bg-[#121218] border border-zinc-800">
            <span className="text-xs font-mono text-zinc-400 uppercase block mb-1">Pending Payouts</span>
            <div className="text-2xl font-bold text-amber-400 font-mono">{formatINR(summary.pendingDisbursements)}</div>
            <span className="text-xs text-zinc-500 mt-1 block">Awaiting admin disbursal check</span>
          </div>
        </div>
      )}

      {/* Transactions Table */}
      <div className="rounded-2xl bg-[#121218] border border-zinc-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="border-b border-zinc-800 bg-zinc-900/60 text-zinc-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Deal ID</th>
                <th className="py-3.5 px-4">Property & Locality</th>
                <th className="py-3.5 px-4">Assigned Agent</th>
                <th className="py-3.5 px-4">Deal Value</th>
                <th className="py-3.5 px-4">Agent Payout (60%)</th>
                <th className="py-3.5 px-4">Platform Share (40%)</th>
                <th className="py-3.5 px-4 text-right">Reconciliation Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-mono">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-zinc-800/30">
                  <td className="py-3.5 px-4 text-cyan-400 font-bold">{t.id}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white font-sans">{t.propertyTitle}</div>
                    <div className="text-[10px] text-zinc-400 font-sans">{t.propertyLocality}</div>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-300 font-sans">{t.agentName}</td>
                  <td className="py-3.5 px-4 font-bold text-white">{formatINR(t.dealValue)}</td>
                  <td className="py-3.5 px-4 text-emerald-400 font-bold">{formatINR(t.agentPayout)}</td>
                  <td className="py-3.5 px-4 text-cyan-300">{formatINR(t.platformShare)}</td>
                  <td className="py-3.5 px-4 text-right">
                    {t.commissionStatus === "approved" ? (
                      <button
                        onClick={() => handleUpdateCommissionStatus(t.id, "disbursed")}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-sans cursor-pointer transition-colors"
                      >
                        Disburse Payout
                      </button>
                    ) : t.commissionStatus === "pending_invoice" ? (
                      <button
                        onClick={() => handleUpdateCommissionStatus(t.id, "approved")}
                        className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-sans cursor-pointer transition-colors"
                      >
                        Approve Split
                      </button>
                    ) : (
                      <span className="text-[10px] text-emerald-400 font-bold">DISBURSED</span>
                    )}
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
