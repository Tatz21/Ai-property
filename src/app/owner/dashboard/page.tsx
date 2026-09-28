"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SpotlightNavbar } from "@/components/ui/spotlight-navbar";
import { PerspectiveGrid } from "@/components/ui/perspective-grid";
import { 
  Home, Plus, Eye, CalendarCheck, ShieldCheck, 
  MapPin, CheckCircle2, ArrowRight, DollarSign, Trash2
} from "lucide-react";
import { formatINR } from "@/lib/utils";
import { PropertyRecord } from "@/lib/properties/types";
import { VisitRecord } from "@/lib/visits/types";

export default function OwnerDashboardPage() {
  const [properties, setProperties] = useState<PropertyRecord[]>([]);
  const [visits, setVisits] = useState<VisitRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadOwnerData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/owner/properties");
      const data = await res.json();
      if (res.ok) {
        setProperties(data.properties || []);
        setVisits(data.visits || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOwnerData();
  }, []);

  const handleDeleteProperty = async (id: string, title: string) => {
    if (!confirm(`Delete listing "${title}"? This will delist it from the marketplace.`)) return;
    try {
      const res = await fetch(`/api/properties/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProperties(prev => prev.filter(p => p.id !== id));
        setFeedback(`Property "${title}" deleted.`);
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono mb-2">
              <Home className="w-3.5 h-3.5" />
              <span>Verified Owner Portal • Kolkata</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Property Owner Console</h1>
            <p className="text-xs sm:text-sm text-zinc-400">
              Manage your residential and commercial listings, track incoming buyer interest, and monitor inspection visits.
            </p>
          </div>

          <Link
            href="/agent/properties/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>List Another Property</span>
          </Link>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl p-5 bg-[#121218] border border-zinc-800">
            <span className="text-xs font-mono text-zinc-400 uppercase block mb-1">Listed Properties</span>
            <div className="text-2xl font-bold text-white font-mono">{properties.length}</div>
            <span className="text-xs text-zinc-500 mt-1 block">Active on Kolkata marketplace</span>
          </div>

          <div className="rounded-2xl p-5 bg-[#121218] border border-zinc-800">
            <span className="text-xs font-mono text-zinc-400 uppercase block mb-1">Buyer Site Visits</span>
            <div className="text-2xl font-bold text-emerald-400 font-mono">{visits.length}</div>
            <span className="text-xs text-zinc-500 mt-1 block">Scheduled with verified agents</span>
          </div>

          <div className="rounded-2xl p-5 bg-[#121218] border border-zinc-800">
            <span className="text-xs font-mono text-zinc-400 uppercase block mb-1">Market Exposure</span>
            <div className="text-2xl font-bold text-cyan-300 font-mono">100%</div>
            <span className="text-xs text-zinc-500 mt-1 block">AI conversational discoverability active</span>
          </div>
        </div>

        {feedback && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Properties List */}
        <div className="rounded-[24px] bg-[#111116] border border-zinc-800 p-6 shadow-2xl space-y-4">
          <h2 className="text-base font-bold text-white mb-2">Your Active Listings</h2>

          {loading ? (
            <div className="py-12 text-center font-mono text-xs text-zinc-500">Loading your listings...</div>
          ) : properties.length === 0 ? (
            <div className="py-12 text-center text-xs text-zinc-500">No properties listed under your account yet.</div>
          ) : (
            <div className="space-y-3">
              {properties.map((p) => (
                <div
                  key={p.id}
                  className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {p.verificationStatus.toUpperCase()}
                      </span>
                      <span className="text-xs text-zinc-400 font-mono">{p.locality}</span>
                    </div>
                    <h3 className="font-bold text-sm text-white">{p.title}</h3>
                    <p className="text-xs font-mono text-cyan-300 mt-1">{formatINR(p.price)} • {p.bhk > 0 ? `${p.bhk} BHK` : "Commercial"}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/properties/${p.id}`}
                      className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 transition-colors"
                    >
                      View Live Page
                    </Link>
                    <button
                      onClick={() => handleDeleteProperty(p.id, p.title)}
                      className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                      title="Delete Listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="py-8 border-t border-zinc-800/80 text-center text-xs text-zinc-500">
        <p>© 2026 EstateAI Kolkata. Owner Portal Subsystem.</p>
      </footer>
    </div>
  );
}
