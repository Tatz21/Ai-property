"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SpotlightNavbar } from "@/components/ui/spotlight-navbar";
import { PerspectiveGrid } from "@/components/ui/perspective-grid";
import { Building2, Plus, ShieldCheck, MapPin, Eye, Edit3, Trash2, CheckCircle2 } from "lucide-react";
import { formatINR } from "@/lib/utils";
import { PropertyRecord } from "@/lib/properties/types";

export default function AgentPropertiesPage() {
  const [properties, setProperties] = useState<PropertyRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/properties");
      const data = await res.json();
      if (res.ok && data.properties) {
        setProperties(data.properties);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const [feedback, setFeedback] = useState<string | null>(null);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "available" ? "under_offer" : "available";
    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setProperties(prev =>
          prev.map(p => (p.id === id ? { ...p, status: newStatus as any } : p))
        );
        setFeedback(`Availability status updated to ${newStatus}.`);
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProperty = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This will immediately remove it from buyer search and AI matching.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProperties(prev => prev.filter(p => p.id !== id));
        setFeedback(`Property "${title}" successfully removed.`);
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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 w-full z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono mb-2">
              <Building2 className="w-3.5 h-3.5" />
              <span>Agent & Owner Inventory</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Managed Property Listings</h1>
            <p className="text-xs sm:text-sm text-zinc-400">
              Manage your active inventory, update live availability, and track verification states.
            </p>
          </div>

          <Link
            href="/agent/properties/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Property</span>
          </Link>
        </div>

        {feedback && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Listings Table */}
        <div className="rounded-2xl bg-[#111116] border border-zinc-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="border-b border-zinc-800 bg-zinc-900/60 text-zinc-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Property</th>
                  <th className="py-3.5 px-4">Type & Area</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Verification</th>
                  <th className="py-3.5 px-4">Availability</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {properties.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-800/30">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{p.title}</div>
                      <div className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-cyan-400" />
                        <span>{p.locality}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-white">
                        {p.bhk > 0 ? `${p.bhk} BHK` : "Commercial"}
                      </span>
                      <div className="text-[10px] text-zinc-500">{p.areaSqFt} sq.ft</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-cyan-300">
                      {formatINR(p.price)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-mono border ${
                          p.verificationStatus === "verified"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}
                      >
                        {p.verificationStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleStatus(p.id, p.status)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono border transition-all cursor-pointer ${
                          p.status === "available"
                            ? "bg-emerald-950/40 text-emerald-300 border-emerald-500/30 hover:bg-emerald-900/50"
                            : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700"
                        }`}
                      >
                        {p.status} (Click to toggle)
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <Link
                          href={`/properties/${p.id}`}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                          title="View Public Page"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteProperty(p.id, p.title)}
                          className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors cursor-pointer"
                          title="Delete Property"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <footer className="py-8 border-t border-zinc-800/80 text-center text-xs text-zinc-500">
        <p>© 2026 EstateAI Kolkata. Agent Inventory Surface.</p>
      </footer>
    </div>
  );
}
