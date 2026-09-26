"use client";

import React, { useState, useEffect } from "react";
import { SpotlightNavbar } from "@/components/ui/spotlight-navbar";
import { PerspectiveGrid } from "@/components/ui/perspective-grid";
import { User, Sliders, MapPin, IndianRupee, Home, CheckCircle2, AlertCircle, Save } from "lucide-react";
import { formatINR } from "@/lib/utils";

const LOCALITIES = [
  "New Town Action Area I",
  "New Town Action Area II",
  "New Town Action Area III",
  "Salt Lake Sector V",
  "EM Bypass",
  "Rajarhat",
  "Ballygunge",
  "Alipore"
];

export default function CustomerProfilePage() {
  const [name, setName] = useState("Dr. Anirban Sengupta");
  const [phone, setPhone] = useState("+91 98300 12345");
  const [budgetMin, setBudgetMin] = useState(8000000);
  const [budgetMax, setBudgetMax] = useState(12000000);
  const [preferredBhk, setPreferredBhk] = useState<number[]>([3, 4]);
  const [preferredLocalities, setPreferredLocalities] = useState<string[]>([
    "New Town Action Area II",
    "Salt Lake Sector V"
  ]);
  const [purpose, setPurpose] = useState<"self_use" | "investment" | "rental_income">("self_use");
  const [financingStatus, setFinancingStatus] = useState<"pre_approved" | "seeking_loan" | "self_financed">("pre_approved");
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleBhk = (bhk: number) => {
    if (preferredBhk.includes(bhk)) {
      setPreferredBhk(preferredBhk.filter(b => b !== bhk));
    } else {
      setPreferredBhk([...preferredBhk, bhk]);
    }
  };

  const toggleLocality = (loc: string) => {
    if (preferredLocalities.includes(loc)) {
      setPreferredLocalities(preferredLocalities.filter(l => l !== loc));
    } else {
      setPreferredLocalities([...preferredLocalities, loc]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          budgetMin,
          budgetMax,
          preferredBhk,
          preferredLocalities,
          purpose,
          financingStatus,
        }),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#09090b] text-zinc-100 flex flex-col justify-between">
      <PerspectiveGrid />
      <SpotlightNavbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono mb-2">
              <User className="w-3.5 h-3.5" />
              <span>Buyer Experience Shell</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Property Requirements & Profile</h1>
            <p className="text-xs sm:text-sm text-zinc-400">
              Customize your preferences so our AI property agent retrieves the best matching homes.
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving..." : "Save Preferences"}</span>
          </button>
        </div>

        {savedSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Buyer profile and search criteria synchronized successfully!</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Account Details */}
          <div className="md:col-span-1 rounded-[20px] bg-[#111116] border border-zinc-800 p-6 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-400" />
              <span>Contact Information</span>
            </h2>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="pt-2">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Status</span>
              <span className="inline-block text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Verified Buyer
              </span>
            </div>
          </div>

          {/* Core Requirements */}
          <div className="md:col-span-2 rounded-[20px] bg-[#111116] border border-zinc-800 p-6 space-y-6">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Property Match Criteria</span>
            </h2>

            {/* Budget Range */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-mono text-zinc-300">Target Budget Range</label>
                <span className="text-xs font-mono text-cyan-400 font-semibold">
                  {formatINR(budgetMin)} — {formatINR(budgetMax)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-zinc-500 block mb-1">Min Budget (₹)</span>
                  <input
                    type="number"
                    step={500000}
                    value={budgetMin}
                    onChange={(e) => setBudgetMin(Number(e.target.value))}
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block mb-1">Max Budget (₹)</span>
                  <input
                    type="number"
                    step={500000}
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(Number(e.target.value))}
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* BHK Preference */}
            <div>
              <label className="text-xs font-mono text-zinc-300 block mb-2">Bedrooms (BHK)</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((bhk) => (
                  <button
                    key={bhk}
                    type="button"
                    onClick={() => toggleBhk(bhk)}
                    className={`py-2 px-4 rounded-xl text-xs font-mono border transition-all cursor-pointer ${
                      preferredBhk.includes(bhk)
                        ? "bg-cyan-500 text-black font-bold border-cyan-400"
                        : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white"
                    }`}
                  >
                    {bhk} BHK
                  </button>
                ))}
              </div>
            </div>

            {/* Localities */}
            <div>
              <label className="text-xs font-mono text-zinc-300 block mb-2">
                Target Kolkata Micro-Markets
              </label>
              <div className="grid grid-cols-2 gap-2">
                {LOCALITIES.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => toggleLocality(loc)}
                    className={`text-left text-xs p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      preferredLocalities.includes(loc)
                        ? "bg-cyan-950/60 border-cyan-500/60 text-cyan-200"
                        : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <span>{loc}</span>
                    {preferredLocalities.includes(loc) && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Purpose and Financing */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-mono text-zinc-300 block mb-1">Purchase Purpose</label>
                <select
                  value={purpose}
                  onChange={(e: any) => setPurpose(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="self_use">Self Residence</option>
                  <option value="investment">Capital Investment</option>
                  <option value="rental_income">Rental Income</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-zinc-300 block mb-1">Financing Status</label>
                <select
                  value={financingStatus}
                  onChange={(e: any) => setFinancingStatus(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="pre_approved">Home Loan Pre-Approved</option>
                  <option value="seeking_loan">Seeking Bank Loan</option>
                  <option value="self_financed">Self-Financed / Cash</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-8 border-t border-zinc-800/80 text-center text-xs text-zinc-500">
        <p>© 2026 EstateAI Kolkata. Phase 1 Customer Surface.</p>
      </footer>
    </div>
  );
}
