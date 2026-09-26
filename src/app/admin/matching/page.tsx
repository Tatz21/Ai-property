"use client";

import React, { useState, useEffect } from "react";
import { Sliders, CheckCircle2, RefreshCw, Sparkles, Scale, Info } from "lucide-react";
import { MatchingWeights } from "@/lib/matching/types";

export default function AdminMatchingPage() {
  const [weights, setWeights] = useState<MatchingWeights>({
    localityWeight: 0.35,
    budgetWeight: 0.25,
    bhkAreaWeight: 0.20,
    amenitiesWeight: 0.15,
    verificationWeight: 0.05,
  });
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchWeights = async () => {
    try {
      const res = await fetch("/api/admin/matching");
      const data = await res.json();
      if (res.ok && data.weights) {
        setWeights(data.weights);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchWeights();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/admin/matching", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(weights),
      });

      const data = await res.json();
      if (res.ok) {
        setFeedback("Matching algorithm weights updated and synced with AI Agent");
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const totalWeight = Object.values(weights).reduce((sum, val) => sum + val, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            Phase 4 Deliverable
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Matching Engine Configuration & Diagnostics
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Tune multi-criteria scoring weights used by the AI property concierge and search ranker.
        </p>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="rounded-[24px] bg-[#111116] border border-zinc-800 p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Algorithm Weights Allocation</span>
          </h2>
          <span className={`text-xs font-mono px-2.5 py-1 rounded-full border ${
            Math.abs(totalWeight - 1.0) < 0.01
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
          }`}>
            Total Weight: {(totalWeight * 100).toFixed(0)}%
          </span>
        </div>

        {/* Locality */}
        <div>
          <div className="flex justify-between items-center text-xs mb-2">
            <label className="font-semibold text-white">1. Locality & Spatial Proximity Weight</label>
            <span className="font-mono text-cyan-300 font-bold">{(weights.localityWeight * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={weights.localityWeight}
            onChange={(e) => setWeights({ ...weights, localityWeight: parseFloat(e.target.value) })}
            className="w-full accent-cyan-500 cursor-pointer"
          />
          <p className="text-[11px] text-zinc-500 mt-1">Impact of micro-market match (e.g. New Town Action Area II vs surrounding).</p>
        </div>

        {/* Budget */}
        <div>
          <div className="flex justify-between items-center text-xs mb-2">
            <label className="font-semibold text-white">2. Budget Fit & Value Weight</label>
            <span className="font-mono text-cyan-300 font-bold">{(weights.budgetWeight * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={weights.budgetWeight}
            onChange={(e) => setWeights({ ...weights, budgetWeight: parseFloat(e.target.value) })}
            className="w-full accent-cyan-500 cursor-pointer"
          />
          <p className="text-[11px] text-zinc-500 mt-1">Rewards properties under max budget and calculates excess tolerances.</p>
        </div>

        {/* BHK & Area */}
        <div>
          <div className="flex justify-between items-center text-xs mb-2">
            <label className="font-semibold text-white">3. BHK & Built-up Area Weight</label>
            <span className="font-mono text-cyan-300 font-bold">{(weights.bhkAreaWeight * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={weights.bhkAreaWeight}
            onChange={(e) => setWeights({ ...weights, bhkAreaWeight: parseFloat(e.target.value) })}
            className="w-full accent-cyan-500 cursor-pointer"
          />
          <p className="text-[11px] text-zinc-500 mt-1">Exact bedroom matching and super built-up square footage.</p>
        </div>

        {/* Amenities */}
        <div>
          <div className="flex justify-between items-center text-xs mb-2">
            <label className="font-semibold text-white">4. Amenities & Facilities Overlap</label>
            <span className="font-mono text-cyan-300 font-bold">{(weights.amenitiesWeight * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={weights.amenitiesWeight}
            onChange={(e) => setWeights({ ...weights, amenitiesWeight: parseFloat(e.target.value) })}
            className="w-full accent-cyan-500 cursor-pointer"
          />
          <p className="text-[11px] text-zinc-500 mt-1">Scores overlap of requested amenities (Swimming Pool, Clubhouse, EV Charging).</p>
        </div>

        {/* RERA Verification */}
        <div>
          <div className="flex justify-between items-center text-xs mb-2">
            <label className="font-semibold text-white">5. WB RERA Verification & Trust Badge</label>
            <span className="font-mono text-cyan-300 font-bold">{(weights.verificationWeight * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={weights.verificationWeight}
            onChange={(e) => setWeights({ ...weights, verificationWeight: parseFloat(e.target.value) })}
            className="w-full accent-cyan-500 cursor-pointer"
          />
          <p className="text-[11px] text-zinc-500 mt-1">Boosts listings verified with registered RERA license numbers.</p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-colors cursor-pointer disabled:opacity-50"
        >
          {saving ? "Updating Algorithm..." : "Save Matching Configuration"}
        </button>
      </form>
    </div>
  );
}
