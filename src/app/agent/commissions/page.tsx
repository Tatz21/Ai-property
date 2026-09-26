"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SpotlightNavbar } from "@/components/ui/spotlight-navbar";
import { PerspectiveGrid } from "@/components/ui/perspective-grid";
import { 
  DollarSign, TrendingUp, CheckCircle2, 
  ArrowRight, ShieldCheck, MapPin, Plus, Clock, FileCheck
} from "lucide-react";
import { formatINR } from "@/lib/utils";
import { TransactionRecord } from "@/lib/revenue/types";

export default function AgentCommissionsPage() {
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [summary, setSummary] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Record Deal Modal
  const [showModal, setShowModal] = useState(false);
  const [leadId, setLeadId] = useState("lead-kol-101");
  const [propertyId, setPropertyId] = useState("prop-kol-001");
  const [dealValue, setDealValue] = useState(9500000);
  const [brokerageRate, setBrokerageRate] = useState(2.0);
  const [agentShare, setAgentShare] = useState(60.0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/agent/commissions");
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

  const handleRecordDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId,
          propertyId,
          dealValue: Number(dealValue),
          brokerageRatePercent: Number(brokerageRate),
          agentSharePercent: Number(agentShare),
        }),
      });

      if (res.ok) {
        setFeedback("Deal recorded & commission ledger calculated!");
        setShowModal(false);
        loadData();
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#09090b] text-zinc-100 flex flex-col justify-between">
      <PerspectiveGrid />
      <SpotlightNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 w-full z-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono mb-2">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Agent Earnings & Commission Ledger</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Earnings & Brokerage Pipeline</h1>
            <p className="text-xs sm:text-sm text-zinc-400">
              Track your commission payouts, deal agreements, and verified registration settlements.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-colors cursor-pointer shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Record Closed Deal</span>
          </button>
        </div>

        {feedback && (
          <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Financial Metrics */}
        {summary && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl p-6 bg-[#121218] border border-zinc-800">
              <span className="text-xs font-mono text-zinc-400 uppercase block mb-1">Total Disbursed Earnings</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
                {formatINR(summary.totalEarned)}
              </div>
              <span className="text-xs text-zinc-500 mt-1 block">Deposited to verified bank account</span>
            </div>

            <div className="rounded-2xl p-6 bg-[#121218] border border-zinc-800">
              <span className="text-xs font-mono text-zinc-400 uppercase block mb-1">In-Flight / Approved Commission</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-300 font-mono">
                {formatINR(summary.pendingPayout)}
              </div>
              <span className="text-xs text-zinc-500 mt-1 block">Pending platform payout cycle</span>
            </div>

            <div className="rounded-2xl p-6 bg-[#121218] border border-zinc-800">
              <span className="text-xs font-mono text-zinc-400 uppercase block mb-1">Deals Closed</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                {summary.dealsClosed}
              </div>
              <span className="text-xs text-zinc-500 mt-1 block">60% Agent Share Tier</span>
            </div>
          </div>
        )}

        {/* Record Deal Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-[24px] bg-[#111116] border border-zinc-800 p-6 shadow-2xl space-y-4 text-xs">
              <h3 className="text-base font-bold text-white">Record Real Estate Deal Closing</h3>

              <form onSubmit={handleRecordDeal} className="space-y-3">
                <div>
                  <label className="block text-zinc-400 font-mono mb-1">Deal Value (₹ Total Sale Price)</label>
                  <input
                    type="number"
                    required
                    step={100000}
                    value={dealValue}
                    onChange={(e) => setDealValue(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-cyan-300 font-mono focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-400 font-mono mb-1">Brokerage Rate (%)</label>
                    <input
                      type="number"
                      step={0.1}
                      value={brokerageRate}
                      onChange={(e) => setBrokerageRate(Number(e.target.value))}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 font-mono mb-1">Agent Split (%)</label>
                    <input
                      type="number"
                      step={1}
                      value={agentShare}
                      onChange={(e) => setAgentShare(Number(e.target.value))}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Gross Brokerage:</span>
                    <span className="text-white">{formatINR(Math.round((dealValue * brokerageRate) / 100))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Your Calculated Payout (60%):</span>
                    <span className="text-emerald-400 font-bold">{formatINR(Math.round((dealValue * brokerageRate * agentShare) / 10000))}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-zinc-800 text-zinc-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold"
                  >
                    Submit Deal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Transactions Table */}
        <div className="rounded-[24px] bg-[#111116] border border-zinc-800 overflow-hidden shadow-2xl">
          <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              Deal Ledger & Commission Breakdown
            </h2>
          </div>

          {loading ? (
            <div className="py-20 text-center font-mono text-xs text-zinc-500">Loading commission ledger...</div>
          ) : transactions.length === 0 ? (
            <div className="py-12 text-center text-xs text-zinc-500">No closed transactions recorded yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="border-b border-zinc-800 bg-zinc-900/60 text-zinc-400 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Deal ID & Property</th>
                    <th className="py-3.5 px-4">Buyer</th>
                    <th className="py-3.5 px-4">Deal Value (GMV)</th>
                    <th className="py-3.5 px-4">Total Brokerage (2%)</th>
                    <th className="py-3.5 px-4">Your Commission (60%)</th>
                    <th className="py-3.5 px-4">Disbursal Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-mono">
                  {transactions.map((txn) => (
                    <tr key={txn.id} className="hover:bg-zinc-800/30">
                      <td className="py-3.5 px-4">
                        <span className="text-cyan-400 font-bold">{txn.id}</span>
                        <div className="text-white font-sans text-xs">{txn.propertyTitle}</div>
                        <div className="text-[10px] text-zinc-500">{txn.propertyLocality}</div>
                      </td>
                      <td className="py-3.5 px-4 font-sans">{txn.customerName}</td>
                      <td className="py-3.5 px-4 font-bold text-white">{formatINR(txn.dealValue)}</td>
                      <td className="py-3.5 px-4 text-zinc-300">{formatINR(txn.totalBrokerage)}</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-400">{formatINR(txn.agentPayout)}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] border uppercase ${
                            txn.commissionStatus === "disbursed"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : txn.commissionStatus === "approved"
                              ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/20 font-bold"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          }`}
                        >
                          {txn.commissionStatus.replace("_", " ")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <footer className="py-8 border-t border-zinc-800/80 text-center text-xs text-zinc-500">
        <p>© 2026 EstateAI Kolkata. Commission & Revenue Subsystem.</p>
      </footer>
    </div>
  );
}
