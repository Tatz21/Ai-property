"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, Check, X, Eye, MapPin, AlertCircle, CheckCircle2, Trash2 } from "lucide-react";
import { formatINR } from "@/lib/utils";
import { PropertyRecord } from "@/lib/properties/types";

export default function AdminPropertiesModerationPage() {
  const [properties, setProperties] = useState<PropertyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

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

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete listing "${title}"? This will remove it from all public search & AI indices.`)) return;
    try {
      const res = await fetch(`/api/properties/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProperties(prev => prev.filter(p => p.id !== id));
        setFeedback(`Listing "${title}" permanently deleted.`);
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleModerate = async (id: string, status: "verified" | "rejected") => {
    try {
      const res = await fetch(`/api/properties/${id}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          notes: status === "verified" ? "All documents & RERA registration checked" : "Document mismatch",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setFeedback(`Property ${status === "verified" ? "Approved & Verified" : "Rejected"} successfully`);
        fetchProperties();
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
            Phase 2 Deliverable
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Property Moderation & Trust Queue
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Review property ownership, RERA registrations, and approve listings for public AI indexing.
        </p>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Moderation Table */}
      <div className="rounded-2xl bg-[#121218] border border-zinc-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="border-b border-zinc-800 bg-zinc-900/60 text-zinc-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Property & Locality</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">RERA Registration</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Audit Verification</th>
                <th className="py-3.5 px-4 text-right">Moderation Actions</th>
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
                  <td className="py-3.5 px-4 font-mono font-semibold text-cyan-300">
                    {formatINR(p.price)}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-zinc-300 text-[11px]">
                    {p.reraId ? (
                      <span className="text-emerald-400">{p.reraId}</span>
                    ) : (
                      <span className="text-zinc-500">Unspecified</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono border ${
                        p.verificationStatus === "verified"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : p.verificationStatus === "rejected"
                          ? "bg-red-500/10 text-red-400 border-red-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}
                    >
                      {p.verificationStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <Link
                        href={`/properties/${p.id}`}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                        title="Inspect Listing"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      {p.verificationStatus !== "verified" && (
                        <button
                          onClick={() => handleModerate(p.id, "verified")}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                      )}

                      {p.verificationStatus !== "rejected" && (
                        <button
                          onClick={() => handleModerate(p.id, "rejected")}
                          className="px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(p.id, p.title)}
                        className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors cursor-pointer"
                        title="Delete Listing"
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
    </div>
  );
}
