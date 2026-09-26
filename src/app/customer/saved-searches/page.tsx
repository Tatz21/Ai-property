"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SpotlightNavbar } from "@/components/ui/spotlight-navbar";
import { PerspectiveGrid } from "@/components/ui/perspective-grid";
import { Bookmark, Bell, Trash2, ArrowRight, Plus, CheckCircle2 } from "lucide-react";
import { formatINR } from "@/lib/utils";
import { SavedSearchItem } from "@/lib/matching/types";

export default function SavedSearchesPage() {
  const [searches, setSearches] = useState<SavedSearchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [locality, setLocality] = useState("New Town Action Area II");
  const [bhk, setBhk] = useState(3);
  const [maxPrice, setMaxPrice] = useState(10000000);
  const [alertFrequency, setAlertFrequency] = useState<"instant" | "daily" | "weekly">("daily");
  const [showModal, setShowModal] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchSearches = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/saved-searches");
      const data = await res.json();
      if (res.ok && data.savedSearches) {
        setSearches(data.savedSearches);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSearches();
  }, []);

  const handleCreateSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/saved-searches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          filters: {
            locality,
            bhk,
            maxPrice,
            verifiedOnly: true,
          },
          alertFrequency,
        }),
      });

      if (res.ok) {
        setFeedback("New search alert activated");
        setShowModal(false);
        setTitle("");
        fetchSearches();
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/saved-searches?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSearches(prev => prev.filter(s => s.id !== id));
      }
    } catch (err) {
      console.error(err);
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
              <Bell className="w-3.5 h-3.5" />
              <span>Real-Time Inventory Alerts</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Saved Searches & Alerts</h1>
            <p className="text-xs sm:text-sm text-zinc-400">
              Get notified immediately via WhatsApp / Email when matching Kolkata inventory is published.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Search Alert</span>
          </button>
        </div>

        {feedback && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-[24px] bg-[#111116] border border-zinc-800 p-6 shadow-2xl space-y-4">
              <h3 className="text-lg font-bold text-white">Create Saved Search Alert</h3>

              <form onSubmit={handleCreateSearch} className="space-y-3 text-xs">
                <div>
                  <label className="block text-zinc-400 mb-1 font-mono">Alert Name</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. 3 BHK in Action Area II under 1 Cr"
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-mono">Kolkata Micro-Market</label>
                  <select
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="New Town Action Area II">New Town Action Area II</option>
                    <option value="Salt Lake Sector V">Salt Lake Sector V</option>
                    <option value="EM Bypass - Topsia">EM Bypass - Topsia</option>
                    <option value="Rajarhat Chinar Park">Rajarhat Chinar Park</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-400 mb-1 font-mono">BHK</label>
                    <input
                      type="number"
                      value={bhk}
                      onChange={(e) => setBhk(Number(e.target.value))}
                      className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1 font-mono">Max Budget (₹)</label>
                    <input
                      type="number"
                      step={500000}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-cyan-300 font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-mono">Notification Frequency</label>
                  <select
                    value={alertFrequency}
                    onChange={(e: any) => setAlertFrequency(e.target.value)}
                    className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="instant">Instant (Push & SMS)</option>
                    <option value="daily">Daily Digest</option>
                    <option value="weekly">Weekly Summary</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold"
                  >
                    Save Alert
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Searches List */}
        <div className="space-y-4">
          {searches.map((s) => (
            <div
              key={s.id}
              className="rounded-2xl bg-[#111116] border border-zinc-800 p-5 flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Bookmark className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">{s.title}</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Active • {s.alertFrequency}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-mono">
                  {s.filters.locality} • {s.filters.bhk} BHK • Max {s.filters.maxPrice ? formatINR(s.filters.maxPrice) : "Open"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href={`/properties?locality=${encodeURIComponent(s.filters.locality || "")}&bhk=${s.filters.bhk}&maxPrice=${s.filters.maxPrice}`}
                  className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-white transition-colors flex items-center gap-1"
                >
                  <span>Run Search</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>

                <button
                  onClick={() => handleDelete(s.id)}
                  className="p-2 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="py-8 border-t border-zinc-800/80 text-center text-xs text-zinc-500">
        <p>© 2026 EstateAI Kolkata. Saved Search Subsystem.</p>
      </footer>
    </div>
  );
}
