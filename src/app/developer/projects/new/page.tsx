"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SpotlightNavbar } from "@/components/ui/spotlight-navbar";
import { PerspectiveGrid } from "@/components/ui/perspective-grid";
import { Building2, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

export default function NewProjectPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [locality, setLocality] = useState("Action Area III, New Town");
  const [address, setAddress] = useState("");
  const [reraNumber, setReraNumber] = useState("WBRERA/P/NOR/2024/000998");
  const [possessionDate, setPossessionDate] = useState("2026-12-31");
  const [totalTowers, setTotalTowers] = useState(4);
  const [totalUnits, setTotalUnits] = useState(320);
  const [amenitiesInput, setAmenitiesInput] = useState("Grand Clubhouse, Olympic Size Pool, Tennis Court, Co-working Lounge");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const amenities = amenitiesInput.split(",").map(a => a.trim()).filter(Boolean);

    try {
      const res = await fetch("/api/developer/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          locality,
          city: "Kolkata",
          address,
          reraRegistrationNumber: reraNumber,
          possessionDate,
          totalTowers: Number(totalTowers),
          totalUnits: Number(totalUnits),
          amenities,
        }),
      });

      if (res.ok) {
        router.push("/developer/dashboard");
      } else {
        const data = await res.json();
        setError(data.error?.message || "Failed to register project");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#09090b] text-zinc-100 flex flex-col justify-between">
      <PerspectiveGrid />
      <SpotlightNavbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full z-10">
        <Link
          href="/developer/dashboard"
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-cyan-300 transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Developer Console</span>
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Register Real Estate Project</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Publish an upcoming township, luxury tower, or commercial IT development in Kolkata.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-950/40 border border-red-500/30 flex items-center gap-3 text-xs text-red-300">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="rounded-[24px] bg-[#111116] border border-zinc-800 p-6 sm:p-8 shadow-2xl space-y-6 text-xs">
          <div className="space-y-4">
            <div>
              <label className="block font-mono text-zinc-400 mb-1">Project Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Godrej Prakriti Luxury Towers"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-zinc-400 mb-1">Locality</label>
                <input
                  type="text"
                  required
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block font-mono text-zinc-400 mb-1">WB RERA Registration Number</label>
                <input
                  type="text"
                  required
                  value={reraNumber}
                  onChange={(e) => setReraNumber(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-cyan-300 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-zinc-400 mb-1">Project Address</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Full plot/survey address in Kolkata"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-mono text-zinc-400 mb-1">Total Towers</label>
                <input
                  type="number"
                  required
                  value={totalTowers}
                  onChange={(e) => setTotalTowers(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-mono text-zinc-400 mb-1">Total Units Count</label>
                <input
                  type="number"
                  required
                  value={totalUnits}
                  onChange={(e) => setTotalUnits(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-mono text-zinc-400 mb-1">Estimated Possession Date</label>
                <input
                  type="date"
                  required
                  value={possessionDate}
                  onChange={(e) => setPossessionDate(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-zinc-400 mb-1">Project Amenities (Comma separated)</label>
              <input
                type="text"
                value={amenitiesInput}
                onChange={(e) => setAmenitiesInput(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-colors cursor-pointer"
          >
            {loading ? "Registering Project..." : "Register Project with EstateAI"}
          </button>
        </form>
      </main>

      <footer className="py-8 border-t border-zinc-800/80 text-center text-xs text-zinc-500">
        <p>© 2026 EstateAI Kolkata. Project Registration Subsystem.</p>
      </footer>
    </div>
  );
}
